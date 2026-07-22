-- An empty allowlist can never admit anyone, so the first two rows arrive by
-- migration rather than by hand (#11): the @aisahub.com wildcard admits the
-- Korea cohort as Learners, and Chloe is the seeded first Maintainer. ON
-- CONFLICT keeps the migration re-runnable against a branch where a Maintainer
-- has since edited these rows — their edits win.
INSERT INTO "allowlist" ("pattern", "is_maintainer", "added_by")
VALUES
  ('@aisahub.com', false, 'seed migration'),
  ('chloe@aisahub.com', true, 'seed migration')
ON CONFLICT ("pattern") DO NOTHING;
