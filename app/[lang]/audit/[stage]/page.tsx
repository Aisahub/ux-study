import Link from 'next/link'
import { notFound } from 'next/navigation'

import { and, eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import type { Bilingual } from '@/lib/content'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor, stageProgress } from '@/lib/progress'
import { content, practicePage } from '@/lib/server-content'

import { attachIssueUrl } from '../actions'
import { FindingsDrawer } from '../drawer'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    locked: string
    lockedBack: string
    revealHeading: string
    revealIntro: string
    found: string
    missed: string
    yourFindings: string
    source: string
    issueHeading: string
    issueExplanation: string
    issueSave: string
    issueSaved: string
    complete: (stage: number) => string
    defectStep: (step: number, of: number) => string
    noSubject: string
    noSubjectWhy: string
  }
> = {
  en: {
    // Not "all four": the number of Gate Quizzes in a Stage is config.md's to
    // say, and a count written into a sentence here is one nobody would think
    // to change when a Stage gains a fifth Competency.
    locked: 'The audit unlocks once every Gate Quiz in this Stage is passed.',
    lockedBack: 'Back to the overview',
    revealHeading: 'What was planted',
    revealIntro:
      'Every planted defect, and whether one of your Findings pointed at it. Missing some is normal — the point was the looking.',
    found: 'Found',
    missed: 'Missed',
    yourFindings: 'Your Findings',
    source: 'Read the page source',
    issueHeading: 'Optional: show a fix',
    issueExplanation:
      'Pick one Finding and actually fix it, then paste a link showing the change — a pull request if you write code, a screenshot of the corrected page if you do not. It never affects completion.',
    issueSave: 'Save link',
    issueSaved: 'Saved.',
    complete: (stage) => `Stage ${stage} complete — every Gate Quiz passed and the report submitted.`,
    // Where the subject is walked, the element alone does not locate a defect:
    // the same control is on screen at more than one moment, and the moment is
    // the thing to go back to. Worded as the subject words it, so a Learner
    // reads the same phrase here and on the screen they are being sent to.
    defectStep: (step, of) => `Step ${step} of ${of}`,
    noSubject: 'This Stage has no page to audit yet.',
    noSubjectWhy:
      'The Gate Quizzes here are ready; the page to practise them on is still being written. Nothing is broken and nothing is lost — the Stage will finish once it arrives.',
  },
  ko: {
    locked: '이 단계의 퀴즈를 모두 통과하면 감사가 열립니다.',
    lockedBack: '학습 개요로',
    revealHeading: '심어 둔 것들',
    revealIntro:
      '심어 둔 결함 전부와, 여러분의 Finding이 그중 무엇을 가리켰는지입니다. 몇 개를 놓치는 건 정상입니다 — 중요한 건 들여다보는 일이었습니다.',
    found: '발견',
    missed: '놓침',
    yourFindings: '나의 Finding',
    source: '페이지 소스 보기',
    issueHeading: '선택: 고친 것을 보여 주기',
    issueExplanation:
      'Finding 하나를 골라 실제로 고치고, 그 변경을 보여 주는 링크를 붙여 넣으세요 — 코드를 쓴다면 pull request, 아니라면 고쳐진 페이지의 스크린샷이면 충분합니다. 수료에는 어떤 영향도 없습니다.',
    issueSave: '링크 저장',
    issueSaved: '저장되었습니다.',
    complete: (stage) => `${stage}단계 수료 — 퀴즈 전부 통과, 보고서 제출 완료.`,
    // 화면, not 단계: the subject calls these 단계, but on this page 단계 is
    // already the Stage — `2단계 수료` sits a few lines below — and one word
    // cannot mean both in one view.
    defectStep: (step, of) => `${of}개 화면 중 ${step}번째`,
    noSubject: '이 단계에는 아직 감사할 페이지가 없습니다.',
    noSubjectWhy:
      '이 단계의 퀴즈는 준비되어 있고, 연습할 페이지는 아직 작성 중입니다. 잘못된 것도, 사라진 것도 없습니다 — 페이지가 준비되면 이 단계를 마칠 수 있습니다.',
  },
}

function briefField(name: string): Bilingual {
  const brief = content.briefs.find((entry) => entry.slug === 'self-audit-report')!
  return brief.frontmatter[name] as Bilingual
}

/**
 * One Stage's Self-Audit Report surface (#24, #61), in its four states: no
 * subject authored yet, locked until this Stage's Gate Quizzes are passed, the
 * audit itself, and the reveal. Before submission this response carries the
 * brief, the embedded page and the Learner's own draft — never the manifest,
 * the defect count, or any element's status; the reveal exists only in the
 * submitted branch below.
 *
 * Every read here is scoped to this Stage. A Learner who submitted Stage 1 and
 * is now working on Stage 2 must see Stage 2's draft and Stage 2's manifest,
 * and a query that matched on the address alone would show them Stage 1's.
 */
