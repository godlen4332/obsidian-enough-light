// Style Settings panel definition (design §4). The palette pickers are built
// from PALETTES and the six heading sections from one template, so nothing is
// written twice. scripts/build.mjs serialises this to the /* @settings */ YAML.
import { PALETTES } from './palettes.mjs';

const DEFAULT_SIZES = { 1: 2, 2: 1.6, 3: 1.3, 4: 1.15, 5: 1.05, 6: 1 };
const lightDefault = PALETTES.find((p) => p.mode === 'light' && p.isDefault);
const darkDefault = PALETTES.find((p) => p.mode === 'dark' && p.isDefault);

// Previews (0.0.9). Style Settings renders an info-text with markdown: true
// through Obsidian's Markdown renderer, so a line of plain HTML comes through
// with its classes, and the theme's CSS (src/css/80-settings-preview.css plus
// the generated per-palette swatch variables) paints it. The dropdown itself
// is a native <select>, which no theme can colour.
const palettePreview = (mode) => ({
  id: `el-${mode}-palette-preview`,
  type: 'info-text',
  markdown: true,
  description: `<div class="el-swatches">${PALETTES.filter((p) => p.mode === mode)
    .map((p) => `<span class="el-sw el-sw-${p.id}"><span class="el-sw-name">${p.name}</span><span class="el-sw-h1">Heading</span><span class="el-sw-h2">Subheading</span><span class="el-sw-body">Text and <span class="el-sw-link">link</span></span></span>`)
    .join('')}</div>`,
});

// One live sample of all six levels; it reads the same --hN-* variables as
// notes, so it changes the moment a heading setting does.
const headingPreview = {
  id: 'el-heading-preview',
  type: 'info-text',
  markdown: true,
  description: `<div class="el-hp">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="el-hp-${n}">Heading ${n}</div>`).join('')}</div>`,
};

const paletteSelect = (mode, title) => ({
  id: `el-${mode}-palette`,
  title,
  type: 'class-select',
  allowEmpty: false,
  default: `el-${mode}-${PALETTES.find((p) => p.mode === mode && p.isDefault).id}`,
  options: PALETTES.filter((p) => p.mode === mode).map((p) => ({ label: p.name, value: `el-${mode}-${p.id}` })),
});

// A colour that follows the palette until the user picks one (same pattern as
// the heading colours: the CSS reads var(--id, palette value)).
const themedColour = (id, title, key) => ({
  id,
  title,
  description: 'Leave untouched to follow the palette; reset to go back to it. A custom colour is not contrast-checked.',
  type: 'variable-themed-color',
  format: 'hex',
  opacity: false,
  'default-light': lightDefault[key],
  'default-dark': darkDefault[key],
});

const headingSection = (n) => [
  { id: `el-h${n}-heading`, title: `H${n}`, type: 'heading', level: 2, collapsed: true },
  // This level alone, live, at the top of its own section.
  {
    id: `el-h${n}-preview`,
    type: 'info-text',
    markdown: true,
    description: `<div class="el-hp el-hp-solo"><div class="el-hp-${n}">Heading ${n} sample</div></div>`,
  },
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
    description: n <= 3 ? 'In em (1 = body text). Shrinks a little on phones.' : 'In em (1 = body text).',
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
    palettePreview('light'),
    paletteSelect('dark', 'Dark palette'),
    palettePreview('dark'),

    { id: 'el-colours', title: 'Accent and text colours', type: 'heading', level: 1, collapsed: true },
    {
      id: 'el-accent-obsidian',
      title: "Use Obsidian's accent colour",
      description: "Off: the palette's accent (contrast-checked). On: the colour from Settings → Appearance → Accent color, which is not contrast-checked.",
      type: 'class-toggle',
      default: false,
    },
    themedColour('el-bold-custom', 'Bold text colour', 'text'),
    themedColour('el-italic-custom', 'Italic text colour', 'text'),
    themedColour('el-highlight-custom', 'Highlight colour (==text==)', 'selection'),

    { id: 'el-layout', title: 'Layout', type: 'heading', level: 1, collapsed: true },
    {
      id: 'file-line-width',
      title: 'Line width',
      description: 'Width of the text column in pixels. Only applies when Settings → Editor → "Readable line length" is on.',
      type: 'variable-number-slider',
      default: 700,
      min: 480,
      max: 1400,
      step: 20,
      format: 'px',
    },

    { id: 'el-effects', title: 'Effects', type: 'heading', level: 1, collapsed: false },
    { id: 'el-glow', title: 'Heading glow', description: 'On by default; softer in light mode.', type: 'class-toggle', default: true },
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
        { label: 'C — Inter + EL Mono C (IBM Plex Mono, renamed)', value: 'el-fonts-c' },
        { label: 'D — Atkinson Hyperlegible Next (both)', value: 'el-fonts-d' },
      ],
    },

    { id: 'el-headings', title: 'Headings', type: 'heading', level: 1, collapsed: true },
    headingPreview,
    ...[1, 2, 3, 4, 5, 6].flatMap(headingSection),
  ],
};
