'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface WordItemProps {
  word: {
    id: string
    lemma: string
    original: string
    translation: string
    language: string
    status: string
    savedAt: string
    tweet?: {
      url: string
      text: string
    }
  }
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: string) => void
}

export function WordItem({ word, onDelete, onStatusChange }: WordItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{word.lemma}</CardTitle>
            <p className="text-callout text-neutral-600">{word.translation}</p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-footnote font-medium text-sky-700">
            {word.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {word.tweet && (
          <div className="rounded-button bg-neutral-50 p-3">
            <p className="text-footnote text-neutral-600 line-clamp-2">
              {word.tweet.text}
            </p>
            <a
              href={word.tweet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-footnote text-sky-500 hover:underline"
            >
              원본 트윗 보기 →
            </a>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange?.(word.id, 'REVIEW')}
            className="flex-1"
          >
            복습 필요
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(word.id)}
            className="text-error"
          >
            삭제
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
