import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'

import { asc, eq } from 'drizzle-orm'

import { SubmitButton } from '@/app/[lang]/pending'
import { db, schema } from '@/db'
import { requireMaintainer } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    explanation: string
    entriesHeading: string
    addHeading: string
    pattern: string
    maintainer: string
    addedBy: string
    addedOn: string
    add: string
    adding: string
    remove: string
    removing: string
    removeEntry: (pattern: string) => string
    addPlaceholder: string
    nobodyYet: string
  }
> = {
  en: {
    heading: 'Allowlist',
    explanation:
      'Who can sign in. A full address admits that person; the @aisahub.com wildcard admits every Workspace account. Removing an entry locks its person out immediately.',
    entriesHeading: 'Current entries',
    addHeading: 'Add an entry',
    pattern: 'Address or wildcard',
    maintainer: 'Maintainer',
    addedBy: 'added by',
    addedOn: 'on',
    add: 'Add',
    adding: 'Adding…',
    remove: 'Remove',
    removing: 'Removing…',
    // The visible word is `Remove` on every row; the accessible name says
    // which entry, because a screen reader reading the list out hears the
    // same word a dozen times otherwise.
    removeEntry: (pattern) => `Remove ${pattern}`,
    addPlaceholder: 'colleague@example.com',
    nobodyYet: 'No entries yet. Nobody can sign in until one is added.',
  },
  ko: {
    heading: '허용 목록',
    explanation:
      '누가 로그인할 수 있는지의 목록입니다. 전체 주소는 그 사람을, @aisahub.com 와일드카드는 모든 Workspace 계정을 들여보냅니다. 항목을 삭제하면 그 즉시 접근이 막힙니다.',
    entriesHeading: '현재 항목',
    addHeading: '항목 추가',
    pattern: '주소 또는 와일드카드',
    maintainer: '운영자',
    addedBy: '추가한 사람',
    addedOn: '일시',
    add: '추가',
    adding: '추가하는 중…',
    remove: '삭제',
    removing: '삭제하는 중…',
    removeEntry: (pattern) => `${pattern} 삭제`,
    addPlaceholder: 'colleague@example.com',
    nobodyYet: '아직 항목이 없습니다. 하나라도 추가되기 전에는 아무도 로그인할 수 없습니다.',
  },
}

/**
 * A Maintainer onboards a colleague by adding their address, and offboards by
 * removing it — neither needing engineering (#13). Sessions only prove
 * identity, so a removal takes effect on the removed person's very next
 * request. Reachable only with the Maintainer flag; for anyone else the
 * route is a 404, indistinguishable from not existing.
 *
 * Two cards: what the list currently is, and the one way to add to it. The
 * page carried neither until 2026-07-31, when it was still scaffold-era zinc
 * with a border on every row — a stroke this design system does not have, on
 * a platform whose own rule is that an unclear edge is answered with depth.
 */
export default async function Allowlist({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  await requireMaintainer(lang)
  const copy = COPY[lang]

  const entries = await db.select().from(schema.allowlist).orderBy(asc(schema.allowlist.id))

  async function add(data: FormData) {
    'use server'
    const maintainer = await requireMaintainer(lang as Language)
    const pattern = String(data.get('pattern') ?? '')
      .trim()
      .toLowerCase()
    // A full address or a domain wildcard — anything else can never match a
    // Google-verified email and would sit in the list doing nothing.
    if (!/^(@|[^@\s]+@)[^@\s]+\.[^@\s]+$/.test(pattern)) return
    await db
      .insert(schema.allowlist)
      .values({ pattern, isMaintainer: data.get('maintainer') === 'on', addedBy: maintainer.email })
      .onConflictDoNothing()
    revalidatePath(`/${lang}/maintain/allowlist`)
  }

  async function remove(data: FormData) {
    'use server'
    await requireMaintainer(lang as Language)
    const id = Number.parseInt(String(data.get('id') ?? ''), 10)
    if (!Number.isInteger(id)) return
    await db.delete(schema.allowlist).where(eq(schema.allowlist.id, id))
    revalidatePath(`/${lang}/maintain/allowlist`)
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="px-1.5 pb-[26px]">
        <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
        <p className="mt-3 max-w-measure text-body text-ink">{copy.explanation}</p>
      </header>

      <div className="flex flex-col gap-[14px]">
        <section aria-labelledby="entries" className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 id="entries" className="font-serif text-headline font-bold text-ink">
            {copy.entriesHeading}
          </h2>

          {entries.length === 0 ? (
            <p className="mt-[14px] text-body-sm text-ink-2">{copy.nobodyYet}</p>
          ) : (
            <ul className="mt-[22px] flex flex-col gap-[22px]">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="grid gap-x-[14px] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
                >
                  <span className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="min-w-0 text-title font-bold text-ink [overflow-wrap:anywhere]">
                      {entry.pattern}
                    </span>
                    {entry.isMaintainer && (
                      // The one inset chip surface this system has, so the
                      // badge reads as sunk into the card rather than as a
                      // second card lying on it.
                      <span className="rounded-full bg-sunk px-2.5 py-1 text-label font-bold text-ink">
                        {copy.maintainer}
                      </span>
                    )}
                  </span>

                  {/* The 44px minimum goes on the control that answers the tap,
                      not on the row around it — the Perceived clickability
                      defect this platform's fourth Competency teaches. The
                      negative inset keeps the target off the text without
                      pushing the word out of the row's right edge. */}
                  <form action={remove} className="-my-2.5 sm:-mr-2.5">
                    <input type="hidden" name="id" value={entry.id} />
                    <SubmitButton
                      aria-label={copy.removeEntry(entry.pattern)}
                      pendingLabel={copy.removing}
                      className="flex min-h-11 items-center rounded-full px-2.5 text-label font-bold text-oxblood"
                    >
                      {copy.remove}
                    </SubmitButton>
                  </form>

                  <p className="col-start-1 mt-1 text-body-sm text-ink-2">
                    {copy.addedBy} {entry.addedBy ?? '—'} · {copy.addedOn}{' '}
                    {entry.createdAt.toISOString().slice(0, 10)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="add" className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 id="add" className="font-serif text-headline font-bold text-ink">
            {copy.addHeading}
          </h2>

          {/* A persistent label rather than a placeholder standing in for one:
              the placeholder is an example of the format, and it disappears
              exactly when someone is typing and might want the rule. */}
          <form action={add} className="mt-[22px] flex flex-wrap items-end gap-x-[14px] gap-y-[14px]">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="pattern" className="text-label font-bold text-ink">
                {copy.pattern}
              </label>
              <input
                id="pattern"
                type="text"
                name="pattern"
                required
                autoComplete="off"
                spellCheck={false}
                placeholder={copy.addPlaceholder}
                className="min-h-11 min-w-0 rounded-full bg-sunk px-[17px] text-body text-ink placeholder:text-ink-2"
              />
            </div>

            <label className="flex min-h-11 items-center gap-2.5 text-body text-ink">
              <input type="checkbox" name="maintainer" className="size-[18px] accent-oxblood" />
              {copy.maintainer}
            </label>

            <SubmitButton
              pendingLabel={copy.adding}
              className="min-h-11 rounded-full bg-oxblood px-[26px] py-[15px] text-label font-bold text-white"
            >
              {copy.add}
            </SubmitButton>
          </form>
        </section>
      </div>
    </main>
  )
}
