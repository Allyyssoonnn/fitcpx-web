import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

const buildType = process.env.VITE_BUILD_TYPE || "usuario";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: `dist-${buildType}`, // Gera dist-usuario ou dist-aluno
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
})
