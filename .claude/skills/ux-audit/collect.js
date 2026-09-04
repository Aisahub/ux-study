// The measurement pass, as a standalone function so there is exactly one copy.
// probe.mjs reads this file and evaluates it; a live Playwright-MCP session
// (browser-qa) can paste it straight into browser_evaluate. Two callers, one
// definition — the numbers cannot drift between the two routes.
//
// Runs inside the document. Everything here is measurement, not judgement.
function collectUxEvidence() {
  const px = (v) => parseFloat(v) || 0;
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && px(s.opacity) > 0.05;
  };
  const name = (el) => (el.getAttribute('data-element') || el.id ||
    (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') ||
    el.tagName.toLowerCase());
  const text = (el) => (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };

  // --- colour maths (WCAG 2.x relative luminance) ---
  const parse = (c) => {
    const m = String(c).match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  };
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
  // Walk ancestors until something actually paints — a transparent background
  // is not a background, it is a hole you see the parent through.
  const effBg = (el) => {
    let n = el, acc = null;
    while (n && n !== document.documentElement.parentNode) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { acc = acc ? over(acc, c) : c; if (acc.a >= 0.999) return acc; }
      n = n.parentElement;
    }
    return acc && acc.a >= 0.999 ? acc : over(acc || { r: 0, g: 0, b: 0, a: 0 }, { r: 255, g: 255, b: 255, a: 1 });
  };
  // A gradient or photo behind the text has no single background colour, so any
  // ratio computed against one is fiction. Say "unmeasurable" instead of lying —
  // a number nobody can trust is worse than an honest gap in the evidence.
  const paintedBehind = (el) => {
    let n = el;
    while (n && n !== document.documentElement.parentNode) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return true;
      const c = parse(s.backgroundColor);
      if (c && c.a >= 0.999) return false;
      n = n.parentElement;
    }
    return false;
  };
  const contrastOf = (el, fg, bg) => (!fg ? null : paintedBehind(el) ? 'unmeasurable-image-background' : ratio(over(fg, bg), bg));
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

  const all = [...document.querySelectorAll('body *')].filter(vis);
  const INTERACTIVE = 'a[href],button,input,select,textarea,[role=button],[role=link],[onclick],[tabindex]:not([tabindex="-1"])';
  const interactive = all.filter((el) => el.matches(INTERACTIVE));
  const textEls = all.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));

  // --- scale: the page announces its priorities through size, chosen or not ---
  const sizes = textEls.map((el) => {
    const s = getComputedStyle(el);
    return { element: name(el), tag: el.tagName.toLowerCase(), text: text(el), fontSize: px(s.fontSize), fontWeight: s.fontWeight, box: box(el) };
  }).filter((e) => e.text).sort((a, b) => b.fontSize - a.fontSize);

  // --- contrast: spent in proportion to importance, or not spent at all ---
  const contrast = interactive.map((el) => {
    const s = getComputedStyle(el);
    const fg = parse(s.color), bg = effBg(el);
    const own = parse(s.backgroundColor);
    const surround = el.parentElement ? effBg(el.parentElement) : bg;
    return {
      element: name(el), tag: el.tagName.toLowerCase(), text: text(el),
      fg: hex(fg || { r: 0, g: 0, b: 0 }), bg: hex(bg),
      textContrast: contrastOf(el, fg, bg),
      // How far the control separates from the field it sits on. A button whose
      // fill matches its surroundings has no edge, whatever its label does.
      fillVsSurround: own && own.a > 0 ? ratio(over(own, surround), surround) : 1,
      fontSize: px(s.fontSize), disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true',
      box: box(el),
    };
  }).sort((a, b) => (typeof a.textContrast === 'number' ? a.textContrast : 99) - (typeof b.textContrast === 'number' ? b.textContrast : 99));

  // --- readability / legibility: comfortable as a block, and glyph by glyph ---
  const readability = textEls.filter((el) => text(el).length > 60).map((el) => {
    const s = getComputedStyle(el);
    const fs = px(s.fontSize);
    const lh = s.lineHeight === 'normal' ? fs * 1.2 : px(s.lineHeight);
    const fg = parse(s.color), bg = effBg(el);
    const raw = (el.innerText || '').trim();
    // Rough but stable: 0.5em average advance width for latin text.
    const cpl = Math.round(el.getBoundingClientRect().width / (fs * 0.5));
    return {
      element: name(el), text: raw.slice(0, 160), chars: raw.length,
      fontSize: fs, lineHeightRatio: +(lh / fs).toFixed(2), charsPerLine: cpl,
      contrast: contrastOf(el, fg, bg),
      sentences: (raw.match(/[.!?。！？]/g) || []).length,
      longestSentence: Math.max(0, ...raw.split(/[.!?。！？]/).map((x) => x.trim().split(/\s+/).length)),
    };
  }).sort((a, b) => b.chars - a.chars);

  // --- proximity: spacing decides what belongs to what, before any markup does ---
  const labels = [...document.querySelectorAll('label')].filter(vis).map((el) => {
    const r = el.getBoundingClientRect();
    const forId = el.getAttribute('for');
    let own = forId ? document.getElementById(forId) : el.querySelector('input,select,textarea');
    // Fall back to "the next control below it", which is how a reader reads it.
    if (!own) { const c = [...document.querySelectorAll('input,select,textarea')].filter(vis).filter((i) => i.getBoundingClientRect().top >= r.bottom - 1); own = c.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0]; }
    const above = [...document.querySelectorAll('input,select,textarea')].filter(vis)
      .filter((i) => i.getBoundingClientRect().bottom <= r.top + 1)
      .sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0];
    const gapBelow = own ? Math.round(own.getBoundingClientRect().top - r.bottom) : null;
    const gapAbove = above ? Math.round(r.top - above.getBoundingClientRect().bottom) : null;
    return {
      element: name(el), text: text(el), ownField: own ? name(own) : null,
      gapToOwnField: gapBelow, gapToFieldAbove: gapAbove,
      // The tell from the course: a label glued to the field it does NOT label.
      readsAsCaptionForFieldAbove: gapAbove !== null && gapBelow !== null && gapAbove < gapBelow,
    };
  });

  // --- signifier: clickable, and does it look it (at rest, before any hover) ---
  const signifier = interactive.filter((el) => el.matches('a[href],[role=link],[onclick],[role=button]')).map((el) => {
    const s = getComputedStyle(el);
    const p = el.parentElement ? getComputedStyle(el.parentElement) : s;
    const border = ['Top', 'Right', 'Bottom', 'Left'].some((d) => px(s['border' + d + 'Width']) > 0);
    const cues = {
      underline: s.textDecorationLine.includes('underline'),
      border, background: (parse(s.backgroundColor) || { a: 0 }).a > 0.05,
      boxShadow: s.boxShadow !== 'none',
      colourDiffersFromProse: s.color !== p.color,
      weightDiffersFromProse: s.fontWeight !== p.fontWeight,
      cursorPointer: s.cursor === 'pointer',
    };
    const visualCues = ['underline', 'border', 'background', 'boxShadow', 'colourDiffersFromProse', 'weightDiffersFromProse'].filter((k) => cues[k]);
    return { element: name(el), tag: el.tagName.toLowerCase(), text: text(el), cues, visualCueCount: visualCues.length, visualCues };
  }).sort((a, b) => a.visualCueCount - b.visualCueCount);

  // --- disabled-state: present but unusable has to LOOK unusable ---
  const disabled = interactive.filter((el) => el.disabled === true || el.getAttribute('aria-disabled') === 'true').map((el) => {
    const s = getComputedStyle(el);
    const fg = parse(s.color), bg = effBg(el);
    return { element: name(el), text: text(el), opacity: px(s.opacity), contrast: contrastOf(el, fg, bg), cursor: s.cursor, hasHint: !!(el.getAttribute('title') || el.getAttribute('aria-describedby')) };
  });

  // --- consistency: same job, two names / two shapes ---
  const actions = interactive.filter((el) => el.matches('a[href],button,[role=button]')).map((el) => {
    const s = getComputedStyle(el);
    return { element: name(el), text: text(el), href: el.getAttribute('href') || null, tag: el.tagName.toLowerCase(), style: `${s.backgroundColor}|${s.color}|${s.borderRadius}|${s.fontSize}`, box: box(el) };
  });
  const sameTargetDifferentLabel = [];
  const seenHref = {};
  for (const a of actions.filter((a) => a.href && a.href !== '#')) { (seenHref[a.href] ||= []).push(a); }
  for (const [href, group] of Object.entries(seenHref)) {
    const labels = [...new Set(group.map((g) => g.text.toLowerCase()))];
    if (labels.length > 1) sameTargetDifferentLabel.push({ href, variants: group.map((g) => ({ element: g.element, text: g.text })) });
  }
  const sameLabelDifferentStyle = [];
  const seenText = {};
  for (const a of actions) { if (a.text) (seenText[a.text.toLowerCase()] ||= []).push(a); }
  for (const [t, group] of Object.entries(seenText)) {
    if (new Set(group.map((g) => g.style)).size > 1) sameLabelDifferentStyle.push({ text: t, variants: group.map((g) => ({ element: g.element, style: g.style })) });
  }
  // Two controls doing one job under two names is the commonest consistency
  // defect and it has no href to match on — "Export CSV" and "Download" are the
  // same button twice. Verb synonyms are the cheapest way to surface the pair;
  // whether it really is one job is a judgement the reader still has to make.
  const SYNONYMS = [
    ['export', 'download', 'save as', 'get', 'csv', '내보내기', '다운로드', '导出', '下载'],
    ['delete', 'remove', 'discard', 'trash', '삭제', '제거', '删除', '移除'],
    ['edit', 'change', 'modify', 'update', '수정', '편집', '변경', '编辑', '修改'],
    ['add', 'create', 'new', '추가', '만들기', '새', '添加', '新建'],
    ['save', 'apply', 'confirm', 'submit', '저장', '적용', '확인', '保存', '应用', '确认'],
    ['cancel', 'close', 'dismiss', '취소', '닫기', '取消', '关闭'],
  ];
  const synonymCandidates = [];
  for (const family of SYNONYMS) {
    const hits = actions.filter((a) => a.text && family.some((w) => a.text.toLowerCase().includes(w)));
    const distinct = [...new Set(hits.map((h) => h.text.toLowerCase()))];
    if (distinct.length > 1) {
      synonymCandidates.push({
        family: family.slice(0, 4).join('/'),
        variants: hits.map((h) => ({ element: h.element, text: h.text, style: h.style })),
        note: 'Same verb family, different wording — confirm whether these are one job before reporting.',
      });
    }
  }

  // --- control-fit: a dropdown hiding three options is a bad trade ---
  const selects = [...document.querySelectorAll('select')].filter(vis).map((el) => ({
    element: name(el), optionCount: el.options.length,
    options: [...el.options].slice(0, 12).map((o) => o.text.trim()),
    hidesFewOptions: el.options.length > 0 && el.options.length <= 4,
  }));

  // --- smart-defaults: what the form asks for that it could have known ---
  const fields = [...document.querySelectorAll('input,select,textarea')].filter(vis)
    .filter((el) => !['hidden', 'submit', 'button'].includes(el.type)).map((el) => ({
      element: name(el), type: el.type || el.tagName.toLowerCase(),
      label: (el.labels && el.labels[0] ? el.labels[0].innerText : '') || el.getAttribute('aria-label') || el.placeholder || '',
      empty: !el.value, required: el.required, autocomplete: el.getAttribute('autocomplete') || null,
      hasPlaceholderOnly: !!el.placeholder && !(el.labels && el.labels.length),
      describedBy: el.getAttribute('aria-describedby') || null,
      invalidNow: el.getAttribute('aria-invalid') === 'true',
    }));

  // --- sense-of-place: where am I, and how far in ---
  const bodyText = document.body.innerText || '';
  const place = {
    title: document.title,
    h1: [...document.querySelectorAll('h1')].filter(vis).map(text),
    headingOutline: [...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map((el) => `${el.tagName} ${text(el)}`),
    stepIndicator: (bodyText.match(/step\s*\d+\s*(of|\/)\s*\d+|\d+\s*\/\s*\d+\s*단계|第\s*\d+\s*步/i) || [null])[0],
    breadcrumb: !!document.querySelector('[aria-label*=readcrumb i],nav ol,nav ul[class*=crumb i]'),
  };

  // --- emergency-exit / undo: is there a way out that isn't "finish it" ---
  const EXIT = /^(cancel|close|back|exit|dismiss|취소|닫기|뒤로|取消|关闭|返回)$/i;
  const UNDO = /(undo|revert|restore|되돌리|실행\s*취소|撤销|还原)/i;
  const exits = {
    exitControls: interactive.filter((el) => EXIT.test(text(el))).map((el) => ({ element: name(el), text: text(el) })),
    undoMentions: (bodyText.match(new RegExp(UNDO, 'gi')) || []).length,
    dialogs: [...document.querySelectorAll('[role=dialog],dialog[open],[aria-modal=true]')].filter(vis)
      .map((d) => ({ element: name(d), hasExit: [...d.querySelectorAll(INTERACTIVE)].some((el) => EXIT.test(text(el))) })),
  };

  // --- expanded-acronym: a bare initialism the reader never met expanded ---
  const acronyms = {};
  for (const m of bodyText.matchAll(/\b([A-Z]{2,6})\b/g)) {
    const a = m[1];
    if (/^(OK|ID|AM|PM|USD|EUR|KRW|CSV|PDF|URL|FAQ)$/.test(a)) continue;
    const around = bodyText.slice(Math.max(0, m.index - 140), m.index + 140);
    const expanded = new RegExp(a.split('').join('[a-z]+\\s+') + '[a-z]*', 'i').test(around) ||
      new RegExp('\\(\\s*' + a + '\\s*\\)').test(around);
    (acronyms[a] ||= { acronym: a, occurrences: 0, expandedNearby: false });
    acronyms[a].occurrences++;
    acronyms[a].expandedNearby ||= expanded;
  }

  // --- the word corpus: jargon and mental model are LLM calls, not measurements ---
  const corpus = {
    headings: place.headingOutline,
    buttons: [...new Set(interactive.filter((el) => el.matches('button,[role=button],input[type=submit]')).map(text).filter(Boolean))],
    links: [...new Set(interactive.filter((el) => el.matches('a[href]')).map(text).filter(Boolean))],
    fieldLabels: [...new Set(fields.map((f) => f.label).filter(Boolean))],
    bodyText: bodyText.replace(/\s+/g, ' ').slice(0, 6000),
  };

  // --- cognitive-load: the counts, so "too much" stops being a feeling ---
  const load = {
    interactiveCount: interactive.length,
    formFieldCount: fields.length,
    distinctFontSizes: [...new Set(sizes.map((s) => s.fontSize))].sort((a, b) => b - a),
    distinctTextColours: [...new Set(textEls.map((el) => getComputedStyle(el).color))].length,
    wordCount: bodyText.trim().split(/\s+/).length,
  };

  return {
    url: location.href, title: document.title,
    viewport: { w: innerWidth, h: innerHeight }, scrollHeight: document.documentElement.scrollHeight,
    byPrinciple: {
      scale: sizes.slice(0, 25),
      contrast, readability, proximity: labels, signifier, 'disabled-state': disabled,
      consistency: { sameTargetDifferentLabel, sameLabelDifferentStyle, synonymCandidates, actions },
      'control-fit': selects, 'smart-defaults': fields, 'sense-of-place': place,
      'emergency-exit': exits, 'expanded-acronym': Object.values(acronyms),
      'cognitive-load': load,
    },
    corpus,
  };
}
