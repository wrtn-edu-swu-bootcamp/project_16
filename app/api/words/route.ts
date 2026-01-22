import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'savedAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { userId: session.user.id }
    if (language) where.language = language
    if (status) where.status = status

    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tweet: {
            select: {
              id: true,
              url: true,
              text: true
            }
          }
        }
      }),
      prisma.word.count({ where })
    ])

    return NextResponse.json({
      words: words.map(w => ({
        id: w.id,
        lemma: w.lemma,
        original: w.original,
        language: w.language,
        partOfSpeech: w.partOfSpeech,
        translation: w.translation,
        pronunciation: {
          ipa: w.ipaNotation,
          hangul: w.hangulNotation
        },
        example: w.example,
        status: w.status,
        savedAt: w.savedAt.toISOString(),
        reviewDate: w.reviewDate?.toISOString(),
        tweet: w.tweet
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('[API] Get words error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch words' },
      { status: 500 }
    )
  }
}
