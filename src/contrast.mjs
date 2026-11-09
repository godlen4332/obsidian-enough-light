// WCAG 2.x contrast and the Enough Light legibility bar (design §5).

const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/** Relative luminance of a #rrggbb colour. */
export function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two #rrggbb colours (1–21). */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const BAR = { body: 7, heading: 5.5, text: 4.5, ui: 3 };

/** Headings H1–H6 aim higher than the 4.5 floor (design §5 target). */
export const HEADING_KEYS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/** Foregrounds that are read as text and must clear 4.5:1 on both page and sidebar. */
export const TEXT_KEYS = ['muted', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'link'];

/**
 * Every pair a reader actually sees, checked against the bar.
 * Returns [] when the palette passes.
 */
export function failures(p) {
  const out = [];
  const check = (pair, fg, bg, min) => {
    const ratio = contrast(fg, bg);
    if (ratio < min) out.push({ pair, ratio, min });
  };
  for (const bg of ['bg', 'bg2']) {
    check(`text/${bg}`, p.text, p[bg], BAR.body);
    for (const k of TEXT_KEYS) check(`${k}/${bg}`, p[k], p[bg], BAR.text);
    for (const k of HEADING_KEYS) check(`${k}/${bg} (heading target)`, p[k], p[bg], BAR.heading);
    check(`accent/${bg}`, p.accent, p[bg], BAR.ui); // cursor, checkbox, focus ring: UI component bar
  }
  check('text/calloutBg', p.text, p.calloutBg, BAR.body);
  check('text/codeBg', p.text, p.codeBg, BAR.body);
  check('text/selection', p.text, p.selection, BAR.text);
  check('tagFg/tagBg', p.tagFg, p.tagBg, BAR.text);
  check('toolbarText/toolbar', p.toolbarText, p.toolbar, BAR.text);
  if (p.ombre) {
    // Worst case: each heading gradient end against each end of the page fade,
    // plus body text against the fade end it did not start from.
    for (const pg of ['pageFrom', 'pageTo']) {
      check(`text/ombre.${pg}`, p.text, p.ombre[pg], BAR.body);
      check(`muted/ombre.${pg}`, p.muted, p.ombre[pg], BAR.text);
      for (const h of ['h1', 'h2']) {
        p.ombre[h].forEach((c, i) => check(`ombre.${h}[${i}]/${pg}`, c, p.ombre[pg], BAR.text));
      }
    }
  }
  return out;
}
