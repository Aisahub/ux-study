import { cookies } from 'next/headers'

import { isLanguage, type Language } from '@/lib/language'

const COPY: Record<Language, { heading: string; body: (email: string | null) => string; hint: string }> = {
  en: {
    heading: 'This address is not enrolled',
    body: (email) =>
      email
        ? `Google confirmed ${email}, but that address is not on the learning programme's list.`
        : 'Google confirmed who you are, but that address is not on the learning programme’s list.',
    hint: 'If you were expecting access, ask the programme maintainer to add the address — or sign in again with the account you were enrolled with.',
  },
  ko: {
    heading: '등록되지 않은 주소입니다',
    body: (email) =>
      email
        ? `Google이 ${email} 계정을 확인했지만, 이 주소는 학습 프로그램 명단에 없습니다.`
        : 'Google 인증은 되었지만, 이 주소는 학습 프로그램 명단에 없습니다.',
    hint: '접근 권한이 있어야 한다면 프로그램 관리자에게 주소 등록을 요청하거나, 등록된 계정으로 다시 로그인하세요.',
  },
}

/**
 * Where a rejected sign-in lands (#11): authenticated fine, just not on the
 * allowlist — and told so, with the address, instead of shown a blank error.
 * The address comes from a short-lived cookie set by the callback, never from
 * the URL.
 */
export default async function NotEnrolled({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language: Language = isLanguage(lang) ? lang : 'en'
  const copy = COPY[language]
  const email = (await cookies()).get('not-enrolled-email')?.value ?? null

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col justify-center gap-4 p-16 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{copy.body(email)}</p>
      <p className="text-sm text-zinc-500">{copy.hint}</p>
    </main>
  )
}
