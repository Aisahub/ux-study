'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { NOTE_MAX_LENGTH } from '@/lib/notes'
import { content } from '@/lib/server-content'

/**
 * The write path of a Learner's notes: add one, remove one. There is no edit —
 * a jotting is re-written by writing the next one.
 *
 * Both actions are reached as a plain `<form action>`, from the lesson page and
 * from the notes page, so both take their surface's language and their own
 * `FormData` and are bound to the rest by the caller.
 *
 * Neither reports a refusal. Every case they refuse is one the field itself
 * already prevents — `required` for an empty note, `maxLength` for an over-long
 * one, and a Competency slug that is not in the URL of a page that exists — so
 * a request that reaches the refusal did not come from the interface, and has
 * nobody in front of it to tell.
 */

export async function addNote(lang: Language, competency: string, data: FormData): Promise<void> {
  if (!isLanguage(lang)) return
  const session = await requireSession(lang)
  // A slug config.md does not declare is not a lesson, whether it arrived from
  // a URL or from a content file that has since been edited.
  if (!content.competencies.some((entry) => entry.slug === competency)) return

  const body = String(data.get('body') ?? '').trim()
  if (body === '' || body.length > NOTE_MAX_LENGTH) return

  await db.insert(schema.notes).values({ email: session.email, competency, body })
  refresh(lang, competency)
}

export async function removeNote(lang: Language, data: FormData): Promise<void> {
  if (!isLanguage(lang)) return
  const session = await requireSession(lang)
  const id = Number.parseInt(String(data.get('id') ?? ''), 10)
  if (!Number.isInteger(id)) return

  // The address is part of the statement rather than a check before it: a note
  // id belonging to a colleague matches no row here, so there is no window
  // between reading the row and acting on it, and no path that deletes
  // somebody else's writing.
  const [removed] = await db
    .delete(schema.notes)
    .where(and(eq(schema.notes.id, id), eq(schema.notes.email, session.email)))
    .returning({ competency: schema.notes.competency })
  if (!removed) return

  refresh(lang, removed.competency)
}

/**
 * The three surfaces a written or deleted note changes: the Competency's notes
 * panel, the Competency page beside it — whose panel switch carries the count —
 * and the notebook that collects every Competency's.
 *
 * All three named in one place, because they are easy to add a fourth to and
 * easy to forget: the count on the switch went stale for exactly as long as
 * this list omitted the page that draws it.
 */
function refresh(lang: Language, competency: string): void {
  revalidatePath(`/${lang}/learn/${competency}/notes`)
  revalidatePath(`/${lang}/learn/${competency}`)
  revalidatePath(`/${lang}/notes`)
}
