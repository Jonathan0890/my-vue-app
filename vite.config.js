import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pokeball.png"],
      manifest: {
        name: "PokéPWA",
        short_name: "PokéPWA",
        description: "Tu Pokédex Progresiva con React + Vite",
        theme_color: "#ff1c1c",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pokeball.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pokeball.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon/,
            handler: "NetworkFirst",
            options: {
              cacheName: "pokemon-api-cache",
              expiration: { maxEntries: 150, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern:
              /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites/,
            handler: "CacheFirst",
            options: {
              cacheName: "pokemon-images-cache",
              expiration: { maxEntries: 300, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ]
});
