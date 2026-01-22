import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { extractTweetId, fetchTweet } from '@/lib/api/x-api'
import { extractWords, translateWord } from '@/lib/api/gemini'
import { getDefinition, getPronunciation } from '@/lib/api/dictionary'
import { prisma } from '@/lib/db/prisma'

const analyzeSchema = z.object({
  url: z.string().url()
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

    // 2. Validate request and check autoSave flag
    const body = await request.json()
    const { url } = analyzeSchema.parse(body)
    const searchParams = request.nextUrl.searchParams
    const autoSave = searchParams.get('autoSave') === 'true'

    // 3. Extract tweet ID
    const tweetId = extractTweetId(url)
    if (!tweetId) {
      return NextResponse.json(
        { error: 'INVALID_URL', message: 'Invalid tweet URL' },
        { status: 400 }
      )
    }

    // 4. Check cache
    const cached = await prisma.tweet.findUnique({
      where: { tweetId },
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
          lemma: w.lemma,
          original: w.original,
          partOfSpeech: w.partOfSpeech,
          translation: w.translation,
          definition: w.definition,
          pronunciation: {
            ipa: w.ipaNotation,
            hangul: w.hangulNotation
          },
          example: w.example
        })),
        analyzedAt: cached.analyzedAt.toISOString()
      })
    }

    // 5. Fetch tweet
    const tweetData = await fetchTweet(tweetId)
    if (!tweetData) {
      return NextResponse.json(
        { error: 'TWEET_NOT_FOUND', message: 'Tweet not found or unavailable' },
        { status: 404 }
      )
    }

    // 6. Extract words
    const extraction = await extractWords(tweetData.text)
    
    if (extraction.words.length < 3) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_WORDS', message: 'Not enough words to learn' },
        { status: 400 }
      )
    }

    // 7. Enrich each word
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
          hangulNotation: undefined, // TODO: Add hangul conversion
          example: tweetData.text
        }
      })
    )

    // 8. Save to database
    if (!session.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'User ID not found' },
        { status: 401 }
      )
    }

    const tweet = await prisma.tweet.create({
      data: {
        tweetId,
        url,
        text: tweetData.text,
        author: tweetData.author_id,
        language: extraction.language as any,
        userId: session.user.id
      },
      include: { words: true }
    })

    // Create words (auto-save logic)
    let createdWords = []
    let savedWords = []
    
    if (autoSave) {
      // Get user settings for auto-save
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id }
      })
      
      if (userSettings?.autoSaveWords && enrichedWords.length >= userSettings.autoSaveMinWords) {
        // Filter words by user's selected languages
        const wordsToSave = enrichedWords.filter(word =>
          userSettings.autoSaveLanguages.includes(extraction.language as any)
        )
        
        if (wordsToSave.length > 0) {
          // Save words
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
          
          // Auto-sync to Notion if enabled
          const notionIntegration = await prisma.notionIntegration.findUnique({
            where: { userId: session.user.id }
          })
          
          if (notionIntegration?.isActive && notionIntegration.autoSync) {
            // TODO: Implement Notion sync in background
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

    // 9. Return response
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
        { error: 'TWEET_NOT_FOUND', message: 'Tweet not found' },
        { status: 404 }
      )
    }

    if (error.message === 'TWEET_PRIVATE') {
      return NextResponse.json(
        { error: 'TWEET_PRIVATE', message: 'This tweet is private' },
        { status: 403 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to analyze tweet' },
      { status: 500 }
    )
  }
}
