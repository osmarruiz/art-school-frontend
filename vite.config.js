import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/students.list": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/transactions.list": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/transactions.revoke_receipt": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/transactions.finish": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/transactions.revoke": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/transactions.add_receipt": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
