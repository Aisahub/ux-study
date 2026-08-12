CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"competency" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "notes_email_competency_idx" ON "notes" USING btree ("email","competency");