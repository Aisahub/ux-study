/**
 * Constructions a Korean writer does not reach for unprompted, each the
 * imprint of an English sentence or of machine-written marketing copy. The
 * list is deliberately short: every entry is one where the rewrite is always
 * better, so a hit is a defect rather than a judgement call. `에 대해`, `을
 * 통해` and `할 수 있습니다` are left off because Korean uses each lawfully and
 * a substring ban would fail correct copy (ERR-229) — those are the reviewer's
 * job, not this file's.
 *
 * Each entry must also be written in CONTEXT.md's Translationese section, so a
 * writer reads the rule before CI reads the copy.
 */
export const TRANSLATIONESE: [RegExp, string][] = [
  [/에 의해/, '에 의해'],
  [/되어지|되어진/, '되어지다'],
  [/것이 가능/, '것이 가능하다'],
  [/(가지고|갖고) 있/, '가지고 있다'],
  [/원활/, '원활'],
  [/효과적으로/, '효과적으로'],
  [/다양한/, '다양한'],
  [/손쉽게/, '손쉽게'],
  [/간편하게/, '간편하게'],
  [/최적화된/, '최적화된'],
  [/완벽하게/, '완벽하게'],
]

/**
 * Coined words the owner's Korean writing convention replaces with the
 * industry term (its section 5-가), which takes precedence over this repo's own
 * rulings. `원장` and `서식` are on that list but left off this one: here they
 * are the accounting ledger and part of a real tax form's name, not coinages.
 * Each must also be named in CONTEXT.md's Coined words section.
 */
export const COINED = ['이름표', '관문', '울타리', '일꾼', '격자', '단추', '서랍', '시험지', '묶음']
