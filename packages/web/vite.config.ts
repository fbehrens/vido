import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      stream: "readable-stream",
    },
  },
  optimizeDeps: {
    include: ["readable-stream"],
  },
});
