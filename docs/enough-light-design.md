# Enough Light — design

Status: draft for Sean's approval · 2026-11-08 · repo `godlen4332/obsidian-enough-light` (private)

## 1. Intent

A personal Obsidian theme for Sean's journal and working vault (`~/Documents/obsidian-SRC`), used on Mac,
iPhone and iPad. The name carries the intent: **calm, sitting with, sufficiency** — enough light to read by,
nothing more.

It takes two things Sean likes from existing themes and drops the rest:

- From **Wasp** (Santi Younger) and **Maple** (his current theme): the calm, warm, yellow-leaning off-white
  light mode and a plain layout.
- From **MagicUser** (Bernardo Pires): the dark-mode colours (teals, magentas, blues, ombres), the optional
  heading glow, and rich per-heading controls through Style Settings.

It replaces Maple plus two patch snippets in the vault (`ntb-cyan-glow`, `maple-dark-editor-bg`).

## 2. Principles (Sean's, in priority order)

1. **Legibility first.** Every choice gives way to reading comfort. See the contrast bar in §5.
2. **Say it once.** Each visual signal does one job. A heading's level is carried by size and weight, helped by
   colour, never repeated with extra underlines/borders/icons. Emphasis (glow) is spent on headings only. No
   stacked decoration (border + shadow + tint on the same element). Every colour is defined once, as a variable,
   and read everywhere.
3. **Calm.** Effects are optional and soft; nothing animates for its own sake.
4. **Same on every device.** Mac, iPhone, iPad look the same (bundled fonts, §6) and stay fast.

**Anti-goals** (would make it a failure even if it "works"): a heading or muted label you have to squint at; a
glow that blurs letters; MagicUser-style sprawl of overlapping effects; a theme that looks different on the
phone; headings that are only told apart by colour.

## 3. Palettes (Sean's call: all six ship)

Sean picks one light and one dark palette in Style Settings; Obsidian's own light/dark switch moves between
them. Starting values from the approved mockups — **the builder darkens/lightens shades as needed to meet §5;
hue family is the decision, not the exact hex.**

