import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// For GitHub Pages project-repo hosting, assets must resolve under /say-hi/.
// Locally (`pnpm dev`), we keep base at `/`. Hash routing keeps deep links
// working without any SPA fallback gymnastics.
const base = process.env.GITHUB_PAGES === "1" ? "/say-hi/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5178,
    strictPort: true,
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
