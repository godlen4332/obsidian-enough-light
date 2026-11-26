#!/usr/bin/env bash
# Renders the built theme on top of Obsidian's REAL app.css (pulled from the
# local Obsidian install; never committed) and screenshots palettes, effects
# and phone widths to preview/out/. Needs Obsidian + Google Chrome installed.
set -euo pipefail
cd "$(dirname "$0")/.."
ASAR=$(ls -t "$HOME/Library/Application Support/obsidian/"obsidian-*.asar | head -1)
mkdir -p preview/.cache preview/out
( cd preview/.cache && npx --yes @electron/asar extract-file "$ASAR" app.css >/dev/null )
cp preview/.cache/app.css preview/app.css
node scripts/build.mjs >/dev/null && cp theme.css preview/theme.css
f(){ echo "<iframe style=\"width:${4:-800}px\" src=\"note.html?mode=$1&cls=$2&label=$3\"></iframe>"; }
page(){ # name, iframes…
  local name=$1; shift
  { echo '<!doctype html><style>body{margin:0;background:#888;display:flex;flex-wrap:wrap;gap:6px;padding:6px;align-items:flex-start}iframe{height:1200px;border:0}</style>'; printf '%s\n' "$@"; } > "preview/$name.html"
}
page palettes "$(f light el-light-honey Honey)" "$(f light el-light-slate Slate)" "$(f light el-light-sage Sage)" "$(f light el-light-daylight Daylight)" \
              "$(f dark el-dark-arcane Arcane)" "$(f dark el-dark-deepsea,el-ombre-page,el-ombre-headings 'Deep Sea + ombre')" "$(f dark el-dark-ember Ember)"
page variants "$(f dark el-dark-arcane,el-glow-off 'Arcane, glow off')" "$(f dark el-dark-ember,el-fonts-b 'Ember, fonts B')" \
              "$(f light el-light-honey,is-phone,is-mobile 'Honey phone' 390)" "$(f dark el-dark-arcane,el-fonts-d,is-phone,is-mobile 'Arcane phone, fonts D' 390)"
# Theme-browser thumbnail (cover.png, committed): 2x2 of Honey, Daylight, Arcane, Deep Sea rendered at 1024x576, saved at 512x288
# (2x Obsidian's 512x288 card). Each note renders at 900x506 and is scaled to fit its 512x288 quarter.
c(){ echo "<div style=\"width:512px;height:288px;overflow:hidden\"><iframe style=\"width:900px;height:506px;border:0;transform:scale(.5689);transform-origin:0 0\" src=\"note.html?mode=$1&cls=$2&label=&snip=cover-snip.css\"></iframe></div>"; }
{ echo '<!doctype html><style>body{margin:0;display:grid;grid-template-columns:512px 512px}</style>'
  printf '%s\n' "$(c light el-light-honey)" "$(c light el-light-daylight)" "$(c dark el-dark-arcane)" \
    "$(c dark el-dark-deepsea,el-ombre-page,el-ombre-headings)"; } > preview/cover.html
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --window-size=1024,576 \
  --force-device-scale-factor=1 --virtual-time-budget=4000 --screenshot="$PWD/cover.png" "file://$PWD/preview/cover.html" 2>/dev/null
# Obsidian's directory wants 512x288 (larger than 1000x500 is flagged).
sips -z 288 512 cover.png >/dev/null
for n in palettes variants; do
  "$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --window-size=2418,2430 \
    --virtual-time-budget=4000 --screenshot="$PWD/preview/out/$n.png" "file://$PWD/preview/$n.html" 2>/dev/null
done
ls -1 preview/out
