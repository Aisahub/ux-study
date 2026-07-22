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

  // The previous submitted draw, so the next one can refuse to repeat it (#22).
  const [previous] = await db
    .select({ drawn: schema.attempts.drawn })
    .from(schema.attempts)
    .where(and(eq(schema.attempts.email, session.email), eq(schema.attempts.competency, competency)))
    .orderBy(desc(schema.attempts.id))
    .limit(1)

  const pool = content.items[competency].map((item) => item.slug)
  const drawn = drawItems(pool, content.config.drawSize, previous?.drawn ?? null)

  const [attempt] = await db
    .insert(schema.attempts)
    .values({ email: session.email, competency, language: lang, drawn })
    .returning()
  redirect(`/${lang}/learn/${competency}/quiz/${attempt.id}`)
}

export async function submitAttempt(attemptId: number, choices: Record<string, number>): Promise<void> {
  const [attempt] = await db.select().from(schema.attempts).where(eq(schema.attempts.id, attemptId))
  if (!attempt) return
  const lang = attempt.language as Language
  const session = await requireSession(lang)
  // Not the owner: this attempt does not exist for them.
  if (attempt.email !== session.email) return
  // Already submitted: scoring twice cannot change a stored verdict.
  if (attempt.submittedAt) redirect(`/${lang}/learn/${attempt.competency}/quiz/${attempt.id}`)

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
