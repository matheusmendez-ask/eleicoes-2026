#!/usr/bin/env node
/**
 * Gera as páginas de compartilhamento (share/<candidato>--<proposta>.html)
 * e as imagens de prévia Open Graph (share/og/*.jpg) a partir de js/data.js.
 *
 * Por que páginas separadas? Redes sociais não executam JavaScript nem leem o
 * "#" da URL. Cada proposta precisa de um HTML próprio com as meta tags; ele
 * redireciona o visitante para a análise no site (#p/<candidato>/<proposta>).
 *
 * Uso: npm run build:share   (requer Playwright: npm i -D playwright)
 */
const fs = require('fs');
const path = require('path');
const { ROOT, loadData } = require('./load-data.cjs');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('Playwright não encontrado. Instale com: npm i -D playwright');
  process.exit(1);
}

const D = loadData();
const SITE = D.meta.siteUrl;
const OUT = path.join(ROOT, 'share');
const OG = path.join(OUT, 'og');
const scale = Object.fromEntries(D.legalScale.map((s) => [s.id, s]));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s);
// Fontes embutidas em base64: a página renderizada não tem acesso a file://
const fontUrl = (f) => `data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'fonts', f)).toString('base64')}`;

const verdictColors = {
  exec: ['#15803D', '#DCFCE7'],
  lei: ['#2563EB', '#DBEAFE'],
  lc: ['#7C3AED', '#EDE9FE'],
  pec: ['#C2410C', '#FFEDD5'],
  vedado: ['#B91C1C', '#FEE2E2']
};

const baseCss = `
  @font-face { font-family: F; src: url('${fontUrl('fraunces.woff2')}'); font-weight: 100 900; }
  @font-face { font-family: I; src: url('${fontUrl('inter.woff2')}'); font-weight: 100 900; }
  @font-face { font-family: M; src: url('${fontUrl('jetbrains-mono-700.woff2')}'); font-weight: 700; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #F6F4EE; font-family: I, sans-serif; color: #14161A; position: relative; overflow: hidden; }
  .band { position: absolute; left: 0; top: 0; bottom: 0; width: 18px; background: var(--c); }
  .wrap { position: absolute; inset: 56px 64px 48px 82px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 14px; font-weight: 700; font-size: 24px; }
  .mark { width: 44px; height: 44px; border-radius: 11px; background: #0B7A4B; color: #fff; display: grid; place-items: center; font-family: F; font-weight: 800; font-size: 24px; position: relative; overflow: hidden; }
  .mark::after { content: ""; position: absolute; right: -8px; bottom: -8px; width: 20px; height: 20px; background: #E8B20E; transform: rotate(45deg); }
  .brand small { color: #6A707A; font-weight: 600; font-size: 20px; margin-left: 6px; }
  .who { display: flex; align-items: center; gap: 16px; margin-top: 44px; font-size: 28px; font-weight: 700; }
  .av { width: 58px; height: 58px; border-radius: 16px; background: var(--c); color: #fff; display: grid; place-items: center; font-family: F; font-weight: 800; font-size: 24px; }
  .who span { color: #6A707A; font-weight: 600; }
  h1 { font-family: F; font-weight: 800; letter-spacing: -0.02em; line-height: 1.06; margin-top: 22px; }
  .foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .chip { display: inline-flex; align-items: center; gap: 12px; padding: 12px 22px; border-radius: 999px; font-weight: 800; font-size: 28px; color: var(--vc); background: var(--vb); }
  .chip::before { content: ""; width: 14px; height: 14px; border-radius: 50%; background: var(--vc); }
  .need { font-size: 22px; color: #3B4049; font-weight: 600; margin-top: 10px; }
  .src { font-family: M; font-size: 18px; color: #6A707A; text-align: right; }
`;

function proposalImage(c, p) {
  const [vc, vb] = verdictColors[p.verdict];
  const size = p.title.length > 90 ? 50 : p.title.length > 60 ? 58 : 66;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}</style></head>
  <body style="--c:${c.color}">
    <div class="band"></div>
    <div class="wrap">
      <div class="brand"><div class="mark">R</div>Raio-X 2026<small>Planos de governo × Constituição</small></div>
      <div class="who"><div class="av">${esc(c.initials)}</div>${esc(c.shortName)} <span>· ${esc(c.party)}</span></div>
      <h1 style="font-size:${size}px">${esc(p.title)}</h1>
      <div class="foot">
        <div>
          <div class="chip" style="--vc:${vc};--vb:${vb}">${esc(scale[p.verdict].label)}</div>
          <div class="need">${esc(scale[p.verdict].who)}${p.contested ? ' · tema controverso' : ''}</div>
        </div>
        <div class="src">Fonte: plano de governo, p. ${esc(p.page)}<br>análise com base na CF/88</div>
      </div>
    </div>
  </body></html>`;
}

function homeImage() {
  const faces = D.candidates.map((c) => `<div class="av" style="--c:${c.color}">${esc(c.initials)}</div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    h1 { font-size: 76px; margin-top: 40px; }
    h1 em { font-style: normal; background: linear-gradient(transparent 62%, rgba(232,178,14,.7) 62%); }
    .faces { display: flex; gap: 10px; }
    .lede { font-size: 28px; color: #3B4049; margin-top: 22px; }
  </style></head>
  <body style="--c:#0B7A4B">
    <div class="band"></div>
    <div class="wrap">
      <div class="brand"><div class="mark">R</div>Raio-X 2026<small>Eleição presidencial</small></div>
      <h1>O que eles prometem.<br><em>O que a Constituição deixa.</em></h1>
      <p class="lede">${D.candidates.length} planos de governo, ${D.candidates.reduce((n, c) => n + c.proposals.length, 0)} propostas checadas no documento original.</p>
      <div class="foot"><div class="faces">${faces}</div><div class="src">Proposta × lei × orçamento</div></div>
    </div>
  </body></html>`;
}

function sharePage(c, p) {
  const key = `${c.id}/${p.id}`;
  const file = `${c.id}--${p.id}`;
  const title = `${p.title} · ${c.shortName}`;
  const desc = clip(`${scale[p.verdict].label} (${scale[p.verdict].who}). ${p.legal}`, 220);
  const target = `../#p/${key}`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} · Raio-X 2026</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(`${SITE}#p/${key}`)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Raio-X dos Planos de Governo 2026">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(`${SITE}share/${file}.html`)}">
  <meta property="og:image" content="${esc(`${SITE}share/og/${file}.jpg`)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(`${c.shortName}: ${p.title} — ${scale[p.verdict].label}`)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta http-equiv="refresh" content="0; url=${esc(target)}">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p><a href="${esc(target)}">Abrir a análise de “${esc(p.title)}”</a></p>
</body>
</html>
`;
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OG, { recursive: true });

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const render = async (html, out) => {
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, type: 'jpeg', quality: 86 });
  };

  await render(homeImage(), path.join(OG, 'home.jpg'));
  let n = 0;
  for (const c of D.candidates) {
    for (const p of c.proposals) {
      const file = `${c.id}--${p.id}`;
      await render(proposalImage(c, p), path.join(OG, `${file}.jpg`));
      fs.writeFileSync(path.join(OUT, `${file}.html`), sharePage(c, p));
      n++;
    }
  }
  await browser.close();
  console.log(`✓ ${n} páginas de compartilhamento + ${n + 1} imagens em share/`);
})();
