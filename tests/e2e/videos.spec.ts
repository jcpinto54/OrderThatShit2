import { expect, test } from "@playwright/test";
import { dismissCookieBanner, orderModal } from "./helpers";

test("a testimonial hands over to the native player", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  const card = page.locator("#videos li").filter({ hasText: "Linda, 47" });
  const play = card.getByRole("button", { name: "Play testimonial from Linda, 47" });

  await expect(play).toBeVisible();
  await play.click();

  await expect(play).toBeHidden();
  await expect(card.locator("video")).toHaveAttribute("controls", "");
});

test("the ad can be skipped, and then it sells you that shit", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  await page.locator("#videos").getByRole("button", { name: /Watch the ad/ }).click();

  const ad = page.getByRole("dialog", { name: "The ad" });
  await expect(ad).toBeVisible();
  await expect(ad.getByText(/Skip in \d…/)).toBeVisible();

  // The eight-second countdown is the whole joke, so it runs for real.
  await expect(ad.getByText("That was the ad.")).toBeVisible({ timeout: 30_000 });

  await ad.getByRole("button", { name: "It worked. Order that shit →" }).click();

  await expect(ad).toBeHidden();
  await expect(orderModal(page)).toBeVisible();
});
