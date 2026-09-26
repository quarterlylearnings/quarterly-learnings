import { describe, expect, it } from 'vitest'
import { mediaFileURL, r2Enabled } from './storage.ts'

const r2Env = {
  S3_BUCKET: 'ql-ledger',
  S3_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
  S3_ACCESS_KEY_ID: 'key',
  S3_SECRET_ACCESS_KEY: 'secret',
  S3_PUBLIC_URL: 'https://media.example.com',
}

describe('r2Enabled', () => {
  it('is on when every R2 variable is set', () => {
    expect(r2Enabled(r2Env)).toBe(true)
  })

  it('is off with MEDIA_STORAGE=local, even with credentials', () => {
    expect(r2Enabled({ ...r2Env, MEDIA_STORAGE: 'local' })).toBe(false)
  })

  it('falls back to local disk off Netlify when credentials are missing', () => {
    expect(r2Enabled({ ...r2Env, S3_SECRET_ACCESS_KEY: '' })).toBe(false)
  })

  it('refuses to start on Netlify without credentials', () => {
    expect(() => r2Enabled({ NETLIFY: 'true', S3_BUCKET: 'ql-ledger' })).toThrow(/S3_ENDPOINT.*Netlify/)
  })
})

describe('mediaFileURL', () => {
  it('points at the public bucket URL, not the app', () => {
    expect(mediaFileURL('https://media.example.com/', 'media', 'cover.png')).toBe(
      'https://media.example.com/media/cover.png',
    )
  })

  it('encodes file names', () => {
    expect(mediaFileURL('https://media.example.com', 'media', 'my cover.png')).toBe(
      'https://media.example.com/media/my%20cover.png',
    )
  })

  it('works without a prefix', () => {
    expect(mediaFileURL('https://media.example.com', undefined, 'a.png')).toBe('https://media.example.com/a.png')
  })
})
