import { defineConfig } from "@playwright/test";

export default defineConfig({
   fullyParallel: false, // ❗ Desativa execução paralela entre arquivos
   workers: 1, // ❗ Garante execução 1 por vez (inclusive em CI)
   use: {
      headless: true,
      baseURL: "http://localhost:5173",
      storageState: "state.json", // usa o state salvo pelo globalSetup
   },
   globalSetup: "./global-setup.ts", // caminho para o arquivo do setup
});
