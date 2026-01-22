import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-button text-body font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-sky-500 text-white shadow-button hover:bg-sky-600 hover:shadow-button-hover active:scale-[0.98]',
        secondary:
          'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:scale-[0.98]',
        outline:
          'border border-neutral-300 bg-transparent hover:bg-neutral-50 active:scale-[0.98]',
        ghost: 'hover:bg-neutral-100 active:scale-[0.98]',
        link: 'text-sky-500 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-footnote',
        md: 'h-11 px-6',
        lg: 'h-12 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
