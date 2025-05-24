import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: false, // ❗ Desativa execução paralela entre arquivos
  workers: 1,            // ❗ Garante execução 1 por vez (inclusive em CI)
  use: {
    headless: true,
    baseURL: 'http://localhost:5173',
  },
});