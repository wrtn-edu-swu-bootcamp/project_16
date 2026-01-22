import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TweetLingo',
  description: 'Learn languages from X tweets',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
