import type { AuthState, UserSettings, Word } from './types'

const STORAGE_KEYS = {
  AUTH: 'tweetlingo_auth',
  SETTINGS: 'tweetlingo_settings',
  RECENT_WORDS: 'tweetlingo_recent_words'
} as const

export const storage = {
  // Authentication
  async getAuth(): Promise<AuthState | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.AUTH)
    return result[STORAGE_KEYS.AUTH] || null
  },

  async setAuth(auth: AuthState): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.AUTH]: auth })
  },

  async clearAuth(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEYS.AUTH)
  },

  // Settings
  async getSettings(): Promise<UserSettings | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS)
    return result[STORAGE_KEYS.SETTINGS] || null
  },

  async setSettings(settings: UserSettings): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings })
  },

  // Recent Words (for popup preview)
  async getRecentWords(): Promise<Word[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.RECENT_WORDS)
    return result[STORAGE_KEYS.RECENT_WORDS] || []
  },

  async addRecentWords(words: Word[]): Promise<void> {
    const recent = await this.getRecentWords()
    const updated = [...words, ...recent].slice(0, 10) // Keep last 10
    await chrome.storage.local.set({ [STORAGE_KEYS.RECENT_WORDS]: updated })
  },

  async clearRecentWords(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEYS.RECENT_WORDS)
  }
}
