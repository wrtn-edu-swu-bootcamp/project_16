import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'No word IDs provided' },
        { status: 400 }
      )
    }

    const result = await prisma.word.deleteMany({
      where: {
        id: { in: ids },
        userId: session.user.id
      }
    })

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    })
  } catch (error) {
    console.error('[API] Batch delete words error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to delete words' },
      { status: 500 }
    )
  }
}
