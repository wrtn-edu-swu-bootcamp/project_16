import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { storage } from '../shared/storage'
import type { Word } from '../shared/types'
import '../content-script/content-script.css'

function Sidebar() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'EN' | 'JA' | 'ZH'>('ALL')

  useEffect(() => {
    loadWords()
  }, [])

  async function loadWords() {
    try {
      const recentWords = await storage.getRecentWords()
      setWords(recentWords)
    } catch (error) {
      console.error('Failed to load words:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveWord(word: Word) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_WORDS',
        payload: { words: [word], syncToNotion: false }
      })

      if (response.success) {
        alert('Word saved successfully!')
      } else {
        alert(response.error || 'Failed to save word')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to save word')
    }
  }

  const filteredWords = filter === 'ALL' 
    ? words 
    : words.filter(w => w.language === filter)

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>
      <header style={{
        background: 'white',
        padding: '16px',
        borderBottom: '1px solid #e5e5e7',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
          TweetLingo
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'EN', 'JA', 'ZH'].map(lang => (
            <button
              key={lang}
              onClick={() => setFilter(lang as any)}
              style={{
                padding: '6px 12px',
                background: filter === lang ? '#0EA5E9' : '#e5e5e7',
                color: filter === lang ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {lang === 'ALL' ? 'All' : lang}
            </button>
          ))}
        </div>
      </header>

      <div style={{ padding: '16px' }}>
        {filteredWords.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '16px', color: '#666' }}>
              No words analyzed yet.
            </p>
            <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
              Click "Analyze" on any tweet to start learning!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredWords.map((word, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                      {word.lemma}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      {word.original !== word.lemma && `(${word.original}) `}
                      {word.partOfSpeech.toLowerCase()}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    background: '#e5e5e7',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {word.language}
                  </span>
                </div>

                <p style={{ fontSize: '16px', marginBottom: '8px', color: '#333' }}>
                  {word.translation}
                </p>

                {word.pronunciation && (
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    🔊 {word.pronunciation.ipa || word.pronunciation.hangul}
                  </p>
                )}

                {word.definition && (
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontStyle: 'italic' }}>
                    {word.definition}
                  </p>
                )}

                <div style={{
                  padding: '12px',
                  background: '#f5f5f7',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
                    "{word.example}"
                  </p>
                </div>

                {!word.savedAt && (
                  <button
                    onClick={() => handleSaveWord(word)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0EA5E9',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save to Vocabulary
                  </button>
                )}

                {word.savedAt && (
                  <div style={{
                    padding: '8px',
                    background: '#34C759',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    ✓ Saved
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Sidebar />)
