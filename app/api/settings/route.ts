import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const updateSettingsSchema = z.object({
  autoSaveWords: z.boolean().optional(),
  autoSaveLanguages: z.array(z.enum(['EN', 'JA', 'ZH'])).optional(),
  autoSaveMinWords: z.number().int().min(1).max(10).optional(),
  targetLanguage: z.enum(['EN', 'JA', 'ZH', 'KO']).optional(),
  defaultSourceLanguage: z.enum(['EN', 'JA', 'ZH', 'KO']).optional(),
  notificationsEnabled: z.boolean().optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional()
})

export async function GET(_request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    if (!settings) {
      // Create default settings if not exists
      const newSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id
        }
      })
      return NextResponse.json(newSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('[API] Get settings error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateSettingsSchema.parse(body)

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...validatedData
      },
      update: validatedData
    })

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('[API] Update settings error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
