// Build output contract (plan Task 2 + Review Focus 1–5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { buildCss } from '../scripts/build.mjs';
import { PALETTES } from '../src/palettes.mjs';

const css = buildCss({ fonts: false });
const settings = css.match(/\/\* @settings\n([\s\S]*?)\*\//)?.[1] ?? '';

test('has a Style Settings block for enough-light', () => {
  assert.match(settings, /^name: Enough Light$/m);
  assert.match(settings, /^id: enough-light$/m);
  assert.doesNotMatch(settings, /\t/, 'YAML must not contain tabs');
});

test('palette pickers list every palette, per mode', () => {
  for (const p of PALETTES) assert.match(settings, new RegExp(`value: el-${p.mode}-${p.id}\\b`), p.id);
});

test('defaults need no class: plain .theme-light is Honey, plain .theme-dark is Arcane (Review Focus 4)', () => {
  const block = (sel) => css.match(new RegExp(`${sel.replace(/\./g, '\\.')}[,\\s][^{]*\\{([^}]*)\\}`))?.[1] ?? '';
  assert.match(block('body.theme-light'), /--el-bg: #faf6ec;/);
  assert.match(block('body.theme-dark'), /--el-bg: #161512;/);
});

test('palette selectors are scoped to their mode (Review Focus 2)', () => {
  for (const m of css.matchAll(/([^{}\n]*\.el-(light|dark)-[a-z]+[^{}\n]*)\{/g)) {
    for (const sel of m[1].split(',')) {
      // The settings chip outline marks the live palette in BOTH modes (you can
      // pick your light palette while in dark mode); it sets no palette colours.
      if (sel.includes('.el-sw-')) continue;
      const mode = sel.match(/\.el-(light|dark)-/)?.[1];
      if (mode) assert.ok(sel.includes(`.theme-${mode}`), `unscoped: ${sel.trim()}`);
    }
  }
});

test('ombre rules only apply in dark mode (Review Focus 3)', () => {
  for (const m of css.matchAll(/([^{}]*\.el-ombre-[a-z]+[^{}]*)\{/g)) {
    for (const sel of m[1].split(',').filter(s => s.includes('el-ombre'))) {
      assert.ok(sel.includes('.theme-dark'), `ombre outside dark: ${sel.trim()}`);
    }
  }
});

test('heading colour falls back to the palette when the custom value is cleared (Review Focus 1)', () => {
  for (let n = 1; n <= 6; n++) {
    assert.match(css, new RegExp(`--h${n}-color: var\\(--el-h${n}-custom, var\\(--el-h${n}\\)\\);`));
  }
});

test('no colour literals in CSS layers — palettes.mjs is the only source (Review Focus 5)', () => {
  for (const f of readdirSync('src/css')) {
    const src = readFileSync(`src/css/${f}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    // hsl(var(--accent-h), …) is Obsidian's own accent, not a literal.
    assert.doesNotMatch(src, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\((?!var\(--accent-h\))/i, f);
  }
});

test('every heading level has a section with colour, size, font and weight settings', () => {
  for (let n = 1; n <= 6; n++) {
    for (const id of [`el-h${n}-custom`, `el-h${n}-size`, `el-h${n}-font`, `el-h${n}-weight`]) {
      assert.match(settings, new RegExp(`id: ${id}$`, 'm'), id);
    }
  }
});

// Regression (2026-11-08, Sean's screenshot): the selected tab in the sidebar was
// unreadable because the theme left --nav-item-color-active unset and a snippet
// (sodium) filled it with near-black. The theme must own every colour Obsidian
// reads for text and its backgrounds, so no snippet can leak one in.
export const OWNED_VARS = [
  '--nav-item-color', '--nav-item-color-hover', '--nav-item-color-active', '--nav-item-color-selected',
  '--nav-item-background-hover', '--nav-item-background-active', '--nav-item-background-selected',
  '--background-modifier-hover', '--background-modifier-active-hover', '--background-modifier-border-focus',
  '--divider-color', '--indentation-guide-color', '--callout-title-color',
  '--interactive-normal', '--interactive-hover', '--icon-color', '--icon-color-hover', '--icon-color-active',
];
test('theme owns every nav/hover/focus colour variable (no snippet can leak one in)', () => {
  const base = readFileSync('src/css/10-base.css', 'utf8');
  for (const v of OWNED_VARS) assert.match(base, new RegExp(`${v}:`), v);
});

// 0.0.7 customisation settings.
test('accent: every accent use reads --el-accent-live, and the toggle swaps it to Obsidian\'s accent', () => {
  const src = readFileSync('src/css/10-base.css', 'utf8') + readFileSync('src/css/50-components.css', 'utf8');
  assert.doesNotMatch(src.replace(/--el-accent-live: var\(--el-accent\);/, ''), /var\(--el-accent\)/, 'a rule still reads the palette accent directly');
  assert.match(settings, /id: el-accent-obsidian$/m);
  assert.match(css, /body\.el-accent-obsidian\.theme-dark\s*\{[^}]*--el-accent-live: hsl\(var\(--accent-h\), var\(--accent-s\), var\(--accent-l\)\)/);
  assert.match(css, /body\.el-accent-obsidian\.theme-dark\s*\{[^}]*--el-on-accent-live:/);
});

test('bold, italic and highlight colours fall back to the palette when untouched', () => {
  assert.match(css, /--bold-color: var\(--el-bold-custom, var\(--el-text\)\);/);
  assert.match(css, /--italic-color: var\(--el-italic-custom, var\(--el-text\)\);/);
  assert.match(css, /--text-highlight-bg: var\(--el-highlight-custom, var\(--el-selection\)\);/);
  for (const id of ['el-bold-custom', 'el-italic-custom', 'el-highlight-custom', 'file-line-width']) {
    assert.match(settings, new RegExp(`id: ${id}$`, 'm'), id);
  }
});

test('only H1–H3 claim to shrink on phones (the phone scale applies to H1–H3 only)', () => {
  const sizeDescs = [...settings.matchAll(/id: el-h(\d)-size\n(?:.*\n)*?\s*description: (.*)/g)];
  assert.equal(sizeDescs.length, 6);
  for (const [, n, d] of sizeDescs) assert.equal(/phones/.test(d), Number(n) <= 3, `H${n}: ${d}`);
});

// Theme guidelines: no !important, low-specificity selectors (no ID selectors).
test('no !important and no ID selectors in the CSS layers', () => {
  for (const f of readdirSync('src/css')) {
    const src = readFileSync(`src/css/${f}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(src, /!important/, f);
    assert.doesNotMatch(src, /#[a-z][\w-]*\s*[),{.:\s]/i, f);
  }
});

// Theme guidelines (hard rule): no remote assets or network calls.
test('built theme.css loads nothing remote', () => {
  const built = buildCss({ fonts: true }).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(built, /@import/);
  assert.doesNotMatch(built, /url\(\s*['"]?(https?:|\/\/)/i);
});

// ---------- 0.0.9: Style Settings previews ----------
test('each palette picker is followed by a preview with one chip per palette of that mode', () => {
  for (const mode of ['light', 'dark']) {
    const block = settings.split(/\n  - /).find((b) => b.startsWith(`id: el-${mode}-palette-preview`));
    assert.ok(block, `missing el-${mode}-palette-preview`);
    assert.match(block, /type: info-text/);
    assert.match(block, /markdown: true/);
    for (const p of PALETTES) {
      const has = block.includes(`el-sw-${p.id}"`);
      assert.equal(has, p.mode === mode, `${mode} preview and ${p.id}`);
    }
    const order = settings.indexOf(`id: el-${mode}-palette\n`);
    assert.ok(order >= 0 && order < settings.indexOf(`id: el-${mode}-palette-preview`), 'preview sits after its picker');
  }
});

test("every chip carries its own palette's colours, and the live palette gets an outline", () => {
  for (const p of PALETTES) {
    const rule = css.match(new RegExp(`\\.el-sw-${p.id} \\{([^}]*)\\}`))?.[1] ?? '';
    assert.match(rule, new RegExp(`--sw-bg: ${p.bg};`), p.id);
    assert.match(rule, new RegExp(`--sw-text: ${p.text};`), p.id);
    assert.match(rule, new RegExp(`--sw-h1: ${p.h1};`), p.id);
    assert.match(rule, new RegExp(`--sw-h2: ${p.h2};`), p.id);
    assert.match(rule, new RegExp(`--sw-link: ${p.link};`), p.id);
    assert.ok(css.includes(`body.el-${p.mode}-${p.id} .el-sw-${p.id}`), `live outline for ${p.id}`);
  }
  // The live chip is marked with a tick, not only by its frame.
  assert.match(css, /\.el-sw-honey \.el-sw-name::before[^{]*\{[^}]*content: "✓ "/);
  // No class set yet: the default palette's chip is the live one.
  assert.match(css, /body:not\(\.el-light-slate\)[^{]*\.el-sw-honey/);
});

test('heading preview sits first under Headings and reads the same variables as notes', () => {
  assert.match(settings, /id: el-headings\n[^]*?\n  - id: el-heading-preview\n/);
  assert.ok(settings.indexOf('id: el-heading-preview') < settings.indexOf('id: el-h1-heading'));
  for (let n = 1; n <= 6; n++) {
    assert.ok(settings.includes(`el-hp-${n}`), `H${n} sample`);
    const rule = css.match(new RegExp(`\\.el-hp-${n} \\{([^}]*)\\}`))?.[1] ?? '';
    for (const v of ['color', 'font', 'size', 'weight']) assert.ok(rule.includes(`var(--h${n}-${v})`), `H${n} ${v}`);
  }
});

test('preview styles are scoped to the settings panel, never notes', () => {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, ''); // comments are not selectors
  for (const m of bare.matchAll(/([^{}]*\.el-(?:sw|hp|swatches)[^{}]*)\{/g)) {
    // Commas inside :is(...) do not start a new selector.
    for (const sel of m[1].replace(/:is\([^)]*\)/g, ':is(…)').split(',')) {
      const s = sel.trim();
      if (/^\.el-sw-[a-z]+$/.test(s)) continue; // the variable-only chip rules
      if (/^body[^ ]* \.el-sw-[a-z]+( \.el-sw-name(::before)?)?$/.test(s)) continue; // live-palette frame + tick
      assert.ok(s.includes('.style-settings-markdown'), `unscoped preview rule: ${s}`);
    }
  }
});

test('each heading section opens with a live sample of just that level', () => {
  for (let n = 1; n <= 6; n++) {
    const at = settings.indexOf(`id: el-h${n}-preview\n`);
    assert.ok(at > settings.indexOf(`id: el-h${n}-heading\n`), `H${n} sample after its heading`);
    assert.ok(at < settings.indexOf(`id: el-h${n}-custom\n`), `H${n} sample before its colour setting`);
    const block = settings.slice(at, settings.indexOf('\n  - ', at));
    assert.match(block, new RegExp(`el-hp-${n}">`));
    for (let m = 1; m <= 6; m++) if (m !== n) assert.doesNotMatch(block, new RegExp(`el-hp-${m}"`), `H${n} sample shows only H${n}`);
  }
});

test("heading glow is a switch named 'Heading glow', on by default (Sean, 0.0.11)", () => {
  const block = settings.split(/\n  - /).find((b) => b.startsWith('id: el-glow\n'));
  assert.ok(block, 'el-glow setting');
  assert.match(block, /title: Heading glow/);
  assert.match(block, /type: class-toggle/);
  assert.match(block, /default: true/);
  assert.doesNotMatch(css, /el-glow-off/, 'old inverted switch is gone');
  assert.match(css, /body\.el-glow \.markdown-rendered h1/);
});

test('each palette picker and its samples join into one card (0.0.12)', () => {
  for (const mode of ['light', 'dark']) {
    const picker = new RegExp(`\\.style-settings-container \\.setting-item:is\\([^)]*\\[data-id="el-${mode}-palette"\\][^)]*\\) \\{[^}]*margin-bottom: 0;[^}]*border-bottom: none;`);
    const preview = new RegExp(`\\.style-settings-container \\.setting-item:is\\([^)]*\\[data-id="el-${mode}-palette-preview"\\][^)]*\\) \\{[^}]*border-top: none;`);
    assert.match(css, picker, `${mode} picker drops its bottom edge`);
    assert.match(css, preview, `${mode} samples drop their top edge`);
    // The preview must directly follow its picker, or the join opens a gap.
    const ids = [...settings.matchAll(/^  - id: (\S+)/gm)].map((m) => m[1]);
    assert.equal(ids[ids.indexOf(`el-${mode}-palette`) + 1], `el-${mode}-palette-preview`);
  }
});
