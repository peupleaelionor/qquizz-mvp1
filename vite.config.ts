/**
 * QQUIZ PRODIGY - Vite Configuration
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import viteCompression from "vite-plugin-compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  // Base URL: '/' pour Vercel, '/qquizz-mvp1/' pour GitHub Pages
  base: process.env.VERCEL ? '/' : (command === 'serve' ? '/' : '/qquizz-mvp1/'),
  plugins: [
    react(),
    // Compression gzip pour des fichiers plus légers
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Obfuscation et minification avancée
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/, // Obfusquer les propriétés commençant par _
        },
      },
      format: {
        comments: false, // Supprimer tous les commentaires
      },
    },
    // Code splitting pour de meilleures performances
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-gsap': ['gsap'],
        },
        // Noms de fichiers obfusqués
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
    // Taille des chunks
    chunkSizeWarningLimit: 1000,
    // Source maps désactivés en production
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['.manus.computer'],
  },
  // Optimisations de dépendances
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap'],
  },
}));
