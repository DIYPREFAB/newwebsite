import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts:["www.diyprefab.com","diyprefab.com"]
  },
  
  // Build optimizations
  build: {
    // Enable minification
    minify: 'esbuild',
    
    // Generate source maps for debugging
    sourcemap: false, // Set to true in development if needed
    
    // Optimize chunk splitting
    rollupOptions: {
      external: [
        '/chatscript/chat/chat.js'
      ],
      output: {
        // Separate vendor chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          bootstrap: ['bootstrap', 'reactstrap'],
        },
        
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    },
    
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  
  // Dependency optimization
  optimizeDeps: {
    // Pre-bundle these dependencies
    include: [
      'react',
      'react-dom',
      'reactstrap',
      'bootstrap'
    ],
    
    // Exclude from pre-bundling if needed
    exclude: []
  },
  
  // CSS processing optimizations
  css: {
    // Enable CSS code splitting
    codeSplit: true,
    
    // CSS preprocessing options
    preprocessorOptions: {
      scss: {
        // Add global SCSS variables if using SCSS
        additionalData: `@import "bootstrap/scss/functions"; @import "bootstrap/scss/variables";`
      }
    }
  },
  
  // Performance optimizations
  esbuild: {
    // Remove console logs and debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    
    // Enable tree shaking
    treeShaking: true
  },
  
  // Define global constants
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      // Add path aliases for cleaner imports
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@assets': '/src/assets'
    }
  }
})