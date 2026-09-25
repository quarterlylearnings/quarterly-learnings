import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores([
    '.next/**',
    '.next-local/**',
    'out/**',
    'build/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
    'tmp/**',
    'next-env.d.ts',
    'payload-types.ts',
    'app/(payload)/**',
  ]),
])
