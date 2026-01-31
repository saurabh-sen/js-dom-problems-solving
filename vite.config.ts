import { defineConfig } from 'vite'

export default defineConfig({
  // Enable serving files from subdirectories
  server: {
    fs: {
      allow: ['..']
    }
  },
  // Handle TypeScript files
  esbuild: {
    target: 'es2020'
  },
})
