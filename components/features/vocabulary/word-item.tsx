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
    pronunciation?: {
      ipa?: string
      hangul?: string
    }
    example?: string
    tweet?: {
      url: string
      text: string
    }
  }
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: string) => void
  selectMode?: boolean
  isSelected?: boolean
  onSelectToggle?: (id: string) => void
}

export function WordItem({ 
  word, 
  onDelete, 
  onStatusChange,
  selectMode = false,
  isSelected = false,
  onSelectToggle
}: WordItemProps) {
  const statusLabel: Record<string, string> = {
    LEARNING: '학습 중',
    MASTERED: '완료'
  }

  const isLearning = word.status === 'LEARNING'

  const handleCardClick = () => {
    if (selectMode && onSelectToggle) {
      onSelectToggle(word.id)
    }
  }

  return (
    <Card 
      className={`${selectMode ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {selectMode && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelectToggle?.(word.id)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 h-5 w-5 rounded border-neutral-300 text-sky-500 focus:ring-sky-500"
              />
            )}
            <div>
              <CardTitle>{word.lemma}</CardTitle>
              {word.pronunciation?.ipa && (
                <p className="text-footnote text-neutral-500">{word.pronunciation.ipa}</p>
              )}
              <p className="text-callout text-neutral-600">{word.translation}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-footnote font-medium ${
            isLearning 
              ? 'bg-amber-100 text-amber-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {statusLabel[word.status] || word.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {word.example && (
          <div className="rounded-button bg-neutral-50 p-3">
            <p className="text-footnote font-medium text-neutral-700 mb-1">예문</p>
            <p className="text-footnote text-neutral-600 italic">
              {word.example}
            </p>
          </div>
        )}
        {word.tweet?.url && (
          <a
            href={word.tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-footnote text-sky-500 hover:underline block"
          >
            원본 트윗 보기 →
          </a>
        )}
        {!selectMode && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange?.(word.id, isLearning ? 'MASTERED' : 'LEARNING')}
              className="flex-1"
            >
              {isLearning ? '완료로 변경' : '학습중으로 변경'}
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
        )}
      </CardContent>
    </Card>
  )
}
