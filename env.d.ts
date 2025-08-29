/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly MODE: "development" | "production" | "test";
   // você pode adicionar outras variáveis de ambiente Vite se quiser
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
