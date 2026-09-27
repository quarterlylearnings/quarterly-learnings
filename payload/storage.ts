import { s3Storage } from '@payloadcms/storage-s3'

type Env = Record<string, string | undefined>

/** Public URL of an object in the bucket, e.g. https://media.example.com/media/cover.png */
export function mediaFileURL(publicUrl: string, prefix: string | undefined, filename: string): string {
  const path = [prefix, filename].filter((part): part is string => Boolean(part)).map(encodeURIComponent)
  return [publicUrl.replace(/\/+$/, ''), ...path].join('/')
}

/**
 * Whether uploads go to Cloudflare R2 (PRD §4.6). Tests and the e2e server set
 * MEDIA_STORAGE=local, which beats anything in .env files, so they never touch
 * the bucket. On Netlify there is no persistent disk, so missing credentials
 * there are an error rather than a silent fallback.
 */
export function r2Enabled(env: Env = process.env): boolean {
  if (env.MEDIA_STORAGE === 'local') return false
  const missing = ['S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_PUBLIC_URL'].filter(
    (name) => !env[name],
  )
  if (missing.length === 0) return true
  if (env.NETLIFY === 'true') throw new Error(`Media storage needs ${missing.join(', ')} on Netlify.`)
  return false
}

/**
 * R2 storage for the `media` collection. Files are read straight from the
 * bucket's public URL, so images never pass through a Netlify function.
 */
export function mediaStorage(env: Env = process.env) {
  const publicUrl = env.S3_PUBLIC_URL ?? ''
  return s3Storage({
    enabled: r2Enabled(env),
    // Same schema (the `prefix` field) whether or not R2 is on, so types don't drift.
    alwaysInsertFields: true,
    bucket: env.S3_BUCKET ?? '',
    config: {
      endpoint: env.S3_ENDPOINT,
      region: 'auto',
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: env.S3_SECRET_ACCESS_KEY ?? '',
      },
    },
    collections: {
      media: {
        prefix: 'media',
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) => mediaFileURL(publicUrl, prefix, filename),
      },
    },
  })
}
