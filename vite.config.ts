import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'PolishLab',
        short_name: 'PolishLab',
        description: 'Simple ai integration app',
        theme_color: '#ffffff',

        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
