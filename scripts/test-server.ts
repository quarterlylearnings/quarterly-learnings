// Boots the app against a throwaway in-memory MongoDB with seeded fixtures.
//   npm run dev:local           http://localhost:3000, data is lost on exit
//   PORT=3100 (Playwright)      e2e never touches Atlas or a running dev server

import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

const port = process.env.PORT || '3000'

// Playwright passes EMAIL_CAPTURE_FILE so specs can read sent emails; start it empty.
if (process.env.EMAIL_CAPTURE_FILE) {
  mkdirSync(path.dirname(process.env.EMAIL_CAPTURE_FILE), { recursive: true })
  writeFileSync(process.env.EMAIL_CAPTURE_FILE, '')
}

const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })

const env = {
  ...process.env,
  DATABASE_URI: replSet.getUri('ql-ledger-local'),
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'local-dev-secret',
  NEXT_PUBLIC_SERVER_URL: `http://localhost:${port}`,
  // Own build dir: Next 16 allows one `next dev` per distDir.
  NEXT_DIST_DIR: '.next-local',
}

// Must be async: mongod is a child of this process and writes its logs to a
// pipe we read. spawnSync would block our event loop, the pipe would fill, and
// mongod would stall mid-write while holding locks.
const seed = spawn('npx', ['payload', 'run', 'scripts/seed-e2e.ts'], { env, stdio: 'inherit' })
const [seedCode] = await once(seed, 'exit')
if (seedCode !== 0) {
  await replSet.stop()
  process.exit(seedCode ?? 1)
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
