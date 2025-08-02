import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    allowedHosts: ["honolulu.kite-ling.ts.net"],
  },
  plugins: [tailwindcss(), sveltekit()],
  resolve: {
    alias: {
      stream: "readable-stream",
    },
  },
  optimizeDeps: {
    include: ["readable-stream"],
  },
});
