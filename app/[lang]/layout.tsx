import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'

import { LanguageSwitcher } from './language-switcher'
import { PlatformNav } from './platform-nav'
import { LANGUAGES, isLanguage, type Language } from '@/lib/language'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/**
 * The application's only shell. It sits inside the language segment because
 * ADR-0008 leaves no unlocalised page — including the `lang` attribute, which
 * a screen reader uses to choose a voice and which would be a lie if it were
 * fixed in an outer layout.
 */

const DESCRIPTION: Record<Language, string> = {
  en: 'An internal UX learning platform for Aisahub staff in Korea and Indonesia.',
  ko: 'Aisahub 한국·인도네시아 구성원을 위한 사내 UX 학습 플랫폼입니다.',
}

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return {
    title: 'ux-study',
    description: isLanguage(lang) ? DESCRIPTION[lang] : DESCRIPTION.en,
  }
}

export default async function LanguageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params
  // A language we do not publish is not a page. Without this the segment would
  // happily render as if it were one, in whichever language the copy defaults
  // to, and the address would be claiming something untrue.
  if (!isLanguage(lang)) notFound()

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* The switcher keeps its own right-hand corner whether or not there
            is a nav beside it, so it does not move between signed-out and
            signed-in pages. */}
        <header className="flex items-baseline gap-4 p-4">
          <PlatformNav lang={lang} />
          <div className="ml-auto">
            <LanguageSwitcher current={lang} />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
