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
