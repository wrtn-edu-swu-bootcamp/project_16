'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  session: any
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-headline font-bold">
          TweetLingo
        </Link>

        <nav className="flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/analyze"
                className={`text-body font-medium transition-colors hover:text-sky-500 ${
                  pathname === '/analyze' ? 'text-sky-500' : 'text-neutral-700'
                }`}
              >
                분석
              </Link>
              <Link
                href="/vocabulary"
                className={`text-body font-medium transition-colors hover:text-sky-500 ${
                  pathname === '/vocabulary' ? 'text-sky-500' : 'text-neutral-700'
                }`}
              >
                단어장
              </Link>
              <Link
                href="/settings"
                className={`text-body font-medium transition-colors hover:text-sky-500 ${
                  pathname === '/settings' ? 'text-sky-500' : 'text-neutral-700'
                }`}
              >
                설정
              </Link>
              <Button variant="outline" size="sm">
                로그아웃
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">로그인</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
