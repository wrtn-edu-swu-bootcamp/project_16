'use client'

import { useState } from 'react'
import { useTweetAnalysis } from '@/lib/hooks/use-tweet-analysis'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type InputMode = 'text' | 'url'

export function TweetInput({ onAnalysisComplete }: { onAnalysisComplete?: (result: any) => void }) {
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const { mutate, isPending, error } = useTweetAnalysis()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputMode === 'text') {
      if (!text.trim()) return
      mutate({ text: text.trim() }, {
        onSuccess: (data) => {
          onAnalysisComplete?.(data)
        }
      })
    } else {
      if (!url.trim()) return
      mutate({ url: url.trim() }, {
        onSuccess: (data) => {
          onAnalysisComplete?.(data)
        }
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input Mode Tabs */}
      <div className="flex rounded-button border border-separator overflow-hidden">
        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`flex-1 py-2 px-4 text-callout font-medium transition-colors ${
            inputMode === 'text'
              ? 'bg-primary text-white'
              : 'bg-secondary text-secondary hover:bg-tertiary'
          }`}
        >
          텍스트 입력
        </button>
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex-1 py-2 px-4 text-callout font-medium transition-colors ${
            inputMode === 'url'
              ? 'bg-primary text-white'
              : 'bg-secondary text-secondary hover:bg-tertiary'
          }`}
        >
          URL 입력
        </button>
      </div>

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="flex flex-col space-y-2">
          <label htmlFor="tweet-text" className="text-headline font-semibold">
            트윗 내용 입력
          </label>
          <p className="text-footnote text-secondary">
            X(Twitter)에서 트윗 내용을 복사해서 붙여넣으세요
          </p>
          <textarea
            id="tweet-text"
            placeholder="트윗 내용을 여기에 붙여넣으세요...&#10;&#10;예: Learning English is fun! I love reading books and watching movies to improve my vocabulary."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
            rows={5}
            className="w-full rounded-input border border-separator bg-secondary px-4 py-3 text-body placeholder:text-tertiary focus:border-primary focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <p className="text-caption text-tertiary">
            최소 3개 이상의 학습 가능한 단어가 포함되어야 합니다
          </p>
        </div>
      )}

      {/* URL Input Mode */}
      {inputMode === 'url' && (
        <div className="flex flex-col space-y-2">
          <label htmlFor="tweet-url" className="text-headline font-semibold">
            트윗 URL 입력
          </label>
          <p className="text-footnote text-secondary">
            X API 토큰이 설정되어 있어야 합니다 (선택사항)
          </p>
          <Input
            id="tweet-url"
            type="url"
            placeholder="https://x.com/username/status/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isPending}
          />
        </div>
      )}

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
