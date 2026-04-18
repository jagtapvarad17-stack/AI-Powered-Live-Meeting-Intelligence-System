import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // So Vite serves from root and /overlay route works
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main:    'index.html',
        overlay: 'overlay.html',
      },
    },
  },
})
