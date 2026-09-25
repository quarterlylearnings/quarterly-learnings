import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // scripts/test-server.ts builds into its own directory so e2e can run while
  // a regular `next dev` is already using .next (Next 16 allows one per distDir).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    // Multiple root layouts ((site), (ledger), (payload)) need a routing-level 404.
    globalNotFound: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
