import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: './manifest.json',
      additionalInputs: ['src/popup/popup.html', 'src/sidebar/sidebar.html']
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: 'src/background/background.ts',
        contentScript: 'src/content-script/content-script.ts'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
})
