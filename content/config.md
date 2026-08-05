---
# The fixed quantities from the spec — deliberate defaults, chosen as the
# cheapest values that still do their job. They are content configuration:
# changing one is an edit here, not a code change.
poolSize: 8
drawSize: 5
passThreshold: 4
minFindings: 3
# The curriculum (ADR-0001): twelve Competencies across three Stages, ordered
# by how hard the defect is to detect. Competency definitions under
# content/competencies/ and item pools under content/items/ must belong to a
# slug declared here, and every Planted Defect must cite one.
#
# Declaring a Stage is not authoring it. A slug listed here may have no
# definition file and no item pool yet, and both are tolerated — the same
# tolerance an unauthored Stage 1 pool already had. As of 2026-08-05 all twelve
# are defined and Stage 3's four are the ones still without an item pool; the
# sentence that stood here named Stage 2 as unwritten, which it stopped being
# on 2026-08-03. Each Stage's list is in display order.
#
# Stage 3 carries the four Competencies ADR-0001's amendment enumerates.
# Accessibility is not a fifth (settled 2026-08-03). The amendment reworked the
# Decision section's three-item sketch and gave Stage 3 a structure a fifth
# entry would break: two defect types invisible from inside the author's own
# head, plus the two routes out of it. WCAG 2.2 AA remains a hard line on the
# platform itself (PRODUCT.md), which is a different thing from a Competency.
stages:
  - stage: 1
    competencies:
      - visual-hierarchy
      - readability
      - consistency
      - perceived-clickability
  - stage: 2
    competencies:
      - system-status
      - error-handling
      - form-burden
      - way-back-and-control
  - stage: 3
    competencies:
      - jargon
      - mental-model-mismatch
      - heuristic-evaluation
      - testing-with-real-users
---
