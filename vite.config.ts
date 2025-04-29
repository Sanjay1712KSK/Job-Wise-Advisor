import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true, // listen on all interfaces (recommended)
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});


// http://localhost:8080/
// API KEY : 1ad5be1af97d5178a3713d99503dc656deceea7269714e01a8cbd554813a95af