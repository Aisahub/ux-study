---
# The fixed quantities from the spec — deliberate defaults, chosen as the
# cheapest values that still do their job. They are content configuration:
# changing one is an edit here, not a code change.
poolSize: 8
drawSize: 5
passThreshold: 4
minFindings: 3
# The Stage 1 curriculum (ADR-0001). Competency definitions under
# content/competencies/ and item pools under content/items/ must belong to a
# slug declared here, and every Planted Defect must cite one of these.
stage1Competencies:
  - visual-hierarchy
  - readability
  - consistency
  - perceived-clickability
---
