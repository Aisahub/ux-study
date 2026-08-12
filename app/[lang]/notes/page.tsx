import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { notesFor } from '@/lib/notes'
import { content } from '@/lib/server-content'

import { NoteRow } from './note-row'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    explanation: string
    openLesson: string
    empty: string
    count: (n: number) => string
  }
> = {
  en: {
    heading: 'My notes',
    explanation:
      'Everything you have written down, kept under the Competency you wrote it against and in the order the programme runs. Yours alone — no colleague and no Maintainer reads these, nothing here is counted, and nothing here decides anything.',
    openLesson: 'Open the Competency',
    empty:
      'Nothing written down yet. Every Competency page has a place to keep what you take from it, between the article and the Gate Quiz.',
    count: (n) => (n === 1 ? '1 note' : `${n} notes`),
  },
  ko: {
    heading: '내 메모',
    explanation:
      '지금까지 적어 둔 것을 모두 모았습니다. 메모를 쓴 역량별로, 프로그램이 진행되는 순서대로 놓입니다. 나만 봅니다 — 동료도 운영자도 읽지 않고, 세어지지도, 무엇을 정하지도 않습니다.',
    openLesson: '역량 페이지 열기',
    empty:
      '아직 적어 둔 것이 없습니다. 각 역량 페이지의 원문 기사와 퀴즈 사이에, 건진 것을 남겨 두는 자리가 있습니다.',
    count: (n) => `메모 ${n}개`,
  },
}

/**
 * Every note this Learner has written, in one place.
 *
 * It exists because a note's second life is away from the lesson it was
 * written on: a Learner mid-ticket wants the line they kept about contrast
 * without first remembering which of twelve Competencies they were reading
 * when they kept it. That is the same reason the Glossary is a working tool
 * rather than a study aid — what a Learner takes away has to survive leaving
 * the page it came from.
 *
 * It is reached from My page and from every lesson's own notes step, and not
 * from the navigation rail. The rail's bottom-bar form is full at six marks,
 * which is exactly what a Maintainer already carries; a seventh would put
 * every target on a 320px screen under the 44px this platform teaches.
 *
 * This Learner and nobody else, and nothing totalled across the programme:
 * the count beside a heading is that Competency's own, never a figure for the
 * person, which is what PRODUCT.md rules out.
 */
export default async function Notes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const notes = await notesFor(session.email)

  // Programme order, and anything unrecognised last rather than dropped. A
  // Competency slug config.md no longer declares cannot be written today — the
  // action refuses it — but it can be left behind by a content edit, and a
  // page that silently swallows a Learner's own writing is worse than one that
  // shows it under a name it does not have copy for.
  const order = content.config.stages.flatMap((entry) => entry.competencies)
  const rank = (slug: string) => {
    const at = order.indexOf(slug)
    return at === -1 ? order.length : at
  }
  const groups = [...new Set(notes.map((note) => note.competency))]
    .sort((a, b) => rank(a) - rank(b))
    .map((slug) => ({
      slug,
      name: content.competencies.find((entry) => entry.slug === slug)?.name[lang] ?? slug,
      notes: notes.filter((note) => note.competency === slug),
    }))

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="px-1.5 pb-[26px]">
        <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
        <p className="mt-3 max-w-measure text-body text-ink">{copy.explanation}</p>
      </header>

      {groups.length === 0 ? (
        <section className="rounded-card bg-surface p-[26px] shadow-card">
          <p className="max-w-measure text-body text-ink-2">{copy.empty}</p>
        </section>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {groups.map((group) => (
            <section
              key={group.slug}
              aria-labelledby={`notes-${group.slug}`}
              className="rounded-card bg-surface p-[26px] shadow-card"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-[22px] gap-y-1">
                <h2
                  id={`notes-${group.slug}`}
                  className="font-serif text-headline font-bold break-keep text-ink"
                >
                  {group.name}
                </h2>
                <p className="text-label font-bold text-ink-2">{copy.count(group.notes.length)}</p>
              </div>

              <ul className="mt-[22px] flex flex-col gap-2.5">
                {group.notes.map((note) => (
                  <NoteRow key={note.id} lang={lang} note={note} />
                ))}
              </ul>

              <Link
                href={`/${lang}/learn/${group.slug}`}
                className="mt-4.5 inline-flex min-h-11 items-center text-label font-bold text-oxblood"
              >
                {copy.openLesson}
                <span aria-hidden> →</span>
              </Link>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
