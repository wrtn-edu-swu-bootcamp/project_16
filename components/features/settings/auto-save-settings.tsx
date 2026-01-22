'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AutoSaveSettingsProps {
  initialSettings: {
    autoSaveWords: boolean
    autoSaveLanguages: string[]
    autoSaveMinWords: number
  }
}

export function AutoSaveSettings({ initialSettings }: AutoSaveSettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const languages = [
    { value: 'EN', label: '영어' },
    { value: 'JA', label: '일본어' },
    { value: 'ZH', label: '중국어' }
  ]

  const handleToggle = (field: 'autoSaveWords') => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleLanguageToggle = (lang: string) => {
    setSettings(prev => ({
      ...prev,
      autoSaveLanguages: prev.autoSaveLanguages.includes(lang)
        ? prev.autoSaveLanguages.filter(l => l !== lang)
        : [...prev.autoSaveLanguages, lang]
    }))
  }

  const handleMinWordsChange = (value: number) => {
    setSettings(prev => ({ ...prev, autoSaveMinWords: Math.max(1, Math.min(10, value)) }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      setMessage({ type: 'success', text: '설정이 저장되었습니다' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body font-semibold">단어 자동 저장</p>
          <p className="text-footnote text-neutral-600">
            트윗 분석 시 자동으로 단어를 저장합니다
          </p>
        </div>
        <button
          onClick={() => handleToggle('autoSaveWords')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.autoSaveWords ? 'bg-sky-500' : 'bg-neutral-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.autoSaveWords ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.autoSaveWords && (
        <>
          <div>
            <p className="text-body font-semibold mb-3">자동 저장할 언어</p>
            <div className="space-y-2">
              {languages.map(lang => (
                <label key={lang.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSaveLanguages.includes(lang.value)}
                    onChange={() => handleLanguageToggle(lang.value)}
                    className="w-4 h-4 text-sky-500 border-neutral-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-body">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-body font-semibold mb-2">
              최소 단어 개수
            </label>
            <p className="text-footnote text-neutral-600 mb-3">
              이 개수 이상의 단어가 있을 때만 자동 저장합니다
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleMinWordsChange(settings.autoSaveMinWords - 1)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center"
              >
                −
              </button>
              <span className="text-headline font-semibold w-8 text-center">
                {settings.autoSaveMinWords}
              </span>
              <button
                onClick={() => handleMinWordsChange(settings.autoSaveMinWords + 1)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </>
      )}

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <p className="text-body">{message.text}</p>
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={isSaving}
        variant="primary"
        className="w-full"
      >
        {isSaving ? '저장 중...' : '설정 저장'}
      </Button>
    </div>
  )
}
