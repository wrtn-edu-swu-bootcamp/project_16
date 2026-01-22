import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { signJWT } from '@/lib/utils/jwt'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Generate a JWT token for the extension
    const token = await signJWT({
      userId: session.user.id,
      email: session.user.email,
      type: 'extension'
    })

    // Return token in a page that the extension can capture
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TweetLingo Extension Authentication</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f7;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .success {
              color: #34C759;
              font-size: 48px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 8px;
            }
            p {
              color: #666;
              margin-bottom: 24px;
            }
          </style>
          <script>
            // Send token to extension
            window.addEventListener('DOMContentLoaded', () => {
              const token = '${token}'
              const userId = '${session.user.id}'
              
              // Try to communicate with extension
              if (window.chrome && window.chrome.runtime) {
                // This will fail if not in extension context, which is fine
                try {
                  window.close()
                } catch (e) {}
              }
              
              // Store in localStorage for extension to pick up
              localStorage.setItem('tweetlingo_extension_token', token)
              localStorage.setItem('tweetlingo_extension_user_id', userId)
              
              setTimeout(() => {
                window.close()
              }, 2000)
            })
          </script>
        </head>
        <body>
          <div class="container">
            <div class="success">✓</div>
            <h1>Authentication Successful</h1>
            <p>You can now close this window and return to the extension.</p>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (error) {
    console.error('[API] Extension auth error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Authentication failed' },
      { status: 500 }
    )
  }
}
