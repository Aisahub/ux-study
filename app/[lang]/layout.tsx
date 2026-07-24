import type { Metadata } from 'next'
import { Gowun_Batang } from 'next/font/google'
import localFont from 'next/font/local'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LanguageSwitcher } from './language-switcher'
import { PlatformNav } from './platform-nav'
import { getSession } from '@/lib/auth'
import { LANGUAGES, isLanguage, type Language } from '@/lib/language'
import '../globals.css'

/**
 * next/font's metadata lists no `korean` subset for either family, so naming
 * subsets here would fetch the Latin ranges alone and every Hangul glyph would
 * silently fall back to a system face — which on the display font would lose
 * the serif that carries this design's only ornament. Omitting `subsets`
 * requires `preload: false`, and that combination fetches the whole face.
 */
const display = Gowun_Batang({
  weight: ['400', '700'],
  preload: false,
  variable: '--font-display',
})

/**
 * Pretendard, self-hosted from `app/fonts` (SIL OFL, see Pretendard-OFL.txt).
 * It is not on Google Fonts, so there is no next/font/google path for it.
 *
 * Two weights only, and the KS X 1001 subset rather than the full face: each
 * Korean weight is ~262KB, so a third would have cost more than the design
 * gains from it. Anything the code asks for between 400 and 700 would be
 * synthesised by the browser — a stretched fake bold that Hangul shows badly —
 * so the type scale uses these two and nothing else.
 */
const body = localFont({
  src: [
    { path: '../fonts/Pretendard-Regular.subset.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Pretendard-Bold.subset.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

/**
 * The application's only shell. It sits inside the language segment because
 * ADR-0008 leaves no unlocalised page — including the `lang` attribute, which
 * a screen reader uses to choose a voice and which would be a lie if it were
 * fixed in an outer layout.
 *
 * Glass, outermost first: a soft colour field, a frosted board filling the
 * viewport, a brighter frosted bed on it, and the opaque cards each page puts
 * on that. Depth comes from translucency and shadow — see DESIGN.md, which
 * forbids solving a soft edge with a border.
 */

const DESCRIPTION: Record<Language, string> = {
  en: 'An internal UX learning platform for Aisahub staff in Korea and Indonesia.',
  ko: 'Aisahub 한국·인도네시아 구성원을 위한 사내 UX 학습 플랫폼입니다.',
}

const ROLE: Record<Language, { learner: string; maintainer: string }> = {
  en: { learner: 'Learner', maintainer: 'Maintainer' },
  ko: { learner: '학습자', maintainer: '운영자' },
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

  const session = await getSession()
  const role = ROLE[lang]

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* The frosted glass background board: translucent white over a blur of
            the colour field, so the blue-grey and sand behind it read through
            the glass. The page carries no outer padding, so the board runs to
            every viewport edge. Its own 14px inset is the breathing space the
            glass shows above, below and beside the content — the board framing
            the page, not a margin around the app. */}
        <div className="grid min-h-screen w-full grid-cols-[78px_minmax(0,1fr)] gap-3.5 bg-white/32 p-3.5 backdrop-blur-[22px] backdrop-saturate-150">
          <PlatformNav lang={lang} />

          {/* The content bed: a brighter frost sitting on the board, holding the
              top bar and the page. The board reads through around it — most
              visibly down the navigation rail, which sits on the board itself. */}
          <div className="rounded-card bg-bed p-[22px] inset-shadow-bed">
            <div className="flex flex-wrap items-center gap-4 px-1.5 pb-5">
              {/* A wordmark, and a way home only for someone who has a home:
                  a signed-out visitor is offered no navigation at all. */}
              {session ? (
                <Link
                  href={`/${lang}/learn`}
                  className="text-[12px] font-bold tracking-[0.26em] uppercase"
                >
                  ux&thinsp;·&thinsp;study
                </Link>
              ) : (
                <span className="text-[12px] font-bold tracking-[0.26em] uppercase">
                  ux&thinsp;·&thinsp;study
                </span>
              )}

              <div className="ml-auto flex items-center gap-2.5">
                <LanguageSwitcher current={lang} />
                {session && (
                  // Not a menu: a link to the page that already holds sign-out
                  // and this Learner's own record.
                  <Link
                    href={`/${lang}/me`}
                    className="flex items-center gap-2.5 rounded-full bg-surface py-[5px] pr-[15px] pl-[5px] shadow-pill"
                  >
                    <span
                      aria-hidden
                      className="grid size-[30px] place-items-center rounded-full bg-oxblood text-xs font-bold text-white"
                    >
                      {session.email.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-[13.5px] leading-tight font-bold">
                      {session.email.split('@')[0]}
                      <span className="block text-[12px] text-ink-2">
                        {session.isMaintainer ? role.maintainer : role.learner}
                      </span>
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
