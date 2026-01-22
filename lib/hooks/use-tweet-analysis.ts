'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface TweetAnalysisResult {
  tweetId: string
  tweet: {
    id: string
    text: string
    author: string
    language: string
    url: string
  }
  words: Array<{
    id?: string
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
    status?: string
    savedAt?: string
  }>
  analyzedAt: string
  autoSaved?: boolean
  savedCount?: number
}

// Support both text input and URL input
interface AnalysisInput {
  text?: string
  url?: string
}

export function useTweetAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: AnalysisInput): Promise<TweetAnalysisResult> => {
      const response = await fetch('/api/tweets/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Analysis failed')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] })
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    }
  })
}
