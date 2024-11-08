import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { loadEnv } from 'vite';
import dotenv from 'dotenv';
import { existsSync } from "fs";

const envFilePath = '.env.local';
dotenv.config({
  path: existsSync(envFilePath) ? envFilePath : undefined,
  override: true,
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': loadEnv(mode, process.cwd()),
  },
}))
