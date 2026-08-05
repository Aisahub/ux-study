import { randomBytes } from 'node:crypto'

import { eq, inArray } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { db, schema } from '@/db'
import type { Language } from '@/lib/language'

/**
 * Who a visitor is, and what they may do (#11).
 *
 * The split matters: a session proves identity and nothing else, while
 * capability is resolved against the allowlist on every request. That makes a
 * session cheap to trust and an allowlist removal immediate (#13) — there is
 * no cached role to wait out.
 */

export const SESSION_COOKIE = 'session'

/** Thirty days — long enough that a weekly visitor is never re-asked, short enough that a lost laptop ages out. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export interface Access {
  allowed: boolean
  isMaintainer: boolean
}

export interface Session {
  email: string
  isMaintainer: boolean
}

export type AllowlistEntry = typeof schema.allowlist.$inferSelect

/**
 * The one allowlist row an address is admitted by, or null if none is. A row
 * is either the full address or a domain wildcard, and the specific row wins:
 * an individually-listed @aisahub.com address carrying the Maintainer flag is
 * a Maintainer even though the wildcard would already have admitted them as a
 * Learner.
 *
 * Which row it is, and not merely that there is one, is what the allowlist
 * interface needs to know before it offers to delete a row (#98): the row that
 * admits the person holding the page is the row that would lock them out.
 */
export async function resolveEntry(email: string): Promise<AllowlistEntry | null> {
  const address = email.toLowerCase()
  const domain = address.slice(address.indexOf('@'))
  const rows = await db
    .select()
    .from(schema.allowlist)
    .where(inArray(schema.allowlist.pattern, [address, domain]))

  return rows.find((row) => row.pattern === address) ?? rows.find((row) => row.pattern === domain) ?? null
}

/** What the allowlist says about an address, which is what its admitting row says. */
export async function resolveAccess(email: string): Promise<Access> {
  const entry = await resolveEntry(email)
  if (!entry) return { allowed: false, isMaintainer: false }
  return { allowed: true, isMaintainer: entry.isMaintainer }
}

/** Opens a session for an address that has already been verified by Google and admitted by the allowlist. */
export async function createSession(email: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
  await db.insert(schema.sessions).values({ token, email: email.toLowerCase(), expiresAt })
  return { token, expiresAt }
}

/**
 * The signed-in visitor, or null. Capability comes from the allowlist at this
 * moment, not from anything stored when the session was opened — so a session
 * whose address has since been removed from the allowlist answers null, and
 * its person is locked out immediately.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  const [row] = await db.select().from(schema.sessions).where(eq(schema.sessions.token, token))
  if (!row || row.expiresAt.getTime() < Date.now()) return null

  const access = await resolveAccess(row.email)
  if (!access.allowed) return null
  return { email: row.email, isMaintainer: access.isMaintainer }
}

/** Gate for Learner surfaces: answers the session or sends the visitor to sign in. */
export async function requireSession(lang: Language): Promise<Session> {
  const session = await getSession()
  if (!session) redirect(`/${lang}/signin`)
  return session
}

/**
 * Gate for Maintainer surfaces. A Learner without the flag gets the same 404
 * as a route that does not exist: revealing "this exists but not for you"
 * would advertise where the Maintainer surfaces live.
 */
export async function requireMaintainer(lang: Language): Promise<Session> {
  const session = await requireSession(lang)
  if (!session.isMaintainer) notFound()
  return session
}
