import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./", // المسار الأساسي لمجلد frontend
  build: {
    outDir: "dist", // مكان إنشاء الملفات النهائية
    emptyOutDir: true,
  },
});
