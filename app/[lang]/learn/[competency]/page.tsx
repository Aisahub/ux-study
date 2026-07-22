import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor } from '@/lib/progress'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    objective: string
    roleHint: string
    questionsHeading: string
    questionsExplanation: string
    article: string
    quizPassed: string
    quizStart: (attempts: number) => string
    back: string
  }
> = {
  en: {
    objective: 'Afterwards, you can',
    roleHint: 'Where to point it',
    questionsHeading: 'Carry these questions into the article',
    questionsExplanation: 'Read with a hypothesis rather than skimming — decide what you expect before the article answers.',
    article: 'Read the source article',
    quizPassed: 'Gate Quiz passed',
    quizStart: (attempts) => (attempts > 0 ? 'Retry the Gate Quiz' : 'Take the Gate Quiz'),
    back: 'All Competencies',
  },
  ko: {
    objective: '마치고 나면 할 수 있는 것',
    roleHint: '어디에 적용해 볼까',
    questionsHeading: '이 질문들을 들고 기사를 읽으세요',
    questionsExplanation: '훑어보는 대신 가설을 세우고 읽습니다 — 기사가 답하기 전에 스스로 예상해 보세요.',
    article: '원문 기사 읽기',
    quizPassed: '관문 퀴즈 통과',
    quizStart: (attempts) => (attempts > 0 ? '관문 퀴즈 다시 도전' : '관문 퀴즈 시작'),
    back: '전체 역량 보기',
  },
}

/**
 * One Competency (#20): what the Learner should be able to do afterwards,
 * where to point it given their role, the questions to read the article with,
 * and the article itself. Flat route per ADR-0008 — no stage segment.
 */
export default async function CompetencyPage({
  params,
}: {
  params: Promise<{ lang: string; competency: string }>
}) {
  const { lang, competency: slug } = await params
  if (!isLanguage(lang)) notFound()
  const competency = content.competencies.find((entry) => entry.slug === slug)
  if (!competency || !content.config.stage1Competencies.includes(slug)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const progress = await progressFor(session.email)
  const quiz = progress.quizzes[slug]

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <nav className="text-sm">
        <Link href={`/${lang}/learn`} className="text-zinc-500 underline-offset-4 hover:underline">
          ← {copy.back}
        </Link>
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight">{competency.name[lang]}</h1>

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.objective}</h2>
        <p className="mt-1">{competency.objective[lang]}</p>
      </section>

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.roleHint}</h2>
        <p className="mt-1">{competency.roleHint[lang]}</p>
      </section>

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.questionsHeading}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{copy.questionsExplanation}</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {competency.preReadingQuestions.map((question) => (
            <li key={question.en}>{question[lang]}</li>
          ))}
        </ol>
      </section>

      {/* Korean-language Learners read the article in English with browser
          translation as an aid (ADR-0002) — the notice never shows in English. */}
      {lang === 'ko' && competency.koTranslationNotice && (
        <p className="rounded-md bg-zinc-100 p-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          {competency.koTranslationNotice}
        </p>
      )}

      <p>
        <a
          href={competency.source.url}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {copy.article}
        </a>
        <span className="text-sm text-zinc-500"> — {competency.source.attribution}</span>
      </p>

      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        {quiz.status === 'passed' ? (
          <p className="text-sm font-medium text-green-700 dark:text-green-400">{copy.quizPassed}</p>
        ) : (
          <Link href={`/${lang}/learn/${slug}/quiz`} className="font-medium underline-offset-4 hover:underline">
            {copy.quizStart(quiz.attempts)}
          </Link>
        )}
      </section>
    </main>
  )
}
