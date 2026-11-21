// compose.mjs — build page.html, rasterise it with headless Chrome over CDP at exactly
// 1024x1024, and print the geometry, font histogram, overflow/clipped counts, page
// height and the aspect ratio of every art box.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { DAY, REGIONS, REGION_INK, STORIES, NUMBERS, EXCLUDED, counts, beats } from './news.mjs';
import { artSvg } from './art.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const W = 1024, H = 1024;

// Band heights. Rules live inside each band, so the sum is the sheet height exactly.
const B = {
  masthead: 88,
  tally: 15,
  numbers: 46,
  leads: 230,
  bandA: 162,
  bandB: 162,
  briefs: 279,
  datecheck: 56,
  footer: 13,
};
const BAND_SUM = Object.values(B).reduce((a, b) => a + b, 0);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
svg{display:block}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#f4f0e6;color:#12100e;
  font-family:"Times New Roman",Georgia,serif}
#sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column}
.band{position:relative;overflow:hidden;border-bottom:1px solid #12100e;flex:none}

.mast{height:${B.masthead}px;display:flex;align-items:center;padding:0 18px;gap:14px;
  border-bottom:3px solid #12100e}
.mast .l{flex:1;min-width:0}
.kick{font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2.1px;font-weight:700;
  text-transform:uppercase;color:#b21e22;line-height:12px}
.date{font-size:46px;line-height:50px;font-weight:700;letter-spacing:-1.4px;white-space:nowrap}
.strap{font-family:"Segoe UI",Arial,sans-serif;font-size:9.6px;line-height:12px;margin-top:3px;
  color:#2a2620;white-space:nowrap}
.redblock{width:100px;height:62px;background:#b21e22;color:#f4f0e6;display:flex;flex-direction:column;
  align-items:center;justify-content:center;flex:none;font-family:Arial,Helvetica,sans-serif}
.redblock .big{font-size:21px;font-weight:700;letter-spacing:1px;line-height:23px}
.redblock .sm{font-size:15px;font-weight:700;letter-spacing:6px;line-height:18px;padding-left:6px}

.tally{height:${B.tally}px;display:flex;align-items:stretch;background:#12100e;color:#f4f0e6;
  font-family:Arial,Helvetica,sans-serif;font-size:9.4px;letter-spacing:1px;text-transform:uppercase}
.tally div{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;
  border-right:1px solid rgba(244,240,230,.4)}
.tally div:last-child{border-right:0}
.tally b{font-size:11.5px;letter-spacing:0}

.numbers{height:${B.numbers}px;display:flex;border-bottom:3px solid #12100e}
.numbers .n{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  border-right:1px solid #c9c1ae;padding:0 2px}
.numbers .n:last-child{border-right:0}
.numbers .v{font-size:23px;font-weight:700;line-height:23px;letter-spacing:-.6px;white-space:nowrap}
.numbers .lb{font-family:"Segoe UI",Arial,sans-serif;font-size:9px;line-height:10.4px;color:#b21e22;
  text-align:center;max-width:100%;height:21px;overflow:visible}

.leads{height:${B.leads}px;display:flex;padding:4px 14px 4px;gap:14px;border-bottom:3px solid #12100e}
.lead{flex:1;min-width:0;display:flex;flex-direction:column}
.lead .artbox{width:198px;height:118.8px;margin:0 auto;border:1px solid #12100e}
.lead h2{font-size:26px;line-height:26px;font-weight:700;letter-spacing:-.6px;margin-top:4px}
.lead .deck{font-family:"Segoe UI",Arial,sans-serif;font-size:9.8px;line-height:11.6px;margin-top:3px;
  color:#3a352c}
.lead .ft{font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:1.1px;
  text-transform:uppercase;margin-top:3px;color:#b21e22;font-weight:700}

.bandrow{height:${B.bandA}px;display:flex;padding:3px 12px;gap:9px;border-bottom:3px solid #12100e}
.bandrow.b{height:${B.bandB}px}
.card{flex:1;min-width:0;display:flex;flex-direction:column}
.card .artbox{width:148px;height:88.8px;margin:0 auto;border:1px solid #12100e}
.card .tag{font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:1.1px;
  text-transform:uppercase;margin-top:2px;line-height:10px}
.card h3{font-size:15.5px;line-height:16.4px;font-weight:700;margin-top:1px;letter-spacing:-.2px}
.card .cft{font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:.9px;
  text-transform:uppercase;color:#b21e22;font-weight:700;margin-top:1px;line-height:10px}

.briefs{height:${B.briefs}px;padding:2px 14px 2px;border-bottom:3px solid #12100e}
.bh{font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.9px;
  text-transform:uppercase;color:#b21e22;line-height:14px;border-bottom:1px solid #b21e22;
  margin-bottom:2px;display:flex;justify-content:space-between}
.bh span{color:#12100e;letter-spacing:1px}
.bcols{columns:2;column-gap:16px;column-rule:1px solid #c9c1ae}
.brief{font-family:"Segoe UI",Arial,sans-serif;font-size:11.2px;line-height:13.2px;
  padding:2.2px 0 2.2px;border-bottom:1px dotted #b9b0a0;break-inside:avoid}
.brief .rt{font-family:Arial,Helvetica,sans-serif;font-size:9.6px;font-weight:700;letter-spacing:.7px;
  background:#12100e;color:#f4f0e6;padding:0 3px;margin-right:4px}
.brief .ot{color:#b21e22;font-weight:700}

.dc{height:${B.datecheck}px;padding:3px 14px 3px 16px;border-left:7px solid #b21e22;
  border-bottom:1px solid #12100e}
.dc .dcr{font-family:Arial,Helvetica,sans-serif;font-size:9.4px;line-height:11.5px;font-weight:700;
  margin-bottom:2px}
.dc .cols{columns:2;column-gap:16px}
.dc .ex{font-family:"Segoe UI",Arial,sans-serif;font-size:9px;line-height:11px}
.dc .ex b{color:#b21e22}

.foot{height:${B.footer}px;display:flex;align-items:center;justify-content:space-between;
  padding:0 14px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:1.2px;
  text-transform:uppercase;border-bottom:0}
`;

function storyHtml(s) {
  if (s.slot === 'lead') {
    return `<div class="lead" data-region="${esc(s.region)}" data-beat="${esc(s.beat)}" data-outlet="${esc(s.outlet)}">
      <div class="artbox" data-art="${esc(s.art)}">${artSvg(s.art, s.headline)}</div>
      <h2>${esc(s.headline)}</h2>
      <div class="deck">${esc(s.deck || '')}</div>
      <div class="ft">${esc(s.outlet)} \u00b7 ${esc(s.region)}</div>
    </div>`;
  }
  if (s.slot === 'bandA' || s.slot === 'bandB') {
    return `<div class="card" data-region="${esc(s.region)}" data-beat="${esc(s.beat)}" data-outlet="${esc(s.outlet)}">
      <div class="artbox" data-art="${esc(s.art)}">${artSvg(s.art, s.headline)}</div>
      <div class="tag" style="color:${REGION_INK[s.region]}">${esc(s.tag)} \u00b7 ${esc(s.beat)}</div>
      <h3>${esc(s.headline)}</h3>
      <div class="cft">${esc(s.outlet)}</div>
    </div>`;
  }
  return `<div class="brief" data-region="${esc(s.region)}" data-beat="${esc(s.beat)}" data-outlet="${esc(s.outlet)}"><span class="rt">${esc(s.tag)}</span>${esc(s.headline)} <span class="ot">${esc(s.outlet)}</span></div>`;
}

function buildHtml() {
  const c = counts();
  const leads = STORIES.filter((s) => s.slot === 'lead');
  const A = STORIES.filter((s) => s.slot === 'bandA');
  const Bn = STORIES.filter((s) => s.slot === 'bandB');
  const briefs = STORIES.filter((s) => s.slot === 'brief');
  const total = STORIES.length;
  const beatList = beats();

  const tally = REGIONS.map(
    (r) => `<div data-region-tally="${esc(r)}"><b>${c[r]}</b>${esc(r)}</div>`,
  ).join('');
  const numbers = NUMBERS.map(
    (n) => `<div class="n"><div class="v">${esc(n.value)}</div><div class="lb">${esc(n.label)}</div></div>`,
  ).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(DAY.long)}</title>
<style>${CSS}</style></head>
<body><div id="sheet">
  <div class="band mast">
    <div class="l">
      <div class="kick">${esc(DAY.kicker)}</div>
      <div class="date">${esc(DAY.long)}</div>
      <div class="strap">${esc(DAY.strap)}</div>
    </div>
    <div class="redblock"><div class="big">${esc(DAY.short)}</div><div class="sm">${esc(DAY.dow)}</div></div>
  </div>

  <div class="band tally">${tally}</div>

  <div class="band numbers">${numbers}</div>

  <div class="band leads">${leads.map(storyHtml).join('')}</div>

  <div class="band bandrow">${A.map(storyHtml).join('')}</div>

  <div class="band bandrow b">${Bn.map(storyHtml).join('')}</div>

  <div class="band briefs">
    <div class="bh"><span>Briefly \u00b7 the rest of the day</span><span>${briefs.length} items \u00b7 ${total} stories on this sheet \u00b7 ${beatList.length} beats</span></div>
    <div class="bcols">${briefs.map(storyHtml).join('')}</div>
  </div>

  <div class="band dc">
    <div class="dcr">DATE CHECK \u2014 the rule: every item here is dated, or was first reported, on 20 November 2026. Six held out:</div>
    <div class="cols">${EXCLUDED.map((e, i) => `<div class="ex"><b>${i + 1}.</b> ${esc(e)}</div>`).join('')}</div>
  </div>

  <div class="band foot"><span>The World on One Sheet \u00b7 ${esc(DAY.long)}</span><span>${total} stories \u00b7 7 regions \u00b7 ${esc(DAY.iso)}</span></div>
</div></body></html>`;
}

const PROBE = `(() => {
  const out = {};
  const sheet = document.getElementById('sheet');
  out.bands = [...sheet.children].map(el => {
    const r = el.getBoundingClientRect();
    return { cls: el.className.replace('band ',''), top: +r.top.toFixed(2), h: +r.height.toFixed(2) };
  });
  out.pageH = document.body.scrollHeight;
  out.pageW = document.body.scrollWidth;

  const hist = {};
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let n;
  while ((n = walk.nextNode())) {
    const direct = [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
    if (!direct) continue;
    const fs = parseFloat(getComputedStyle(n).fontSize);
    hist[fs] = (hist[fs] || 0) + 1;
  }
  out.fonts = Object.entries(hist).map(([k,v]) => [+k, v]).sort((a,b) => a[0]-b[0]);

  out.overflow = [];
  out.clipped = [];
  for (const el of document.querySelectorAll('#sheet *')) {
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
      out.overflow.push({ tag: el.tagName, cls: el.className, sw: el.scrollWidth, cw: el.clientWidth });
    if (el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 0)
      out.clipped.push({ tag: el.tagName, cls: el.className, sh: el.scrollHeight, ch: el.clientHeight });
  }

  out.art = [...document.querySelectorAll('.artbox')].map(b => {
    const r = b.getBoundingClientRect();
    return { k: b.dataset.art, w: +r.width.toFixed(2), h: +r.height.toFixed(2),
             ratio: +(r.width / r.height).toFixed(4) };
  });

  const reg = {};
  for (const el of document.querySelectorAll('[data-region]'))
    reg[el.dataset.region] = (reg[el.dataset.region]||0)+1;
  out.regions = reg;
  out.stories = document.querySelectorAll('[data-region]').length;
  out.bySlot = {
    lead: document.querySelectorAll('.lead').length,
    card: document.querySelectorAll('.card').length,
    brief: document.querySelectorAll('.brief').length,
  };
  out.beats = [...new Set([...document.querySelectorAll('[data-beat]')].map(e => e.dataset.beat))].sort();
  out.outletless = [...document.querySelectorAll('[data-region]')].filter(e => !e.dataset.outlet).length;
  out.ellipsis = (document.body.innerText.match(/\\u2026/g) || []).length;
  out.hash = (document.documentElement.outerHTML.match(/&#/g) || []).length;

  // line-box height of each brief, to catch two-line rows in a one-line grid
  out.briefLines = [...document.querySelectorAll('.brief')].map(b => {
    const rng = document.createRange(); rng.selectNodeContents(b);
    return Math.round(b.getBoundingClientRect().height);
  });
  out.briefMaxH = out.briefLines.length ? Math.max(...out.briefLines) : 0;
  out.briefCols = getComputedStyle(document.querySelector('.bcols')).columnCount;

  // ink coverage: share of near-black pixels, measured through a canvas
  return out;
})()`;

function cdp(ws, method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const id = ++cdp.id;
    const msg = JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) });
    const onMsg = (ev) => {
      const d = JSON.parse(ev.data);
      if (d.id !== id) return;
      ws.removeEventListener('message', onMsg);
      d.error ? rej(new Error(method + ': ' + d.error.message)) : res(d.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(msg);
  });
}
cdp.id = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const html = buildHtml();
  fs.writeFileSync(path.join(ROOT, 'page.html'), html, 'utf8');

  const profile = path.join(ROOT, '.chrome-profile');
  fs.rmSync(profile, { recursive: true, force: true });
  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--disable-gpu', '--window-size=1024,1024', 'about:blank',
  ], { stdio: 'ignore' });

  let ver;
  for (let i = 0; i < 80; i++) {
    try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
    catch { await sleep(300); }
  }
  if (!ver) throw new Error('chrome did not start');

  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));

  const { targetId } = await cdp(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp(ws, 'Target.attachToTarget', { targetId, flatten: true });
  await cdp(ws, 'Page.enable', {}, sessionId);
  await cdp(ws, 'Emulation.setDeviceMetricsOverride',
    { width: W, height: H, deviceScaleFactor: 1, mobile: false }, sessionId);
  const tree = await cdp(ws, 'Page.getFrameTree', {}, sessionId);
  await cdp(ws, 'Page.setDocumentContent',
    { frameId: tree.frameTree.frame.id, html }, sessionId);
  await sleep(1200);

  const probe = await cdp(ws, 'Runtime.evaluate',
    { expression: PROBE, returnByValue: true }, sessionId);
  const r = probe.result.value;

  console.log('=== BANDS (top / height) ===');
  for (const b of r.bands)
    console.log(`  ${String(b.cls).padEnd(14)} top ${String(b.top).padStart(7)}  h ${String(b.h).padStart(7)}`);
  const sum = r.bands.reduce((a, b) => a + b.h, 0);
  console.log(`  SUM ${sum.toFixed(2)}   pageH ${r.pageH}  pageW ${r.pageW}  planned ${BAND_SUM}`);

  console.log('\n=== FONT HISTOGRAM (px: elements) ===');
  for (const [s, cc] of r.fonts) console.log(`  ${String(s).padStart(6)} px : ${cc}`);
  console.log(`  MIN FONT ${Math.min(...r.fonts.map((f) => f[0]))} px`);

  console.log('\n=== ART BOXES ===');
  for (const a of r.art)
    console.log(`  ${String(a.k).padEnd(11)} ${String(a.w).padStart(7)} x ${String(a.h).padStart(6)}  ratio ${a.ratio}`);
  const badRatio = r.art.filter((a) => Math.abs(a.ratio - 5 / 3) > 0.01);
  console.log(`  ${r.art.length} art boxes, off-ratio: ${badRatio.length}`);

  console.log('\n=== PAGE ===');
  console.log('  stories in DOM :', r.stories, JSON.stringify(r.bySlot));
  console.log('  regions        :', JSON.stringify(r.regions));
  console.log('  min region     :', Math.min(...Object.values(r.regions)));
  console.log(`  beats (${r.beats.length})      :`, r.beats.join(', '));
  console.log('  missing outlet :', r.outletless);
  console.log('  overflow nodes :', r.overflow.length, JSON.stringify(r.overflow.slice(0, 6)));
  console.log('  clipped nodes  :', r.clipped.length, JSON.stringify(r.clipped.slice(0, 6)));
  console.log('  ellipsis count :', r.ellipsis);
  console.log('  literal &# runs:', r.hash);
  console.log('  brief columns  :', r.briefCols, ' max brief box height:', r.briefMaxH);
  console.log('  brief heights  :', r.briefLines.join(' '));

  const shot = await cdp(ws, 'Page.captureScreenshot',
    { format: 'png', captureBeyondViewport: false,
      clip: { x: 0, y: 0, width: W, height: H, scale: 1 } }, sessionId);
  const png = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(path.join(ROOT, 'entry.png'), png);
  console.log(`\n  wrote entry.png ${png.length} bytes`);

  ws.close();
  chrome.kill();
  await sleep(400);
  fs.rmSync(profile, { recursive: true, force: true });
}

main().catch((e) => { console.error(e); process.exit(1); });
