'use client'

import { Button } from '@/components/ui/button'

interface NotionConnectButtonProps {
  isConnected: boolean
  onDisconnect?: () => void
}

export function NotionConnectButton({
  isConnected,
  onDisconnect
}: NotionConnectButtonProps) {
  const handleConnect = () => {
    window.location.href = '/api/notion/connect'
  }

  return (
    <div className="space-y-4">
      {isConnected ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <p className="text-body font-medium">Notion 연동됨</p>
          </div>
          <Button variant="outline" onClick={onDisconnect}>
            연결 해제
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-body text-neutral-600">
            Notion과 연동하여 단어장을 자동으로 저장하세요
          </p>
          <Button onClick={handleConnect}>Notion 연동하기</Button>
        </div>
      )}
    </div>
  )
}
