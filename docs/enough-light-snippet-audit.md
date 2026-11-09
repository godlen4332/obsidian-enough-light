# Enough Light — snippet audit (live vault, 2026-11-08)

**Live vault:** `~/obs 2025-04-13/obs-2025-04-13` (the only vault registered in Obsidian on the Mac).
`~/Documents/obsidian-SRC` is an older copy — not opened by Obsidian here; it was left unchanged.

Enabled snippets before install → after:

| Snippet | Overrides | With Enough Light |
|---|---|---|
| `ntb-cyan-glow` | toolbar colours + glow; Today button gradient/border/glow | **Turned off** (design §12, colour-only, built in). |
| `sodium` | Wasp companion: dark backgrounds, text and **H1–H6 colours** (`.theme-dark`, 47 colour literals) | **Still on — Sean to decide.** Enough Light's selectors are more specific, so its palette wins for the variables it sets; Sodium still fills any variable the theme leaves alone, which breaks "say it once" and isn't covered by the contrast test. |
| `hide-properties-panel`, `supercharged-links-gen`, `tolerance-table` | — | Listed as enabled but the files don't exist; no effect. |

Present but not enabled: CyanVoxel's General Tweaks, Daily Note Outline, Frontmatter/Table tweaks, Compact
Explorer/Properties/Sidebar, Native Scrollbar, calendar, vc-weather, maple-dark-editor-bg.

**Fonts:** `textFontFamily` (Berkeley Mono Variable, …) and `interfaceFontFamily` (Iosevka, …) are set and
were kept at Sean's request, so the bundled pairings don't show; per-heading fonts from the pairing still
apply to headings (headings use `--el-font-heading`, which these fields don't override).
