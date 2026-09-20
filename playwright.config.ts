import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests run against the production build, served by `vite preview`, so CI
 * exercises the same bundle Cloudflare ships rather than the dev server.
 */
const PORT = 4173;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 60_000,
  // The fake checkout and the Shit Finder step through their animations on real
  // timers, so a verdict can take a few seconds to land.
  expect: { timeout: 20_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Same escape hatch as scripts/generate-og.mjs: run against an existing
        // Chromium instead of Playwright's own download.
        launchOptions: process.env.CHROMIUM_PATH
          ? { executablePath: process.env.CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
