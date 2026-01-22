import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-large-title">404</h1>
        <h2 className="text-title-1">페이지를 찾을 수 없습니다</h2>
        <p className="text-body text-neutral-600">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  )
}
