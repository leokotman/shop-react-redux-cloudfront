/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Avoid manualChunks: splitting React/MUI from other deps (react-query,
    // formik, shared libs) creates circular chunks where `import { R as I } from
    // "./react-mui.js"` is still undefined during vendor top-level init
    // (I.createContext → TypeError). Default chunking keeps a consistent graph.
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
