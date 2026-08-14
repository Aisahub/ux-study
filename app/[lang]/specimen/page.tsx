import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { reportFor } from '@/lib/progress'
import { content } from '@/lib/server-content'
import { specimenAsServed } from '@/lib/content'

export const dynamic = 'force-dynamic'

/**
 * The specimen Self-Audit Report, read (ADR-0011, artefact B, #120).
 *
 * A report this project wrote as if a Learner had written it, of deliberately
 * mixed quality, reviewing the Stage 1 Practice Page. It is what a Learner
 * practises reviewing on the way to heuristic evaluation, and it is here
 * rather than on that Competency's page because DESIGN.md's Two Panel Rule
 * makes two the ceiling: a third panel would turn a Competency into a cabinet
 * to hunt through, which is the defect Stage 1 teaches.
 *
 * Nothing here says which Finding is sound and which is not. `specimenAsServed`
 * drops the authoring labels before this page can render one, and the order is
 * the authored order rather than a ranking. What settles it for the reader is
 * the Planted Defect manifest they were shown when they submitted their own
 * Stage 1 report — which is the same fact that makes this page safe to serve at
 * all, and the reason it is gated on that submission.
 *
 * Reading it is optional, is recorded against nobody, and gates nothing.
 */

const COPY: Record<
  Language,
  {
    back: string
    heading: string
    what: string
    howToRead: string
    subject: string
    principle: string
    defect: string
    fix: string
    lockedHeading: string
    lockedWhy: string
    lockedAction: string
    unwrittenHeading: string
    unwrittenWhy: string
  }
> = {
  en: {
    back: 'Heuristic evaluation',
    heading: 'A report to practise on',
    what: 'We wrote this report ourselves, as if a Learner had written it about the Stage 1 Practice Page. It is not a colleague’s work and nobody is being judged by it — it exists so that you can practise reading a review, which is a different skill from writing one.',
    howToRead:
      'Read each Finding and ask what a third person could do with it: does it name an element, does the Principle it cites fit what it describes, and is there a defect there at all? Some of these hold up and some do not. You already know what was planted on this page, so you can check every claim against it.',
    subject: 'Open the page it reviews',
    principle: 'Principle',
    defect: 'What goes wrong',
    fix: 'Proposed fix',
    lockedHeading: 'This one waits for your own report',
    lockedWhy:
      'This report reviews the Stage 1 Practice Page, so it names what is wrong with a page you have not finished auditing yet — before you submit, it would be an answer key. It opens by itself the moment your Stage 1 report is in.',
    lockedAction: 'Go to the Stage 1 audit',
    unwrittenHeading: 'The report to practise on is still being written.',
    unwrittenWhy:
      'Nothing is broken and nothing is lost. Heuristic evaluation is complete without it — its Gate Quiz carries its own material, and this page is practice rather than a gate.',
  },
  ko: {
    back: '휴리스틱 평가',
    heading: '연습용 리포트',
    what: '이 리포트는 학습자가 쓴 것처럼 저희가 직접 써 둔 것으로, 1단계 연습 페이지를 점검한 내용입니다. 동료가 쓴 것이 아니고, 이걸로 평가받는 사람도 없습니다. 리포트를 읽어 내는 연습을 하라고 있는 것이며, 그것은 리포트를 쓰는 일과는 다른 능력입니다.',
    howToRead:
      '발견을 하나씩 읽으면서, 제3자가 이걸 받아서 무엇을 할 수 있을지 물어보세요. 어떤 요소를 짚었는지, 가져다 쓴 원칙이 설명한 내용과 맞는지, 애초에 거기 결함이 있기는 한지. 여기에는 말이 되는 것도 있고 아닌 것도 있습니다. 이 페이지에 무엇을 심어 두었는지는 이미 보셨으니, 주장 하나하나를 그것과 대조해 볼 수 있습니다.',
    subject: '점검 대상 페이지 열기',
    principle: '원칙',
    defect: '무엇이 잘못되는가',
    fix: '제안하는 수정',
    lockedHeading: '이 페이지는 내 리포트를 기다립니다',
    lockedWhy:
      '이 리포트는 1단계 연습 페이지를 점검한 것이라, 아직 점검을 마치지 않은 페이지의 무엇이 잘못되었는지를 말합니다. 제출 전에 읽으면 정답지가 됩니다. 1단계 리포트를 제출하는 순간 저절로 열립니다.',
    lockedAction: '1단계 자가 점검으로',
    unwrittenHeading: '연습용 리포트는 아직 작성 중입니다.',
    unwrittenWhy:
      '잘못된 것도, 사라진 것도 없습니다. 이것 없이도 휴리스틱 평가는 완결됩니다 — 퀴즈는 자체 자료를 갖고 있고, 이 페이지는 관문이 아니라 연습입니다.',
  },
}

