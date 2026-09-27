/**
 * A solid-color PNG as a Payload upload file, for seeds and tests. Sharp is
 * imported lazily so Playwright specs can import the seed module without it.
 */
export async function placeholderImage(name: string, { width = 1600, height = 900, color = '#FFDB00' } = {}) {
  const { default: sharp } = await import('sharp')
  const data = await sharp({ create: { width, height, channels: 3, background: color } }).png().toBuffer()
  return { data, mimetype: 'image/png', name, size: data.length }
}
