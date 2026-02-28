import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isElectron = mode === "electron";

  return {
    plugins: [react()],
    base: isElectron ? "./" : "/",
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        overlay: true,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@editor": path.resolve(__dirname, "./src/editor"),
        "@store": path.resolve(__dirname, "./src/store"),
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
  };
});
