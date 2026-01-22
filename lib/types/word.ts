export type Language = 'EN' | 'JA' | 'ZH' | 'KO'
export type PartOfSpeech = 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB'
export type WordStatus = 'LEARNING' | 'REVIEW' | 'MASTERED'

export interface Word {
  id: string
  lemma: string
  original: string
  language: Language
  partOfSpeech: PartOfSpeech
  translation: string
  definition?: string
  pronunciation: {
    ipa?: string
    hangul?: string
  }
  example: string
  status: WordStatus
  savedAt: string
  reviewDate?: string
  tweet?: {
    id: string
    url: string
    text: string
  }
}
