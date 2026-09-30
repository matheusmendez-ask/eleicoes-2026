#!/usr/bin/env node
/**
 * Valida a base js/data.js e os arquivos que dependem dela.
 * Sem dependências. Roda no CI a cada push e pull request.
 *
 * Uso: npm test
 */
const fs = require('fs');
const path = require('path');
const { ROOT, loadData } = require('./load-data.cjs');

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const isHttps = (u) => typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u);
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

let D;
try {
  D = loadData();
} catch (e) {
  console.error(`✗ js/data.js não pôde ser carregado: ${e.message}`);
  process.exit(1);
}

const verdicts = new Set(D.legalScale.map((s) => s.id));
const themes = new Set(D.themes.map((t) => t.id));
const articles = new Set(Object.keys(D.articles));

/* ---------- Escada e temas ---------- */
D.legalScale.forEach((s) => ['id', 'short', 'label', 'who', 'desc'].forEach((k) => nonEmpty(s[k]) || fail(`legalScale.${s.id || '?'}: campo "${k}" vazio`)));

/* ---------- Candidatos e propostas ---------- */
const candIds = new Set();
let total = 0;
for (const c of D.candidates) {
  const where = `candidato "${c.id}"`;
  if (candIds.has(c.id)) fail(`${where}: id duplicado`);
  candIds.add(c.id);
  ['name', 'shortName', 'party', 'vice', 'color', 'initials', 'thesis', 'summary'].forEach((k) => nonEmpty(c[k]) || fail(`${where}: campo "${k}" vazio`));
  if (!/^#[0-9A-Fa-f]{6}$/.test(c.color || '')) fail(`${where}: cor inválida "${c.color}"`);

  const doc = c.document || {};
  if (!fs.existsSync(path.join(ROOT, 'planos', doc.file || ''))) fail(`${where}: PDF não encontrado em planos/${doc.file}`);
  if (!Number.isInteger(doc.maxPage) || doc.maxPage < 1) fail(`${where}: document.maxPage ausente`);
  if (!['direct', 'saddle84'].includes(doc.pageMap)) fail(`${where}: document.pageMap inválido`);
  if (c.motto?.page && c.motto.page > doc.maxPage) fail(`${where}: página do lema fora do documento`);

  const pids = new Set();
  for (const p of c.proposals) {
    total++;
    const pw = `${where} › "${p.id}"`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id || '')) fail(`${pw}: id deve ser minúsculo-com-hifens`);
    if (pids.has(p.id)) fail(`${pw}: id duplicado no mesmo candidato`);
    pids.add(p.id);
    ['title', 'plain', 'legal'].forEach((k) => nonEmpty(p[k]) || fail(`${pw}: campo "${k}" vazio`));
    if (!themes.has(p.theme)) fail(`${pw}: tema desconhecido "${p.theme}"`);
    if (!verdicts.has(p.verdict)) fail(`${pw}: classificação desconhecida "${p.verdict}"`);
    if (!Number.isInteger(p.page) || p.page < 1 || p.page > doc.maxPage) fail(`${pw}: página ${p.page} fora do documento (1–${doc.maxPage})`);
    if (!Array.isArray(p.arts)) fail(`${pw}: "arts" deve ser uma lista`);
    else p.arts.forEach((a) => articles.has(a) || fail(`${pw}: artigo "${a}" não existe em articles`));
    if (p.quote && p.quote.split(/\s+/).length > 30) warn(`${pw}: citação com mais de 30 palavras`);
    if (p.contested !== undefined && typeof p.contested !== 'boolean') fail(`${pw}: "contested" deve ser booleano`);
    if (!p.fiscal || !['gasto', 'economia', 'neutro', 'incerto'].includes(p.fiscal.effect)) fail(`${pw}: fiscal.effect deve ser gasto, economia, neutro ou incerto`);
    if (!p.fiscal || !nonEmpty(p.fiscal.note)) fail(`${pw}: fiscal.note vazio`);
  }

  const e = c.economic || {};
  if (!nonEmpty(e.headline) || !nonEmpty(e.analysis)) fail(`${where}: análise econômica incompleta`);
  (e.figures || []).forEach((f, i) => {
    if (!nonEmpty(f.label) || !nonEmpty(f.display)) fail(`${where}: economic.figures[${i}] incompleta`);
    if (f.value !== null && !(typeof f.value === 'number' && f.value > 0)) fail(`${where}: economic.figures[${i}].value deve ser número > 0 ou null`);
    if (!Number.isInteger(f.page) || f.page > doc.maxPage) fail(`${where}: economic.figures[${i}] com página inválida`);
  });
  if (!(e.figures || []).length && !nonEmpty(e.figuresNote)) fail(`${where}: sem cifras, informe economic.figuresNote`);
  ['funding', 'gaps'].forEach((k) => (Array.isArray(e[k]) && e[k].length && e[k].every(nonEmpty)) || fail(`${where}: economic.${k} deve ser uma lista de textos`));
}

