import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'
import path from 'path'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['robots.txt', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,otf,ttf}']
  },
  manifest: {
    name: 'Dev_Wars',
    short_name: 'dev_wars',
    theme_color: '#577590',
    background_color: '#577590',
    display: 'standalone',
    orientation: 'portrait',
    categories: ["game", "strategy", "war"],
    icons: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      }
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}

const replaceOptions = {
  __DATE__: new Date().toISOString(),
  __RELOAD_SW__: 'true'
}

export default defineConfig({
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    },
  },
  plugins: [
    vue(),
    VitePWA(pwaOptions),
    replace(replaceOptions),
  ],
})