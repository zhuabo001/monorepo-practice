import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config.ts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'components',
      environment: 'jsdom',
      include: [
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ],
      coverage: {
        include: [
          'src/**'
        ]
      }
    }
  })
)