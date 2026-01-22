/**
 * Extract tweet ID from X/Twitter URL
 */
export function extractTweetUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    
    // Check if it's a valid X/Twitter URL
    if (!['twitter.com', 'x.com'].some(domain => urlObj.hostname.includes(domain))) {
      return null
    }

    // Extract tweet ID from URL path
    const match = urlObj.pathname.match(/\/status\/(\d+)/)
    if (!match) {
      return null
    }

    return url
  } catch {
    return null
  }
}

/**
 * Get current tab's URL
 */
export async function getCurrentTabUrl(): Promise<string | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab?.url || null
}

/**
 * Check if current page is X/Twitter
 */
export function isXPage(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['twitter.com', 'x.com'].some(domain => 
      urlObj.hostname.includes(domain)
    )
  } catch {
    return false
  }
}
