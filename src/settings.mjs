// Style Settings panel definition (design §4). The palette pickers are built
// from PALETTES and the six heading sections from one template, so nothing is
// written twice. scripts/build.mjs serialises this to the /* @settings */ YAML.
import { PALETTES } from './palettes.mjs';

const DEFAULT_SIZES = { 1: 2, 2: 1.6, 3: 1.3, 4: 1.15, 5: 1.05, 6: 1 };
const lightDefault = PALETTES.find((p) => p.mode === 'light' && p.isDefault);
const darkDefault = PALETTES.find((p) => p.mode === 'dark' && p.isDefault);

const paletteSelect = (mode, title) => ({
  id: `el-${mode}-palette`,
  title,
  type: 'class-select',
  allowEmpty: false,
  default: `el-${mode}-${PALETTES.find((p) => p.mode === mode && p.isDefault).id}`,
  options: PALETTES.filter((p) => p.mode === mode).map((p) => ({ label: p.name, value: `el-${mode}-${p.id}` })),
});

const headingSection = (n) => [
  { id: `el-h${n}-heading`, title: `H${n}`, type: 'heading', level: 2, collapsed: true },
  {
    id: `el-h${n}-custom`,
    title: `H${n} colour`,
    description: 'Leave untouched to follow the palette; reset to go back to it. A custom colour is not contrast-checked.',
    type: 'variable-themed-color',
    format: 'hex',
    opacity: false,
    'default-light': lightDefault[`h${n}`],
    'default-dark': darkDefault[`h${n}`],
  },
  {
    id: `el-h${n}-size`,
    title: `H${n} size`,
    description: 'In em (1 = body text). Shrinks a little on phones.',
    type: 'variable-number-slider',
    default: DEFAULT_SIZES[n],
    min: 0.8,
    max: 3.5,
    step: 0.05,
    format: 'em',
  },
  {
    id: `el-h${n}-font`,
    title: `H${n} font`,
    description: "Font name, e.g. Poppins. Empty = the pairing's heading font. Fonts not bundled with the theme only show on devices that have them.",
    type: 'variable-text',
    default: '',
  },
  {
    id: `el-h${n}-weight`,
    title: `H${n} weight`,
    type: 'class-select',
    allowEmpty: true,
    default: '',
    options: [
      { label: 'Regular', value: `el-h${n}-w-regular` },
      { label: 'Bold', value: `el-h${n}-w-bold` },
      { label: 'Heavy', value: `el-h${n}-w-heavy` },
    ],
  },
];

export const SETTINGS = {
  name: 'Enough Light',
  id: 'enough-light',
  settings: [
    { id: 'el-palettes', title: 'Palettes', type: 'heading', level: 1, collapsed: false },
    paletteSelect('light', 'Light palette'),
    paletteSelect('dark', 'Dark palette'),

    { id: 'el-effects', title: 'Effects', type: 'heading', level: 1, collapsed: false },
    { id: 'el-glow-off', title: 'Turn off heading glow', description: 'Glow is on by default, softer in light mode.', type: 'class-toggle', default: false },
    { id: 'el-ombre-page', title: 'Ombre page fade (dark mode)', type: 'class-toggle', default: false },
    { id: 'el-ombre-headings', title: 'Ombre gradient headings (dark mode, H1–H2)', type: 'class-toggle', default: false },

    { id: 'el-fonts-heading', title: 'Fonts', type: 'heading', level: 1, collapsed: false },
    {
      id: 'el-fonts',
      title: 'Font pairing',
      description: "Bundled, so every device matches. Obsidian's Settings → Appearance font fields override these when filled in.",
      type: 'class-select',
      allowEmpty: false,
      default: 'el-fonts-a',
      options: [
        { label: 'A — Atkinson Hyperlegible Next + Mono', value: 'el-fonts-a' },
        { label: 'B — Poppins + JetBrains Mono', value: 'el-fonts-b' },
        { label: 'C — Inter + IBM Plex Mono', value: 'el-fonts-c' },
        { label: 'D — Atkinson Hyperlegible Next (both)', value: 'el-fonts-d' },
      ],
    },

    { id: 'el-headings', title: 'Headings', type: 'heading', level: 1, collapsed: true },
    ...[1, 2, 3, 4, 5, 6].flatMap(headingSection),
  ],
};