| Mode | Palette | Page | Body | H1 | H2 | H3 | Accent / link |
|---|---|---|---|---|---|---|---|
| Light | **Honey** (default light; Maple's look, distinct headings) | `#faf6ec` | `#3b3226` | rust `#7a3a10` | amber `#7d5608` | olive `#4d5c20` | `#a0521d`, toolbar band `#e3c677` |
| Light | **Slate** (cool blue-grey; replaced Parchment & Ink 2026-11-08, too close to Honey) | `#eef1f4` | `#22282f` | navy `#1d4a7a` | plum `#6a3f8f` | teal `#1f6159` | `#1d5b96`, accent `#2a63a8` |
| Light | **Sage** (soft green; replaced Sunlit 2026-11-08) | `#f0f3ea` | `#283026` | forest `#2f5a2a` | terracotta `#8a3f16` | indigo `#3a4f86` | `#2f6a4a`, accent `#3d7044` |
| Light | **Daylight** (bright white; Arcane's colours by day; added 2026-11-08) | `#ffffff` | `#1f2328` | teal `#08695f` | magenta `#a3289e` | blue `#2559c7` | `#2559c7` |
| Dark | **Arcane** (default dark; MagicUser look) | `#161512` | `#e6e1d6` | teal `#5fd3c4` | magenta `#cf6fd6` | blue `#6aa8ff` | `#6aa8ff`, rule `#2f6fd0` |
| Dark | **Deep Sea** (ombre) | fade `#0c1424`→`#1a1735` | `#dde6f2` | gradient `#7cc4ff`→`#8f7dff` | gradient `#5fd3c4`→`#6aa8ff` | lilac `#b9a8ff` | `#7cc4ff` |
| Dark | **Ember** (dark twin of Honey) | `#18181a` | `#ece4d6` | gold `#f0c46a` | copper `#e48a5c` | sky `#6fb0e0` | `#f0c46a` |

\* below the bar in the mockup; must be deepened. "Ember" is already a community theme name — fine as a palette
name inside this private theme; rename (e.g. "Hearthlight") only if it is ever published.

H4–H6 are derived per palette (builder's call), each visibly distinct from body text by size/weight.

Each palette also defines: muted text (property labels, "Empty", breadcrumbs, file tree secondary), faint
borders, selection, tag pill bg/fg, callout bg/border, code bg, the note-toolbar band, active tab, and
interactive (button/hover) colours.

## 4. Settings panel (Style Settings; installed in the vault)

Theme colours live **in the theme**, configured through the Style Settings plugin. Cutaway (Sean's plugin) does
not own colours; it reads the theme's variables (its type control already defaults to "theme").

Settings, grouped:

- **Palettes** — light palette (3 choices), dark palette (3 choices).
- **Effects** — heading glow on/off (all palettes, both modes; softer by default in light); ombre page fade
  on/off; ombre gradient headings on/off. The two ombre switches work with any dark palette, not only Deep Sea.
- **Fonts** — font pairing (A–D, §6); body text size.
- **Headings, H1–H6, each** — font (default: pairing), size, colour (default: palette), weight. A custom colour
  overrides the palette; the theme cannot contrast-check custom values and says so in the setting's description.

Defaults must look right with zero configuration: Honey / Arcane, glow on, ombre off, pairing A.

## 5. Legibility bar (Sean's: "legibility is very important")

Measured with the WCAG contrast formula against the actual background (for ombre: the worst-case point of
both the text gradient and the page fade).

- Body text **≥ 7:1** in every palette.
- Headings, links, tags, muted/secondary text, placeholder text ("Empty", `mm/dd/yyyy`), breadcrumbs **≥ 4.5:1**;
  target ≥ 5.5:1 for headings.
- Glow never reduces contrast: letters stay solid, glow is behind. On gradient headings use
  `filter: drop-shadow`, not `text-shadow` (text-shadow on transparent text breaks).
- Heading levels differ by a clear step in size and weight; colour is never the only signal.
- OS **Increase Contrast** (`prefers-contrast: more`) → strongest shades, glow off. OS **Reduce Motion** →
  no animations.
- Minimum sizes: body ≥ 16px equivalent; nothing below 12px anywhere in the UI chrome.

**Enforced by a test**, not by eye: a script in the repo reads every palette's colour pairs and fails if any
drops below the bar. It runs before every release (`npm test` or equivalent).

## 6. Fonts (Sean's call: bundled, all four pairings selectable)

Bundled so Mac, iPhone and iPad render identically (phones don't have Sean's Mac fonts). All SIL OFL — free to
embed. Berkeley Mono (Sean's current body font) is commercially licensed and is **not** bundled; Sean can still
type it into a heading/body font override on desktop.

| Pairing | Headings | Body |
|---|---|---|
| **A** (default) | Atkinson Hyperlegible Next | Atkinson Hyperlegible Mono |
| B | Poppins | JetBrains Mono |
| C | Inter | IBM Plex Mono |
| D | Atkinson Hyperlegible Next | Atkinson Hyperlegible Next |

Bundling: subset to Latin (plus common punctuation, arrows, en/em dash, curly quotes), only weights used
(400, 700, and the H1 weight), woff2, base64-embedded in the built `theme.css`. Target built size ≈ 1 MB.
**Measure** cold-start on iPhone with and without the fonts; if the difference is noticeable, ask Sean
before splitting extra pairings into an add-on (do not split unilaterally).

## 7. Coverage

Beyond the note body, the theme styles (so the palette is consistent, "say it once"):

- Tabs (incl. the `vertical-tabs` plugin), sidebars, file explorer and `notebook-navigator`, status bar.
- Properties panel (incl. the `pretty-properties` plugin) — the muted labels are the commonest legibility failure.
- **Bases** tables and toolbar (Sort / Group / Filter row), Dataview tables.
- The **note-toolbar** plugin row (the yellow band in light, the blue rule in dark in Sean's screenshots).
- Callouts, tags, code blocks, blockquotes, tables, task checkboxes, embeds, canvas cards, graph view colours.
- Mobile toolbar and mobile navigation.

Not in scope: re-styling individual plugin UIs beyond inheriting the palette variables; Obsidian Publish site.

## 8. Devices and delivery

- `isDesktopOnly` concept doesn't apply to themes; the theme must work on Obsidian desktop and mobile
  (`minAppVersion` = current Obsidian that has Bases).
- Effects stay cheap: glow is one shadow on headings only; ombre page fade is a static background, not
  repainted on scroll. No separate "phone mode" switch.
- Heading size steps shrink slightly on narrow screens (`is-mobile` / `is-phone`) so H1 doesn't wrap into
  three lines.
- **Delivery:** vault syncs via **Obsidian Sync** (core plugin on) and also sits in iCloud Drive
  (`~/Documents`). Install = build → copy `theme.css` + `manifest.json` to
  `obsidian-SRC/.obsidian/themes/Enough Light/` → select it. Obsidian Sync must have "Active community theme"
  and "Installed community themes" enabled on each device for the phone/iPad to receive it — verify on
  first install.
- Dev loop: the build writes straight into the vault's theme folder; Obsidian reloads CSS on change.
- On switch-over, disable the `ntb-cyan-glow` and `maple-dark-editor-bg` snippets (their effects are now
  built in). Leave Maple installed for rollback.

## 9. Repo shape (builder's call within these bounds)

- Source CSS (or SCSS) split by concern: palettes, typography, headings, effects, components, settings block;
  a build step concatenates, embeds fonts, and writes `theme.css`.
- `manifest.json` (`name: "Enough Light"`, author Sean), `README.md`, `docs/` (all docs; names prefixed
  `enough-light-…`), `versions` starting at 0.01 and bumping 0.01 per release.
- The contrast test from §5; font licences included in the repo.
- Style Settings block written in the documented `/* @settings */` YAML format.

## 10. Left to the builder

Exact hex adjustments to meet §5; H4–H6 colours; font sizes/scale ratio; build tooling (plain Node script
preferred over a framework); file layout; glow radius/opacity; how to name CSS classes/variables
(prefix `enough-`).

## 11. Calls made after the builder check (Claude's calls — Sean to confirm while reading)

- **Ombre on Arcane and Ember.** Gradient headings fade H1 colour → H2 colour of that palette (H2 → H3 for
  H2); the page fade runs page colour → page colour tinted ~6% toward the palette's H3. Both ends must pass §5.
- **Font weights.** Static weights, not variable fonts: 400, 700, 800 for heading fonts; 400, 700 plus italic
  400 and 700 for body fonts (journals need italics). The per-heading weight setting is a menu of
  Regular / Bold / Heavy, so nothing is ever faux-bolded. Re-measure the ~1 MB target with these.
- **Interface font** (sidebars, tabs, properties, settings) = the pairing's heading font, i.e. proportional
  and legible; Obsidian's own Appearance → Interface font still overrides it.
- **Other vault snippets** (compact explorer/properties/sidebar, frontmatter and table tweaks, CyanVoxel's
  General Tweaks, calendar, daily-note outline) keep running. The builder audits each for colour or font
  overrides and lists them; any colour they set moves into the theme's variables so the contrast test reflects
  the real screen. No snippet is deleted or disabled without Sean's OK.

## 12. Decided after review (Sean, 2026-11-08)

- **`ntb-cyan-glow` effects → colour only.** The note-toolbar "Today" button keeps one signal: the palette's
  gold/accent colour (no gradient, border or outer glow). Toolbar hover becomes a plain colour change (no
  drop-shadow glow). Glow stays reserved for headings. The snippet is then disabled (with Sean's OK at
  switch-over, per §11).

## 13. Open

- None.
