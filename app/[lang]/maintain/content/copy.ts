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
  all: string
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
    // Capital D, like every other defined term this interface says out loud —
    // `Competency`, `Findings`, `Gate Quiz`, and `Quiz Item` on the line below.
    // It was lower-case here and in the heading until 2026-09-14, which put two
    // spellings of one CONTEXT.md term inside one card set.
    defectsPanel: 'Planted Defects',
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
    // `least found first`, not `most missed first`. One table counts one way
    // now, and it counts what was found: a row that read `missed by 5 of 5`
    // beside `0 found` and `0 found` asked its reader to hold two polarities
    // at once. The order is unchanged — fewest found first is most missed
    // first, since every row of a Stage divides by the same number.
    defectsHeading: 'Planted Defects, least found first',
    // Three sentences because this card absorbed a second one on 2026-09-14:
    // what the counts are drawn from, what makes the split between the cohorts
    // worth reading, and which address lands in which column. `counts as`, not
    // `is` — an address is not a cohort; it is what sorts a report into one.
    defectsExplanation:
      'Across submitted reports: how many found each defect. Both cohorts audit identical input, so the split between them is a controlled comparison. A Workspace address counts as the Korea cohort; a personal address as Indonesia.',
    // The column the two beside it add up to. `All`, not `Total`, because it
    // heads a count of people rather than a sum of the rows under it.
    all: 'All',
    korea: 'Korea',
    indonesia: 'Indonesia',
    submitted: (reports) => `${reports} submitted`,
    // `2 found`, where the Korean cell is a bare `2명`. The head above it ends
    // in `submitted`, so an English digit alone under it reads as a second
    // submission count; Korean puts `제출` first and the cell's `명` answers the
    // head's `명` rather than its verb, so it does not need the word. Parity is
    // equal legibility, not equal grammar — the same reason the Korean labels
    // carry `팀` where the English ones do not.
    finders: (found) => `${found} found`,
    noReportsHere: 'no reports yet',
    noReports: 'No submitted reports yet.',
  },
  // Comments inside this record carry no apostrophe and no 줄표, and that is a
  // constraint rather than a style: `koreanCopy()` in `test/competencies.test.ts`
  // reads every quoted run inside a `ko: { … }` block, so an apostrophe here
  // opens a literal that runs to the next quote and hands whatever sits between
  // to the banned-mark check as if it were Korean screen copy. It has broken
  // CI once already. Reword rather than punctuate.
  ko: {
    heading: '콘텐츠 상태',
    // `시도 기록`, one noun, the way every other screen says it. `시도와 보고서
    // 기록` left the reader deciding whether `기록` reached back over `시도`.
    explanation: '모든 수치는 페이지를 열 때 시도 기록과 제출된 보고서에서 계산하며, 따로 저장하지 않습니다.',
    itemsPanel: '문항',
    defectsPanel: '심어둔 결함',
    itemsHeading: '문항별 정답률',
    // Two subjects for one thing (`문항은 … 문항이`) made a Korean reader check
    // whether the second was a different item, and `보다` was comparing a noun
    // with a clause, which is the English `more likely A than B` showing
    // through. Who prepared badly is now said as well.
    itemsExplanation:
      '모두가 틀리는 문항이라면, 학습자들이 준비를 못 했다기보다 문항이 잘못 작성되었을 가능성이 훨씬 큽니다.',
    stage: (n) => `${n}단계`,
    // `문항 풀` + the subject marker renders as `문항 풀이`, which a Korean reader
    // meets first as `문항 풀이`, a worked solution, and has to back out of.
    notAuthored: '아직 문항 풀을 작성하지 않았습니다',
    noSubject: '아직 점검할 페이지가 작성되지 않았습니다',
    // `출제 5회 중` rather than `5회 출제 중`: `출제` is a verbal noun, so the `중`
    // behind it reads as "currently being set" before it reads as "out of".
    // The other Maintainer screen already closes the quantity first:
    // `퀴즈 5개 중 3개 통과`.
    rate: (correct, drawn) => `출제 ${drawn}회 중 정답 ${correct}회`,
    // `문항 5개`, not `5문항`: this repo counts the members of a list with the
    // noun closed first: `메모 3개`, `퀴즈 5개`, `저장된 발견 3개`. A modifier
    // clause with the numeral welded to the noun is headline compression, and
    // this is a row you press.
    neverDrawnPool: (items) => `아직 출제되지 않은 문항 ${items}개`,
    // `적게 발견된 순`, not `많이 놓친 순`. One table counts one way now, and it
    // counts 발견: a row reading `5명 중 5명이 놓침` beside `0명` and `0명` asked
    // its reader to hold two directions at once. The order did not move, since
    // every row of a Stage divides by the same number.
    defectsHeading: '심어둔 결함 · 적게 발견된 순',
    // Three sentences because this card absorbed a second one on 2026-09-14.
    // `…표시합니다`, the ending the explanatory lines here settled on. A 차이
    // cannot 비교가 되다 in Korean, and an address is not a team; it is what
    // sorts a report into one.
    defectsExplanation:
      '제출된 보고서를 기준으로, 각 결함을 몇 명이 발견했는지 표시합니다. 두 팀이 완전히 같은 페이지를 점검하므로 팀별 수치를 같은 조건에서 비교할 수 있습니다. Workspace 주소를 쓰면 한국팀, 개인 주소를 쓰면 인도네시아팀으로 집계합니다.',
    // The column the two beside it add up to.
    all: '전체',
    // The English column says `Korea`, and a bare `한국` beside a number would
    // read as the country rather than the people in it. `팀` is what makes the
    // Korean label name the same thing its English sibling names (CONTEXT.md).
    korea: '한국팀',
    indonesia: '인도네시아팀',
    // `제출 3명`, not `3명 제출`. Two reasons, both about the cell under it.
    // The empty state that takes this same slot is `아직 제출 없음`, which puts
    // `제출` first, so the pair flipped word order between two states of one box.
    // And the cell below reads `2명`: under `3명 제출` it looked like the tail
    // of that phrase, when it is a count of something else entirely.
    submitted: (reports) => `제출 ${reports}명`,
    finders: (found) => `${found}명`,
    noReportsHere: '아직 제출 없음',
    noReports: '제출된 보고서가 아직 없습니다.',
  },
}
