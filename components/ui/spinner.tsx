'use client'

import { cn } from '@/lib/utils/cn'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-neutral-300 border-t-sky-500', sizeClasses[size], className)} />
  )
}
