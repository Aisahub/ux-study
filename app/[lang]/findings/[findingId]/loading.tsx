/**
 * The pending shape of one Finding — same reason as the library's loading
 * state next door: force-dynamic pages that read Neon on every request must
 * acknowledge the click before the data lands. Shapes echo the page: the back
 * link, the element name, the author line, the three-part body.
 */
export default function Loading() {
  return (
    <main aria-busy className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8">
      <div className="h-5 w-24 animate-pulse rounded-card bg-surface" />
      <div className="h-7 w-64 max-w-full animate-pulse rounded-card bg-surface" />
      <div className="h-5 w-40 animate-pulse rounded-card bg-surface" />
      <div className="h-28 animate-pulse rounded-card bg-surface" />
    </main>
  )
}
