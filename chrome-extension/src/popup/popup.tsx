import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { storage } from '../shared/storage'
import type { Word, AuthState } from '../shared/types'
import '../content-script/content-script.css'

function Popup() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [recentWords, setRecentWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [authState, words] = await Promise.all([
        storage.getAuth(),
        storage.getRecentWords()
      ])
      setAuth(authState)
      setRecentWords(words)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyzeCurrentPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.url) {
        alert('Cannot analyze this page')
        return
      }

      const response = await chrome.runtime.sendMessage({
        type: 'ANALYZE_TWEET',
        payload: { url: tab.url, autoSave: true }
      })

      if (response.success) {
        await chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' })
        window.close()
      } else {
        alert(response.error || 'Analysis failed')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to analyze tweet')
    }
  }

  function handleOpenSettings() {
    chrome.tabs.create({ url: 'https://tweetlingo.com/settings' })
    window.close()
  }

  function handleLogin() {
    chrome.tabs.create({ url: 'https://tweetlingo.com/login' })
    window.close()
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!auth?.isAuthenticated) {
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Welcome to TweetLingo</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Log in to start learning from tweets
        </p>
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            background: '#0EA5E9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Log In
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          TweetLingo
        </h2>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Extract vocabulary from tweets
        </p>
      </div>

      <button
        onClick={handleAnalyzeCurrentPage}
        style={{
          width: '100%',
          padding: '12px',
          background: '#0EA5E9',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        Analyze Current Tweet
      </button>

      {recentWords.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Recent Words
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {recentWords.slice(0, 5).map((word, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  marginBottom: '4px',
                  background: '#f5f5f5',
                  borderRadius: '6px'
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                  {word.lemma}
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  {word.translation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleOpenSettings}
        style={{
          width: '100%',
          padding: '10px',
          background: '#f5f5f5',
          color: '#333',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          cursor: 'pointer'
        }}
      >
        Settings
      </button>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Popup />)
