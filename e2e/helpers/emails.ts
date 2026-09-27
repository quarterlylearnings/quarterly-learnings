import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect } from '@playwright/test'

/** Emails sent during e2e land here as JSON lines (payload/email/adapter.ts). */
export const EMAIL_CAPTURE_FILE = path.resolve('tmp/e2e-emails.jsonl')

type CapturedEmail = { to: string; subject: string; html?: string; text?: string; replyTo?: string }

function readEmails(): CapturedEmail[] {
  const raw = readFileSync(EMAIL_CAPTURE_FILE, 'utf8').trim()
  return raw ? raw.split('\n').map((line) => JSON.parse(line) as CapturedEmail) : []
}

/** Waits for the most recent email sent to `to` and returns it. */
export async function latestEmailTo(to: string): Promise<CapturedEmail> {
  let found: CapturedEmail | undefined
  await expect
    .poll(() => {
      found = readEmails().filter((email) => email.to === to).at(-1)
      return Boolean(found)
    }, { timeout: 10_000 })
    .toBe(true)
  return found!
}

/** First href in the email's HTML that contains `pathPart`, with HTML entities decoded. */
export function linkIn(email: CapturedEmail, pathPart: string): string {
  const href = [...(email.html ?? '').matchAll(/href="([^"]+)"/g)]
    .map((match) => match[1].replace(/&amp;/g, '&'))
    .find((url) => url.includes(pathPart))
  if (!href) throw new Error(`No link containing ${pathPart} in "${email.subject}"`)
  return href
}
