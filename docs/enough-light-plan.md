# Enough Light Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Enough Light Obsidian theme described in the design: six palettes, optional glow/ombre, per-heading controls in Style Settings, four bundled font pairings, and an automated legibility test.

**Architecture:** One data file (`src/palettes.mjs`) is the single source of every colour. A Node build script turns it into palette CSS and the palette part of the Style Settings block, concatenates hand-written CSS layers from `src/css/`, embeds subset woff2 fonts, and writes `theme.css`. The contrast test reads the same data file, so the test and the theme cannot disagree.

**Tech Stack:** Node 26 (no npm dependencies; `node:test`), fonttools via `uvx` (subset + variable-font instancing + woff2), Obsidian CSS variables, Style Settings `@settings` YAML.

**Spec:** `docs/enough-light-design.md`

## Global Constraints

- Theme name `Enough Light`; CSS class/variable prefix `el-` (`--el-*`, `.el-*`).
- Body text ≥ 7:1 contrast; headings, links, tags, muted, placeholder, breadcrumbs ≥ 4.5:1 (target ≥ 5.5 headings), measured against page **and** secondary (sidebar) background; ombre at worst-case ends.
- Glow only on headings; letters stay solid; gradient headings glow via `filter: drop-shadow`.
- `prefers-contrast: more` → muted = body colour, glow off. `prefers-reduced-motion` → no animation.
- Defaults with no settings: Honey (light), Arcane (dark), glow on, ombre off, pairing A.
- Fonts SIL OFL only; Latin subset; heading fonts 400/700/800, body fonts 400/700 + italic 400/700; target built size ≈ 1 MB.
- Every colour defined once in `src/palettes.mjs`; CSS layers only read `--el-*` variables (no hex literals outside palettes).
- Docs live in `docs/`, named `enough-light-*`. Version starts 0.01, +0.01 per release.

## Review Focus

1. **Custom heading colour cleared** — after Style Settings "reset", the heading returns to the palette colour (CSS must use `var(--el-hN-custom, <palette>)`, never a hard default). Test in Task 2.
2. **Palette switched while in the other mode** — choosing a dark palette while in light mode must change nothing until dark mode. Test in Task 2 (selectors scoped by `.theme-light`/`.theme-dark`).
3. **Ombre on a light palette** — ombre switches must have no effect in light mode. Test in Task 2.
4. **No Style Settings plugin** — theme must render with defaults. Test in Task 2 (default palette selectors don't require any `el-` class).
5. **Hex literal leaks into a CSS layer** — would bypass the contrast test. Test in Task 2 (lint `src/css/*.css` for `#rgb` literals).

---

### Task 1: Palette data + legibility test

**Files:**
- Create: `package.json` (`"type":"module"`, scripts `test`, `build`, `dev`), `manifest.json`, `.gitignore`
- Create: `src/palettes.mjs`, `src/contrast.mjs`
- Test: `test/contrast.test.mjs`

**Interfaces:**
- Produces: `export const PALETTES: Palette[]` where `Palette = { id, name, mode:'light'|'dark', isDefault:boolean, bg, bg2, text, muted, faint, border, h1..h6, link, accent, tagBg, tagFg, calloutBg, codeBg, selection, toolbar, toolbarText, glow:{alpha}, ombre:{pageFrom,pageTo,h1:[a,b],h2:[a,b]} }` (ombre on dark only).
- Produces: `contrast(hexA, hexB): number`, `failures(p: Palette): {pair, ratio, min}[]`.

- [ ] Step 1: test — for every palette `failures(p)` is empty; exactly one default per mode; ids unique; required keys present.
- [ ] Step 2: run `node --test` → FAIL (module missing).
- [ ] Step 3: implement data with design §3 values; ombre for Arcane/Ember per design §11; `failures` checks text/bg & text/bg2 ≥ 7, every other foreground vs bg and bg2 ≥ 4.5, tagFg/tagBg ≥ 4.5, toolbarText/toolbar ≥ 4.5, ombre ends vs pageFrom and pageTo ≥ 4.5.
- [ ] Step 4: run → expect FAILs on flagged shades; deepen/lighten only lightness until PASS.
- [ ] Step 5: commit.

### Task 2: CSS layers + build + Style Settings block

**Files:**
- Create: `src/css/10-base.css` (Obsidian variable mapping), `20-typography.css`, `30-headings.css`, `40-effects.css`, `50-components.css` (properties, Bases, tabs, callouts, tags, code, note-toolbar incl. Today button colour-only), `60-mobile.css`, `70-a11y.css`, `src/settings.yaml` (non-palette settings), `scripts/build.mjs`
- Test: `test/build.test.mjs`

**Interfaces:**
- Consumes: `PALETTES`.
- Produces: `buildCss({fonts:boolean}): string`, writes `theme.css`; palette classes `el-light-<id>` / `el-dark-<id>`; toggles `el-glow-off`, `el-ombre-page`, `el-ombre-headings`; pairings `el-fonts-a|b|c|d`; per-heading vars `--el-h{n}-custom`, `--el-h{n}-size`, `--el-h{n}-font`, weight classes.

- [ ] Step 1: tests — built CSS contains a `/* @settings` block whose palette options list every palette id; defaults render without classes (`.theme-light` block sets Honey vars, `.theme-dark` sets Arcane); dark palette selectors all start `.theme-dark`; ombre rules only under `.theme-dark`; `--h1-color` resolves through `var(--el-h1-custom,`; no `#hex` in `src/css/*.css`.
- [ ] Step 2: run → FAIL.
- [ ] Step 3: implement build (palette CSS generated from data; settings block = palette selects generated + `src/settings.yaml`).
- [ ] Step 4: run → PASS.
- [ ] Step 5: commit.

### Task 3: Bundled fonts

**Files:**
- Create: `scripts/fetch-fonts.sh` (downloads google/fonts OFL TTFs + `OFL.txt` per family into `fonts/src/<family>/`, instances variable fonts to static weights, subsets to Latin woff2 into `fonts/woff2/`), `fonts/LICENSES.md`
- Modify: `scripts/build.mjs` (embed `@font-face` base64), `src/css/20-typography.css` (pairing classes)
- Test: `test/fonts.test.mjs`

- [ ] Step 1: test — built CSS has `@font-face` for each family/weight/style listed in Global Constraints; `theme.css` ≤ 1.4 MB; pairing A is default without class.
- [ ] Step 2: run → FAIL. Step 3: implement. Step 4: PASS. Step 5: commit (woff2 committed; TTF sources gitignored).

### Task 4: Test vault, visual check, snippet audit, release 0.01

**Files:**
- Create: `test-vault/` (sample notes: headings H1–H6, properties, callouts, tags, table, code, Base), `scripts/dev.mjs` (build + copy to a target `themes/Enough Light/`), `docs/enough-light-snippet-audit.md`, `README.md`

- [ ] Step 1: `npm run dev -- test-vault` → theme installed in test vault with Style Settings copied from Sean's vault.
- [ ] Step 2: open test vault in Obsidian, screenshot Honey/Arcane/Deep Sea ombre + glow; check each against design.
- [ ] Step 3: audit Sean's enabled snippets for colour/font overrides → doc.
- [ ] Step 4: version 0.01, tag, push. Installing into Sean's real vault waits for his OK (it syncs to all devices).
