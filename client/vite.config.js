import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],

      manifest: {
        name: "Synconnect",
        short_name: "Synconnect",
        display: "standalone",
        start_url: "/dashboard",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/1080x1920-1.jpg",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Synconnnect App Screenshot 1",
            platform: "narrow",
          },
          {
            src: "/screenshots/1080x1920-2.jpg",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Synconnnect App Screenshot 2",
            platform: "narrow",
          },
          {
            src: "/screenshots/1920x1080-1.jpg",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "Synconnnect App Screenshot 3",
            platform: "wide",
          },
          {
            src: "/screenshots/1920x1080-2.jpg",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "Synconnnect App Screenshot 4",
            platform: "wide",
          },
        ],
      },
    }),
  ],
});
