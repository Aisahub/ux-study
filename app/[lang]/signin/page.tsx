import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'

const COPY: Record<Language, { heading: string; explanation: string; button: string }> = {
  en: {
    heading: 'Sign in',
    explanation:
      'One button for everyone: Aisahub staff use their Workspace account, and colleagues in Indonesia use the personal Google account they were enrolled with.',
    button: 'Continue with Google',
  },
  ko: {
    heading: '로그인',
    explanation:
      '버튼은 모두에게 하나입니다. Aisahub 구성원은 Workspace 계정으로, 인도네시아 동료는 등록된 개인 Google 계정으로 로그인합니다.',
    button: 'Google로 계속하기',
  },
}

/** The door (#11). Localised like every other page — sign-in is not an exception to ADR-0008. */
export default async function SignIn({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language: Language = isLanguage(lang) ? lang : 'en'
  // Already in — the door is behind them.
  if (await getSession()) redirect(`/${language}`)
  const copy = COPY[language]

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col justify-center gap-4 p-16 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{copy.explanation}</p>
      <a
        href={`/api/auth/google?lang=${language}`}
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
      >
        {copy.button}
      </a>
    </main>
  )
}
