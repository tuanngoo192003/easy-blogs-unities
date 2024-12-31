/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import {quasar} from "@quasar/vite-plugin";
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'

dotenv.config()

export default defineConfig({
  cacheDir: './node_modules/.vite/easy-blogs-unities',
  server: {
    port: parseInt(process.env.VITE_PORT || '4200', 10),
    host: process.env.VITE_HOST || 'localhost',
    proxy: {
      "/socket.io": {
        target: process.env.VITE_SOCKET_URL || 'http://localhost:10000',
        changeOrigin: true,
        secure: false,
        ws: true
      },
    },
    strictPort: true,
    hmr: {
      overlay: false,
      clientPort: parseInt(process.env.VITE_PORT || '8082', 10),
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md']),
            quasar({
              sassVariables: fileURLToPath(
                  new URL('./src/quasar-variables.sass', import.meta.url)
              )
            })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist/easy-blogs-unities',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage/easy-blogs-unities',
      provider: 'v8',
    },
  },
});
