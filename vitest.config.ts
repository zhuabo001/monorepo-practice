import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test?(s)/**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__x00__*',
        '**/\x00*',
        'cypress/**',
        'test?(s)/**',
        'test?(-*).?(c|m)[jt]s?(x)',
        '**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/vitest.{workspace,projects}.[jt]s?(on)',
        '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
        '**/node_modules/**'
      ],
      include: [
        'apps/**/src/**',
        'packages/**/src/**'
      ]
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1
      }
    },
    testTimeout: 30000,
    hookTimeout: 30000
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@core': resolve(__dirname, './packages/core/src'),
      '@components': resolve(__dirname, './packages/components/src'),
      '@backend': resolve(__dirname, './apps/back-end/src'),
      '@frontend': resolve(__dirname, './apps/front-end/src')
    }
  },
  esbuild: {
    target: 'node18'
  }
 })