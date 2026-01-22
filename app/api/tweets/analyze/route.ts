import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { extractTweetId, fetchTweet } from '@/lib/api/x-api'
import { extractWords, translateWord } from '@/lib/api/gemini'
import { getDefinition, getPronunciation } from '@/lib/api/dictionary'
import { prisma } from '@/lib/db/prisma'
import { randomUUID } from 'crypto'

// Support both text input and URL input
const analyzeSchema = z.object({
  text: z.string().min(10).optional(),
  url: z.string().url().optional()
}).refine(data => data.text || data.url, {
  message: 'Either text or url is required'
})

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Validate request
    const body = await request.json()
    const { text, url } = analyzeSchema.parse(body)
    const searchParams = request.nextUrl.searchParams
    const autoSave = searchParams.get('autoSave') === 'true'

    let tweetText: string
    let tweetId: string
    let tweetUrl: string
    let tweetAuthor: string | undefined

    // 3. Get tweet content - either from direct text or URL
    if (text) {
      // Direct text input mode (No X API required)
      tweetText = text
      tweetId = `text_${randomUUID().slice(0, 8)}`
      tweetUrl = ''
      tweetAuthor = undefined
    } else if (url) {
      // URL input mode (requires X API token)
      const extractedId = extractTweetId(url)
      if (!extractedId) {
        return NextResponse.json(
          { error: 'INVALID_URL', message: 'Invalid tweet URL' },
          { status: 400 }
        )
      }

      // Check cache first
      const cached = await prisma.tweet.findUnique({
        where: { tweetId: extractedId },
        include: { words: true }
      })

      if (cached && cached.userId === session.user.id) {
        return NextResponse.json({
          tweetId: cached.id,
          tweet: {
            id: cached.tweetId,
            text: cached.text,
            author: cached.author || '',
            language: cached.language,
            url: cached.url
          },
          words: cached.words.map(w => ({
            id: w.id,
            lemma: w.lemma,
            original: w.original,
            partOfSpeech: w.partOfSpeech,
            translation: w.translation,
            definition: w.definition,
            pronunciation: {
              ipa: w.ipaNotation,
              hangul: w.hangulNotation
            },
            example: w.example,
            status: w.status,
            savedAt: w.savedAt.toISOString()
          })),
          analyzedAt: cached.analyzedAt.toISOString()
        })
      }

      // Fetch tweet from X API
      const tweetData = await fetchTweet(extractedId)
      if (!tweetData) {
        return NextResponse.json(
          { error: 'TWEET_NOT_FOUND', message: 'Tweet not found. Try copying the tweet text directly instead.' },
          { status: 404 }
        )
      }

      tweetText = tweetData.text
      tweetId = extractedId
      tweetUrl = url
      tweetAuthor = tweetData.author_id
    } else {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Either text or url is required' },
        { status: 400 }
      )
    }

    // 4. Extract words using Gemini
    const extraction = await extractWords(tweetText)
    
    if (extraction.words.length < 3) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_WORDS', message: 'Not enough words to learn (minimum 3 words required)' },
        { status: 400 }
      )
    }

    // 5. Enrich each word with translation, definition, pronunciation
    const enrichedWords = await Promise.all(
      extraction.words.map(async (word) => {
        const translation = await translateWord(word.lemma, extraction.language, 'KO')
        const definition = await getDefinition(word.lemma, extraction.language)
        const pronunciation = await getPronunciation(word.lemma, extraction.language)

        return {
          lemma: word.lemma,
          original: word.original,
          partOfSpeech: word.pos.toUpperCase(),
          translation,
          definition,
          ipaNotation: pronunciation?.ipa,
          hangulNotation: undefined,
          example: tweetText
        }
      })
    )

    // 6. Save to database
    if (!session.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'User ID not found' },
        { status: 401 }
      )
    }

    const tweet = await prisma.tweet.create({
      data: {
        tweetId,
        url: tweetUrl,
        text: tweetText,
        author: tweetAuthor,
        language: extraction.language as any,
        userId: session.user.id
      },
      include: { words: true }
    })

    // 7. Create words (with auto-save logic)
    let createdWords = []
    let savedWords: any[] = []
    
    if (autoSave) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id }
      })
      
      if (userSettings?.autoSaveWords && enrichedWords.length >= userSettings.autoSaveMinWords) {
        const wordsToSave = enrichedWords.filter(() =>
          userSettings.autoSaveLanguages.includes(extraction.language as any)
        )
        
        if (wordsToSave.length > 0) {
          savedWords = await Promise.all(
            wordsToSave.map(word =>
              prisma.word.create({
                data: {
                  ...word,
                  language: extraction.language as any,
                  partOfSpeech: word.partOfSpeech as any,
                  userId: session.user!.id!,
                  tweetId: tweet.id,
                  status: 'LEARNING'
                }
              })
            )
          )
          
          const notionIntegration = await prisma.notionIntegration.findUnique({
            where: { userId: session.user.id }
          })
          
          if (notionIntegration?.isActive && notionIntegration.autoSync) {
            console.log('[Auto-save] Notion sync triggered for', savedWords.length, 'words')
          }
        }
      }
    }
    
    createdWords = savedWords.length > 0 ? savedWords : await Promise.all(
      enrichedWords.map(word =>
        prisma.word.create({
          data: {
            ...word,
            language: extraction.language as any,
            partOfSpeech: word.partOfSpeech as any,
            userId: session.user!.id!,
            tweetId: tweet.id
          }
        })
      )
    )

    // 8. Return response
    return NextResponse.json({
      tweetId: tweet.id,
      tweet: {
        id: tweet.tweetId,
        text: tweet.text,
        author: tweet.author || '',
        language: tweet.language,
        url: tweet.url
      },
      words: createdWords.map(w => ({
        id: w.id,
        lemma: w.lemma,
        original: w.original,
        partOfSpeech: w.partOfSpeech,
        translation: w.translation,
        definition: w.definition,
        pronunciation: {
          ipa: w.ipaNotation,
          hangul: w.hangulNotation
        },
        example: w.example,
        status: w.status,
        savedAt: w.savedAt.toISOString()
      })),
      analyzedAt: tweet.analyzedAt.toISOString(),
      autoSaved: savedWords.length > 0,
      savedCount: savedWords.length
    })
  } catch (error: any) {
    console.error('[API] Tweet analysis error:', error)

    if (error.message === 'TWEET_NOT_FOUND') {
      return NextResponse.json(
        { error: 'TWEET_NOT_FOUND', message: 'Tweet not found. Try using text input instead.' },
        { status: 404 }
      )
    }

    if (error.message === 'TWEET_PRIVATE') {
      return NextResponse.json(
        { error: 'TWEET_PRIVATE', message: 'This tweet is private' },
        { status: 403 }
      )
    }

    if (error.message === 'X_API_UNAUTHORIZED') {
      return NextResponse.json(
        { error: 'X_API_UNAUTHORIZED', message: 'X API not configured. Please use text input instead.' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to analyze. Please try again.' },
      { status: 500 }
    )
  }
}