/**
 * The shell every state of this page shares, so a Learner who arrives before
 * their Stage 1 report is in lands on the same page they will come back to
 * rather than on a different-looking dead end.
 */
function Frame({ lang, children }: { lang: Language; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <nav className="text-body-sm">
        <Link
          href={`/${lang}/learn/heuristic-evaluation`}
          className="text-ink-2 underline-offset-4 hover:underline"
        >
          ← {COPY[lang].back}
        </Link>
      </nav>
      {children}
    </main>
  )
}

export default async function Specimen({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const specimen = specimenAsServed(content)

  // Said in words rather than by a missing page. An unauthored artefact and a
  // broken one look identical from a 404, and this platform's own second Stage
  // is about the difference.
  if (!specimen) {
    return (
      <Frame lang={lang}>
        <h1 className="font-serif text-display font-bold text-ink">{copy.unwrittenHeading}</h1>
        <p className="text-body-sm text-ink-2">{copy.unwrittenWhy}</p>
      </Frame>
    )
  }

  // The gate is the subject's own Stage, not the Stage this artefact is read
  // at. The report names what is wrong with the Stage 1 page, so it is that
  // page's audit it would answer for — and ADR-0011 refuses to put the
  // heuristic-evaluation Gate Quiz behind the Stage 3 report, which is where
  // gating on Stage 3 would land it.
  const own = await reportFor(session.email, specimen.subject)
  if (!own?.submittedAt) {
    return (
      <Frame lang={lang}>
        <h1 className="font-serif text-display font-bold text-ink">{copy.lockedHeading}</h1>
        <p className="text-body-sm text-ink-2">{copy.lockedWhy}</p>
        <p className="text-body-sm">
          <Link href={`/${lang}/audit/${specimen.subject}`} className="font-bold underline underline-offset-4">
            {copy.lockedAction}
          </Link>
        </p>
      </Frame>
    )
  }

  return (
    <Frame lang={lang}>
      <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
      <p className="text-body-sm text-ink-2">{copy.what}</p>

      {/* Between the two paragraphs rather than after them, which is where it
          sat until the 375px screen was actually looked at: two paragraphs of
          orientation pushed it hard against the bottom bar, and an action a
          phone reader has to hunt for on a self-paced programme is how
          drop-out starts. The order it makes now is also the order the work
          happens in — what this is, the page it is about, then how to read it. */}
      <p className="text-body-sm">
        <a
          href={`/${lang}/audit/${specimen.subject}/page?read`}
          target="_blank"
          rel="noreferrer"
          className="font-bold underline underline-offset-4"
        >
          {copy.subject}
        </a>
      </p>

      <p className="text-body-sm text-ink-2">{copy.howToRead}</p>

      <ol className="flex flex-col gap-6">
        {specimen.findings.map((finding) => {
          const principle = content.glossary.find((entry) => entry.slug === finding.principle)
          return (
            <li key={finding.element} className="flex flex-col gap-3 text-body-sm">
              {/* The element as the audit surface, the reveal and the Findings
                  library all draw it: the identifier itself, in mono. A Finding
                  points at an element rather than describing one, and rewording
                  it here would make the same record read two ways. */}
              <h2 className="font-mono text-title">{finding.element}</h2>
              <p>
                <span className="text-ink-2">{copy.principle}: </span>
                {principle ? principle.name[lang] : finding.principle}
              </p>
              <p>
                <span className="text-ink-2">{copy.defect}: </span>
                {finding.defect[lang]}
              </p>
              <p>
                <span className="text-ink-2">{copy.fix}: </span>
                {finding.fix[lang]}
              </p>
            </li>
          )
        })}
      </ol>
    </Frame>
  )
}
