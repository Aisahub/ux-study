import { boolean, index, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

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
