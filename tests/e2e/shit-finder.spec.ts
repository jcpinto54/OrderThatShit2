import { expect, test } from "@playwright/test";
import { dismissCookieBanner, orderModal } from "./helpers";

test("analyzing a problem hands the verdict to checkout", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  const finder = page.locator("#finder");
  await finder.getByLabel("Describe your problem").fill("my code fails in prod");
  await finder.getByRole("button", { name: "Analyze my problem" }).click();

  await expect(finder.getByText("shitfinder v4.2.0 — problem: “my code fails in prod”")).toBeVisible();
  await expect(finder.getByText("Recommended solution · confidence 100%")).toBeVisible();
  // Problems mentioning code always get the same verdict.
  await expect(finder.getByText("Have you tried turning it off and ordering that shit?")).toBeVisible();

  await finder.getByRole("button", { name: "Order that shit for this →" }).click();

  const modal = orderModal(page);
  await expect(modal).toBeVisible();
  await expect(modal.getByLabel("What shit do you want to order?")).toHaveValue("my code fails in prod");
});

test("a suggestion chip runs the finder on its own", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  const finder = page.locator("#finder");
  await finder.getByRole("button", { name: "I'm tired" }).click();

  await expect(finder.getByText("Recommended solution · confidence 100%")).toBeVisible();
  await expect(finder.getByText("Rest is temporary. That shit is forever.", { exact: false })).toBeVisible();

  await finder.getByRole("button", { name: "I have another problem" }).click();
  await expect(finder.getByText("Recommended solution · confidence 100%")).toBeHidden();
});
