#!/usr/bin/env node
// Build and install into a vault: node scripts/dev.mjs <vault-path> [--watch]
// Writes <vault>/.obsidian/themes/Enough Light/{theme.css,manifest.json}.
// Obsidian reloads theme CSS when the file changes. There is deliberately no
// default vault: installing into the real vault syncs to every device.
import { mkdirSync, writeFileSync, copyFileSync, existsSync, watch } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [vault, flag] = process.argv.slice(2);
if (!vault || !existsSync(join(vault, '.obsidian'))) {
  console.error('usage: node scripts/dev.mjs <vault-path> [--watch]   (path must contain .obsidian/)');
  process.exit(1);
}
const dest = join(vault, '.obsidian', 'themes', 'Enough Light');

async function install() {
  // Fresh import each time so --watch picks up edits to palettes/settings.
  const { buildCss } = await import(`./build.mjs?t=${Date.now()}`);
  mkdirSync(dest, { recursive: true });
  const css = buildCss({ fonts: true });
  writeFileSync(join(ROOT, 'theme.css'), css);
  writeFileSync(join(dest, 'theme.css'), css);
  copyFileSync(join(ROOT, 'manifest.json'), join(dest, 'manifest.json'));
  console.log(`${new Date().toLocaleTimeString()} installed → ${dest} (${(css.length / 1024).toFixed(0)} KB)`);
}
await install();
if (flag === '--watch') {
  let t;
  watch(join(ROOT, 'src'), { recursive: true }, () => { clearTimeout(t); t = setTimeout(install, 150); });
  console.log('watching src/ …');
}
