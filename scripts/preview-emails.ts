// Renders every QL Ledger email with sample data to tmp/email-preview/.
//   node scripts/preview-emails.ts                 write HTML + text previews
//   node scripts/preview-emails.ts --send <email>  also send each one via Resend (needs RESEND_API_KEY)

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import {
  duplicatePurchaseAlert,
  enrolledLogIn,
  passwordReset,
  seatInvite,
  welcomeSetPassword,
  type Email,
} from '../payload/email/templates.ts'

try {
  process.loadEnvFile('.env.local')
} catch {
  // No .env.local: previews still render; --send will fail without RESEND_API_KEY.
}

const site = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://quarterlylearnings.com').replace(/\/$/, '')

const samples: Record<string, Email> = {
  'welcome-set-password': welcomeSetPassword({
    name: 'Jordan',
    courseTitle: 'AI Tool Survey',
    setPasswordUrl: `${site}/reset-password?token=sample-token&welcome=1`,
    forgotPasswordUrl: `${site}/forgot-password`,
    expiresInHours: 72,
  }),
  'enrolled-log-in': enrolledLogIn({
    name: 'Jordan',
    courseTitle: 'AI Tool Survey',
    loginUrl: `${site}/login?next=/courses/ai-tool-survey`,
  }),
  'password-reset': passwordReset({
    resetUrl: `${site}/reset-password?token=sample-token`,
    forgotPasswordUrl: `${site}/forgot-password`,
    expiresInHours: 72,
  }),
  'seat-invite': seatInvite({
    buyerName: 'Sam',
    companyName: 'Example Co',
    offeringTitle: 'AI Tool Survey, Nov 2026 cohort',
    seatsPurchased: 5,
    inviteUrl: `${site}/join/sample-invite-token`,
    accountUrl: `${site}/account`,
  }),
  'duplicate-purchase-alert': duplicatePurchaseAlert({
    learnerEmail: 'jordan@example.com',
    offeringTitle: 'AI Tool Survey, Nov 2026 cohort',
    stripeSessionId: 'cs_test_sample',
    stripeDashboardUrl: 'https://dashboard.stripe.com/test/checkout/sessions/cs_test_sample',
  }),
}

const outDir = path.resolve('tmp/email-preview')
mkdirSync(outDir, { recursive: true })

for (const [name, email] of Object.entries(samples)) {
  writeFileSync(path.join(outDir, `${name}.html`), email.html)
  writeFileSync(path.join(outDir, `${name}.txt`), `Subject: ${email.subject}\n\n${email.text}\n`)
  console.log(`wrote ${name} — "${email.subject}"`)
}
console.log(`\nOpen ${outDir} in a browser to review.`)

const sendIndex = process.argv.indexOf('--send')
if (sendIndex !== -1) {
  const to = process.argv[sendIndex + 1]
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) {
    console.error('--send needs a recipient address and RESEND_API_KEY')
    process.exit(1)
  }

  for (const [name, email] of Object.entries(samples)) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Quarterly Learnings <ledger@quarterlylearnings.com>',
        to,
        reply_to: 'info@quarterlylearnings.com',
        subject: `[preview] ${email.subject}`,
        html: email.html,
        text: email.text,
      }),
    })
    console.log(`sent ${name}: ${res.status} ${await res.text()}`)
  }
}
