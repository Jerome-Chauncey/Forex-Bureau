import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'forex-bureau-ui.onrender.com',
      'forex-bureau-api.onrender.com'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})