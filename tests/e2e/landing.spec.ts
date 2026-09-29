import { expect, test } from "@playwright/test";
import { dismissCookieBanner } from "./helpers";

test("the landing page renders every section", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Order That Shit/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Still haven't");

  for (const id of ["top", "videos", "stories", "finder", "science", "pricing", "faq"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("the nav jumps to the Shit Finder", async ({ page }) => {
  await page.goto("/");
  await dismissCookieBanner(page);

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Shit Finder™" }).click();

  await expect(page).toHaveURL(/#finder$/);
  await expect(page.locator("#finder").getByLabel("Describe your problem")).toBeInViewport();
});
