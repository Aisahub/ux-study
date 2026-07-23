import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Next.js keeps local secrets in .env.local, which dotenv does not read by
// default. Without this, `npm run db:migrate` sees no DATABASE_URL at all.
// On Vercel there is no such file and the call is a no-op, which is correct:
// the platform injects DATABASE_URL as a real environment variable.
config({ path: '.env.local', quiet: true })

// This config is also what runs on a production deploy. `package.json` carries
// a `vercel-build` script — Vercel prefers it over `build` — which runs
// `drizzle-kit migrate` before `next build`, so the schema can never be behind
// the code that expects it.
//
// It is deliberately NOT folded into `build`: `npm test` runs `next build`,
// and a plain `npm run build` is something you do while developing, neither of
// which should quietly migrate whichever database DATABASE_URL happens to
// name. Deploying is the one moment where migrating is always right.
//
// And it is guarded on VERCEL_ENV being `production`. Preview deployments get
// no DATABASE_URL at all, on purpose: their URLs are generated per deployment
// and cannot be registered as a Google redirect URI, so nobody can sign in to
// one and there is nothing behind the sign-in for a database to serve. Giving
// them a database would be one more place holding a live credential in
// exchange for nothing. Without the guard, that missing variable would fail
// the migrate step and take the whole preview build down with it.

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
