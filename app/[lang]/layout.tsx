import type { Metadata } from 'next'
import { Gowun_Batang } from 'next/font/google'
import localFont from 'next/font/local'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LanguageSwitcher } from './language-switcher'
import { PlatformNav } from './platform-nav'
import { SignOut } from './sign-out'
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
        {/* Below `sm` the rail's 78px column is gone entirely rather than
            narrowed: it costs a fifth of a phone's width, and the marks it
            held are on the bottom bar instead. A signed-out visitor has no
            navigation at all, so nothing is reserved for a bar they will not
            be shown. */}
        <div
          className={`relative grid min-h-screen w-full grid-cols-1 gap-3.5 p-3.5 sm:grid-cols-[78px_minmax(0,1fr)] sm:pb-3.5 ${
            session ? 'pb-(--bottom-bar)' : ''
          }`}
        >
          {/* The frost is its own layer rather than a filter on the grid above.
              `backdrop-filter` makes an element the containing block for every
              fixed-position descendant, so with the blur on the grid the bottom
              bar anchored itself to the bottom of the page instead of the
              bottom of the viewport — visible only after scrolling to the end
              of a Gate Quiz, which is precisely where navigation is no use.
              Fixed here too, so the board stays still under a scrolling page
              the way the colour field behind it already does. */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-white/32 backdrop-blur-[22px] backdrop-saturate-150"
          />

          <PlatformNav lang={lang} />

          {/* The content bed: a brighter frost sitting on the board, holding the
              top bar and the page. The board reads through around it — most
              visibly down the navigation rail, which sits on the board itself. */}
          <div className="rounded-card bg-bed p-4 inset-shadow-bed sm:p-[22px]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-1.5 pb-5">
              {/* A wordmark, and a way home only for someone who has a home:
                  a signed-out visitor is offered no navigation at all. */}
              {session ? (
                <Link
                  href={`/${lang}/learn`}
                  className="text-label font-bold tracking-[0.26em] uppercase"
                >
                  ux&thinsp;·&thinsp;study
                </Link>
              ) : (
                <span className="text-label font-bold tracking-[0.26em] uppercase">
                  ux&thinsp;·&thinsp;study
                </span>
              )}

              {/* min-w-0 is what lets the account pill's `truncate` actually
                  fire. A flex item defaults to min-width:auto, so this row
                  refuses to shrink below its contents' own minimum and pushes
                  the pill off the right edge instead of clipping the email
                  inside it. It held until the label step went 12px -> 13.5px on
                  2026-07-29, which is the point the two pills stopped fitting a
                  320px row — the guard was always missing, not the width. */}
              <div className="ml-auto flex min-w-0 items-center gap-2.5">
                <LanguageSwitcher current={lang} />
                {session && (
                  // Not a menu: a link to this Learner's own record. It held
                  // sign-out too until 2026-07-29, which is why the pill was
                  // ever the way out of the platform.
                  <Link
                    href={`/${lang}/me`}
                    // min-w-11/min-h-11 below `sm`, not padding: with the text
                    // gone the pill is its 30px avatar plus 5px, and 40px is
                    // under the 44px this platform teaches. The target is the
                    // link, so the minimum goes on the link and is measured on
                    // the rendered box (ERR-206).
                    className="flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full bg-surface p-[5px] shadow-pill sm:min-h-0 sm:min-w-0 sm:justify-start sm:py-[5px] sm:pr-[15px] sm:pl-[5px]"
                  >
                    <span
                      aria-hidden
                      className="grid size-[30px] shrink-0 place-items-center rounded-full bg-oxblood text-label font-bold text-white"
                    >
                      {session.email.slice(0, 1).toUpperCase()}
                    </span>
                    {/* Below `sm` the pill is the avatar alone. There is room
                        for exactly 44px here once the switcher and sign-out
                        have taken theirs, and 44px is the avatar — so the text
                        was not shrinking, it was being shown as "c…" over a
                        half-drawn "Mai". A truncate that truncates everything
                        is not a graceful degradation, it is a defect on the
                        platform that teaches Readability. The address and the
                        role are on My page, one tap away, which is what that
                        page is for. */}
                    <span className="hidden min-w-0 truncate text-body-sm leading-tight font-bold sm:block">
                      {session.email.split('@')[0]}
                      <span className="block text-label text-ink-2">
                        {session.isMaintainer ? role.maintainer : role.learner}
                      </span>
                    </span>
                  </Link>
                )}
                {/* Below `sm` only: the bottom bar is full at six marks, so the
                    rail's other half comes here instead of vanishing. Last in
                    the row rather than beside the switcher, so the two pieces
                    of "who you are and how you leave" stay adjacent, and the
                    account pill — the one item here that truncates — keeps the
                    slack between two fixed widths. */}
                {session && <SignOut lang={lang} className="shrink-0 sm:hidden" />}
              </div>
            </div>

            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
