import { Language } from '../types/word'

export function getLanguageName(lang: Language): string {
  const map: Record<Language, string> = {
    EN: '영어',
    JA: '일본어',
    ZH: '중국어',
    KO: '한국어'
  }
  return map[lang]
}

export function getPartOfSpeechName(pos: string): string {
  const map: Record<string, string> = {
    NOUN: '명사',
    VERB: '동사',
    ADJECTIVE: '형용사',
    ADVERB: '부사'
  }
  return map[pos] || pos
}
