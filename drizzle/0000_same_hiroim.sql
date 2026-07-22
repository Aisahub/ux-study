CREATE TABLE "allowlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"pattern" text NOT NULL,
	"is_maintainer" boolean DEFAULT false NOT NULL,
	"added_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "allowlist_pattern_idx" ON "allowlist" USING btree ("pattern");