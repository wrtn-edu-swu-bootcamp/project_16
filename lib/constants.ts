export const SUPPORTED_LANGUAGES = ['EN', 'JA', 'ZH'] as const
export const PART_OF_SPEECH_LIST = ['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB'] as const
export const WORD_STATUS_LIST = ['LEARNING', 'REVIEW', 'MASTERED'] as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: '인증이 필요합니다',
  INVALID_URL: '올바른 트윗 URL이 아닙니다',
  INVALID_TWEET: '트윗을 불러올 수 없습니다',
  TWEET_NOT_FOUND: '트윗을 찾을 수 없습니다',
  TWEET_PRIVATE: '비공개 트윗은 분석할 수 없습니다',
  INSUFFICIENT_WORDS: '학습할 단어가 부족합니다 (최소 3개)',
  UNSUPPORTED_LANGUAGE: '지원하지 않는 언어입니다',
  RATE_LIMIT_EXCEEDED: '요청 한도를 초과했습니다',
  API_ERROR: 'API 오류가 발생했습니다',
  NOTION_NOT_CONNECTED: 'Notion이 연동되지 않았습니다',
  INTERNAL_ERROR: '서버 오류가 발생했습니다'
} as const
