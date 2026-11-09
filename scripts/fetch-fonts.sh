#!/usr/bin/env bash
# Downloads the four pairings' fonts (all SIL OFL) from github.com/google/fonts,
# pins variable fonts to static weights, subsets to Latin, and writes woff2 to
# fonts/woff2/<Family>__<weight>__<style>.woff2 (the name the build reads).
# Sources (TTF) go to fonts/src/ and are gitignored; woff2 + licences are committed.
# Needs: curl, uv (uvx runs fonttools + brotli without installing them).
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=https://raw.githubusercontent.com/google/fonts/main/ofl
SRC=fonts/src; OUT=fonts/woff2; LIC=fonts/licenses
mkdir -p "$SRC" "$OUT" "$LIC"

# Google Fonts' "latin" range + arrows (design §6).
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD"
FT="uvx --quiet --with brotli --from fonttools"

fetch() { # dir file
  [ -s "$SRC/$1/$2" ] || { mkdir -p "$SRC/$1"; curl -fsSL --globoff "$RAW/$1/$2" -o "$SRC/$1/$2"; }
}
licence() { # dir family
  curl -fsSL "$RAW/$1/OFL.txt" -o "$LIC/$2 - OFL.txt"
}
emit() { # ttf family weight style
  $FT pyftsubset "$1" --unicodes="$UNICODES" --flavor=woff2 --layout-features='*' \
    --output-file="$OUT/$2__$3__$4.woff2"
}
from_variable() { # dir file family style axes-extra weights...
  local dir=$1 file=$2 fam=$3 style=$4 extra=$5; shift 5
  fetch "$dir" "$file"
  for w in "$@"; do
    local tmp="$SRC/$dir/${fam// /_}-$w-$style.ttf"
    $FT fonttools varLib.instancer -q "$SRC/$dir/$file" wght=$w $extra -o "$tmp"
    emit "$tmp" "$fam" "$w" "$style"
  done
}
from_static() { # dir file family weight style
  fetch "$1" "$2"; emit "$SRC/$1/$2" "$3" "$4" "$5"
}

rm -f "$OUT"/*.woff2

from_variable atkinsonhyperlegiblenext 'AtkinsonHyperlegibleNext[wght].ttf'        'Atkinson Hyperlegible Next' normal '' 400 700 800
from_variable atkinsonhyperlegiblenext 'AtkinsonHyperlegibleNext-Italic[wght].ttf' 'Atkinson Hyperlegible Next' italic '' 400 700
from_variable atkinsonhyperlegiblemono 'AtkinsonHyperlegibleMono[wght].ttf'        'Atkinson Hyperlegible Mono' normal '' 400 700
from_variable atkinsonhyperlegiblemono 'AtkinsonHyperlegibleMono-Italic[wght].ttf' 'Atkinson Hyperlegible Mono' italic '' 400 700
from_variable jetbrainsmono 'JetBrainsMono[wght].ttf'        'JetBrains Mono' normal '' 400 700
from_variable jetbrainsmono 'JetBrainsMono-Italic[wght].ttf' 'JetBrains Mono' italic '' 400 700
# Inter: pin the optical-size axis to its display end for headings.
from_variable inter 'Inter[opsz,wght].ttf' 'Inter' normal 'opsz=28' 400 700 800

from_static poppins 'Poppins-Regular.ttf'   'Poppins' 400 normal
from_static poppins 'Poppins-Bold.ttf'      'Poppins' 700 normal
from_static poppins 'Poppins-ExtraBold.ttf' 'Poppins' 800 normal
from_static ibmplexmono 'IBMPlexMono-Regular.ttf'    'IBM Plex Mono' 400 normal
from_static ibmplexmono 'IBMPlexMono-Bold.ttf'       'IBM Plex Mono' 700 normal
from_static ibmplexmono 'IBMPlexMono-Italic.ttf'     'IBM Plex Mono' 400 italic
from_static ibmplexmono 'IBMPlexMono-BoldItalic.ttf' 'IBM Plex Mono' 700 italic

licence atkinsonhyperlegiblenext 'Atkinson Hyperlegible Next'
licence atkinsonhyperlegiblemono 'Atkinson Hyperlegible Mono'
licence poppins 'Poppins'
licence inter 'Inter'
licence jetbrainsmono 'JetBrains Mono'
licence ibmplexmono 'IBM Plex Mono'

ls -1 "$OUT" | wc -l | xargs echo "faces:"
du -ch "$OUT"/*.woff2 | tail -1
