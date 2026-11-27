#!/usr/bin/env node
// Builds theme.css: header → @settings block → embedded fonts → palette
// variables (from src/palettes.mjs) → hand-written layers (src/css/*.css).
// Usage: node scripts/build.mjs [--no-fonts] [--out <file>]
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PALETTES } from '../src/palettes.mjs';
import { onAccent } from '../src/contrast.mjs';
import { SETTINGS } from '../src/settings.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// ---------- Style Settings YAML (just the subset of YAML this file needs) ----------
// Quote only when YAML needs it (colours start with '#', titles may hold ':' or '&', '' is empty).
const scalar = (v) =>
  typeof v === 'string' && (v === '' || /[:#&*!|>'"%@`,[\]{}]|^[-?\s]|\s$/.test(v))
    ? `'${v.replace(/'/g, "''")}'`
    : String(v);
function yamlItem(obj, indent) {
  const pad = ' '.repeat(indent);
  return Object.entries(obj)
    .map(([k, v], i) => {
      const lead = i === 0 ? `${pad}- ` : `${pad}  `;
      if (Array.isArray(v)) return `${lead}${k}:\n${v.map((o) => yamlItem(o, indent + 4)).join('\n')}`;
      return `${lead}${k}: ${scalar(v)}`;
    })
    .join('\n');
}
export function settingsBlock() {
  // name/id stay unquoted so tools (and our test) can read them plainly.
  return `/* @settings\nname: ${SETTINGS.name}\nid: ${SETTINGS.id}\nsettings:\n${SETTINGS.settings.map((s) => yamlItem(s, 2)).join('\n')}\n*/`;
}

// ---------- Palette variables ----------
export function paletteVars(p) {
  const skip = new Set(['id', 'name', 'mode', 'isDefault', 'ombre', 'glow']);
  const lines = Object.entries(p)
    .filter(([k]) => !skip.has(k))
    .map(([k, v]) => `  --el-${kebab(k)}: ${v};`);
  lines.push(`  --el-on-accent: ${onAccent(p)};`);
  lines.push(`  --el-glow: ${p.glow};`);
  if (p.ombre) {
    lines.push(`  --el-ombre-page-from: ${p.ombre.pageFrom};`, `  --el-ombre-page-to: ${p.ombre.pageTo};`);
    lines.push(`  --el-ombre-h1-a: ${p.ombre.h1[0]};`, `  --el-ombre-h1-b: ${p.ombre.h1[1]};`);
    lines.push(`  --el-ombre-h2-a: ${p.ombre.h2[0]};`, `  --el-ombre-h2-b: ${p.ombre.h2[1]};`);
  }
  return lines.join('\n');
}
export function paletteCss() {
  return PALETTES.map((p) => {
    // The default palette also answers to the bare mode class, so the theme
    // is correct with no Style Settings class at all.
    const sel = [`body.theme-${p.mode}.el-${p.mode}-${p.id}`];
    if (p.isDefault) sel.unshift(`body.theme-${p.mode}`);
    return `/* ${p.name} (${p.mode}${p.isDefault ? ', default' : ''}) */\n${sel.join(',\n')} {\n${paletteVars(p)}\n}`;
  }).join('\n\n');
}

// ---------- Settings swatches: each palette's own colours, for its preview chip ----------
// The chip shows that palette whatever palette is live, so these are plain
// classes, not body-scoped. The live palette's chip gets an outline (the
// default one also when Style Settings has set no class yet).
export function swatchCss() {
  const chips = PALETTES.map((p) =>
    `.el-sw-${p.id} { --sw-bg: ${p.bg}; --sw-text: ${p.text}; --sw-border: ${p.border}; --sw-1: ${p.h1}; --sw-2: ${p.h2}; --sw-3: ${p.h3}; --sw-4: ${p.accent}; }`);
  const live = PALETTES.map((p) => {
    const others = PALETTES.filter((o) => o.mode === p.mode && o.id !== p.id).map((o) => `:not(.el-${o.mode}-${o.id})`).join('');
    const sel = [`body.el-${p.mode}-${p.id} .el-sw-${p.id}`];
    if (p.isDefault) sel.push(`body${others} .el-sw-${p.id}`);
    return sel.join(',\n');
  });
  return [...chips, `${live.join(',\n')} {\n  outline: 2px solid var(--interactive-accent);\n  outline-offset: 2px;\n}`].join('\n');
}

// ---------- Fonts: fonts/woff2/<Family>__<weight>__<style>.woff2 ----------
export function fontFaceCss() {
  const dir = join(ROOT, 'fonts', 'woff2');
  if (!existsSync(dir)) return '';
  return readdirSync(dir)
    .filter((f) => f.endsWith('.woff2'))
    .sort()
    .map((f) => {
      const [family, weight, style] = f.replace(/\.woff2$/, '').split('__');
      const b64 = readFileSync(join(dir, f)).toString('base64');
      return `@font-face { font-family: "${family}"; font-weight: ${weight}; font-style: ${style}; font-display: swap; src: url(data:font/woff2;base64,${b64}) format("woff2"); }`;
    })
    .join('\n');
}

// ---------- Font licence notice: travels inside theme.css, since users get only that file ----------
export function fontLicenceCss() {
  const dir = join(ROOT, 'fonts', 'licenses');
  if (!existsSync(dir)) return '';
  const lines = readdirSync(dir).filter((f) => f.endsWith(' - OFL.txt')).sort().map((f) => {
    const family = f.replace(' - OFL.txt', '');
    const copyright = readFileSync(join(dir, f), 'utf8').split('\n').find((l) => /copyright/i.test(l))?.trim() ?? '';
    const shown = family === 'IBM Plex Mono' ? 'EL Mono C (IBM Plex Mono, subset and renamed: "Plex" is a Reserved Font Name)' : family;
    return `   ${shown}: ${copyright}`;
  });
  return ['/* Bundled fonts, embedded below under the SIL Open Font License 1.1 (https://openfontlicense.org).',
    '   Full licence texts: https://github.com/godlen4332/obsidian-enough-light/tree/master/fonts/licenses',
    ...lines, '*/'].join('\n');
}

export function buildCss({ fonts = true } = {}) {
  const layers = readdirSync(join(ROOT, 'src', 'css'))
    .filter((f) => f.endsWith('.css'))
    .sort()
    .map((f) => readFileSync(join(ROOT, 'src', 'css', f), 'utf8'))
    .join('\n');
  return [
    `/* Enough Light ${pkg.version} — a calm, legible Obsidian theme. Built file: edit src/, not this. */`,
    fontLicenceCss(),
    settingsBlock(),
    fonts ? fontFaceCss() : '',
    '/* ===== Palettes (generated from src/palettes.mjs) ===== */',
    paletteCss(),
    swatchCss(),
    layers,
  ].filter(Boolean).join('\n\n') + '\n';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : join(ROOT, 'theme.css');
  const css = buildCss({ fonts: !args.includes('--no-fonts') });
  writeFileSync(out, css);
  console.log(`wrote ${out} (${(css.length / 1024).toFixed(0)} KB)`);
}
