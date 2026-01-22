'use client'

import { WordCard } from './word-card'
import { Button } from '@/components/ui/button'

interface WordListProps {
  words: Array<{
    lemma: string
    original: string
    partOfSpeech: string
    translation: string
    definition?: string
    pronunciation: {
      ipa?: string
      hangul?: string
    }
    example: string
  }>
  onSaveAll?: () => void
}

export function WordList({ words, onSaveAll }: WordListProps) {
  if (!words || words.length === 0) {
    return (
      <div className="rounded-card border border-neutral-200 p-8 text-center">
        <p className="text-body text-neutral-600">분석된 단어가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-headline font-semibold">
          추출된 단어 ({words.length}개)
        </p>
        <Button onClick={onSaveAll} variant="secondary" size="sm">
          전체 저장
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {words.map((word) => (
          <WordCard key={word.lemma} word={word} />
        ))}
      </div>
    </div>
  )
}
