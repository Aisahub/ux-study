/**
 * What a reader sees between asking for the library and the library arriving.
 * The findings pages are force-dynamic and read Neon on every request, so
 * without this the click that opens them is acknowledged by nothing at all —
 * the defect Stage 2 teaches as Visibility of system status. Shapes echo the
 * page: a heading, the explanation, a shelf title, three cards.
 */
export default function Loading() {
  return (
    <main aria-busy className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8">
      <div className="h-12 w-72 max-w-full animate-pulse rounded-card bg-surface" />
      <div className="h-16 animate-pulse rounded-card bg-surface" />
      <div className="flex flex-col gap-2">
        <div className="h-6 w-56 max-w-full animate-pulse rounded-card bg-surface" />
        <div className="h-[72px] animate-pulse rounded-card bg-surface shadow-card" />
        <div className="h-[72px] animate-pulse rounded-card bg-surface shadow-card" />
        <div className="h-[72px] animate-pulse rounded-card bg-surface shadow-card" />
      </div>
    </main>
  )
}
