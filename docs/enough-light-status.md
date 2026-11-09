# Enough Light — status / resume point

**Updated:** 2026-11-08 19:25 PT · **Version:** v0.03 (`master`, pushed) · tests 28/28

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
Parchment & Ink and Sunlit. **Daylight** (bright white, Arcane's colours) was not chosen; its values stay in
`docs/proposals/enough-light-light-palettes-2026-11-08.mjs` if wanted later. Sean's saved choice is Honey, so
nothing he selected disappeared. Installed in the live vault.

## How to change a palette
1. Edit `src/palettes.mjs` (Style Settings options regenerate automatically).
2. `npm test` → `./scripts/preview.sh` → look at `preview/out/palettes.png`.
3. Bump version 0.01, `npm run dev -- "<live vault>"`, commit, tag, push. Tell Sean to reload if needed.
4. A removed palette id that Sean had selected falls back to the mode's default.

## Not done yet
- Never seen on iPhone/iPad (Obsidian Sync: enable "Installed community themes" + "Active community theme").
- No independent code review of the build yet (plan's final review step).
