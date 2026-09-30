import { expect, type Locator, type Page } from "@playwright/test";

/**
 * The cookie banner is fixed to the bottom of the page and sits above everything
 * else, so get rid of it before clicking anything. Also a smoke test of the
 * banner itself: every test starts with a fresh context, so it is always there.
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
  const banner = page.getByRole("region", { name: "Cookie notice" });
  // It waits for the visitor to scroll before barging in.
  await page.mouse.wheel(0, 600);
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Decline (still order it)" }).click();
  await expect(banner).toBeHidden();
}

/** The checkout modal, whichever of its many buttons opened it. */
export function orderModal(page: Page): Locator {
  return page.getByRole("dialog", { name: "Order that shit" });
}

/** Opens checkout from the hero's main call to action. */
export async function openCheckoutFromHero(page: Page): Promise<Locator> {
  await page.locator("#top").getByRole("button", { name: "Order That Shit →" }).click();
  const modal = orderModal(page);
  await expect(modal).toBeVisible();
  return modal;
}
