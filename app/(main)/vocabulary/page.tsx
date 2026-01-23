'use client'

import { useState } from 'react'
import { useVocabulary } from '@/lib/hooks/use-vocabulary'
import { WordItem } from '@/components/features/vocabulary/word-item'
import { FilterBar } from '@/components/features/vocabulary/filter-bar'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

export default function VocabularyPage() {
  const [language, setLanguage] = useState('')
  const [status, setStatus] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const { data, isLoading, error } = useVocabulary({
    language: language || undefined,
    status: status || undefined
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/words/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete word')
      }

      window.location.reload()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/words/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update word')
      }

      window.location.reload()
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (data?.words) {
      const allIds = data.words.map((w: any) => w.id)
      setSelectedIds(prev => 
        prev.length === allIds.length ? [] : allIds
      )
    }
  }

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return
    
    if (!confirm(`선택한 ${selectedIds.length}개의 단어를 삭제하시겠습니까?`)) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/words/batch', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })

      if (!response.ok) {
        throw new Error('Failed to delete words')
      }

      window.location.reload()
    } catch (error) {
      console.error('Batch delete error:', error)
      alert('삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelSelect = () => {
    setSelectMode(false)
    setSelectedIds([])
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-title-1 mb-2">내 단어장</h1>
            <p className="text-body text-neutral-600">
              저장한 단어들을 확인하고 복습하세요
            </p>
          </div>
          {data && data.words.length > 0 && (
            <div>
              {selectMode ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedIds.length === data.words.length ? '전체 해제' : '전체 선택'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBatchDelete}
                    disabled={selectedIds.length === 0 || isDeleting}
                    className="text-error border-error hover:bg-error/10"
                  >
                    {isDeleting ? '삭제 중...' : `삭제 (${selectedIds.length})`}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancelSelect}>
                    취소
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setSelectMode(true)}>
                  선택하기
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 rounded-card bg-white p-6 shadow-card">
          <FilterBar
            language={language}
            status={status}
            onLanguageChange={setLanguage}
            onStatusChange={setStatus}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="rounded-card bg-error/10 p-6 text-center text-body text-error">
            단어를 불러오는데 실패했습니다
          </div>
        )}

        {data && data.words.length === 0 && (
          <div className="rounded-card bg-white p-12 text-center shadow-card">
            <p className="text-body text-neutral-600">저장된 단어가 없습니다</p>
          </div>
        )}

        {data && data.words.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.words.map((word: any) => (
              <WordItem
                key={word.id}
                word={word}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                selectMode={selectMode}
                isSelected={selectedIds.includes(word.id)}
                onSelectToggle={handleSelectToggle}
              />
            ))}
          </div>
        )}

        {data && data.pagination && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`rounded-button px-4 py-2 text-footnote font-medium ${
                  page === data.pagination.page
                    ? 'bg-sky-500 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
