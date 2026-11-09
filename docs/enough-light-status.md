# Enough Light — status / resume point

**Updated:** 2026-11-08 19:20 PT · **Version:** v0.02 (`master`, pushed) · tests 28/28

## Where things are
- Live vault: `~/obs 2025-04-13/obs-2025-04-13` (NOT `~/Documents/obsidian-SRC` — that one was touched by
  mistake and restored). Installed with `npm run dev -- "$HOME/obs 2025-04-13/obs-2025-04-13"`.
- In the live vault: theme = Enough Light; snippets `ntb-cyan-glow` and `sodium` turned off (Sean OK'd);
  Appearance fonts left as Sean has them (Berkeley Mono / Iosevka) — **Sean: don't change fonts**.
- v0.02 fixed: unreadable selected tab (sodium leaked `--nav-item-color-active`); theme now owns all
  nav/hover/focus/icon colours (regression test).
- Sean confirmed "better" after reload.

## Open — waiting on Sean
**Light palettes too similar.** Proposal (rendered `preview/out/light-proposal.png`, all pass the test):
keep **Honey** (warm yellow); replace Parchment & Ink → **Slate** (cool blue-grey paper; navy/plum/teal);
replace Sunlit → **Sage** (soft green paper; forest/terracotta/indigo); alternative third: **Daylight**
(bright white; teal/magenta/blue = Arcane by day). Values: `docs/proposals/enough-light-light-palettes-2026-11-08.mjs`.
Question to Sean: which three light palettes?

## To apply the answer
1. Edit `src/palettes.mjs` (ids change → also Style Settings options regenerate automatically).
2. `npm test` → `./scripts/preview.sh` → look at `preview/out/palettes.png`.
3. Bump version 0.01, `npm run dev -- "<live vault>"`, commit, tag, push. Tell Sean to reload if needed.
4. If an old palette id is removed and Sean had selected it, Style Settings falls back to the default.

## Not done yet
- Never seen on iPhone/iPad (Obsidian Sync: enable "Installed community themes" + "Active community theme").
- No independent code review of the build yet (plan's final review step).
