import { expect, test } from "@playwright/test";
import { dismissCookieBanner, openCheckoutFromHero, orderModal } from "./helpers";

test("ordering that shit ends in a certificate, and the site remembers", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  // Escape closes the modal without ordering anything.
  let modal = await openCheckoutFromHero(page);
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();

  modal = await openCheckoutFromHero(page);
  await expect(modal.getByRole("heading", { name: "What shit do you want to order?" })).toBeVisible();

  await modal.getByLabel("What shit do you want to order?").fill("a second monitor");
  await modal.getByRole("button", { name: "Order that shit →" }).click();

  await expect(modal.getByRole("heading", { name: "Ordering a second monitor…" })).toBeVisible();

  await expect(modal.getByRole("heading", { name: "You ordered that shit." })).toBeVisible();
  await expect(modal.getByText(/OTS-\d{6}-[A-Z]/)).toBeVisible();
  await expect(modal.getByText("Certificate of having ordered that shit")).toBeVisible();
  await expect(modal.getByText("has ordered that shit. Specifically: “a second monitor.”")).toBeVisible();
  await expect(modal.getByText("✓ Lifetime orders: 1")).toBeVisible();

  // The order count is persisted, so a reload greets a repeat customer.
  await page.reload();
  await expect(page.getByTitle("Times you have ordered that shit. Still not fixed? Order again.")).toHaveText("Ordered ×1");

  const again = await openCheckoutFromHero(page);
  await expect(again.getByRole("heading", { name: "Again? Respect." })).toBeVisible();
});

test("the cookie banner can order that shit too", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByRole("region", { name: "Cookie notice" });
  await banner.getByRole("button", { name: "Accept & order that shit" }).click();

  await expect(banner).toBeHidden();
  await expect(orderModal(page)).toBeVisible();
});
