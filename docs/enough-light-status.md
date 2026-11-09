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