export default async function Audit({ params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage: raw } = await params
  if (!isLanguage(lang)) notFound()
  const stage = Number(raw)
  // A Stage the curriculum does not declare is not a page. `stageProgress`
  // throws on one, so this has to come first.
  if (!Number.isInteger(stage) || !content.config.stages.some((entry) => entry.stage === stage)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const subject = practicePage(stage)
  if (!subject) {
    // Said, not shown as an empty frame. A Learner who reached a declared
    // Stage and found nothing would have no way to tell an unwritten page from
    // a broken one.
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 p-8 font-sans">
        <h1 className="text-2xl font-semibold tracking-tight">{briefField('title')[lang]}</h1>
        <p className="text-sm font-medium">{copy.noSubject}</p>
        <p className="text-zinc-600 dark:text-zinc-400">{copy.noSubjectWhy}</p>
        <Link href={`/${lang}/learn`} className="text-sm text-zinc-500 underline-offset-4 hover:underline">
          ← {copy.lockedBack}
        </Link>
      </main>
    )
  }

  const progress = stageProgress(await progressFor(session.email), stage)

  if (!progress.allPassed) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 p-8 font-sans">
        <h1 className="text-2xl font-semibold tracking-tight">{briefField('title')[lang]}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{briefField('intro')[lang]}</p>
        <p className="text-sm font-medium">{copy.locked}</p>
        <Link href={`/${lang}/learn`} className="text-sm text-zinc-500 underline-offset-4 hover:underline">
          ← {copy.lockedBack}
        </Link>
      </main>
    )
  }

  const [report] = await db
    .select()
    .from(schema.reports)
    .where(and(eq(schema.reports.email, session.email), eq(schema.reports.stage, stage)))
  const findings = report
    ? await db.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
    : []

  if (report?.submittedAt) {
    const foundElements = new Set(findings.map((finding) => finding.element))
    const save = attachIssueUrl.bind(null, lang, stage)

    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
        <h1 className="text-2xl font-semibold tracking-tight">{copy.revealHeading}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{copy.revealIntro}</p>

        <ul className="flex flex-col gap-3">
          {subject.defects.map((defect) => (
            <li key={defect.slug} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm">
                <span
                  className={
                    foundElements.has(defect.element)
                      ? 'font-medium text-green-700 dark:text-green-400'
                      : 'font-medium text-zinc-500'
                  }
                >
                  {foundElements.has(defect.element) ? copy.found : copy.missed}
                </span>
                {defect.step !== undefined && (
                  <span className="ml-2 text-xs text-zinc-500">
                    {copy.defectStep(defect.step, subject.steps.length)}
                  </span>
                )}
                <span className="ml-2 font-mono text-xs text-zinc-500">{defect.element}</span>
              </p>
              <p className="mt-2 text-sm">{defect.explanation[lang]}</p>
            </li>
          ))}
        </ul>

        <p>
          <a href={`/${lang}/audit/${stage}/page/source`} className="text-sm underline underline-offset-4">
            {copy.source}
          </a>
        </p>

        <section>
          <h2 className="text-sm font-medium text-zinc-500">{copy.yourFindings}</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {findings.map((finding) => (
              <li key={finding.id} className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <p className="font-mono text-xs">{finding.element}</p>
                <p className="mt-1">{finding.description}</p>
                <p className="mt-1 text-zinc-500">{finding.fix}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium">{copy.issueHeading}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{copy.issueExplanation}</p>
          <form
            action={async (data: FormData) => {
              'use server'
              await save(String(data.get('url') ?? ''))
            }}
            className="mt-2 flex gap-2"
          >
            <input
              type="url"
              name="url"
              defaultValue={report.issueUrl ?? ''}
              placeholder="https://…"
              className="w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-800"
            />
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
            >
              {copy.issueSave}
            </button>
          </form>
          {report.issueUrl && <p className="mt-1 text-xs text-zinc-500">{copy.issueSaved}</p>}
        </section>

        <p className="text-sm font-medium text-green-700 dark:text-green-400">{copy.complete(stage)}</p>
      </main>
    )
  }

  // The audit: brief above, the page beside its drawer. The page lives in an
  // iframe so the platform around it stays outside its bounds (#23).
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 font-sans">
      <details className="mx-auto w-full max-w-4xl rounded-lg border border-zinc-200 p-4 open:pb-4 dark:border-zinc-800" open>
        <summary className="cursor-pointer font-medium">{briefField('title')[lang]}</summary>
        <div className="mt-2 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>{briefField('intro')[lang]}</p>
          <p>{briefField('whatCounts')[lang]}</p>
          <p>{briefField('advice')[lang]}</p>
        </div>
      </details>
      <div className="relative flex min-h-[70vh] flex-1 flex-col gap-4 wide:flex-row">
        <iframe
          src={`/${lang}/audit/${stage}/page`}
          title={briefField('title')[lang]}
          className="min-h-[70vh] w-full flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800"
        />
        <FindingsDrawer
          lang={lang}
          stage={stage}
          glossary={content.glossary.map((entry) => ({ slug: entry.slug, name: entry.name[lang] }))}
          findings={findings.map((finding) => ({
            id: finding.id,
            element: finding.element,
            principle: finding.principle,
            description: finding.description,
            fix: finding.fix,
          }))}
          minFindings={content.config.minFindings}
        />
      </div>
    </main>
  )
}
