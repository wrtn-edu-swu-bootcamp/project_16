import { auth, signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignUpPage() {
  const session = await auth()
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md space-y-8 rounded-card bg-white p-8 shadow-card">
        <div className="text-center">
          <h1 className="text-title-1">TweetLingo</h1>
          <p className="mt-2 text-body text-neutral-600">
            Learn languages, one tweet at a time
          </p>
        </div>

        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/analyze' })
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="w-full rounded-button bg-sky-500 px-6 py-3 text-body font-semibold text-white shadow-button transition-all hover:bg-sky-600 hover:shadow-button-hover active:scale-[0.98]"
          >
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  )
}
