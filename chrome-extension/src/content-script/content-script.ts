/**
 * TweetLingo Content Script
 * Runs on X/Twitter pages to add analyze buttons to tweets
 */

import { extractTweetUrl } from '../shared/utils'

// Track processed tweets to avoid duplicates
const processedTweets = new Set<string>()

/**
 * Initialize content script
 */
function init() {
  console.log('[TweetLingo] Content script loaded')
  
  // Watch for new tweets being added to the page
  observeTweets()
  
  // Process existing tweets on load
  processExistingTweets()
}

/**
 * Process tweets that are already on the page
 */
function processExistingTweets() {
  const articles = document.querySelectorAll('article[data-testid="tweet"]')
  articles.forEach(article => {
    addAnalyzeButton(article as HTMLElement)
  })
}

/**
 * Observe DOM for new tweets
 */
function observeTweets() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          
          // Check if the added node is a tweet
          if (element.matches('article[data-testid="tweet"]')) {
            addAnalyzeButton(element)
          }
          
          // Check for tweets within the added node
          const tweets = element.querySelectorAll('article[data-testid="tweet"]')
          tweets.forEach(tweet => {
            addAnalyzeButton(tweet as HTMLElement)
          })
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

/**
 * Add analyze button to a tweet
 */
function addAnalyzeButton(tweetElement: HTMLElement) {
  // Extract tweet URL
  const tweetUrl = extractTweetUrlFromElement(tweetElement)
  if (!tweetUrl || processedTweets.has(tweetUrl)) {
    return
  }

  processedTweets.add(tweetUrl)

  // Find the action bar (like, retweet, etc.)
  const actionBar = tweetElement.querySelector('[role="group"]')
  if (!actionBar) {
    return
  }

  // Create analyze button container
  const container = document.createElement('div')
  container.className = 'tweetlingo-btn-container'

  // Create button
  const button = document.createElement('button')
  button.className = 'tweetlingo-analyze-btn'
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
    <span>Analyze</span>
  `

  button.addEventListener('click', async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await handleAnalyzeClick(tweetUrl, button)
  })

  container.appendChild(button)
  actionBar.appendChild(container)
}

/**
 * Extract tweet URL from tweet element
 */
function extractTweetUrlFromElement(tweetElement: HTMLElement): string | null {
  // Try to find the permalink link
  const timeLink = tweetElement.querySelector('a[href*="/status/"]')
  if (!timeLink) {
    return null
  }

  const href = timeLink.getAttribute('href')
  if (!href) {
    return null
  }

  // Convert relative URL to absolute
  const url = href.startsWith('http') ? href : `https://x.com${href}`
  return extractTweetUrl(url)
}

/**
 * Handle analyze button click
 */
async function handleAnalyzeClick(tweetUrl: string, button: HTMLButtonElement) {
  try {
    // Update button state
    button.classList.add('loading')
    button.disabled = true
    button.innerHTML = `
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Analyzing...</span>
    `

    // Send message to background script
    const response = await chrome.runtime.sendMessage({
      type: 'ANALYZE_TWEET',
      payload: { url: tweetUrl, autoSave: true }
    })

    if (response.success) {
      // Success state
      button.classList.remove('loading')
      button.classList.add('success')
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Analyzed</span>
      `

      // Open side panel
      chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' })

      // Reset button after 3 seconds
      setTimeout(() => {
        button.classList.remove('success')
        button.disabled = false
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>Analyze</span>
        `
      }, 3000)
    } else {
      throw new Error(response.error || 'Analysis failed')
    }
  } catch (error) {
    console.error('[TweetLingo] Analysis error:', error)
    
    // Error state
    button.classList.remove('loading')
    button.style.background = '#FF3B30'
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span>Failed</span>
    `

    // Reset button after 3 seconds
    setTimeout(() => {
      button.disabled = false
      button.style.background = ''
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>Analyze</span>
      `
    }, 3000)
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
