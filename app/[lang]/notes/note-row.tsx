import { SubmitButton } from '@/app/[lang]/pending'
import type { Language } from '@/lib/language'
import type { Note } from '@/lib/notes'

import { removeNote } from './actions'

const COPY: Record<
  Language,
  { remove: string; removing: string; removeNote: (opening: string) => string }
> = {
  en: {
    remove: 'Delete',
    removing: 'Deleting…',
    // The visible word is `Delete` on every row. The accessible name carries
    // the note's opening words, because a screen reader working down a lesson's
    // notes otherwise hears `Delete` six times with nothing to tell them apart.
    removeNote: (opening) => `Delete the note “${opening}”`,
  },
  ko: {
    remove: '삭제',
    removing: '삭제하는 중…',
    removeNote: (opening) => `메모 “${opening}” 삭제`,
  },
}

/** Enough of a note to tell it from the one above it, said out loud. */
function opening(body: string): string {
  const line = body.trim().replace(/\s+/g, ' ')
  return line.length > 40 ? `${line.slice(0, 40)}…` : line
}

/**
 * One saved note, as it reads on both surfaces that show one — the lesson it
 * was written against, and the notes page that collects them all. One
 * component rather than two matching ones: the row is the same object in both
 * places, and a platform that teaches Consistency should not have to remember
 * to change it twice.
 *
 * Sunk rather than a card of its own. A note lies inside the surface that
 * holds it; a second white card on a white card would say these are separate
 * objects lying on the page, which is what a Finding is and a note is not.
 *
 * Deleting takes one press and asks nothing first, matching the allowlist —
 * the one other list in this platform a person removes their own rows from.
 * A confirmation on every note would put a dialog between a Learner and the
 * tidying-up of their own jottings, several times a sitting.
 */
export function NoteRow({ lang, note }: { lang: Language; note: Note }) {
  const copy = COPY[lang]
  const remove = removeNote.bind(null, lang)

  return (
    <li className="rounded-badge bg-sunk p-[17px]">
      {/* `whitespace-pre-line` because a Learner's own line breaks are part of
          what they wrote — a note jotted as three lines is three lines. */}
      <p className="max-w-measure text-body whitespace-pre-line [overflow-wrap:anywhere]">
        {note.body}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3.5">
        <p className="text-body-sm text-ink-2">{note.createdAt.toISOString().slice(0, 10)}</p>
        {/* The 44px minimum goes on the control that answers the tap, not on
            the row around it. The negative inset keeps the target clear of the
            date without pushing the word past the row's right edge. */}
        <form action={remove} className="-my-2.5 -mr-2.5">
          <input type="hidden" name="id" value={note.id} />
          <SubmitButton
            aria-label={copy.removeNote(opening(note.body))}
            pendingLabel={copy.removing}
            className="flex min-h-11 items-center rounded-full px-2.5 text-label font-bold text-oxblood"
          >
            {copy.remove}
          </SubmitButton>
        </form>
      </div>
    </li>
  )
}
