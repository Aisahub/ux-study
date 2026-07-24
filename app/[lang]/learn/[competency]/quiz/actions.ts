'use server'

import { and, desc, eq, isNull } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { drawItems, scoreDraw } from '@/lib/quiz'
import { content } from '@/lib/server-content'

/**
 * The write path of a Gate Quiz attempt (#21, #22): start draws and persists
 * the set, submit scores everything at once. Both re-check the session and
 * the attempt's owner — the browser's word is not taken for anything.
 */

export async function startAttempt(lang: Language, competency: string): Promise<void> {
  if (!isLanguage(lang) || !content.config.stage1Competencies.includes(competency)) return
  const session = await requireSession(lang)

  // An open attempt is resumed, not shadowed: its drawn set was persisted so
  // a refresh or a lost tab lands back on the same five items.
  const [open] = await db
    .select()
    .from(schema.attempts)
    .where(
      and(
        eq(schema.attempts.email, session.email),
        eq(schema.attempts.competency, competency),
        isNull(schema.attempts.submittedAt),
      ),
    )
  if (open) redirect(`/${lang}/learn/${competency}/quiz/${open.id}`)

  // This Learner's history on this Competency, newest first. It carries two
  // things the draw needs: the previous set, so the next one can refuse to
  // repeat it (#22), and every item ever answered correctly, so a retry does
  // not spend a slot re-asking something already shown.
  const history = await db
    .select({ drawn: schema.attempts.drawn, selections: schema.attempts.selections })
    .from(schema.attempts)
    .where(and(eq(schema.attempts.email, session.email), eq(schema.attempts.competency, competency)))
    .orderBy(desc(schema.attempts.id))

  const mastered = [
    ...new Set(
      history.flatMap((attempt) =>
        (attempt.selections ?? [])
          .filter((selection) => selection.correct)
          .map((selection) => selection.item),
      ),
    ),
  ]

  const pool = content.items[competency].map((item) => item.slug)
  const drawn = drawItems(pool, content.config.drawSize, history[0]?.drawn ?? null, mastered)

  const [attempt] = await db
    .insert(schema.attempts)
    .values({ email: session.email, competency, language: lang, drawn })
    .returning()
  redirect(`/${lang}/learn/${competency}/quiz/${attempt.id}`)
}

/**
 * Discard the open attempt on this Competency and draw a fresh one. An open
 * attempt holds no answers of its own beyond the draft below and has never
 * been scored, so nothing a Learner has earned is lost by throwing it away —
 * which is why "try again" is offered beside "carry on" rather than behind a
 * warning. Submitted attempts are untouchable: history is the whole point of
 * #22.
 */
export async function restartAttempt(lang: Language, competency: string): Promise<void> {
  if (!isLanguage(lang) || !content.config.stage1Competencies.includes(competency)) return
  const session = await requireSession(lang)

  await db
    .delete(schema.attempts)
    .where(
      and(
        eq(schema.attempts.email, session.email),
        eq(schema.attempts.competency, competency),
        isNull(schema.attempts.submittedAt),
      ),
    )
  await startAttempt(lang, competency)
}

/**
 * Keep the answers picked so far. Sent on every change and written whole, so
 * two clicks in quick succession cannot interleave into a half-updated map.
 * Nothing here is scored or acknowledged — the Learner is not told anything
 * they did not already know, and the key stays server-side (#22).
 */
export async function saveDraft(attemptId: number, choices: Record<string, number>): Promise<void> {
  const [attempt] = await db.select().from(schema.attempts).where(eq(schema.attempts.id, attemptId))
  if (!attempt) return
  const session = await requireSession(attempt.language as Language)
  if (attempt.email !== session.email) return
  // A submitted attempt is frozen; a late draft write must not reopen it.
  if (attempt.submittedAt) return

  await db.update(schema.attempts).set({ draft: choices }).where(eq(schema.attempts.id, attempt.id))
}

/**
 * `lang` is where the Learner is now, which since the switch was unlocked need
 * not be where they started — the verdict should appear in the language they
 * were reading, not the one they happened to open the attempt in.
 */
export async function submitAttempt(
  attemptId: number,
  lang: Language,
  choices: Record<string, number>,
): Promise<void> {
  const [attempt] = await db.select().from(schema.attempts).where(eq(schema.attempts.id, attemptId))
  if (!attempt) return
  if (!isLanguage(lang)) return
  const session = await requireSession(lang)
  // Not the owner: this attempt does not exist for them.
  if (attempt.email !== session.email) return
  // Already submitted: scoring twice cannot change a stored verdict.
  if (attempt.submittedAt) redirect(`/${lang}/learn/${attempt.competency}/quiz/${attempt.id}`)

  // Either language's pool gives the same answer: an item's keyed option sits
  // at the same index in both, which `loadItems` enforces. That invariant is
  // what makes a mid-attempt switch safe to score.
  const pool = content.items[attempt.competency]
  const keyedIndexBySlug = Object.fromEntries(
    pool.map((item) => [item.slug, item.options[lang].findIndex((option) => option.correct)]),
  )
  const { selections, score, passed } = scoreDraw(
    attempt.drawn,
    keyedIndexBySlug,
    choices,
    content.config.passThreshold,
  )

  await db
    .update(schema.attempts)
    .set({ selections, score, passed, submittedAt: new Date() })
    .where(eq(schema.attempts.id, attempt.id))

  // The verdict is the next thing the Learner sees — nothing and nobody in
  // between (ADR-0006).
  redirect(`/${lang}/learn/${attempt.competency}/quiz/${attempt.id}`)
}
