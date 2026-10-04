import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Cloudflare Web Analytics. Cookieless and privacy-preserving: no cookies, no
// fingerprinting, nothing that follows anyone between sites, so the cookie
// banner stays a joke and nothing here needs consent.
//
// The site token is public by design (it ships in the page source), but it
// still comes from the environment rather than this file, so it is set once in
// Cloudflare Workers Builds. With no token set the beacon is left out entirely,
// which keeps dev servers, CI builds and local previews unmeasured.
function cloudflareWebAnalytics(token: string | undefined): Plugin {
  return {
    name: "cloudflare-web-analytics",
    apply: "build",
    transformIndexHtml() {
      if (!token) return [];
      return [
        {
          tag: "script",
          attrs: {
            // type="module" keeps the beacon from running in browsers too old
            // to parse it, which is what Cloudflare's own injection does.
            type: "module",
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            "data-cf-beacon": JSON.stringify({ token }),
          },
          injectTo: "body",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), cloudflareWebAnalytics(env.CF_BEACON_TOKEN)],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      target: "es2022",
    },
  };
});
