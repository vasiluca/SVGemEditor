import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

import path from 'path'
import { fileURLToPath } from 'url'
import { listHostURL } from './plugins/vite-plugin-list-host-url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '../../')

export default defineConfig({
  root: repoRoot, // React will check all files in the specified root directory for jsx script imports and output them in dist, root is set to this because there are jsx imports in that root html file 
  base: './',
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: path.resolve(__dirname, 'tsconfig.json')
      }
    }),
    listHostURL
  ],
  build: {
    outDir: path.resolve(repoRoot, 'dist'),
    rollupOptions: {
      input: {
        index: path.resolve(repoRoot, 'index.html')
      }
    }
  },
  server: { // this is specifically for the react dev server
    open: '/index.html', // this opens the app on 'npm run dev'
    fs: { allow: [repoRoot] }
  },
})