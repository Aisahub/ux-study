import { randomBytes } from 'node:crypto'

import { sql, type AnyColumn } from 'drizzle-orm'

/**
 * Public demo (portfolio). A visitor without an allowlist entry can try the
 * programme as a throwaway Learner: each visit gets its own address on a
 * reserved domain that no real account can have (RFC 2606 `.invalid`).
 *
 * Demo Learners are kept apart in both directions: they see only their own
 * Findings, and every Maintainer view and every colleague's board leaves them
 * out, so a visitor neither reads the team's work nor appears in its numbers.
 */
export const DEMO_DOMAIN = '@demo.invalid'

export function isDemoEmail(email: string): boolean {
  return email.toLowerCase().endsWith(DEMO_DOMAIN)
}

export function newDemoEmail(): string {
  return `visitor-${randomBytes(6).toString('hex')}${DEMO_DOMAIN}`
}

/** SQL condition: this email column belongs to a real Learner, not a demo visitor. */
export function realLearner(column: AnyColumn) {
  return sql`${column} not like ${'%' + DEMO_DOMAIN}`
}
