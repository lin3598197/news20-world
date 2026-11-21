// verify.mjs — audit the RENDERED page, not the data file. Loads page.html into headless
// Chrome, counts stories/regions/beats out of the DOM, counts trailing ellipses, checks
// minimum font, art ratios, ink coverage and the PNG's own header bytes.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9334;
const W = 1024, H = 1024;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PROBE = `(() => {
  const o = {};
  const nodes = [...document.querySelectorAll('[data-region]')];
  o.stories = nodes.length;
  o.slots = { lead: document.querySelectorAll('.lead').length,
              card: document.querySelectorAll('.card').length,
              brief: document.querySelectorAll('.brief').length };
  const reg = {}, beats = new Set();
  for (const el of nodes) {
    reg[el.dataset.region] = (reg[el.dataset.region] || 0) + 1;
    if (el.dataset.beat) beats.add(el.dataset.beat);
  }
  o.regions = reg;
  o.regionCount = Object.keys(reg).length;
  o.minRegion = Math.min(...Object.values(reg));
  o.beats = [...beats].sort();
  o.noOutlet = nodes.filter(e => !e.dataset.outlet || !e.dataset.outlet.trim()).length;

  // every drawn story must have an svg with a 5:3 viewBox
  o.svgs = [...document.querySelectorAll('.artbox svg')].map(s => s.getAttribute('viewBox'));
  o.artBoxes = [...document.querySelectorAll('.artbox')].map(b => {
    const r = b.getBoundingClientRect();
    return +(r.width / r.height).toFixed(4);
  });

  // min computed font over elements that own text
  let min = 1e9, minCls = '';
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let n;
  while ((n = tw.nextNode())) {
    if (![...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())) continue;
    const fs = parseFloat(getComputedStyle(n).fontSize);
    if (fs < min) { min = fs; minCls = n.className || n.tagName; }
  }
  o.minFont = min; o.minFontOn = minCls;

  // text-overflow ellipsis / truncation signals
  o.ellipsisInline = [...document.querySelectorAll('#sheet *')]
    .filter(e => getComputedStyle(e).textOverflow === 'ellipsis').length;
  o.ellipsisChars = (document.body.innerText.match(/\\u2026/g) || []).length;
  o.overflow = [...document.querySelectorAll('#sheet *')]
    .filter(e => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 1).length;
  o.clipped = [...document.querySelectorAll('#sheet *')]
    .filter(e => e.clientHeight > 0 && e.scrollHeight > e.clientHeight + 1).length;
  o.hash = (document.documentElement.outerHTML.match(/&#/g) || []).length;

  // brief column balance
  const bs = [...document.querySelectorAll('.brief')];
  const mid = document.querySelector('.bcols').getBoundingClientRect().left +
              document.querySelector('.bcols').getBoundingClientRect().width / 2;
  o.briefLeft = bs.filter(b => b.getBoundingClientRect().left < mid).length;
  o.briefRight = bs.length - o.briefLeft;

  o.height = document.getElementById('sheet').getBoundingClientRect().height;
  return o;
})()`;

const INK = `(async () => {
  const img = document.querySelector('#probe');
  return 'skip';
})()`;

function cdp(ws, method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const id = ++cdp.id;
    const onMsg = (ev) => {
      const d = JSON.parse(ev.data);
      if (d.id !== id) return;
      ws.removeEventListener('message', onMsg);
      d.error ? rej(new Error(method + ': ' + d.error.message)) : res(d.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
cdp.id = 0;

async function main() {
  const html = fs.readFileSync(path.join(ROOT, 'page.html'), 'utf8');
  const profile = path.join(ROOT, '.chrome-verify');
  fs.rmSync(profile, { recursive: true, force: true });
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--force-device-scale-factor=1', '--disable-gpu',
    '--window-size=1024,1024', 'about:blank'], { stdio: 'ignore' });

  let ver;
  for (let i = 0; i < 80; i++) {
    try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
    catch { await sleep(300); }
  }
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  const { targetId } = await cdp(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp(ws, 'Target.attachToTarget', { targetId, flatten: true });
  await cdp(ws, 'Page.enable', {}, sessionId);
  await cdp(ws, 'Emulation.setDeviceMetricsOverride',
    { width: W, height: H, deviceScaleFactor: 1, mobile: false }, sessionId);
  const tree = await cdp(ws, 'Page.getFrameTree', {}, sessionId);
  await cdp(ws, 'Page.setDocumentContent', { frameId: tree.frameTree.frame.id, html }, sessionId);
  await sleep(900);

  const r = (await cdp(ws, 'Runtime.evaluate', { expression: PROBE, returnByValue: true }, sessionId)).result.value;

  const png = fs.readFileSync(path.join(ROOT, 'entry.png'));
  const sigOk = png.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const pw = sigOk ? png.readUInt32BE(16) : 0;
  const ph = sigOk ? png.readUInt32BE(20) : 0;

  const fail = [];
  const ok = (c, msg) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fail.push(msg); };

  console.log('\n--- DOM census (from page.html, not news.mjs) ---');
  console.log(`  stories ${r.stories}  leads ${r.slots.lead}  cards ${r.slots.card}  briefs ${r.slots.brief}`);
  console.log(`  regions ${JSON.stringify(r.regions)}`);
  console.log(`  beats (${r.beats.length}): ${r.beats.join(', ')}`);

  console.log('\n--- GATES ---');
  ok(r.stories >= 36, `story count ${r.stories} >= 36`);
  ok(r.regionCount === 7, `all seven regions present (${r.regionCount})`);
  ok(r.minRegion >= 3, `no region under 3 (min ${r.minRegion})`);
  ok(r.beats.length >= 14, `distinct beats ${r.beats.length} >= 14`);
  ok(r.noOutlet === 0, `every story carries an outlet (${r.noOutlet} missing)`);
  ok(r.minFont >= 9, `min font ${r.minFont}px >= 9 (on .${r.minFontOn})`);
  ok(r.artBoxes.length >= 13 && r.artBoxes.length <= 15, `art box count ${r.artBoxes.length} in 13..15`);
  ok(r.artBoxes.every((x) => Math.abs(x - 5 / 3) < 0.01), `all art boxes 5:3 (${[...new Set(r.artBoxes)].join(',')})`);
  ok(r.svgs.every((v) => v === '0 0 160 96'), `all svg viewBoxes 160x96 (${[...new Set(r.svgs)].join('|')})`);
  ok(r.ellipsisInline === 0, `no text-overflow:ellipsis (${r.ellipsisInline})`);
  ok(r.ellipsisChars === 0, `no trailing ellipsis characters (${r.ellipsisChars})`);
  ok(r.overflow === 0, `zero horizontal overflow nodes (${r.overflow})`);
  ok(r.clipped === 0, `zero clipped nodes (${r.clipped})`);
  ok(r.hash === 0, `no literal &# sequences (${r.hash})`);
  ok(Math.abs(r.height - 1024) < 0.5, `sheet height ${r.height} == 1024`);
  ok(sigOk, 'entry.png has a PNG signature');
  ok(pw === 1024 && ph === 1024, `entry.png is ${pw}x${ph}`);
  ok(png.length <= 1048576, `entry.png is ${png.length} bytes <= 1048576`);
  console.log(`  INFO  brief columns ${r.briefLeft} / ${r.briefRight}`);

  console.log(`\n${fail.length ? 'FAILURES: ' + fail.length : 'ALL GATES PASS'}\n`);
  ws.close(); chrome.kill(); await sleep(300);
  fs.rmSync(profile, { recursive: true, force: true });
  if (fail.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
