import { and, desc, eq } from 'drizzle-orm'

import { db, schema } from '@/db'

/**
 * The read path of a Learner's own notes. There is no other one: every caller
 * here passes the session's own address, and nothing in the application asks
 * this table a question that is not filtered by it.
 */

export interface Note {
  id: number
  competency: string
  body: string
  createdAt: Date
}

/**
 * How long one note may be.
 *
 * A ceiling rather than a guideline, and a generous one: a note is a jotting,
 * and the number exists so that a single paste cannot put a megabyte of text
 * into a row that every render of two pages then reads back. The textarea
 * carries the same number as `maxLength`, so a Learner meets it as the field
 * declining to take more rather than as a refusal after they have written.
 */
export const NOTE_MAX_LENGTH = 2000

/**
 * This Learner's notes, newest first — all of them, or one Competency's.
 *
 * Ordered by the id as well as the timestamp. Two notes written in the same
 * second are perfectly ordinary here (a Learner reading with the page open
 * beside them), and on the timestamp alone Postgres is free to return those
 * two in either order — so the list would reshuffle itself between renders
 * with nothing having changed.
 */
export async function notesFor(email: string, competency?: string): Promise<Note[]> {
  return db
    .select({
      id: schema.notes.id,
      competency: schema.notes.competency,
      body: schema.notes.body,
      createdAt: schema.notes.createdAt,
    })
    .from(schema.notes)
    .where(
      competency === undefined
        ? eq(schema.notes.email, email)
        : and(eq(schema.notes.email, email), eq(schema.notes.competency, competency)),
    )
    .orderBy(desc(schema.notes.createdAt), desc(schema.notes.id))
}
