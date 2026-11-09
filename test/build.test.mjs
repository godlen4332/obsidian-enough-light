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
    assert.doesNotMatch(src, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, f);
  }
});

test('every heading level has a section with colour, size, font and weight settings', () => {
  for (let n = 1; n <= 6; n++) {
    for (const id of [`el-h${n}-custom`, `el-h${n}-size`, `el-h${n}-font`, `el-h${n}-weight`]) {
      assert.match(settings, new RegExp(`id: ${id}$`, 'm'), id);
    }
  }
});
