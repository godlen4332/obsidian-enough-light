# Enough Light — status / resume point

**Updated:** 2026-11-08 19:40 PT · **Version:** v0.05 (`master`, pushed) · tests 29/29

## Where things are
- Live vault: `~/obs 2025-04-13/obs-2025-04-13` (NOT `~/Documents/obsidian-SRC` — that one was touched by
  mistake and restored). Installed with `npm run dev -- "$HOME/obs 2025-04-13/obs-2025-04-13"`.
- In the live vault: theme = Enough Light; snippets `ntb-cyan-glow` and `sodium` turned off (Sean OK'd);
  Appearance fonts left as Sean has them (Berkeley Mono / Iosevka) — **Sean: don't change fonts**.
- v0.02 fixed: unreadable selected tab (sodium leaked `--nav-item-color-active`); theme now owns all
  nav/hover/focus/icon colours (regression test).
- Sean confirmed "better" after reload.

## v0.03 (2026-11-08) — light palettes spread out
Sean approved ("those color ideas look great. make it so"). Light palettes are now **Honey** (warm yellow),
**Slate** (cool blue-grey; navy/plum/teal) and **Sage** (soft green; forest/terracotta/indigo), replacing
Parchment & Ink and Sunlit. v0.04: Sean said "keep all 4", so **Daylight** (bright white, Arcane's colours by day) is the fourth light
palette. Now 7 palettes: 4 light, 3 dark (count test updated). Sean's saved choice is Honey, so
nothing he selected disappeared. Installed in the live vault.

## How to change a palette
1. Edit `src/palettes.mjs` (Style Settings options regenerate automatically).
2. `npm test` → `./scripts/preview.sh` → look at `preview/out/palettes.png`.
3. Bump version 0.01, `npm run dev -- "<live vault>"`, commit, tag, push. Tell Sean to reload if needed.
4. A removed palette id that Sean had selected falls back to the mode's default.

## Not done yet
- Never seen on iPhone/iPad (Obsidian Sync: enable "Installed community themes" + "Active community theme").
- No independent code review of the build yet (plan's final review step).

## v0.05 (2026-11-08)
- Ember reworked (Sean: "arcane and ember also look too similar"): warm brown paper, gold/copper/rose, no blue.
- Theme-list thumbnail `cover.png` + README; `manifest.json` has `repo` + `screenshot`. They stay blank in
  Obsidian until the repo is public (Obsidian fetches both from raw.githubusercontent.com without login).
  **Open question for Sean: make the repo public?**
- iPhone "fonts not installed": Appearance names Mac-only fonts. `scripts/personal-fonts.sh "<vault>"` writes
  the `enough-light-sean-fonts` snippet (568 KB). Sean must turn it on (Appearance → CSS snippets).
- Vault `appearance.json` shows `ntb-cyan-glow` and `sodium` enabled again (Sync likely restored them).

## Sharing — parked by Sean (2026-11-08, "not yet")
Repo stays private. When Sean wants to share, do a "share-ready" pass first, then publish:
- MIT licence; switch to x.y.z versions (`1.0.0`); GitHub release per version with `theme.css` + `manifest.json`.
- Today-button rule targets Sean's own Note Toolbar button id → make it a Style Settings option or drop it.
- README: remove personal vault path / Berkeley mention. Size 531 KB (fonts) is allowed but heavy.
- Then: make repo public → friends install via BRAT → after ~a week, PR to `obsidianmd/obsidian-releases`
  (`community-css-themes.json`). Making public and submitting each need Sean's go.

## Getting the theme onto iPhone/iPad (2026-11-25)
- The theme reaches other devices ONLY through Obsidian Sync. It cannot come from the theme store while the repo is private.
- Sync's **Installed themes and snippets** and **Appearance settings** switches are per device: turn both on, on the Mac AND on each iPad/iPhone, then fully restart Obsidian there.
- Then pick Enough Light under Appearance → Themes and turn on the `enough-light-sean-fonts` snippet.
- Sean asked "why isn't this theme on my ipad" on 2026-11-25; the cause above is likely but unconfirmed (the iPad's settings can't be seen from the Mac).

## Open with Sean (2026-11-25)
- iPad: turn on the two Sync switches (above); report back if the theme still doesn't appear.
- Turn on `enough-light-sean-fonts`; turn `sodium` and `ntb-cyan-glow` back off.
- Sharing still parked; independent review of the build not done.

## Store-ready (2026-11-25, v0.0.6)
- Sean OK'd going public and submitting (2026-11-25).
- Version is now semver (`0.0.6` = old "0.06"); the release tag must equal it exactly, no `v`.
- Added `LICENSE` (MIT; fonts stay OFL), a font licence header inside theme.css, `test/manifest.test.mjs`
  and `.github/workflows/test.yml` (tests run on GitHub: no tests on Sean's Mac).
- IBM Plex Mono reserves the name "Plex", so the subset copy is renamed **EL Mono C** (file and name table,
  `scripts/rename-font.py`); a real installed IBM Plex Mono still wins via the font stack.
- Removed `!important` (high contrast now zeroes `--el-glow`; the blanket reduced-motion rule is gone: the theme has no motion).
- Sean's Today-button UUID rule moved from the theme to his personal snippet (`personal-fonts.sh`).
- Cover re-shot with neutral sample text (garden notes), not Sean's journal.
- Submission is via community.obsidian.md (sign in, link GitHub, add theme), not a PR to obsidian-releases.

## History scrub + submission (2026-11-25)
- Sean submitted Enough Light at community.obsidian.md (2026-11-25); pending review (not yet in community-css-themes.json).
- Personal line ("Solo journey…/Kate") and the old cover scrubbed from ALL history with git filter-repo; master + v0.01–v0.05 force-pushed by Sean.
- Tag `0.0.6` re-pointed locally to 77bd44e; needs `git push --force origin 0.0.6` (Sean runs it; force-push is blocked for Claude). Until then the old history stays reachable via that tag.
- Backup of pre-scrub history: scratchpad bundle `enough-light-before-scrub.bundle` (Mac only, temporary).
- Berkeley Mono confirmed never committed in any version, release, or theme.css; only the vault snippet carries it (Sync → Sean's own devices).

## 0.0.7 (2026-11-25)

- New Style Settings: "Use Obsidian's accent colour" (class `el-accent-obsidian`; every accent use reads
  `--el-accent-live`; text on accent is black/white from `--accent-l`), bold/italic/highlight colours
  (`--el-*-custom` with palette fallback), line width (drives Obsidian's `--file-line-width`).
- H4–H6 size descriptions no longer claim to shrink on phones (`--el-hscale` covers H1–H3 only).
- CI green at ba7ddcd; release 0.0.7 published with assets; installed in Sean's vault.
- Not yet checked by eye in Obsidian: the accent toggle with a light accent (black text expected).
- Open ideas from the customisation review: per-type callout colours, density, one heading-scale slider,
  monochrome headings; possible empty `--el-hN-font` bug (untested).
- Still pending: Sean's `git push --force origin 0.0.6` (remote tag still at pre-scrub 39f2005);
  directory listing still awaiting Obsidian review.

## 0.0.8 — directory-review audit (2026-11-26)

Research: obsidian-releases PRs are closed (since 2026-05); submission is community.obsidian.md, which scans each
release automatically (Manifest / Releases / Source code / Build verification; Error blocks install, Warning does
not; "Request review" in the entry menu re-scans). Top removal reason: remote resources (16 of 26). Rules checked:
name (no "Obsidian"/"Theme", Basic Latin), manifest fields, tag == version, assets, README/LICENSE/screenshot,
no remote assets, avoid !important, low specificity.

Found and fixed:
- LICENSE had a font note appended, so GitHub showed NOASSERTION ("custom licence" warning). Now plain MIT; GitHub detects MIT. Font note stays in README.
- cover.png was 1024x576 (old validator: >1000x500 = error). Now 512x288; preview.sh resizes.
- manifest had undocumented `repo` and `screenshot` keys; removed.
- Four `:not(#el)` ID-specificity tricks removed (guideline: low specificity, let snippets override).
- New tests: no !important, no ID selectors, no remote url()/@import in built CSS, screenshot 512x288, plain MIT, manifest fields + name rules. CI 43/43 at 639b911; release 0.0.8 published; installed in vault.
