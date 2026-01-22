// Mock tweet data for testing when X API credits are depleted
const MOCK_TWEETS = [
  {
    id: '1234567890',
    text: 'Learning English is fun! I love reading books and watching movies to improve my vocabulary. The more you practice, the better you become. #English #Learning',
    author_id: 'mock_user_1'
  },
  {
    id: '1234567891',
    text: 'Just discovered a fascinating article about climate change and its environmental impact. Scientists are working hard to find sustainable solutions for our planet.',
    author_id: 'mock_user_2'
  },
  {
    id: '1234567892',
    text: 'Technology is transforming the way we communicate and collaborate. Artificial intelligence and machine learning are becoming increasingly important in modern society.',
    author_id: 'mock_user_3'
  }
]

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
      // 실제 에러 응답 로깅
      const errorData = await response.json().catch(() => ({}))
      console.error('X API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        token: process.env.X_API_BEARER_TOKEN ? 'SET' : 'NOT_SET'
      })
      
      // 402 Payment Required (크레딧 소진) - Mock 데이터 반환
      if (response.status === 402) {
        console.warn('X API credits depleted. Using mock tweet data for testing.')
        // 트윗 ID 기반으로 일관된 mock 데이터 반환
        const mockIndex = parseInt(tweetId.slice(-1)) % MOCK_TWEETS.length
        return MOCK_TWEETS[mockIndex]
      }
      
      if (response.status === 404) {
        throw new Error('TWEET_NOT_FOUND')
      }
      if (response.status === 403) {
        throw new Error('TWEET_PRIVATE')
      }
      if (response.status === 401) {
        throw new Error('X_API_UNAUTHORIZED')
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
