import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'apps/back-end/vitest.config.ts',
  'apps/front-end/vitest.config.ts',
  'packages/components/vitest.config.ts',
  'packages/core/vitest.config.ts'
])