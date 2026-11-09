# Enough Light

A calm, legible Obsidian theme. Enough light to read by, nothing more.

- **Seven palettes:** light Honey · Slate · Sage · Daylight; dark Arcane · Deep Sea · Ember.
- **Optional effects:** heading glow (all palettes), ombre page fade and gradient headings (dark).
- **Per-heading controls** (H1–H6 colour, size, font, weight) and **four bundled font pairings** via the
  [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) plugin.
- **Legibility is tested, not eyeballed:** body ≥ 7:1, headings ≥ 5.5:1, other text ≥ 4.5:1, on page and sidebar.
- **Say it once:** every colour lives in `src/palettes.mjs`; each element gets one visual signal.

Design: [docs/enough-light-design.md](docs/enough-light-design.md) · Plan: [docs/enough-light-plan.md](docs/enough-light-plan.md)

## Use

```bash
npm test                                    # legibility + build + font contracts
npm run build                               # writes theme.css (≈ 530 KB, fonts embedded)
npm run dev -- "$HOME/obs 2025-04-13/obs-2025-04-13" [--watch]   # build + install (live vault)
./scripts/preview.sh                        # screenshots on Obsidian's real app.css → preview/out/
./scripts/fetch-fonts.sh                    # rebuild fonts/woff2 from google/fonts (needs uv)
```

Then: Settings → Appearance → Themes → **Enough Light**; Settings → Style Settings → Enough Light.

**Fonts:** the bundled fonts only show if Settings → Appearance → *Text font* and *Interface font* are
empty (those fields override any theme). **Other devices:** Obsidian Sync → enable *Active community theme*
and *Installed community themes* on each device.

Fonts are SIL Open Font License — see `fonts/licenses/`.
