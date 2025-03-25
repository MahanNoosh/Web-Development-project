import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 2450;


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`
      }
    },
    build: {
      outDir: 'dist'
    }
  },
});

console.log(`Proxy set to http://localhost:${PORT}`);