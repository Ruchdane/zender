import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  // plugins: [eslintPlugin()],
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    strictPort: true,
  },
  esbuild: {
    jsx: "transform",
    jsxFactory: "m",
    jsxFragment: "'['",
  },
  // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
  // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
  // env variables
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    rollupOptions:{
        input:['index.html',"splashscreen.html"]
      },
    // Tauri supports es2021
    target: ['es2021', 'chrome100', 'safari13'],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    root:"src-mithril",
    transformMode: {
      web: [/.[tj]sx$/],
    }
  }
})