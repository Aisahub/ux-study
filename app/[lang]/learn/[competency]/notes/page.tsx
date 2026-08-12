import Link from 'next/link'
import { notFound } from 'next/navigation'

import { addNote } from '@/app/[lang]/notes/actions'
import { NoteRow } from '@/app/[lang]/notes/note-row'
import { SubmitButton } from '@/app/[lang]/pending'
import { isLanguage, type Language } from '@/lib/language'
import { NOTE_MAX_LENGTH, notesFor } from '@/lib/notes'

import { CompetencyShell, loadCompetency } from '../shell'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    explanation: string
    label: string
    placeholder: string
    add: string
    adding: string
    empty: string
    saved: (n: number) => string
    all: string
  }
> = {
  en: {
    heading: 'Your notes',
    explanation:
      'Whatever you want to keep from this Competency — a line the article turned over, a screen in your own product it applies to, the sentence you would say in a review. Yours alone: no colleague and no Maintainer reads these, and nothing here is counted toward anything.',
    label: 'A new note',
    placeholder: 'What did you take from this?',
    add: 'Add note',
    adding: 'Adding…',
    empty: 'No notes on this Competency yet.',
    saved: (n) => (n === 1 ? '1 note' : `${n} notes`),
    all: 'All notes',
  },
  ko: {
    heading: '내 메모',
    explanation:
      '이 역량에서 남겨 두고 싶은 것을 적으세요 — 기사에서 건진 한 줄, 그 말이 그대로 들어맞는 우리 제품의 화면, 리뷰에서 꺼낼 문장. 나만 봅니다: 동료도 운영자도 읽지 않고, 어디에도 반영되지 않습니다.',
    label: '새 메모',
    placeholder: '무엇을 건졌나요?',
    add: '메모 추가',
    adding: '추가하는 중…',
    empty: '이 역량에는 아직 메모가 없습니다.',
    saved: (n) => `메모 ${n}개`,
    all: '전체 메모 보기',
  },
}

/**
 * The Learner's own half of one Competency: write a note, read the ones
 * already written here.
 *
 * Its own address rather than a tab this page toggles in state — see
 * `shell.tsx` for why the switch had to survive a language change, a refresh
 * and a bookmark.
 *
 * The composer is above the notes rather than below them. A new note lands at
 * the top of the list, so writing one and seeing it arrive happen in the same
 * place — with the composer at the foot, the Learner's own note would appear
 * off the top of a Competency's worth of them.
 *
 * `Add note` is an oxblood pill at the `label` step, which is the treatment
 * the allowlist's own `Add` already gives a form's submit. It is the only
 * action on this panel, so nothing here competes with it — which is the reason
 * this panel can carry a filled control at all while the other one spends its
 * on the Gate Quiz.
 */
export default async function CompetencyNotes({
  params,
}: {
  params: Promise<{ lang: string; competency: string }>
}) {
  const { lang, competency: slug } = await params
  if (!isLanguage(lang)) notFound()
  const { session, competency, quiz, station } = await loadCompetency(lang, slug)
  const copy = COPY[lang]

  // This Learner's own notes on this Competency and nobody else's.
  const notes = await notesFor(session.email, slug)
  const add = addNote.bind(null, lang, slug)

  return (
    <CompetencyShell
      lang={lang}
      slug={slug}
      name={competency.name}
      quiz={quiz}
      station={station}
      active="notes"
      noteCount={notes.length}
    >
      <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
        {/* No numeral. The four numbered steps are the four that happen in
            order, and they are all on the other panel; a `05` here would say
            this comes after the Gate Quiz, which is not true of a note. */}
        <h2 className="font-serif text-headline font-bold text-ink">{copy.heading}</h2>
        <p className="mt-2.5 max-w-measure text-body-sm text-ink-2">{copy.explanation}</p>

        {/* A persistent label rather than a placeholder standing in for one:
            the placeholder is the prompt, and it disappears exactly when
            someone has started typing and might still want it. */}
        <form action={add} className="mt-5.5">
          <label htmlFor="note-body" className="text-label font-bold text-ink">
            {copy.label}
          </label>
          <textarea
            id="note-body"
            name="body"
            required
            rows={3}
            maxLength={NOTE_MAX_LENGTH}
            placeholder={copy.placeholder}
            className="mt-2 block w-full resize-y rounded-badge bg-sunk p-[17px] text-body text-ink placeholder:text-ink-2"
          />
          <SubmitButton
            pendingLabel={copy.adding}
            className="mt-3.5 min-h-11 rounded-full bg-oxblood px-[26px] py-[15px] text-label font-bold text-white"
          >
            {copy.add}
          </SubmitButton>
        </form>

        <div className="mt-[26px] border-t border-khaki/40 pt-[22px]">
          {notes.length === 0 ? (
            <p className="text-body-sm text-ink-2">{copy.empty}</p>
          ) : (
            <>
              <h3 className="text-label font-bold text-ink-2">{copy.saved(notes.length)}</h3>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {notes.map((note) => (
                  <NoteRow key={note.id} lang={lang} note={note} />
                ))}
              </ul>
            </>
          )}

          <Link
            href={`/${lang}/notes`}
            className="mt-4.5 inline-flex min-h-11 items-center text-label font-bold text-oxblood"
          >
            {copy.all}
            <span aria-hidden> →</span>
          </Link>
        </div>
      </section>
    </CompetencyShell>
  )
}
