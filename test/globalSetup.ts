import { MongoMemoryReplSet } from 'mongodb-memory-server'

// Starts a throwaway single-node replica set (Payload uses transactions) and
// points Payload at it before any spec imports the config.
let replSet: MongoMemoryReplSet | undefined

export async function setup() {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  process.env.DATABASE_URI = replSet.getUri('ql-ledger-test')
  process.env.PAYLOAD_SECRET = 'test-secret'
}

export async function teardown() {
  await replSet?.stop()
}
