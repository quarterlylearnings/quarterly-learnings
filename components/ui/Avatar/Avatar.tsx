'use client'

import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { useState } from 'react'

const avatarVariants = cva(
  'relative flex items-center justify-center overflow-hidden flex-shrink-0',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const initialsVariants = cva(
  'rounded-full bg-primary/20 text-tertiary font-sans font-semibold select-none',
  {
    variants: {
      size: {
        sm: 'text-label',
        md: 'text-small',
        lg: 'text-body',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

const logoClass = 'rounded-md bg-white border border-neutral/20'

const sizeMap: Record<string, number> = { sm: 32, md: 48, lg: 64 }

type AvatarProps = VariantProps<typeof avatarVariants> & {
  src?: string
  alt?: string
  name?: string
  variant?: 'logo' | 'initials'
  className?: string
}

export function Avatar({
  src,
  alt = '',
  name,
  variant = 'logo',
  size = 'md',
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  const showInitials = variant === 'initials' || !src || imgError
  const px = sizeMap[size ?? 'md']

  if (showInitials) {
    return (
      <div
        className={`${avatarVariants({ size, className })} ${initialsVariants({ size })}`}
        role="img"
        aria-label={name ?? alt}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className={`${avatarVariants({ size, className })} ${logoClass}`}>
      <Image
        src={src!}
        alt={alt}
        width={px}
        height={px}
        className="object-contain w-full h-full p-1"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
