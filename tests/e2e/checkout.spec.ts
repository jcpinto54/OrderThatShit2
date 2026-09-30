import { expect, test } from "@playwright/test";
import { dismissCookieBanner, openCheckoutFromHero, orderModal } from "./helpers";

test("ordering that shit prints an authorization, and the site remembers", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  // Escape closes the modal without ordering anything.
  let modal = await openCheckoutFromHero(page);
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();

  // Whatever they type in the hero comes along into checkout.
  await page.locator("#top").getByLabel("That thing you keep thinking about ordering:").fill("a second monitor");
  modal = await openCheckoutFromHero(page);
  await expect(modal.getByRole("heading", { name: "What shit do you want to order?" })).toBeVisible();
  await expect(modal.getByLabel("What shit do you want to order?")).toHaveValue("a second monitor");

  await modal.getByText("Months", { exact: true }).click();
  await expect(modal.getByRole("radio", { name: "Months" })).toBeChecked();
  await modal.getByLabel("How do you feel right now?").fill("3");
  await modal.getByRole("button", { name: "Order that shit →" }).click();

  await expect(modal.getByRole("heading", { name: "Ordering a second monitor…" })).toBeVisible();

  await expect(modal.getByRole("heading", { name: "You ordered that shit." })).toBeVisible();
  await expect(modal.getByText(/OTS-\d{6}-[A-Z]/)).toBeVisible();
  await expect(modal.getByText("Order authorization")).toBeVisible();
  await expect(modal.getByText("4 months")).toBeVisible();
  await expect(modal.getByText("3/10")).toBeVisible();

  // Approvals wait for the visitor to stamp them, then offer sharing and a way out.
  await expect(modal.getByText("Stamp here")).toBeVisible();
  await modal.getByRole("button", { name: /Stamp it/ }).click();
  await expect(modal.getByText("Stamp here")).toBeHidden();
  // The shareable image is drawn in the background; the button waits for it.
  await expect(modal.getByRole("button", { name: "Share your receipt" })).toBeEnabled();
  await expect(modal.getByRole("button", { name: "Done. I feel better." })).toBeVisible();
  await expect(modal.getByText(/Lifetime orders: 1\./)).toBeVisible();

  // The order count is persisted, so a reload greets a repeat customer.
  await page.reload();
  await expect(page.getByTitle("Times you have ordered that shit. Still not fixed? Order again.")).toHaveText("Ordered ×1");

  const again = await openCheckoutFromHero(page);
  await expect(again.getByRole("heading", { name: "Again? Respect." })).toBeVisible();
});

test("an order that comes before rent is denied", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  const modal = await openCheckoutFromHero(page);
  await modal.getByLabel("What shit do you want to order?").fill("a new couch, rent is due friday");
  await modal.getByRole("button", { name: "Order that shit →" }).click();

  await expect(modal.getByRole("heading", { name: "Order denied." })).toBeVisible();
  await expect(modal.getByText("Rent first, shit second. We'll hold your spot.")).toBeVisible();
});

test("the joke stops when someone types something that isn't one", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  const modal = await openCheckoutFromHero(page);
  await modal.getByLabel("What shit do you want to order?").fill("honestly i want to die");
  await modal.getByRole("button", { name: "Order that shit →" }).click();

  await expect(modal.getByRole("heading", { name: "We can't joke about this one." })).toBeVisible();
  await expect(modal.getByRole("link", { name: "Find a helpline" })).toHaveAttribute("href", "https://findahelpline.com");
  await expect(modal.getByRole("button", { name: "Share your receipt" })).toHaveCount(0);
});

test("the cookie banner can order that shit too", async ({ page }) => {
  await page.goto("/");
  await page.mouse.wheel(0, 600);

  const banner = page.getByRole("region", { name: "Cookie notice" });
  await banner.getByRole("button", { name: "Accept & order that shit" }).click();

  await expect(banner).toBeHidden();
  await expect(orderModal(page)).toBeVisible();
});
