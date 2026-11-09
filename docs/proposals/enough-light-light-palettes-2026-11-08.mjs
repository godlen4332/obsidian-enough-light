// Scratch: proposed light palettes, checked with the real failures() and rendered as an override CSS.
import { failures, onAccent } from '/Users/seanc/Coding/obsidian-enough-light/src/contrast.mjs';
import { PALETTES } from '/Users/seanc/Coding/obsidian-enough-light/src/palettes.mjs';
import { writeFileSync } from 'node:fs';
const honey = PALETTES.find(p => p.id === 'honey');
const P = [
 { id:'slate', name:'Slate', mode:'light', bg:'#eef1f4', bg2:'#e3e8ee', text:'#22282f', muted:'#545e6a', border:'#cfd6de',
   h1:'#1d4a7a', h2:'#6a3f8f', h3:'#1f6159', h4:'#7a4a12', h5:'#3e4650', h6:'#4c5560', link:'#1d5b96', accent:'#2a63a8',
   tagBg:'#dde6f0', tagFg:'#1d4a7a', calloutBg:'#e2e8ef', codeBg:'#e4e9ef', selection:'#c9d8ea', toolbar:'#d6dee8', toolbarText:'#1d2a3a', today:'#1d4a7a', glow:0.25 },
 { id:'sage', name:'Sage', mode:'light', bg:'#f0f3ea', bg2:'#e5eadc', text:'#283026', muted:'#556050', border:'#d3dac6',
   h1:'#2f5a2a', h2:'#8a3f16', h3:'#3a4f86', h4:'#6a5410', h5:'#3f473c', h6:'#4d5848', link:'#2f6a4a', accent:'#3d7044',
   tagBg:'#dfe8d3', tagFg:'#2f5a2a', calloutBg:'#e5ebdb', codeBg:'#e7ecdf', selection:'#d2e2c0', toolbar:'#d5e0c4', toolbarText:'#24301f', today:'#8a3f16', glow:0.3 },
 { id:'daylight', name:'Daylight', mode:'light', bg:'#ffffff', bg2:'#f3f4f6', text:'#1f2328', muted:'#59606b', border:'#dfe2e7',
   h1:'#08695f', h2:'#a3289e', h3:'#2559c7', h4:'#7d5200', h5:'#3d434b', h6:'#59606b', link:'#2559c7', accent:'#2559c7',
   tagBg:'#f3e3f2', tagFg:'#8a2386', calloutBg:'#f1f3f6', codeBg:'#f3f4f6', selection:'#d6e4fb', toolbar:'#e8f3f1', toolbarText:'#0b3e38', today:'#a3289e', glow:0.3 },
];
let bad = 0;
for (const p of P) { const f = failures(p); bad += f.length; console.log(p.name, f.length ? f.map(x => `${x.pair} ${x.ratio.toFixed(2)}`).join('; ') : 'PASS'); }
const k = s => s.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
const css = P.map(p => `body.theme-light.el-light-${p.id} {\n${Object.entries(p).filter(([x]) => !['id','name','mode','glow'].includes(x)).map(([x,v]) => `  --el-${k(x)}: ${v};`).join('\n')}\n  --el-on-accent: ${onAccent(p)};\n  --el-glow: ${p.glow};\n}`).join('\n');
writeFileSync('/Users/seanc/Coding/obsidian-enough-light/preview/.cache/proposal.css', css);
process.exit(bad ? 1 : 0);
