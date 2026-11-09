// THE single source of every colour in Enough Light ("say it once").
// The build turns this into CSS; test/contrast.test.mjs checks it against the
// legibility bar. CSS layers in src/css/ never contain a colour literal.
//
// Keys:
//   bg / bg2        page / sidebars, tabs, secondary panes
//   text / muted    body text / labels, "Empty", breadcrumbs, placeholders
//   border          hairlines (decoration only, not text)
//   h1..h6, link    headings and links (text: ≥ 4.5:1)
//   accent          cursor, checkbox, focus ring, active tab marker (UI: ≥ 3:1)
//   tagBg/tagFg, calloutBg, codeBg, selection
//   toolbar/toolbarText   note-toolbar band (Sean's yellow band in light)
//   today           the note-toolbar "Today" button colour (colour only — design §12)
//   glow            heading glow strength (0–1)
//   ombre           dark only: page fade ends and gradient-heading ends (design §11)

export const REQUIRED_KEYS = [
  'bg', 'bg2', 'text', 'muted', 'border',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'link', 'accent',
  'tagBg', 'tagFg', 'calloutBg', 'codeBg', 'selection', 'toolbar', 'toolbarText', 'today',
];

export const PALETTES = [
  // ---------- LIGHT ----------
  {
    id: 'honey', name: 'Honey', mode: 'light', isDefault: true,
    bg: '#faf6ec', bg2: '#f3ecdb', text: '#3b3226', muted: '#6b5f4c', border: '#e3d8bf',
    h1: '#7a3a10', h2: '#7d5608', h3: '#4d5c20', h4: '#6e4a26', h5: '#574e41', h6: '#62574a',
    link: '#9a4a18', accent: '#8f6312',
    tagBg: '#f1e2b4', tagFg: '#6b4a10', calloutBg: '#f5ebcf', codeBg: '#f1ead8', selection: '#f0dc9c',
    toolbar: '#e3c677', toolbarText: '#3e2f10', today: '#7a3a10',
    glow: 0.35,
  },
  {
    // Cool blue-grey paper; navy, plum, teal headings.
    id: 'slate', name: 'Slate', mode: 'light', isDefault: false,
    bg: '#eef1f4', bg2: '#e3e8ee', text: '#22282f', muted: '#545e6a', border: '#cfd6de',
    h1: '#1d4a7a', h2: '#6a3f8f', h3: '#1f6159', h4: '#7a4a12', h5: '#3e4650', h6: '#4c5560',
    link: '#1d5b96', accent: '#2a63a8',
    tagBg: '#dde6f0', tagFg: '#1d4a7a', calloutBg: '#e2e8ef', codeBg: '#e4e9ef', selection: '#c9d8ea',
    toolbar: '#d6dee8', toolbarText: '#1d2a3a', today: '#1d4a7a',
    glow: 0.25,
  },
  {
    // Soft green paper; forest, terracotta, indigo headings.
    id: 'sage', name: 'Sage', mode: 'light', isDefault: false,
    bg: '#f0f3ea', bg2: '#e5eadc', text: '#283026', muted: '#556050', border: '#d3dac6',
    h1: '#2f5a2a', h2: '#8a3f16', h3: '#3a4f86', h4: '#6a5410', h5: '#3f473c', h6: '#4d5848',
    link: '#2f6a4a', accent: '#3d7044',
    tagBg: '#dfe8d3', tagFg: '#2f5a2a', calloutBg: '#e5ebdb', codeBg: '#e7ecdf', selection: '#d2e2c0',
    toolbar: '#d5e0c4', toolbarText: '#24301f', today: '#8a3f16',
    glow: 0.3,
  },

  // ---------- DARK ----------
  {
    id: 'arcane', name: 'Arcane', mode: 'dark', isDefault: true,
    bg: '#161512', bg2: '#1d1c19', text: '#e6e1d6', muted: '#a8a296', border: '#34322c',
    h1: '#5fd3c4', h2: '#cf6fd6', h3: '#6aa8ff', h4: '#e0b45e', h5: '#c9c3b6', h6: '#a8a296',
    link: '#6aa8ff', accent: '#4f8ae6',
    tagBg: '#2a2235', tagFg: '#d99be0', calloutBg: '#1e2321', codeBg: '#201f1b', selection: '#2b3a52',
    toolbar: '#1d1c19', toolbarText: '#7fd8cc', today: '#e0b45e',
    glow: 0.5,
    ombre: { pageFrom: '#161512', pageTo: '#181b22', h1: ['#5fd3c4', '#cf6fd6'], h2: ['#cf6fd6', '#6aa8ff'] },
  },
  {
    id: 'deepsea', name: 'Deep Sea', mode: 'dark', isDefault: false,
    bg: '#0c1424', bg2: '#111b30', text: '#dde6f2', muted: '#9aa8bf', border: '#24304a',
    h1: '#7cc4ff', h2: '#5fd3c4', h3: '#b9a8ff', h4: '#e0b45e', h5: '#c3cde0', h6: '#9aa8bf',
    link: '#7cc4ff', accent: '#4a7fd8',
    tagBg: '#1d2a48', tagFg: '#9cc8ff', calloutBg: '#16213a', codeBg: '#111b30', selection: '#233a63',
    toolbar: '#111c33', toolbarText: '#9cc8ff', today: '#e0b45e',
    glow: 0.45,
    ombre: { pageFrom: '#0c1424', pageTo: '#1a1735', h1: ['#7cc4ff', '#8f7dff'], h2: ['#5fd3c4', '#6aa8ff'] },
  },
  {
    id: 'ember', name: 'Ember', mode: 'dark', isDefault: false,
    bg: '#18181a', bg2: '#202022', text: '#ece4d6', muted: '#aaa293', border: '#36342f',
    h1: '#f0c46a', h2: '#e48a5c', h3: '#6fb0e0', h4: '#c9a0dc', h5: '#cfc7b8', h6: '#aaa293',
    link: '#f0c46a', accent: '#c9972f',
    tagBg: '#33291a', tagFg: '#f0c46a', calloutBg: '#222019', codeBg: '#222124', selection: '#4a3c1e',
    toolbar: '#202022', toolbarText: '#f0c46a', today: '#f0c46a',
    glow: 0.5,
    ombre: { pageFrom: '#18181a', pageTo: '#1b1d22', h1: ['#f0c46a', '#e48a5c'], h2: ['#e48a5c', '#6fb0e0'] },
  },
];
