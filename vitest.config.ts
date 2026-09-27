import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', 'e2e/**', '.next/**', '.next-local/**', 'storybook-static/**'],
    globalSetup: ['./test/globalSetup.ts'],
    // One in-memory database is shared, so spec files run one at a time.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
})
