import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // KAPLAY game state breaks under HMR.
    hmr: false,
  },
  build: {
    assetsInlineLimit: 0,
  },
});
