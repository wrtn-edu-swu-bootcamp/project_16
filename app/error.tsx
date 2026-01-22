'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-title-1">문제가 발생했습니다</h1>
        <p className="text-body text-neutral-600">
          요청을 처리하는 중 오류가 발생했습니다.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            홈으로
          </Button>
        </div>
      </div>
    </div>
  )
}
