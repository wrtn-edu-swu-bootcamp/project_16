import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { syncWordToNotion } from '@/lib/api/notion'
import { z } from 'zod'

const syncSchema = z.object({
  words: z.array(z.object({
    lemma: z.string(),
    translation: z.string(),
    pronunciation: z.string().optional(),
    example: z.string(),
    language: z.string(),
    partOfSpeech: z.string(),
    tweetUrl: z.string().optional()
  }))
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
    const { words } = syncSchema.parse(body)

    if (!session.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'User ID not found' },
        { status: 401 }
      )
    }

    // Sync each word to Notion
    await Promise.all(
      words.map((word) => syncWordToNotion(session.user!.id!, word))
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API] Notion sync error:', error)

    if (error.message === 'NOTION_NOT_CONNECTED') {
      return NextResponse.json(
        { error: 'NOTION_NOT_CONNECTED', message: 'Notion is not connected' },
        { status: 400 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to sync to Notion' },
      { status: 500 }
    )
  }
}
