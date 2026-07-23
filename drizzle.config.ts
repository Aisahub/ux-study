import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Next.js keeps local secrets in .env.local, which dotenv does not read by
// default. Without this, `npm run db:migrate` sees no DATABASE_URL at all.
// On Vercel there is no such file and the call is a no-op, which is correct:
// the platform injects DATABASE_URL as a real environment variable.
config({ path: '.env.local', quiet: true })

// This config is also what runs on every deploy. `package.json` carries a
// `vercel-build` script — Vercel prefers it over `build` — which runs
// `drizzle-kit migrate` before `next build`, so the schema can never be
// behind the code that expects it.
//
// It is deliberately NOT folded into `build`: `npm test` runs `next build`,
// and a plain `npm run build` is something you do while developing, neither
// of which should quietly migrate whichever database DATABASE_URL happens to
// name. Deploying is the one moment where migrating is always right.

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
