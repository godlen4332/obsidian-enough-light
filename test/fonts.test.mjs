// Bundled fonts contract (design §6, §11; plan Task 3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCss } from '../scripts/build.mjs';

// family → [weight, style] pairs that must be embedded.
export const REQUIRED_FACES = {
  'Atkinson Hyperlegible Next': [[400, 'normal'], [700, 'normal'], [800, 'normal'], [400, 'italic'], [700, 'italic']],
  'Atkinson Hyperlegible Mono': [[400, 'normal'], [700, 'normal'], [400, 'italic'], [700, 'italic']],
  'Poppins': [[400, 'normal'], [700, 'normal'], [800, 'normal']],
  'Inter': [[400, 'normal'], [700, 'normal'], [800, 'normal']],
  'JetBrains Mono': [[400, 'normal'], [700, 'normal'], [400, 'italic'], [700, 'italic']],
  'EL Mono C': [[400, 'normal'], [700, 'normal'], [400, 'italic'], [700, 'italic']],
};

const css = buildCss({ fonts: true });

for (const [family, faces] of Object.entries(REQUIRED_FACES)) {
  test(`${family}: every required face is embedded`, () => {
    for (const [w, s] of faces) {
      const re = new RegExp(`@font-face \\{ font-family: "${family}"; font-weight: ${w}; font-style: ${s};[^}]*base64,`);
      assert.match(css, re, `${family} ${w} ${s}`);
    }
  });
}

test('no unexpected faces (keeps the file small)', () => {
  const n = [...css.matchAll(/@font-face/g)].length;
  assert.equal(n, Object.values(REQUIRED_FACES).flat().length);
});

test('built theme.css stays within the size budget (≤ 1.4 MB)', () => {
  assert.ok(css.length <= 1.4 * 1024 * 1024, `${(css.length / 1024).toFixed(0)} KB`);
});

test('no embedded family uses a Reserved Font Name (IBM Plex Mono reserves "Plex")', () => {
  assert.doesNotMatch(css, /font-family: "[^"]*Plex[^"]*"; font-weight/);
});

test('theme.css carries the OFL notice for every bundled font', () => {
  for (const family of Object.keys(REQUIRED_FACES)) assert.match(css.slice(0, 4000), new RegExp(family), family);
  assert.match(css.slice(0, 4000), /SIL Open Font License 1\.1/);
});
