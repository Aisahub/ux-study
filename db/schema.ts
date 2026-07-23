import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

/**
 * Who is allowed in. A row holds either a full email address or the wildcard
 * `@aisahub.com`; a more specific entry wins over the wildcard, so an
 * individually-listed address carrying the maintainer flag is a Maintainer even
 * though the wildcard would already have admitted them as a Learner.
 *
 * See ADR-0004. Sign-in itself, and the seeded first Maintainer, arrive with it.
 */
export const allowlist = pgTable(
  'allowlist',
  {
    id: serial('id').primaryKey(),
    pattern: text('pattern').notNull(),
    isMaintainer: boolean('is_maintainer').notNull().default(false),
    addedBy: text('added_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('allowlist_pattern_idx').on(table.pattern)],
)

/**
 * One row per person who has ever signed in. Identity is the Google-verified
 * email address; there is no password and no registration (ADR-0004). The row
 * exists to carry what belongs to the person rather than to a session —
 * today that is only the language preference (#12: a signed-in Learner's
 * saved preference wins over the browser guess on a device with no cookie).
 */
export const users = pgTable('users', {
  email: text('email').primaryKey(),
  /** 'en' | 'ko'. Written at sign-in from the page the Learner signed in on. */
  language: text('language'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Database-backed sessions (#11). A session proves who the visitor is and
 * nothing more: what they may do is resolved against the allowlist on every
 * request, so removing an allowlist entry locks its person out immediately
 * (#13) instead of when their session happens to expire.
 */
export const sessions = pgTable(
  'sessions',
  {
    /** The cookie value: 256 random bits, hex-encoded. Unguessable, so it is the whole credential. */
    token: text('token').primaryKey(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [index('sessions_email_idx').on(table.email)],
)

/**
 * One Gate Quiz attempt (#21). The drawn set is persisted at the start — a
 * refresh mid-attempt must not redraw — and the selections, score and verdict
 * arrive together at the single submit. Storing the pairing of item and
 * selection, not just the score, is what lets a Maintainer tell a defective
 * item from an unprepared cohort (ADR-0006).
 */
export const attempts = pgTable(
  'attempts',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    competency: text('competency').notNull(),
    /**
     * The language the attempt was started in. It is no longer the language it
     * was necessarily finished in: switching mid-attempt is allowed (ADR-0008
     * amendment, 2026-07-23), so this records where a Learner began, not a
     * claim about every item they saw.
     */
    language: text('language').notNull(),
    /** The item slugs drawn for this attempt, in presentation order. */
    drawn: text('drawn').array().notNull(),
    /**
     * Answers as they are picked, before submission — item slug to the chosen
     * option's authored index. Persisted so a refresh, a closed tab or a
     * language switch does not throw away work already done. It carries no
     * correctness: the key stays on the server until scoring (#22).
     */
    draft: jsonb('draft').$type<Record<string, number>>(),
    /**
     * One entry per drawn item once submitted: the option index chosen and
     * whether it was the keyed answer at scoring time. Null while open.
     * Correctness is frozen here so re-scoring a stored attempt yields the
     * same verdict even after an item is reworded.
     */
    selections: jsonb('selections').$type<{ item: string; choice: number; correct: boolean }[]>(),
    score: integer('score'),
    passed: boolean('passed'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
  },
  (table) => [index('attempts_email_idx').on(table.email)],
)

/**
 * The Self-Audit Report (#24) — at most one per Learner, because submission
 * is final: once the manifest is revealed, a second attempt measures nothing.
 * The row exists from the first autosave; submittedAt is what separates a
 * draft from the submitted report.
 */
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  /** Optional link showing one Finding actually fixed; a screenshot URL is sufficient. Never affects Completion. */
  issueUrl: text('issue_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
})

/**
 * One Finding: two structured fields and two written ones (#24). The element
 * is an identifier pointed at on the page — which is what makes a Korean
 * Finding and an English Finding the same record (ADR-0008).
 */
export const findings = pgTable(
  'findings',
  {
    id: serial('id').primaryKey(),
    reportId: integer('report_id')
      .notNull()
      .references(() => reports.id, { onDelete: 'cascade' }),
    element: text('element').notNull(),
    principle: text('principle').notNull(),
    description: text('description').notNull(),
    fix: text('fix').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('findings_report_idx').on(table.reportId)],
)

/**
 * Agreement marks (#25): a Learner endorsing a colleague's Finding. Ranks
 * Findings, never Learners — nothing anywhere totals these per person.
 */
export const agreements = pgTable(
  'agreements',
  {
    id: serial('id').primaryKey(),
    findingId: integer('finding_id')
      .notNull()
      .references(() => findings.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('agreements_once_idx').on(table.findingId, table.email)],
)
