// Store-submission contract: Obsidian's theme directory reads manifest.json from the repo root and
// downloads theme.css/manifest.json from the GitHub release whose tag equals manifest.version.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

test('manifest has the fields the theme directory needs', () => {
  for (const k of ['name', 'version', 'minAppVersion', 'author']) assert.ok(manifest[k], k);
  assert.equal(manifest.name, 'Enough Light');
});

// docs.obsidian.md/Reference/Manifest: the theme fields, and the name rules.
test('manifest uses only documented theme fields and a valid name', () => {
  const allowed = new Set(['name', 'version', 'minAppVersion', 'author', 'authorUrl', 'fundingUrl']);
  for (const k of Object.keys(manifest)) assert.ok(allowed.has(k), `undocumented field: ${k}`);
  assert.match(manifest.name, /^[A-Za-z0-9 ()+-]+$/);
  assert.doesNotMatch(manifest.name, /obsi|sidian|theme/i);
  assert.doesNotMatch(manifest.authorUrl ?? '', /obsidian\.md|obsidian-enough-light/);
});

test('version is semver x.y.z and matches package.json', () => {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(pkg.version, manifest.version);
});

test('repo root has the files a submission needs', () => {
  for (const f of ['theme.css', 'README.md', 'LICENSE', manifest.screenshot ?? 'cover.png']) assert.ok(existsSync(f), f);
});

test('sample note for screenshots is free of personal vault text', () => {
  assert.doesNotMatch(readFileSync('preview/note.html', 'utf8'), /journey|journal/i);
});

// Obsidian's directory review: screenshot 512x288 recommended, >1000x500 flagged.
test('screenshot is a 512x288 PNG', () => {
  const png = readFileSync(manifest.screenshot ?? 'cover.png');
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [512, 288]);
});

// GitHub must recognise the licence (an unrecognised "custom" licence is flagged).
test('LICENSE is the plain MIT text with nothing appended', () => {
  const lic = readFileSync('LICENSE', 'utf8');
  assert.match(lic, /^MIT License\n/);
  assert.match(lic, /OTHER DEALINGS IN THE\nSOFTWARE\.\n$/);
});
