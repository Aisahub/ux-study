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
# Declaring a Stage is not authoring it. A slug listed here with no definition
# file and no item pool is a Stage that has not been written yet, which is the
# state Stage 2 and Stage 3 are in — the same tolerance an unauthored Stage 1
# pool already had. Each Stage's list is in display order.
#
# Stage 3 carries the four Competencies ADR-0001's amendment enumerates.
# Whether accessibility is a fifth is unsettled — PRODUCT.md and DESIGN.md
# assert it is and the enumeration does not list it (ADR-0011's follow-up,
# issue #72). Adding it is one line here; this file does not decide it.
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
