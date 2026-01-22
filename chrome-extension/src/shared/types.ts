export interface Word {
  id?: string
  lemma: string
  original: string
  language: 'EN' | 'JA' | 'ZH'
  partOfSpeech: 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB'
  translation: string
  definition?: string
  pronunciation?: {
    ipa?: string
    hangul?: string
  }
  example: string
  status?: 'LEARNING' | 'REVIEW' | 'MASTERED'
  savedAt?: string
}

export interface Tweet {
  id: string
  text: string
  author?: string
  language: 'EN' | 'JA' | 'ZH'
  url: string
}

export interface AnalyzeResponse {
  tweetId: string
  tweet: Tweet
  words: Word[]
  analyzedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  accessToken?: string
  userId?: string
}

export interface UserSettings {
  autoSaveWords: boolean
  autoSaveLanguages: ('EN' | 'JA' | 'ZH')[]
  autoSaveMinWords: number
}

export type MessageType =
  | 'ANALYZE_TWEET'
  | 'SAVE_WORDS'
  | 'GET_AUTH_STATE'
  | 'OPEN_SIDE_PANEL'

export interface Message {
  type: MessageType
  payload?: unknown
}

export interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
