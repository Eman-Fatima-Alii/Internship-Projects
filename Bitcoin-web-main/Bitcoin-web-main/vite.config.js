import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    allowedHosts: ['bitcoin-web-09t4.onrender.com']
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: ['bitcoin-web-09t4.onrender.com']
  }
})