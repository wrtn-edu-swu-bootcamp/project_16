import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const saveWordsSchema = z.object({
  words: z.array(z.object({
    lemma: z.string().min(1).max(100),
    original: z.string().min(1).max(100),
    language: z.enum(['EN', 'JA', 'ZH']),
    partOfSpeech: z.enum(['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB']),
    translation: z.string().min(1),
    definition: z.string().optional(),
    ipaNotation: z.string().optional(),
    hangulNotation: z.string().optional(),
    example: z.string(),
    tweetId: z.string().optional()
  })),
  syncToNotion: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { words, syncToNotion } = saveWordsSchema.parse(body)

    if (!session.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'User ID not found' },
        { status: 401 }
      )
    }

    // Save words to database
    const savedWords = await prisma.$transaction(
      words.map(word =>
        prisma.word.create({
          data: {
            ...word,
            userId: session.user!.id!
          }
        })
      )
    )

    // TODO: Sync to Notion if requested
    if (syncToNotion) {
      // Implement Notion sync in next task
    }

    return NextResponse.json({
      savedWords: savedWords.map(w => ({
        id: w.id,
        lemma: w.lemma,
        savedAt: w.savedAt.toISOString()
      })),
      notionSynced: false
    })
  } catch (error: any) {
    console.error('[API] Save words error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to save words' },
      { status: 500 }
    )
  }
}
