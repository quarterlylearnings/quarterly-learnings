import type { Course, Media } from '@/payload-types'

type CourseCoverProps = {
  image: Course['coverImage']
  className?: string
  /** Load immediately (the course page hero) instead of when scrolled near. */
  priority?: boolean
}

/**
 * A course's cover image, or nothing when there isn't one. Uses a plain <img>
 * so the browser loads it straight from R2; next/image would route every
 * image through a Netlify function (DEV-87).
 */
export function CourseCover({ image, className, priority }: CourseCoverProps) {
  if (!image || typeof image !== 'object') return null
  const media = image as Media
  const card = media.sizes?.card
  const src = card?.url ?? media.url
  if (!src) return null
  const width = card?.width ?? media.width ?? undefined
  const height = card?.height ?? media.height ?? undefined

  return (
    // eslint-disable-next-line @next/next/no-img-element -- served from R2, see above
    <img
      src={src}
      alt={media.alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`aspect-[16/9] w-full object-cover ${className ?? ''}`}
    />
  )
}
