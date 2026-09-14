import type { Language } from '@/lib/language'

/**
 * Every word this route says, in one place, because it is read by three files
 * now: the frame that holds the heading and the panel switch, and each of the
 * two panels beneath it.
 */
export type Copy = {
  heading: string
  explanation: string
  itemsPanel: string
  defectsPanel: string
  itemsHeading: string
  itemsExplanation: string
  stage: (n: number) => string
  notAuthored: string
  noSubject: string
  rate: (correct: number, drawn: number) => string
  neverDrawnPool: (items: number) => string
  defectsHeading: string
  defectsExplanation: string
  missedBy: (missed: number, of: number) => string
  locationsHeading: string
  locationsExplanation: string
  korea: string
  indonesia: string
  submitted: (reports: number) => string
  finders: (found: number) => string
  noReportsHere: string
  noReports: string
}

export const COPY: Record<Language, Copy> = {
  en: {
    heading: 'Content health',
    // What is true of every figure on either panel, and nothing else. The
    // sentence about badly-worded items stood here until 2026-09-14, when the
    // page became two panels and that half stopped being true of both.
    explanation:
      'Every figure is computed from attempts and reports as this page loads — nothing is stored separately.',
    itemsPanel: 'Quiz Items',
    defectsPanel: 'Planted defects',
    itemsHeading: 'Quiz Item pass rates',
    // The cohort size is deliberately not a number here. It said "four
    // badly-prepared Learners" until 2026-07-31, which the Maintainer reading
    // this page can falsify from the allowlist one mark away.
    itemsExplanation:
      'An item everyone fails is far more likely a badly-worded item than a cohort who all prepared badly.',
    stage: (n) => `Stage ${n}`,
    notAuthored: 'No pool authored yet',
    noSubject: 'no page authored to audit yet',
    rate: (correct, drawn) => `${correct} correct of ${drawn} drawn`,
    neverDrawnPool: (items) => `${items} item${items === 1 ? '' : 's'} never drawn`,
    defectsHeading: 'Planted defects, most missed first',
    defectsExplanation: 'Across submitted reports: how many missed each defect.',
    missedBy: (missed, of) => `missed by ${missed} of ${of}`,
    locationsHeading: 'The two locations, same page',
    locationsExplanation:
      'Both cohorts audit identical input, so what each found is a controlled comparison. Workspace addresses are the Korea cohort; personal addresses are Indonesia.',
    korea: 'Korea',
    indonesia: 'Indonesia',
    submitted: (reports) => `${reports} submitted`,
    finders: (found) => `${found}`,
    noReportsHere: 'no reports yet',
    noReports: 'No submitted reports yet.',
  },
  ko: {
    heading: '콘텐츠 상태',
    explanation: '모든 수치는 페이지를 열 때 시도와 보고서 기록에서 계산되며, 별도로 저장되지 않습니다.',
    itemsPanel: '문항',
    defectsPanel: '심어둔 결함',
    itemsHeading: '문항별 정답률',
    itemsExplanation: '모두가 틀리는 문항은 준비 부족보다 문항이 잘못 작성되었을 가능성이 훨씬 큽니다.',
    stage: (n) => `${n}단계`,
    notAuthored: '아직 작성된 문항 풀이 없습니다',
    noSubject: '아직 점검할 페이지가 작성되지 않았습니다',
    rate: (correct, drawn) => `${drawn}회 출제 중 ${correct}회 정답`,
    neverDrawnPool: (items) => `아직 출제되지 않은 ${items}문항`,
    defectsHeading: '심어둔 결함 · 많이 놓친 순',
    defectsExplanation: '제출된 보고서 기준: 각 결함을 몇 명이 놓쳤는지입니다.',
    missedBy: (missed, of) => `${of}명 중 ${missed}명이 놓침`,
    locationsHeading: '같은 페이지 · 팀별 결함 발견 비교',
    locationsExplanation:
      '두 팀이 완전히 같은 페이지를 점검하므로, 발견의 차이는 통제된 비교가 됩니다. Workspace 주소는 한국팀, 개인 주소는 인도네시아팀입니다.',
    // The English column says `Korea`, and a bare `한국` beside a number would
    // read as the country rather than the people in it. `팀` is what makes the
    // Korean label name the same thing its English sibling names (CONTEXT.md).
    korea: '한국팀',
    indonesia: '인도네시아팀',
    submitted: (reports) => `${reports}명 제출`,
    finders: (found) => `${found}명`,
    noReportsHere: '아직 제출 없음',
    noReports: '제출된 보고서가 아직 없습니다.',
  },
}
