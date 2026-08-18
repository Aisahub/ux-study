import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  // The same `@/` the application imports by, so a test can reach a module that
  // reaches for the database without rewriting its imports. Next resolves this
  // from tsconfig's paths; Vitest does not read those.
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['./test/server.ts'],
    hookTimeout: 180_000,
    testTimeout: 30_000,
  },
})
