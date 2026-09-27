const DEFAULT_NEXT = '/courses'

/**
 * Sanitizes a `?next=` return URL so auth pages can't be used as an open
 * redirect. Only same-site paths are allowed: "/courses/x" passes;
 * "https://evil.com", "//evil.com" and "/\evil.com" fall back to /courses.
 */
export function safeNext(value: unknown, fallback = DEFAULT_NEXT): string {
  if (typeof value !== 'string' || value.length === 0) return fallback
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//') || value.startsWith('/\\')) return fallback
  if (/[\u0000-\u001f]/.test(value)) return fallback
  return value
}
