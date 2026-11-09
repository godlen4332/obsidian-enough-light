// Legibility bar from docs/enough-light-design.md §5. Reads the same palette
// data the build uses, so the theme and this test can never disagree.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PALETTES, REQUIRED_KEYS } from '../src/palettes.mjs';
import { contrast, failures } from '../src/contrast.mjs';

test('contrast() matches known WCAG values', () => {
  assert.equal(contrast('#000000', '#ffffff').toFixed(1), '21.0');
  assert.equal(contrast('#ffffff', '#ffffff').toFixed(1), '1.0');
  assert.equal(contrast('#767676', '#ffffff').toFixed(2), '4.54');
});

test('six palettes, three per mode, unique ids', () => {
  assert.equal(PALETTES.length, 6);
  for (const mode of ['light', 'dark']) {
    assert.equal(PALETTES.filter(p => p.mode === mode).length, 3, mode);
  }
  assert.equal(new Set(PALETTES.map(p => p.id)).size, 6);
});

test('exactly one default per mode: Honey (light), Arcane (dark)', () => {
  assert.deepEqual(PALETTES.filter(p => p.isDefault).map(p => p.id).sort(), ['arcane', 'honey']);
});

test('every palette defines every required key as a hex colour', () => {
  for (const p of PALETTES) {
    for (const k of REQUIRED_KEYS) {
      assert.match(String(p[k]), /^#[0-9a-f]{6}$/i, `${p.id}.${k}`);
    }
  }
});

test('dark palettes define ombre ends; light palettes do not', () => {
  for (const p of PALETTES) {
    if (p.mode === 'dark') {
      assert.ok(p.ombre?.pageFrom && p.ombre?.pageTo && p.ombre.h1?.length === 2 && p.ombre.h2?.length === 2, p.id);
    } else {
      assert.equal(p.ombre, undefined, p.id);
    }
  }
});

for (const p of PALETTES) {
  test(`${p.name}: meets the legibility bar`, () => {
    const f = failures(p);
    assert.deepEqual(f, [], f.map(x => `${x.pair} ${x.ratio.toFixed(2)} < ${x.min}`).join('\n'));
  });
}
