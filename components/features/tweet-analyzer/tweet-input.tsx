'use client'

import { useState } from 'react'
import { useTweetAnalysis } from '@/lib/hooks/use-tweet-analysis'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function TweetInput({ onAnalysisComplete }: { onAnalysisComplete?: (result: any) => void }) {
  const [url, setUrl] = useState('')
  const { mutate, isPending, error } = useTweetAnalysis()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    mutate(url, {
      onSuccess: (data) => {
        onAnalysisComplete?.(data)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="tweet-url" className="text-headline font-semibold">
          트윗 URL 입력
        </label>
        <Input
          id="tweet-url"
          type="url"
          placeholder="https://x.com/username/status/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isPending}
        />
      </div>

      {error && (
        <div className="rounded-button bg-error/10 p-3 text-footnote text-error">
          {error.message}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Spinner size="sm" className="mr-2" />
            분석 중...
          </>
        ) : (
          '분석하기'
        )}
      </Button>
    </form>
  )
}
