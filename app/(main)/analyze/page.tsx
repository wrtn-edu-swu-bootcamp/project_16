'use client'

import { useState } from 'react'
import { TweetInput } from '@/components/features/tweet-analyzer/tweet-input'
import { WordList } from '@/components/features/tweet-analyzer/word-list'

export default function AnalyzePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-title-1 mb-2">트윗 분석</h1>
          <p className="text-body text-neutral-600">
            X 트윗의 본문이나 URL을 입력하면 학습할 단어를 자동으로 추출합니다
          </p>
        </div>

        <div className="rounded-card bg-white p-6 shadow-card mb-8">
          <TweetInput onAnalysisComplete={setAnalysisResult} />
        </div>

        {analysisResult && (
          <div className="space-y-6">
            <div className="rounded-card bg-white p-6 shadow-card">
              <h2 className="text-headline font-semibold mb-2">원본 트윗</h2>
              <p className="text-body text-neutral-700">{analysisResult.tweet.text}</p>
            </div>

            <WordList words={analysisResult.words} />
          </div>
        )}
      </div>
    </main>
  )
}
