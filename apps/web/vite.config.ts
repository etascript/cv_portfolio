import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const apiTarget = process.env.VITE_DEV_API_TARGET ?? "http://127.0.0.1:8003";
const webPort = Number(process.env.WEB_PORT ?? 8002);
const publicTunnel = process.env.VITE_PUBLIC_TUNNEL === "true";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: webPort,
    strictPort: true,
    allowedHosts: publicTunnel ? true : undefined,
    proxy: {
      "/api": apiTarget,
      "/uploads": apiTarget,
      "/sitemap.xml": apiTarget,
      "/robots.txt": apiTarget
    }
  }
});
