# Renames a font's family in its name table (OFL Reserved Font Name compliance) and keeps licence fields.
import sys
from fontTools.ttLib import TTFont
src, dst, old, new = sys.argv[1:5]
f = TTFont(src)
oldc, newc = old.replace(' ', ''), new.replace(' ', '')
for r in f['name'].names:
    if r.nameID in (0, 7, 13, 14):  # copyright, trademark, licence text, licence URL stay as-is
        continue
    t = r.toUnicode()
    t2 = t.replace(old, new).replace(oldc, newc)
    if t2 != t:
        r.string = t2
f.save(dst)
left = [(r.nameID, r.toUnicode()) for r in f['name'].names if 'Plex' in r.toUnicode() and r.nameID not in (0, 7, 13, 14)]
print(dst, 'remaining Plex:', left)
