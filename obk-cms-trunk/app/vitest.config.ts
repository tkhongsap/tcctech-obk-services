import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@fonts': path.resolve(__dirname, 'src/fonts'),
      '@hocs': path.resolve(__dirname, 'src/hocs'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@public': path.resolve(__dirname, 'public'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      src: path.resolve(__dirname, 'src'),
      '@src': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@mocks': path.resolve(__dirname, '__mocks__'),
      '@tests': path.resolve(__dirname, '__tests__'),
      'utils/number': path.resolve(__dirname, 'utils/number'),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./__tests__/setup-test.ts'],
    include: ['./__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      enabled: true,
      all: true,
      thresholds: {
        lines: 80,
      },
      reporter: ['text', 'json', 'html'],
    },
  },
})
