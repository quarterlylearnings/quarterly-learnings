import { describe, expect, it } from 'vitest'
import { formatPrice, salesWindow } from './offerings.ts'

const opens = '2026-10-01T12:00:00.000Z'
const closes = '2026-10-15T12:00:00.000Z'
const at = (iso: string) => new Date(iso)

describe('salesWindow', () => {
  it('is not open before salesOpenAt', () => {
    expect(salesWindow({ salesOpenAt: opens, salesCloseAt: closes }, at('2026-10-01T11:59:59.999Z'))).toEqual({
      status: 'not_open',
      opensAt: at(opens),
    })
  })

  it('opens exactly at salesOpenAt', () => {
    expect(salesWindow({ salesOpenAt: opens, salesCloseAt: closes }, at(opens))).toEqual({
      status: 'open',
      closesAt: at(closes),
    })
  })

  it('is open inside the window', () => {
    expect(salesWindow({ salesOpenAt: opens, salesCloseAt: closes }, at('2026-10-08T00:00:00Z')).status).toBe('open')
  })

  it('has ended from salesCloseAt on', () => {
    expect(salesWindow({ salesOpenAt: opens, salesCloseAt: closes }, at(closes))).toEqual({
      status: 'ended',
      closedAt: at(closes),
    })
  })

  it('treats an empty open bound as already open', () => {
    expect(salesWindow({ salesCloseAt: closes }, at('2020-01-01T00:00:00Z')).status).toBe('open')
  })

  it('treats an empty close bound as never closing', () => {
    expect(salesWindow({ salesOpenAt: opens }, at('2099-01-01T00:00:00Z'))).toEqual({ status: 'open', closesAt: null })
  })

  it('is always open with no bounds', () => {
    expect(salesWindow({ salesOpenAt: null, salesCloseAt: null }).status).toBe('open')
  })
})

describe('formatPrice', () => {
  it('drops cents on whole amounts', () => {
    expect(formatPrice(49900, 'usd')).toBe('$499')
    expect(formatPrice(120000, 'usd')).toBe('$1,200')
  })

  it('keeps cents otherwise', () => {
    expect(formatPrice(4950, 'usd')).toBe('$49.50')
  })
})
