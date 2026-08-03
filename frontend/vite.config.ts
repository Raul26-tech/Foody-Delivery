import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite runs from frontend/, but project environment variables live at repo root.
export default defineConfig({
  envDir: "../",
  plugins: [react()],
});
