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
        name: "Synconnnect",
        short_name: "Synconnnect",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#67d861",
        start_url: "/dashboard",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
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
