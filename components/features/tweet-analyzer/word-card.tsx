'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface WordCardProps {
  word: {
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
  }
  onSave?: () => void
}

export function WordCard({ word, onSave }: WordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      className="cursor-pointer select-none"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader>
        <CardTitle>{word.lemma}</CardTitle>
        <p className="text-body text-neutral-600">{word.translation}</p>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-3 border-t border-neutral-200 pt-4">
              {word.pronunciation.ipa && (
                <div>
                  <p className="text-footnote font-semibold text-neutral-700">발음</p>
                  <p className="text-body">{word.pronunciation.ipa}</p>
                </div>
              )}

              {word.definition && (
                <div>
                  <p className="text-footnote font-semibold text-neutral-700">정의</p>
                  <p className="text-body text-neutral-600">{word.definition}</p>
                </div>
              )}

              <div>
                <p className="text-footnote font-semibold text-neutral-700">예문</p>
                <p className="text-body italic text-neutral-600">{word.example}</p>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onSave?.()
                }}
                variant="primary"
                size="sm"
                className="w-full"
              >
                💾 저장하기
              </Button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
