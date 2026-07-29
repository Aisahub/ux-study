import type { Language } from '@/lib/language'

const COPY: Record<Language, string> = {
  en: 'Sign out',
  ko: '로그아웃',
}

/**
 * Ending the session, drawn as one of the rail's marks.
 *
 * A form and not a link, and this is the whole reason the control is shaped
 * this way: a link is something the browser will follow on its own, so an
 * `img` tag on any page — ours or anyone's — could end a Learner's session
 * without their touching it. The route refuses `GET` for the same reason; this
 * is the other half of that decision, kept next to it.
 *
 * It carries no visible label. On the rail that matches the marks above it,
 * which put their words in `aria-label` alone; in the top bar it sits beside
 * the language switcher, which is the only other control there that is a
 * picture rather than a word. The name is on the button either way, so a
 * screen reader and a hover both get it.
 *
 * The caller positions it. Two placements exist — the foot of the rail from
 * `sm` up, the top bar below it — and each hides itself at the other's width,
 * so exactly one is ever in the page.
 */
export function SignOut({ lang, className = '' }: { lang: Language; className?: string }) {
  return (
    <form action={`/api/auth/signout?lang=${lang}`} method="POST" className={className}>
      <button
        type="submit"
        title={COPY[lang]}
        aria-label={COPY[lang]}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-ink-2 shadow-pill"
      >
        {/* The rail's grammar: 24px box, 1.7 stroke, round caps, no fill. A
            doorway on the right and an arrow leaving through it — the arrow
            stops short of the frame so the two read as separate strokes at
            19px rather than merging into one shape. */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-[19px] fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
        >
          <path d="M14 4h4a1.6 1.6 0 011.6 1.6v12.8A1.6 1.6 0 0118 20h-4M4 12h7.5M8.5 8.5L12 12l-3.5 3.5" />
        </svg>
      </button>
    </form>
  )
}
