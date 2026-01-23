'use client'

interface FilterBarProps {
  language?: string
  status?: string
  onLanguageChange?: (language: string) => void
  onStatusChange?: (status: string) => void
}

export function FilterBar({
  language,
  status,
  onLanguageChange,
  onStatusChange
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="mb-2 block text-footnote font-semibold text-neutral-700">
          언어
        </label>
        <div className="flex gap-2">
          {['전체', 'EN', 'JA', 'ZH'].map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange?.(lang === '전체' ? '' : lang)}
              className={`rounded-button px-4 py-2 text-footnote font-medium transition-colors ${
                (lang === '전체' && !language) || language === lang
                  ? 'bg-sky-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {lang === 'EN' ? '영어' : lang === 'JA' ? '일본어' : lang === 'ZH' ? '중국어' : lang}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-footnote font-semibold text-neutral-700">
          상태
        </label>
        <div className="flex gap-2">
          {['전체', 'LEARNING', 'MASTERED'].map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange?.(st === '전체' ? '' : st)}
              className={`rounded-button px-4 py-2 text-footnote font-medium transition-colors ${
                (st === '전체' && !status) || status === st
                  ? 'bg-sky-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {st === 'LEARNING'
                ? '학습중'
                : st === 'MASTERED'
                ? '완료'
                : st}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
