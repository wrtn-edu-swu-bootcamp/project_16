import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { encrypt } from '@/lib/utils/encryption'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.redirect('/login')
  }

  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect('/settings?error=notion_auth_failed')
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString('base64')}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/notion/callback`
      })
    })

    const tokenData = await tokenResponse.json()

    // Encrypt and save access token
    const encryptedToken = encrypt(tokenData.access_token)

    await prisma.notionIntegration.upsert({
      where: { userId: session.user.id! },
      create: {
        userId: session.user.id!,
        accessToken: encryptedToken,
        workspaceId: tokenData.workspace_id,
        workspaceName: tokenData.workspace_name,
        isActive: true
      },
      update: {
        accessToken: encryptedToken,
        workspaceId: tokenData.workspace_id,
        workspaceName: tokenData.workspace_name,
        isActive: true
      }
    })

    return NextResponse.redirect('/settings?notion_connected=true')
  } catch (error) {
    console.error('[Notion] OAuth error:', error)
    return NextResponse.redirect('/settings?error=notion_auth_failed')
  }
}
