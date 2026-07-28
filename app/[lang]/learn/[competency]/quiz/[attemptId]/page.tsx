import Link from 'next/link'
import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { shuffledOrder } from '@/lib/quiz'
import { content, itemScreenCss } from '@/lib/server-content'

import { QuizWizard } from './wizard'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    verdictPassed: string
    verdictFailed: string
    score: (score: number, of: number) => string
    passedExplanation: string
    failedExplanation: string
    summaryHeading: string
    wrongHeading: string
    coveredIn: string
    retry: string
    backToLearn: string
    article: string
  }
> = {
  en: {
    verdictPassed: 'Passed',
    verdictFailed: 'Not passed',
    score: (score, of) => `${score} of ${of} correct.`,
    passedExplanation: 'This Competency is cleared.',
    summaryHeading: 'The key points',
    failedExplanation:
      'Below are the items you missed and where the article covers each one. The answers stay hidden — reread, then draw a fresh set.',
    wrongHeading: 'Worth another look',
    coveredIn: 'Covered in',
    retry: 'Try again now',
    backToLearn: 'Back to the overview',
    article: 'the article',
  },
  ko: {
    verdictPassed: '통과',
    verdictFailed: '미통과',
    score: (score, of) => `${of}문항 중 ${score}문항 정답.`,
    passedExplanation: '이 역량을 통과했습니다.',
    summaryHeading: '핵심 요약',
    failedExplanation:
      '아래는 틀린 문항과, 기사에서 그 내용을 다루는 위치입니다. 정답은 공개하지 않습니다 — 다시 읽고, 새로 뽑힌 문항으로 도전하세요.',
    wrongHeading: '다시 볼 문항',
    coveredIn: '다루는 절',
    retry: '지금 다시 도전',
    backToLearn: '학습 개요로',
    article: '기사',
  },
}

/**
 * One attempt (#21): the wizard while it is open, the verdict once submitted.
 * Both render in the language of the URL — the attempt no longer owns it
 * (ADR-0008 amendment, 2026-07-23). Failure feedback names the missed items
 * and their article sections and nothing else (#22): no response anywhere
 * carries the answer key.
 */
export default async function AttemptPage({
  params,
}: {
  params: Promise<{ lang: string; competency: string; attemptId: string }>
}) {
  const { lang, competency: slug, attemptId } = await params
  if (!isLanguage(lang)) notFound()
  const id = Number.parseInt(attemptId, 10)
  if (!Number.isInteger(id)) notFound()

  const session = await requireSession(lang)
  const [attempt] = await db.select().from(schema.attempts).where(eq(schema.attempts.id, id))
  // Someone else's attempt is indistinguishable from no attempt.
  if (!attempt || attempt.email !== session.email || attempt.competency !== slug) notFound()

  const pool = content.items[slug]
  const items = attempt.drawn.map((itemSlug) => pool.find((item) => item.slug === itemSlug)!)

  if (!attempt.submittedAt) {
    // Open, and rendered in the language of the URL like every other page. The
    // switch used to be forbidden here and the URL bent to the attempt; it is
    // allowed now, and the answers picked so far are persisted, so crossing
    // over mid-attempt costs a Learner nothing.
    return (
      <QuizWizard
        lang={lang}
        attemptId={attempt.id}
        screenCss={itemScreenCss}
        initialChoices={attempt.draft ?? {}}
        items={items.map((item) => {
          const order = shuffledOrder(`${attempt.id}:${item.slug}`, item.options[lang].length)
          return {
            slug: item.slug,
            artefact: item.artefact[lang],
            screen: item.screen?.[lang],
            prompt: item.prompt[lang],
            // Original indices survive the shuffle so scoring is order-blind;
            // the keyed flag itself must never travel to the client (#22).
            options: order.map((index) => ({
              index,
              text: item.options[lang][index].text,
              reason: item.options[lang][index].reason,
            })),
          }
        })}
      />
    )
  }

  // Submitted: the verdict, in the language of the URL like any other page —
  // the attempt owns the language only while it is open.
  const copy = COPY[lang]
  const competency = content.competencies.find((entry) => entry.slug === slug)!
  const wrong = (attempt.selections ?? []).filter((selection) => !selection.correct)

  return (
    // A column like the doorstep and the wizard: the attempt is one thread,
    // and it ends the way it began rather than spreading back onto the grid
    // the map pages use.
    <main className="mx-auto w-full max-w-[720px] px-0.5">
      <nav className="px-1.5 pb-3.5">
        <Link
          href={`/${lang}/learn`}
          className="inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill"
        >
          <span aria-hidden>←</span>
          {copy.backToLearn}
        </Link>
      </nav>

      <h1 className="px-1.5 pb-5 font-serif text-[44px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">
        {attempt.passed ? copy.verdictPassed : copy.verdictFailed}
      </h1>

      <div className="flex flex-col gap-3.5">
        {attempt.passed ? (
          // Nothing is outstanding, so nothing here wears the warm field.
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <p className="max-w-[56ch] text-[16px] leading-[1.55]">
              {copy.score(attempt.score ?? 0, attempt.drawn.length)} {copy.passedExplanation}
            </p>
          </section>
        ) : (
          // The one warm field: the single next action, which is to go again.
          // The prose points down at the list below before the button is
          // pressed — the retry is offered, not urged.
          <section className="rounded-card bg-sand p-5 sm:p-[26px] shadow-warm">
            <p className="max-w-[56ch] text-[16px] leading-[1.55]">
              {copy.score(attempt.score ?? 0, attempt.drawn.length)} {copy.failedExplanation}
            </p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="mt-5.5 flex w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
            >
              {copy.retry}
            </Link>
          </section>
        )}

        {/* The written explanation (#29) lands here rather than on the Competency
            page: read before the quiz it is a second thing to study, read after
            passing it is the recap of what the Learner has just shown they can
            do. It is withheld on a failed attempt on purpose — that screen sends
            the Learner back to the article section by section (ADR-0006), and a
            summary offered in its place would be read instead of the article. */}
        {attempt.passed && competency.explanation && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.summaryHeading}
            </h2>
            <p className="mt-3.5 max-w-[56ch] text-[16px] leading-[1.55] whitespace-pre-line">
              {competency.explanation[lang]}
            </p>
          </section>
        )}

        {!attempt.passed && wrong.length > 0 && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="mb-4.5 font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.wrongHeading}
            </h2>
            <div className="flex flex-col">
              {wrong.map((selection) => {
                const item = items.find((candidate) => candidate.slug === selection.item)!
                return (
                  <div
                    key={selection.item}
                    className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5"
                  >
                    {/* A hollow blue-grey ring: real, and not yet reached. The
                        same mark an unvisited station wears, because that is
                        exactly what this item still is. */}
                    <i
                      aria-hidden
                      className="mt-[7px] size-[14px] rounded-full shadow-[inset_0_0_0_2.5px_var(--blue-grey)]"
                    />
                    <span>
                      <span className="block max-w-[56ch] text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
                        {item.prompt[lang]}
                      </span>
                      <span className="mt-1 block text-[13.5px] leading-[1.55] text-ink-2">
                        {copy.coveredIn}:{' '}
                        <a
                          href={competency.source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-oxblood"
                        >
                          {item.sourceSection}
                          <span aria-hidden> ↗</span>
                        </a>
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
