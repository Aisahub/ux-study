import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Next.js keeps local secrets in .env.local, which dotenv does not read by
// default. Without this, `npm run db:migrate` sees no DATABASE_URL at all.
config({ path: '.env.local', quiet: true })

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
