import { appendFileSync } from 'node:fs'
import { resendAdapter } from '@payloadcms/email-resend'
import type { EmailAdapter, SendEmailOptions } from 'payload'

export const EMAIL_FROM_ADDRESS = 'ledger@quarterlylearnings.com' // send-only, no inbox
export const EMAIL_FROM_NAME = 'Quarterly Learnings'
export const EMAIL_REPLY_TO = 'info@quarterlylearnings.com'

/** Test adapter: appends each message as a JSON line so Playwright can read it. */
function captureAdapter(file: string): EmailAdapter {
  return () => ({
    name: 'capture',
    defaultFromAddress: EMAIL_FROM_ADDRESS,
    defaultFromName: EMAIL_FROM_NAME,
    sendEmail: async (message: SendEmailOptions) => {
      const { to, subject, html, text, replyTo } = message
      appendFileSync(file, JSON.stringify({ to, subject, html, text, replyTo }) + '\n')
      return { ok: true }
    },
  })
}

/** Every message, including Payload's built-in ones, replies to info@. */
function withReplyTo(adapter: EmailAdapter): EmailAdapter {
  return (args) => {
    const initialized = adapter(args)
    return {
      ...initialized,
      sendEmail: (message) => initialized.sendEmail({ replyTo: EMAIL_REPLY_TO, ...message }),
    }
  }
}

/**
 * Resend when RESEND_API_KEY is set, a file-capture adapter when
 * EMAIL_CAPTURE_FILE is set (e2e), otherwise undefined so Payload logs emails
 * to the console (local dev).
 */
export function emailAdapter(): EmailAdapter | undefined {
  if (process.env.RESEND_API_KEY) {
    return withReplyTo(
      resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: EMAIL_FROM_ADDRESS,
        defaultFromName: EMAIL_FROM_NAME,
      }),
    )
  }
  if (process.env.EMAIL_CAPTURE_FILE) {
    return withReplyTo(captureAdapter(process.env.EMAIL_CAPTURE_FILE))
  }
  return undefined
}
