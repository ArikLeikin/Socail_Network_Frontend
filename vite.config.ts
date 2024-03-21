import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSSL from '@vitejs/plugin-basic-ssl'
import path from "path";
import https from "https";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: 
  [
    react(),
  ],
  server: {
    https: {
      key: fs.readFileSync("/home/st111/Socail_Network_Frontend/client-key.pem"),
      cert: fs.readFileSync("/home/st111/Socail_Network_Frontend/client-cert.pem")
    }
  }
});
