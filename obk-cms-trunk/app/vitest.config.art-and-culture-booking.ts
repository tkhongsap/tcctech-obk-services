import { defineConfig, mergeConfig } from 'vitest/config'
import vitestConfig from './vitest.config'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['./__tests__/art-and-culture/booking/*.test.{ts,tsx}'],
      coverage: {
        include: [
          'pages/art-and-culture/booking/**/*.{ts,tsx}',
          'src/components/art-and-culture/booking-history/**/*.{ts,tsx}',
          'src/components/art-and-culture/booking-setting/**/*.{ts,tsx}',
          'src/components/art-and-culture/booking-status/**/*.{ts,tsx}',
          'src/services/art-and-culture/booking/**/*.{ts,tsx}',
        ],
        reportsDirectory: 'coverage/art-and-culture/booking',
      },
    },
  })
)
