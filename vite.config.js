import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "pokeball.png", "Pokeball-192.png", "Pokeball-512.png"],
      manifest: {
        name: "PokéPWA",
        short_name: "PokéPWA",
        description: "Tu Pokédex Progresiva con React + Vite",
        theme_color: "#dc2626",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "pokeball.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "Pokeball-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "Pokeball-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
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
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites/,
            handler: "CacheFirst",
            options: {
              cacheName: "pokemon-images-cache",
              expiration: { maxEntries: 300, maxAgeSeconds: 86400 }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  base: "/",
});