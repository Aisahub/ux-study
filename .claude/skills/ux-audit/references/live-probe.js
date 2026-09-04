// Paste into browser_evaluate (browser-qa / Playwright MCP) when a live session
// is ALREADY open — logged in, or mid-flow — and launching a second browser
// would lose that state. Returns the four highest-signal measurements.
//
// Verified to return numbers identical to probe.mjs on the same page.
// For the full 26-principle evidence pack, use probe.mjs instead.
() => {
  const px = v => parseFloat(v) || 0;
  const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const nm = el => el.getAttribute('data-element') || el.id || el.tagName.toLowerCase();
  const tx = el => (el.innerText || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const parse = c => { const m = String(c).match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null; };
  const over = (f, b) => ({ r: f.r*f.a + b.r*(1-f.a), g: f.g*f.a + b.g*(1-f.a), b: f.b*f.a + b.b*(1-f.a), a: 1 });
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v/12.92 : ((v+0.055)/1.055) ** 2.4; };
    return 0.2126*f(c.r) + 0.7152*f(c.g) + 0.0722*f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x+0.05)/(y+0.05)).toFixed(2); };
  // A gradient or photo behind the text has no single background colour, so any
  // ratio would be fiction. Say so instead of inventing a number.
  const gradient = el => { let n = el; while (n) { const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return true;
      const c = parse(s.backgroundColor); if (c && c.a >= 0.999) return false; n = n.parentElement; } return false; };
  const bgOf = el => { let n = el; while (n) { const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a >= 0.999) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };

  const all = [...document.querySelectorAll('body *')].filter(vis);
  const scale = all.filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
    .map(el => ({ el: nm(el), text: tx(el), px: px(getComputedStyle(el).fontSize) }))
    .filter(e => e.text).sort((a, b) => b.px - a.px).slice(0, 4);
  const contrast = all.filter(el => el.matches('a[href],button,[role=button],input,select'))
    .map(el => { const s = getComputedStyle(el), fg = parse(s.color), bg = bgOf(el);
      return { el: nm(el), text: tx(el), contrast: gradient(el) ? 'unmeasurable' : (fg ? ratio(over(fg, bg), bg) : null) }; })
    .sort((a, b) => (typeof a.contrast === 'number' ? a.contrast : 99) - (typeof b.contrast === 'number' ? b.contrast : 99)).slice(0, 3);
  const noSignifier = all.filter(el => el.matches('a[href],[role=link]')).filter(el => {
      const s = getComputedStyle(el), p = el.parentElement ? getComputedStyle(el.parentElement) : s;
      return !s.textDecorationLine.includes('underline') && s.boxShadow === 'none'
        && !['Top','Right','Bottom','Left'].some(d => px(s['border'+d+'Width']) > 0)
        && s.color === p.color; }).map(el => ({ el: nm(el), text: tx(el) }));
  const proximity = [...document.querySelectorAll('label')].filter(vis).map(el => {
      const r = el.getBoundingClientRect(), fid = el.getAttribute('for');
      const own = fid ? document.getElementById(fid) : null;
      const above = [...document.querySelectorAll('input,select,textarea')].filter(vis)
        .filter(i => i.getBoundingClientRect().bottom <= r.top + 1)
        .sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0];
      const gOwn = own ? Math.round(own.getBoundingClientRect().top - r.bottom) : null;
      const gAbove = above ? Math.round(r.top - above.getBoundingClientRect().bottom) : null;
      return { el: tx(el), gapOwn: gOwn, gapAbove: gAbove, misreads: gAbove !== null && gOwn !== null && gAbove < gOwn }; })
    .filter(l => l.misreads);
  return { largestText: scale, faintestControls: contrast, linksWithNoSignifier: noSignifier, labelsGluedToWrongField: proximity };
}
