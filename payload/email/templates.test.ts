import { describe, expect, it } from 'vitest'
import {
  duplicatePurchaseAlert,
  enrolledLogIn,
  passwordReset,
  seatInvite,
  welcomeSetPassword,
} from './templates.ts'

const site = 'https://quarterlylearnings.com'

describe('email templates', () => {
  it('welcomeSetPassword', () => {
    expect(
      welcomeSetPassword({
        name: 'Jordan',
        courseTitle: 'AI Tool Survey',
        setPasswordUrl: `${site}/reset-password?token=abc&welcome=1`,
        forgotPasswordUrl: `${site}/forgot-password`,
        expiresInHours: 72,
      }),
    ).toMatchSnapshot()
  })

  it('enrolledLogIn without a name falls back to "Hello,"', () => {
    const email = enrolledLogIn({ courseTitle: 'AI Tool Survey', loginUrl: `${site}/login` })
    expect(email.text.startsWith('Hello,')).toBe(true)
    expect(email).toMatchSnapshot()
  })

  it('passwordReset', () => {
    expect(
      passwordReset({ resetUrl: `${site}/reset-password?token=abc`, forgotPasswordUrl: `${site}/forgot-password`, expiresInHours: 1 }),
    ).toMatchSnapshot()
  })

  it('seatInvite uses singular copy for one seat', () => {
    const email = seatInvite({
      companyName: 'Example Co',
      offeringTitle: 'AI Tool Survey',
      seatsPurchased: 1,
      inviteUrl: `${site}/join/token`,
      accountUrl: `${site}/account`,
    })
    expect(email.text).toContain('1 seat in')
    expect(email.text).toContain('until it is claimed')
    expect(email).toMatchSnapshot()
  })

  it('duplicatePurchaseAlert', () => {
    expect(
      duplicatePurchaseAlert({
        learnerEmail: 'jordan@example.com',
        offeringTitle: 'AI Tool Survey',
        stripeSessionId: 'cs_test_123',
        stripeDashboardUrl: 'https://dashboard.stripe.com/test/checkout/sessions/cs_test_123',
      }),
    ).toMatchSnapshot()
  })

  it('escapes HTML in user-supplied values', () => {
    const email = enrolledLogIn({ name: '<script>', courseTitle: 'A & B', loginUrl: `${site}/login` })
    expect(email.html).not.toContain('<script>')
    expect(email.html).toContain('A &amp; B')
  })
})
