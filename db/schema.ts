import { boolean, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

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
