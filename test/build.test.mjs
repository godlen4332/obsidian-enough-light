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
  assert.match(css, /body\.el-accent-obsidian:not\(#el\)\s*\{[^}]*--el-accent-live: hsl\(var\(--accent-h\), var\(--accent-s\), var\(--accent-l\)\)/);
  assert.match(css, /body\.el-accent-obsidian:not\(#el\)\s*\{[^}]*--el-on-accent-live:/);
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
