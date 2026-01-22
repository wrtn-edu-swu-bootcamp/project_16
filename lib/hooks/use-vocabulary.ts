'use client'

import { useQuery } from '@tanstack/react-query'

interface VocabularyFilters {
  language?: string
  status?: string
  sortBy?: string
  order?: string
  page?: number
  limit?: number
}

export function useVocabulary(filters?: VocabularyFilters) {
  return useQuery({
    queryKey: ['vocabulary', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any)
      const response = await fetch(`/api/words?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary')
      }

      return response.json()
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
