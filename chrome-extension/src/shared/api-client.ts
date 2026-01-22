import type { AnalyzeResponse, Word, UserSettings } from './types'
import { storage } from './storage'

const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://tweetlingo.com/api'

class ApiClient {
  private async getHeaders(): Promise<HeadersInit> {
    const auth = await storage.getAuth()
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (auth?.accessToken) {
      headers['Authorization'] = `Bearer ${auth.accessToken}`
    }
    
    return headers
  }

  async analyzeTweet(url: string, autoSave = false): Promise<AnalyzeResponse> {
    const headers = await this.getHeaders()
    const queryParams = new URLSearchParams()
    if (autoSave) {
      queryParams.set('autoSave', 'true')
    }

    const response = await fetch(
      `${API_BASE_URL}/tweets/analyze?${queryParams}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ url })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to analyze tweet')
    }

    return response.json()
  }

  async saveWords(words: Word[], syncToNotion = false): Promise<void> {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${API_BASE_URL}/words/save`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ words, syncToNotion })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save words')
    }
  }

  async getSettings(): Promise<UserSettings> {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error('Failed to fetch settings')
    }

    return response.json()
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(settings)
    })

    if (!response.ok) {
      throw new Error('Failed to update settings')
    }
  }
}

export const apiClient = new ApiClient()
