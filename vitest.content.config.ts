import { defineConfig } from 'vitest/config'

/**
 * The content checks alone, without the global setup.
 *
 * Authoring content touches no route and no table, so migrating the test
 * branch and booting a server proves nothing here — and both are exclusive:
 * a second suite running beside this one would race for the same branch and
 * the same port. Dropping the setup lets someone author content while
 * someone else works on the application.
 */
export default defineConfig({
  test: {
    include: ['test/content.test.ts', 'test/competencies.test.ts', 'test/items.test.ts'],
    testTimeout: 30_000,
  },
})
