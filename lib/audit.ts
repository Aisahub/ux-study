import { briefOf, type Brief, type PracticePage } from '@/lib/content'
import { capstoneState, progressFor, stageProgress, type StageProgress } from '@/lib/progress'
import { content, practicePage } from '@/lib/server-content'

/**
 * Whether a Learner can get at a Stage's Self-Audit Report, and if not, which
 * of the three reasons it is.
 *
 * The reasons are ordered, and the order is the domain rule: a Stage with
 * nothing to audit says so before it says anything about quizzes, because
 * "come back when you have passed these" is the wrong sentence for a Stage
 * whose subject nobody has written yet (#61). Until now that order lived as
 * `if`/`return` inside one JSX file, and the write path re-implemented two of
 * the three in a different order of its own (#130).
 */
export type AuditStanding =
  /** Nothing authored to audit yet. The brief may exist, and its title is used if it does. */
  | { state: 'no-subject'; subject: null; brief: Brief | null }
  /** A Gate Quiz in this Stage is still outstanding — what the report waits on (#24). */
  | { state: 'locked'; subject: PracticePage; brief: Brief | null }
  /** Past the gate, with nothing telling the Learner what a complete report asks of them. */
  | { state: 'no-brief'; subject: PracticePage; brief: null }
  /** Everything the report needs is here. */
  | { state: 'open'; subject: PracticePage; brief: Brief }

/**
 * The order itself, over what has already been gathered.
 *
 * Separated from the reads so it can be asked directly: the gate order is the
 * part that carries the rule, and it was previously checkable only by fetching
 * a rendered page from a running server and matching an English sentence in it.
 */
export function auditStandingFrom(
  subject: PracticePage | null,
  brief: Brief | null,
  progress: StageProgress,
): AuditStanding {
  if (!subject) return { state: 'no-subject', subject: null, brief }
  if (capstoneState(progress) === 'locked') return { state: 'locked', subject, brief }
  if (!brief) return { state: 'no-brief', subject, brief: null }
  return { state: 'open', subject, brief }
}

/** Where this Learner stands with one Stage's Self-Audit Report. */
export async function auditStanding(email: string, stage: number): Promise<AuditStanding> {
  const progress = stageProgress(await progressFor(email), stage)
  return auditStandingFrom(practicePage(stage), briefOf(content, stage), progress)
}

/**
 * The subject a write may be made against, or the refusal to hand one over.
 *
 * A write needs the subject and the passed quizzes; it does not need the brief,
 * which is instructions for a person rather than a condition on a Finding. That
 * is the one place the write path and the surface legitimately differ, and
 * saying so here is what stops it from being re-derived as a second gate order.
 */
export async function subjectForWriting(
  email: string,
  stage: number,
): Promise<{ subject: PracticePage; error?: undefined } | { error: 'no-subject' | 'locked'; subject?: undefined }> {
  const standing = await auditStanding(email, stage)
  if (standing.state === 'no-subject') return { error: 'no-subject' }
  if (standing.state === 'locked') return { error: 'locked' }
  return { subject: standing.subject }
}
