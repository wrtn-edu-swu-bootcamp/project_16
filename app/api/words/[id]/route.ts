import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const word = await prisma.word.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        tweet: true
      }
    })

    if (!word) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Word not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: word.id,
      lemma: word.lemma,
      original: word.original,
      language: word.language,
      partOfSpeech: word.partOfSpeech,
      translation: word.translation,
      definition: word.definition,
      pronunciation: {
        ipa: word.ipaNotation,
        hangul: word.hangulNotation
      },
      example: word.example,
      status: word.status,
      savedAt: word.savedAt.toISOString(),
      reviewDate: word.reviewDate?.toISOString(),
      tweet: word.tweet
    })
  } catch (error) {
    console.error('[API] Get word error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch word' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    const word = await prisma.word.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        status,
        reviewDate: status === 'REVIEW' ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) : null
      }
    })

    if (word.count === 0) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Word not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Update word error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to update word' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const result = await prisma.word.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Word not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Delete word error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to delete word' },
      { status: 500 }
    )
  }
}
