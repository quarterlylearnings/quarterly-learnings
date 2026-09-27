import { describe, expect, it } from 'vitest'
import { safeNext } from './safeNext.ts'

describe('safeNext', () => {
  it.each([
    ['/courses/ai-tool-survey', '/courses/ai-tool-survey'],
    ['/account?tab=profile', '/account?tab=profile'],
  ])('keeps same-site path %s', (input, expected) => {
    expect(safeNext(input)).toBe(expected)
  })

  it.each([
    ['https://evil.com'],
    ['//evil.com'],
    ['/\\evil.com'],
    ['javascript:alert(1)'],
    ['courses'],
    ['/\tevil'],
    [''],
    [null],
    [undefined],
  ])('falls back to /courses for %s', (input) => {
    expect(safeNext(input)).toBe('/courses')
  })
})
