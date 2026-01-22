export function extractTweetId(url: string): string | null {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /\/status\/(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export async function fetchTweet(tweetId: string): Promise<{
  id: string
  text: string
  author_id?: string
} | null> {
  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=author_id,created_at`,
      {
        headers: {
          Authorization: `Bearer ${process.env.X_API_BEARER_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('TWEET_NOT_FOUND')
      }
      if (response.status === 403) {
        throw new Error('TWEET_PRIVATE')
      }
      throw new Error('X_API_ERROR')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Fetch tweet error:', error)
    throw error
  }
}