/* ---------- Artigos ---------- */
for (const [id, a] of Object.entries(D.articles)) {
  ['title', 'topic', 'text', 'plain'].forEach((k) => nonEmpty(a[k]) || fail(`articles.${id}: campo "${k}" vazio`));
}
const usedArts = new Set(D.candidates.flatMap((c) => c.proposals.flatMap((p) => p.arts)));
Object.keys(D.articles).forEach((id) => usedArts.has(id) || warn(`articles.${id}: não é citado por nenhuma proposta`));

/* ---------- Links e fontes ---------- */
D.refs.forEach((r) => (nonEmpty(r.match) && isHttps(r.url)) || fail(`refs: "${r.match}" sem URL https válida`));
isHttps(D.constitutionUrl) || fail('constitutionUrl inválida');
D.indicators.forEach((i) => isHttps(i.url) || fail(`indicators.${i.id}: sem URL de fonte`));
D.sources.forEach((s, i) => (nonEmpty(s.text) && isHttps(s.url)) || fail(`sources[${i}]: texto ou URL inválidos`));
isHttps(D.meta.siteUrl) && D.meta.siteUrl.endsWith('/') || fail('meta.siteUrl deve ser https e terminar com "/"');

/* ---------- Orçamento ---------- */
const sum = D.budget.items.reduce((s, i) => s + i.value, 0);
if (Math.abs(sum - D.budget.total) / D.budget.total > 0.01) fail(`budget: itens somam ${sum}, total declarado ${D.budget.total}`);
if (!D.budget.items.some((i) => i.id === 'livre')) fail('budget: item "livre" é obrigatório');
D.budget.promises.forEach((p) => candIds.has(p.candidate) || fail(`budget.promises: candidato "${p.candidate}" desconhecido`));
(D.budget.funnel || []).forEach((f, i) => (nonEmpty(f.label) && f.value > 0) || fail(`budget.funnel[${i}] inválido`));
if (!D.budget.funnel?.length || D.budget.funnel[D.budget.funnel.length - 1].value !== D.budget.items.find((i) => i.id === 'livre').value) fail('budget.funnel deve terminar no valor livre do Executivo');
(D.budget.debtSeries || []).forEach((d, i) => (nonEmpty(d.year) && d.value > 0 && d.value < 200) || fail(`budget.debtSeries[${i}] inválido`));
if ((D.budget.debtSeries || []).length < 5) fail('budget.debtSeries precisa de pelo menos 5 pontos');
(D.budget.debtFacts || []).forEach((f, i) => (nonEmpty(f.label) && nonEmpty(f.value) && isHttps(f.url)) || fail(`budget.debtFacts[${i}] inválido`));
(D.budget.timeline || []).forEach((t, i) => (nonEmpty(t.year) && nonEmpty(t.text)) || fail(`budget.timeline[${i}] inválido`));

/* ---------- Glossário ---------- */
const aliasSeen = new Map();
D.glossary.forEach((g) => {
  (nonEmpty(g.term) && nonEmpty(g.definition)) || fail(`glossary: termo incompleto "${g.term}"`);
  (g.aliases || []).forEach((a) => {
    const k = a.toLowerCase();
    if (aliasSeen.has(k)) fail(`glossary: sinônimo "${a}" repetido em "${aliasSeen.get(k)}" e "${g.term}"`);
    aliasSeen.set(k, g.term);
  });
});

/* ---------- Páginas de compartilhamento ---------- */
const shareDir = path.join(ROOT, 'share');
const expected = new Set(D.candidates.flatMap((c) => c.proposals.map((p) => `${c.id}--${p.id}`)));
D.candidates.forEach((a, i) => D.candidates.slice(i + 1).forEach((b) => expected.add(`comparar--${a.id}--${b.id}`)));
if (!fs.existsSync(shareDir)) {
  fail('share/ não existe: rode "npm run build:share"');
} else {
  const have = new Set(fs.readdirSync(shareDir).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
  expected.forEach((k) => {
    have.has(k) || fail(`share/${k}.html ausente: rode "npm run build:share"`);
    fs.existsSync(path.join(shareDir, 'og', `${k}.jpg`)) || fail(`share/og/${k}.jpg ausente: rode "npm run build:share"`);
  });
  have.forEach((k) => expected.has(k) || fail(`share/${k}.html não corresponde a nenhuma proposta ou comparação (arquivo órfão)`));
  fs.existsSync(path.join(shareDir, 'og', 'home.jpg')) || fail('share/og/home.jpg ausente');
}

/* ---------- index.html referencia arquivos que existem ---------- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
[...html.matchAll(/(?:src|href)="(?!https?:|data:|#|mailto:)([^"]+)"/g)].forEach(([, f]) => {
  fs.existsSync(path.join(ROOT, f.split(/[?#]/)[0])) || fail(`index.html referencia arquivo inexistente: ${f}`);
});

/* ---------- Resultado ---------- */
warnings.forEach((w) => console.warn(`! ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.error(`\n${errors.length} erro(s) encontrados.`);
  process.exit(1);
}
console.log(`✓ Dados válidos: ${D.candidates.length} candidatos, ${total} propostas, ${Object.keys(D.articles).length} artigos, ${D.refs.length} referências, ${expected.size} páginas de compartilhamento (propostas e comparações).`);
