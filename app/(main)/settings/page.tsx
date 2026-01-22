import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { NotionConnectButton } from '@/components/features/notion/notion-connect-button'
import { AutoSaveSettings } from '@/components/features/settings/auto-save-settings'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/login')
  }

  const [notionIntegration, userSettings] = await Promise.all([
    prisma.notionIntegration.findUnique({
      where: { userId: session.user.id! }
    }),
    prisma.userSettings.findUnique({
      where: { userId: session.user.id! }
    })
  ])

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8">
          <h1 className="text-title-1 mb-2">설정</h1>
          <p className="text-body text-neutral-600">
            계정 및 연동 설정을 관리합니다
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-card bg-white p-6 shadow-card">
            <h2 className="text-headline font-semibold mb-4">계정 정보</h2>
            <div className="space-y-2">
              <div>
                <p className="text-footnote font-semibold text-neutral-700">이름</p>
                <p className="text-body">{session.user.name || '설정 안됨'}</p>
              </div>
              <div>
                <p className="text-footnote font-semibold text-neutral-700">이메일</p>
                <p className="text-body">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-white p-6 shadow-card">
            <h2 className="text-headline font-semibold mb-4">자동 저장 설정</h2>
            <AutoSaveSettings 
              initialSettings={{
                autoSaveWords: userSettings?.autoSaveWords || false,
                autoSaveLanguages: userSettings?.autoSaveLanguages || ['EN', 'JA', 'ZH'],
                autoSaveMinWords: userSettings?.autoSaveMinWords || 3
              }}
            />
          </div>

          <div className="rounded-card bg-white p-6 shadow-card">
            <h2 className="text-headline font-semibold mb-4">Notion 연동</h2>
            <NotionConnectButton
              isConnected={notionIntegration?.isActive || false}
            />
            {notionIntegration?.isActive && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-footnote text-neutral-600">
                  연동된 워크스페이스: {notionIntegration.workspaceName || '알 수 없음'}
                </p>
                {notionIntegration.lastSyncAt && (
                  <p className="text-footnote text-neutral-600 mt-1">
                    마지막 동기화: {new Date(notionIntegration.lastSyncAt).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
