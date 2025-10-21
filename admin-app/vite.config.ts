import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './app'),
      '@components': resolve(__dirname, './app/components'),
      '@stores': resolve(__dirname, './app/stores'),
      '@services': resolve(__dirname, './app/api/services'),
      '@types': resolve(__dirname, './app/types'),
      '@utils': resolve(__dirname, './app/utils'),
      '@pages': resolve(__dirname, './app/pages'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          pinia: ['pinia'],
          axios: ['axios'],
        },
      },
    },
  },
})
