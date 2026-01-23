import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-large-title mb-4">TweetLingo</h1>
        <p className="text-title-2 mb-8 font-normal text-neutral-600">
          Learn languages, one tweet at a time
        </p>
        <p className="mx-auto mb-12 max-w-2xl text-body text-neutral-600">
          X(트위터)에서 외국어 트윗을 읽을 때, 모르는 단어를 자동으로 추출하고
          학습할 수 있도록 돕는<br />마이크로러닝 기반 실시간 언어 학습 도구
        </p>
        <div className="flex justify-center gap-4">
          {session ? (
            <Link href="/analyze">
              <Button size="lg">시작하기</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg">시작하기</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-title-1 mb-12 text-center">주요 기능</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>자동 단어 추출</CardTitle>
              <CardDescription>
                트윗 텍스트에서 주요 단어를 자동으로 추출하고 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-footnote text-neutral-600">
                명사, 동사, 형용사, 부사 위주로 학습 가치가 높은 단어만 선별합니다
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>단어 정보 제공</CardTitle>
              <CardDescription>
                각 단어의 뜻, 발음, 예문을 카드 형태로 제공합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-footnote text-neutral-600">
                원본 트윗을 예문으로 활용하여 문맥 기반 학습을 지원합니다
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notion 연동</CardTitle>
              <CardDescription>
                개인 Notion 데이터베이스에 단어장을 자동 저장합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-footnote text-neutral-600">
                날짜별, 언어별, 상태별로 단어를 관리하고 복습할 수 있습니다
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-card bg-sky-50 p-12">
          <h2 className="text-title-1 mb-4">지금 시작해보세요</h2>
          <p className="mb-8 text-body text-neutral-600">
            3-10분 마이크로러닝으로 자연스럽게 외국어를 학습하세요
          </p>
          {session ? (
            <Link href="/analyze">
              <Button size="lg">트윗 분석하기</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg">무료로 시작하기</Button>
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
