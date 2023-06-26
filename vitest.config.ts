import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const config = defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
  },
});

export default config;
