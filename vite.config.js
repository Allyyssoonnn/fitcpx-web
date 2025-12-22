import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
   server: {
      open: true,
   },
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   plugins: [
      tailwindcss(),
      compression({
         algorithm: "brotliCompress", // Usa Brotli (mais eficiente que Gzip)
         threshold: 1024, // Só comprime arquivos maiores que 1KB
      }),
      react(),
      VitePWA({
         registerType: "autoUpdate",
         injectRegister: "auto",
         manifest: {
            name: "Fit Complex",
            short_name: "FitCpx",
            description: "Um app de Lab Complex Dev LTDA",
            theme_color: "#ffffff",
            icons: [
               {
                  src: "/icon-192x192.png",
                  sizes: "192x192",
                  type: "image/png",
               },
               {
                  src: "/icon-512x512.png",
                  sizes: "512x512",
                  type: "image/png",
               },
            ],
         },
         workbox: {
            maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // Ajusta o limite para 5MB
            skipWaiting: true, // ⬅️ força o SW a ativar sem esperar o usuário fechar
            clientsClaim: true, // ⬅️ força a controlar todas as abas imediatamente
         },
      }),
   ],
   define: {
      __APP_VERSION__: JSON.stringify(version),
   },
   build: {
      // minify: 'esbuild',
      minify: "terser",
      terserOptions: {
         compress: {
            drop_console: true, // Remove console.log()
         },
         keep_classnames: true,
         keep_fnames: true,
      },
      outDir: "dist",
   },
});
