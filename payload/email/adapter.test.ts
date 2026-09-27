import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import type { Payload } from 'payload'
import { afterEach, describe, expect, it } from 'vitest'
import { EMAIL_REPLY_TO, emailAdapter } from './adapter.ts'

describe('emailAdapter', () => {
  afterEach(() => {
    delete process.env.EMAIL_CAPTURE_FILE
  })

  it('logs to the console (no adapter) when neither Resend nor capture is configured', () => {
    expect(emailAdapter()).toBeUndefined()
  })

  it('adds reply-to info@ to every message, including ones that set none', async () => {
    const file = path.join(mkdtempSync(path.join(tmpdir(), 'ql-email-')), 'emails.jsonl')
    process.env.EMAIL_CAPTURE_FILE = file

    const adapter = emailAdapter()!({ payload: {} as Payload })
    await adapter.sendEmail({ to: 'learner@example.com', subject: 'Hello', html: '<p>Hi</p>' })

    const [sent] = readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line))
    expect(sent).toMatchObject({ to: 'learner@example.com', subject: 'Hello', replyTo: EMAIL_REPLY_TO })
    expect(adapter.defaultFromAddress).toBe('ledger@quarterlylearnings.com')
  })
})
