// Transactional email copy for QL Ledger (DEV-82). Approved by Brandon.
// Each template returns { subject, html, text }; senders set from/to/reply-to.

import { TEXT_FOOTER, button, escapeHtml, greeting, layout, link, paragraph, plainLayout } from './layout.ts'

export type Email = { subject: string; html: string; text: string }

const QUESTION_LINE = 'If you have a question about the course, reply to this email.'

function hours(expiresInHours: number): string {
  return expiresInHours === 1 ? '1 hour' : `${expiresInHours} hours`
}

export function welcomeSetPassword(params: {
  name?: string
  courseTitle: string
  setPasswordUrl: string
  forgotPasswordUrl: string
  expiresInHours: number
}): Email {
  const { name, courseTitle, setPasswordUrl, forgotPasswordUrl, expiresInHours } = params
  const subject = `Your access to ${courseTitle} is ready`
  const intro = `Thank you for enrolling in ${courseTitle}. We created a Quarterly Learnings account for you with this email address. Set a password to start reading the course.`
  const expiry = `This link works for ${hours(expiresInHours)}. If it has expired, you can request a new one at`

  const html = layout({
    title: subject,
    body: [
      paragraph(escapeHtml(greeting(name))),
      paragraph(escapeHtml(intro)),
      button(setPasswordUrl, 'Set your password'),
      paragraph(`${escapeHtml(expiry)} ${link(forgotPasswordUrl)}.`),
      paragraph(escapeHtml(QUESTION_LINE)),
    ].join('\n'),
  })

  const text = [
    greeting(name),
    intro,
    `Set your password: ${setPasswordUrl}`,
    `${expiry} ${forgotPasswordUrl}.`,
    QUESTION_LINE,
  ].join('\n\n') + TEXT_FOOTER

  return { subject, html, text }
}

export function enrolledLogIn(params: { name?: string; courseTitle: string; loginUrl: string }): Email {
  const { name, courseTitle, loginUrl } = params
  const subject = `You're enrolled in ${courseTitle}`
  const intro = `Your payment went through and you're enrolled in ${courseTitle}. You already have a Quarterly Learnings account with this email address, so log in to start reading.`

  const html = layout({
    title: subject,
    body: [
      paragraph(escapeHtml(greeting(name))),
      paragraph(escapeHtml(intro)),
      button(loginUrl, 'Log in'),
      paragraph(escapeHtml(QUESTION_LINE)),
    ].join('\n'),
  })

  const text = [greeting(name), intro, `Log in: ${loginUrl}`, QUESTION_LINE].join('\n\n') + TEXT_FOOTER

  return { subject, html, text }
}

export function passwordReset(params: { resetUrl: string; forgotPasswordUrl: string; expiresInHours: number }): Email {
  const { resetUrl, forgotPasswordUrl, expiresInHours } = params
  const subject = 'Reset your Quarterly Learnings password'
  const intro = 'Someone asked to reset the password for this account. Use the link below to choose a new one.'
  const expiry = `The link works for ${hours(expiresInHours)}. If it has expired, request a new one at`
  const ignore = "If you didn't ask for this, you can ignore this email and your password will stay the same."

  const html = layout({
    title: subject,
    body: [
      paragraph(escapeHtml(intro)),
      button(resetUrl, 'Reset your password'),
      paragraph(`${escapeHtml(expiry)} ${link(forgotPasswordUrl)}. ${escapeHtml(ignore)}`),
    ].join('\n'),
  })

  const text = [intro, `Reset your password: ${resetUrl}`, `${expiry} ${forgotPasswordUrl}. ${ignore}`].join('\n\n') + TEXT_FOOTER

  return { subject, html, text }
}

export function seatInvite(params: {
  buyerName?: string
  companyName: string
  offeringTitle: string
  seatsPurchased: number
  inviteUrl: string
  accountUrl: string
}): Email {
  const { buyerName, companyName, offeringTitle, seatsPurchased, inviteUrl, accountUrl } = params
  const seats = seatsPurchased === 1 ? '1 seat' : `${seatsPurchased} seats`
  const claimedUntil = seatsPurchased === 1 ? 'until it is claimed' : `until all ${seatsPurchased} are claimed`
  const subject = `Your team's invite link for ${offeringTitle}`
  const intro = `Thank you for buying ${seats} in ${offeringTitle} for ${companyName}. Share the link below with the people you want to enroll. Each person logs in or creates an account, and the link gives them a seat ${claimedUntil}.`
  const buyerAccess = "You're enrolled too, and your access doesn't use a seat. To see who has claimed a seat, go to your account page."

  const html = layout({
    title: subject,
    body: [
      paragraph(escapeHtml(greeting(buyerName))),
      paragraph(escapeHtml(intro)),
      paragraph(link(inviteUrl)),
      paragraph(escapeHtml(buyerAccess)),
      button(accountUrl, 'View seats'),
    ].join('\n'),
  })

  const text = [greeting(buyerName), intro, inviteUrl, buyerAccess, `View seats: ${accountUrl}`].join('\n\n') + TEXT_FOOTER

  return { subject, html, text }
}

export function duplicatePurchaseAlert(params: {
  learnerEmail: string
  offeringTitle: string
  stripeSessionId: string
  stripeDashboardUrl: string
}): Email {
  const { learnerEmail, offeringTitle, stripeSessionId, stripeDashboardUrl } = params
  const subject = `Duplicate purchase: ${learnerEmail}, ${offeringTitle}`
  const intro = `${learnerEmail} bought ${offeringTitle} again while they already had active access. No new enrollment was created.`
  const session = `Stripe Checkout session: ${stripeSessionId}`
  const action = 'Refund in Stripe if the purchase was a mistake.'

  const html = plainLayout({
    title: subject,
    body: [
      `<p>${escapeHtml(intro)}</p>`,
      `<p>${escapeHtml(session)}<br>${link(stripeDashboardUrl)}</p>`,
      `<p>${escapeHtml(action)}</p>`,
    ].join('\n'),
  })

  const text = [intro, `${session}\n${stripeDashboardUrl}`, action].join('\n\n')

  return { subject, html, text }
}
