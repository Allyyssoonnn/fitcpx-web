import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

const buildType = process.env.VITE_BUILD_TYPE || "usuario";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Fit Complex",
        short_name: "FitCpx",
        description: "Um app de Lab Complex Dev",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // Ajusta o limite para 5MB
      }
    })
  ],
  build: {
    outDir: `dist-${buildType}`, // Gera dist-usuario ou dist-aluno
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
})
