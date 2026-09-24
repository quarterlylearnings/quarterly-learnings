// Boots the app against a throwaway in-memory MongoDB with seeded fixtures.
//   npm run dev:local           http://localhost:3000, data is lost on exit
//   PORT=3100 (Playwright)      e2e never touches Atlas or a running dev server

import { spawn, spawnSync } from 'node:child_process'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

const port = process.env.PORT || '3000'
const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })

const env = {
  ...process.env,
  DATABASE_URI: replSet.getUri('ql-learn-local'),
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'local-dev-secret',
  NEXT_PUBLIC_SERVER_URL: `http://localhost:${port}`,
  NEXT_DIST_DIR: '.next-local',
}

const seed = spawnSync('npx', ['payload', 'run', 'scripts/seed-e2e.ts'], { env, stdio: 'inherit' })
if (seed.status !== 0) {
  await replSet.stop()
  process.exit(seed.status ?? 1)
}

const next = spawn('npx', ['next', 'dev', '-p', port], { env, stdio: 'inherit' })

const shutdown = async () => {
  next.kill('SIGTERM')
  await replSet.stop()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
next.on('exit', shutdown)
