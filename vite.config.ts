import { defineConfig } from "vite";

// O frontend (web/) é servido pelo Vite; chamadas /api/* vão para o Express na porta 3000.
export default defineConfig({
  root: "web",
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
  build: { outDir: "../dist", emptyOutDir: true },
});
