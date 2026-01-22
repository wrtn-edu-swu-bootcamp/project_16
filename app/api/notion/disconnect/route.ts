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

    await prisma.notionIntegration.update({
      where: { userId: session.user.id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Notion disconnect error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to disconnect Notion' },
      { status: 500 }
    )
  }
}
