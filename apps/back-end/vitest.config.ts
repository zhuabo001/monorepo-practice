import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config.ts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'back-end',
      environment: 'node',
      include: [
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'
      ],
      coverage: {
        include: [
          'src/**'
        ]
      }
    }
  })
)