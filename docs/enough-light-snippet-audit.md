# Enough Light — snippet audit (vault obsidian-SRC, 2026-11-08)

Enabled in `appearance.json` → `enabledCssSnippets`:

| Snippet | File exists | Colour/font overrides | With Enough Light |
|---|---|---|---|
| `ntb-cyan-glow` | yes | toolbar button colours + glow; Today button gradient/border/glow | **Replaced** (design §12, colour-only). Disable at switch-over (Sean's OK). |
| `maple-dark-editor-bg` | yes | `--background-primary: #1e1e1e` | **Replaced** — would override every dark palette's page colour. Disable at switch-over. |
| `hide-properties-panel` | **no** | — | Stale entry; does nothing. |
| `supercharged-links-gen` | **no** | — | Stale entry; does nothing. |
| `tolerance-table` | **no** | — | Stale entry; does nothing. |

Present but **not enabled** (no effect): CyanVoxel's General Tweaks, Daily Note Outline, Frontmatter tweaks,
Table tweaks, Compact File Explorer / Properties / Sidebar, Native Scrollbar styles, calendar, vc-weather.

**Also overriding the theme:** `appearance.json` sets `textFontFamily` (Berkeley Mono, …) and
`interfaceFontFamily` (Iosevka, …). While set, the bundled pairings never show, and on iPhone/iPad text falls
back to Avenir. Clear both fields to use the theme's fonts.
