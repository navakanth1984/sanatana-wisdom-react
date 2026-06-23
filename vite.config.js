import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: enables JSX compilation + binds dev server to all interfaces
// so the ngrok tunnel (drove-employed-unmixed) can reach it.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listen on 0.0.0.0 — required for ngrok
    port: 5173,
    allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app'],
  },
})
