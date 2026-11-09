// Proposal (2026-11-08): Ember moved away from Arcane. Arcane = neutral black + teal/magenta/blue (cool).
// Ember = brown-black "embers" paper + gold/copper/rose, no blue at all (warm). Checked with the real failures().
import { failures } from '../../src/contrast.mjs';
export const EMBER = {
  id: 'ember', name: 'Ember', mode: 'dark', isDefault: false,
  bg: '#1f1611', bg2: '#271c15', text: '#f0e4d2', muted: '#b5a490', border: '#3d2d22',
  h1: '#f2c35b', h2: '#f08a4b', h3: '#e88aa0', h4: '#b5c97e', h5: '#d8cbb6', h6: '#b5a490',
  link: '#f5b15f', accent: '#d08a2a',
  tagBg: '#3a2618', tagFg: '#f2b36b', calloutBg: '#2a1d16', codeBg: '#261b15', selection: '#5a3a1c',
  toolbar: '#2c1f16', toolbarText: '#f2c35b', today: '#f08a4b',
  glow: 0.5,
  ombre: { pageFrom: '#1f1611', pageTo: '#2a1410', h1: ['#f2c35b', '#f08a4b'], h2: ['#f08a4b', '#e88aa0'] },
};
if (import.meta.url === `file://${process.argv[1]}`) {
  const f = failures(EMBER);
  console.log(f.length ? f.map(x => `${x.pair} ${x.ratio.toFixed(2)} < ${x.min}`).join('\n') : 'Ember PASS');
}
