import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.redirect('/login')
  }

  const notionAuthUrl = new URL('https://api.notion.com/v1/oauth/authorize')
  notionAuthUrl.searchParams.set('client_id', process.env.NOTION_CLIENT_ID!)
  notionAuthUrl.searchParams.set('response_type', 'code')
  notionAuthUrl.searchParams.set('owner', 'user')
  notionAuthUrl.searchParams.set(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_APP_URL}/api/notion/callback`
  )

  return NextResponse.redirect(notionAuthUrl.toString())
}
