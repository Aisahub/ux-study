-- A Self-Audit Report belongs to a Stage (#61).
--
-- Hand-edited from what `drizzle-kit generate` produced. The generated form was
-- `ADD COLUMN "stage" integer NOT NULL`, which is correct against an empty table
-- and fails against any table holding a row. The test branch is empty, so
-- nothing in the suite could have caught that; production is not empty.

-- Adopt every existing report into Stage 1 — the only Stage that has ever had
-- an authored subject to audit, so the only Stage they can have been written
-- against. Findings need no adopting: each one reaches its Stage through the
-- report it hangs off.
ALTER TABLE "reports" ADD COLUMN "stage" integer DEFAULT 1 NOT NULL;--> statement-breakpoint

-- The default existed only to carry those rows across. Left in place, an insert
-- that forgot to say which Stage it was for would land silently in Stage 1 —
-- the same class of mistake this column exists to make impossible.
ALTER TABLE "reports" ALTER COLUMN "stage" DROP DEFAULT;--> statement-breakpoint

-- One report per Learner becomes one report per Learner per Stage. Submission
-- stays final — that is what the uniqueness enforces — but finality is now per
-- Stage, so a submitted Stage 1 report no longer stands in the way of Stage 2's.
ALTER TABLE "reports" DROP CONSTRAINT "reports_email_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "reports_email_stage_idx" ON "reports" USING btree ("email","stage");
