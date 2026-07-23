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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">
        {attempt.passed ? copy.verdictPassed : copy.verdictFailed}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {copy.score(attempt.score ?? 0, attempt.drawn.length)}{' '}
        {attempt.passed ? copy.passedExplanation : copy.failedExplanation}
      </p>

      {!attempt.passed && wrong.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-zinc-500">{copy.wrongHeading}</h2>
          <ul className="mt-2 flex flex-col gap-3">
            {wrong.map((selection) => {
              const item = items.find((candidate) => candidate.slug === selection.item)!
              return (
                <li key={selection.item} className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
                  <p>{item.prompt[lang]}</p>
                  <p className="mt-1 text-zinc-500">
                    {copy.coveredIn}:{' '}
                    <a
                      href={competency.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {item.sourceSection}
                    </a>
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <p className="flex gap-4 text-sm">
        {!attempt.passed && (
          <Link href={`/${lang}/learn/${slug}/quiz`} className="font-medium underline underline-offset-4">
            {copy.retry}
          </Link>
        )}
        <Link href={`/${lang}/learn`} className="text-zinc-500 underline-offset-4 hover:underline">
          {copy.backToLearn}
        </Link>
      </p>
    </main>
  )
}
