import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar warnings de TypeScript durante o build
        if (warning.code === 'PLUGIN_WARNING') return
        warn(warning)
      }
    }
  },
  esbuild: {
    // Ignorar erros de TypeScript no build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
