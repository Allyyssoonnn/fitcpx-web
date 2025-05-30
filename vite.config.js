import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import compression from 'vite-plugin-compression';
import fs from 'fs';
import crypto from 'crypto';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    compression({
      algorithm: 'brotliCompress', // Usa Brotli (mais eficiente que Gzip)
      threshold: 1024, // Só comprime arquivos maiores que 1KB
    }),
    react(),
    metaPlugin(),
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
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 // Ajusta o limite para 5MB
      }
    })
  ],
  build: {
    // minify: 'esbuild',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log()
      },
    },
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
})

function metaPlugin() {
  return {
    name: 'vite-meta-hash',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));

      let combined = '';
      files.forEach((file) => {
        const content = fs.readFileSync(path.join(distPath, file), 'utf-8');
        combined += `/** ${file} **/\n${content}\n`;
      });

      const hash = crypto.createHash('sha256').update(combined).digest('hex').slice(0, 10);

      const output = {
        hash,
        timestamp: Date.now(),
      };

      fs.writeFileSync(
        path.join(distPath, 'meta.json'),
        JSON.stringify(output)
      );

      console.log('✅ meta.json gerado com hash:', hash);
    },
  };
}