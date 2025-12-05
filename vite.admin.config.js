import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for shared hosting
  build: {
    outDir: 'dist-admin',
    rollupOptions: {
      input: {
        admin: path.resolve(__dirname, 'admin.html')
      }
    }
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
