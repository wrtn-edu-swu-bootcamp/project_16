/**
 * TweetLingo Background Service Worker
 * Handles API requests, authentication, and message passing
 */

import { apiClient } from '../shared/api-client'
import { storage } from '../shared/storage'
import type { Message, MessageResponse } from '../shared/types'

console.log('[TweetLingo] Background service worker loaded')

/**
 * Handle messages from content script and popup
 */
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse: (response: MessageResponse) => void) => {
    handleMessage(message, sender)
      .then(sendResponse)
      .catch(error => {
        console.error('[Background] Message handler error:', error)
        sendResponse({
          success: false,
          error: error.message || 'Unknown error'
        })
      })
    
    // Return true to indicate we'll respond asynchronously
    return true
  }
)

/**
 * Main message handler
 */
async function handleMessage(message: Message, sender: chrome.runtime.MessageSender): Promise<MessageResponse> {
  const { type, payload } = message

  switch (type) {
    case 'ANALYZE_TWEET':
      return await handleAnalyzeTweet(payload as { url: string; autoSave?: boolean })
    
    case 'SAVE_WORDS':
      return await handleSaveWords(payload as { words: any[]; syncToNotion?: boolean })
    
    case 'GET_AUTH_STATE':
      return await handleGetAuthState()
    
    case 'OPEN_SIDE_PANEL':
      return await handleOpenSidePanel(sender.tab?.id)
    
    default:
      return {
        success: false,
        error: 'Unknown message type'
      }
  }
}

/**
 * Handle tweet analysis
 */
async function handleAnalyzeTweet(payload: { url: string; autoSave?: boolean }): Promise<MessageResponse> {
  try {
    const { url, autoSave = false } = payload

    // Check authentication
    const auth = await storage.getAuth()
    if (!auth?.isAuthenticated) {
      return {
        success: false,
        error: 'Not authenticated. Please log in first.'
      }
    }

    // Call API
    const result = await apiClient.analyzeTweet(url, autoSave)

    // Cache recent words
    await storage.addRecentWords(result.words)

    return {
      success: true,
      data: result
    }
  } catch (error: any) {
    console.error('[Background] Analyze tweet error:', error)
    return {
      success: false,
      error: error.message || 'Failed to analyze tweet'
    }
  }
}

/**
 * Handle saving words
 */
async function handleSaveWords(payload: { words: any[]; syncToNotion?: boolean }): Promise<MessageResponse> {
  try {
    const { words, syncToNotion = false } = payload

    // Check authentication
    const auth = await storage.getAuth()
    if (!auth?.isAuthenticated) {
      return {
        success: false,
        error: 'Not authenticated'
      }
    }

    // Call API
    await apiClient.saveWords(words, syncToNotion)

    return {
      success: true,
      data: { savedCount: words.length }
    }
  } catch (error: any) {
    console.error('[Background] Save words error:', error)
    return {
      success: false,
      error: error.message || 'Failed to save words'
    }
  }
}

/**
 * Handle getting auth state
 */
async function handleGetAuthState(): Promise<MessageResponse> {
  try {
    const auth = await storage.getAuth()
    return {
      success: true,
      data: auth || { isAuthenticated: false }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Handle opening side panel
 */
async function handleOpenSidePanel(tabId?: number): Promise<MessageResponse> {
  try {
    if (!tabId) {
      return {
        success: false,
        error: 'No tab ID provided'
      }
    }

    await chrome.sidePanel.open({ tabId })

    return {
      success: true
    }
  } catch (error: any) {
    console.error('[Background] Open side panel error:', error)
    return {
      success: false,
      error: error.message || 'Failed to open side panel'
    }
  }
}

/**
 * Handle extension icon click
 */
chrome.action.onClicked.addListener(async (tab) => {
  // Open side panel on icon click
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id })
  }
})

/**
 * Initialize extension
 */
async function initialize() {
  console.log('[TweetLingo] Initializing extension')
  
  // Check auth state
  const auth = await storage.getAuth()
  if (!auth?.isAuthenticated) {
    console.log('[TweetLingo] Not authenticated')
  } else {
    console.log('[TweetLingo] Authenticated as user:', auth.userId)
    
    // Fetch and cache settings
    try {
      const settings = await apiClient.getSettings()
      await storage.setSettings(settings)
      console.log('[TweetLingo] Settings cached')
    } catch (error) {
      console.error('[TweetLingo] Failed to fetch settings:', error)
    }
  }
}

// Initialize on install or startup
chrome.runtime.onInstalled.addListener(initialize)
chrome.runtime.onStartup.addListener(initialize)
