/**
 * Raio-X dos Planos de Governo 2026 — interface
 * Renderiza tudo a partir de ELECTION_DATA (js/data.js). Sem dependências.
 *
 * Rotas (hash):
 *   #p/<candidato>/<proposta>   abre a proposta (link compartilhável)
 *   #dossie/<candidato>         abre o dossiê do candidato
 *   #comparar/<a>,<b>           compara dois candidatos lado a lado
 */
(() => {
  'use strict';

  const D = ELECTION_DATA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const scaleById = Object.fromEntries(D.legalScale.map((s) => [s.id, s]));
  const themeById = Object.fromEntries(D.themes.map((t) => [t.id, t]));
  const candById = Object.fromEntries(D.candidates.map((c) => [c.id, c]));
  const candIndex = Object.fromEntries(D.candidates.map((c, i) => [c.id, i]));
  const allProposals = D.candidates.flatMap((c) => c.proposals.map((p) => ({ ...p, cand: c, key: `${c.id}/${p.id}` })));
  const byKey = Object.fromEntries(allProposals.map((p) => [p.key, p]));
  const FREE_SPACE = D.budget.items.find((i) => i.id === 'livre').value;

  const state = {
    theme: 'all',
    cands: new Set(D.candidates.map((c) => c.id)),
    verdict: 'all',
    q: '',
    cmp: [D.candidates[0].id, D.candidates[1].id]
  };

  /* ==========================================================
     Ícones (SVG inline, traço simples)
     ========================================================== */
  const ICONS = {
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>',
    x: '<path fill="currentColor" stroke="none" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>',
    close: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4L10 14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
    swap: '<path d="M4 8h13"/><path d="M14 5l3 3-3 3"/><path d="M20 16H7"/><path d="M10 13l-3 3 3 3"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'
  };
  const icon = (name, size = 16) => `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  /* ==========================================================
     Helpers
     ========================================================== */
  const pdfPage = (c, page) => {
    if (!page) return null;
    if (c.document.pageMap === 'saddle84') return page <= 42 ? page : 85 - page;
    return page;
  };
  const pdfUrl = (c, page) => {
    const base = `planos/${encodeURIComponent(c.document.file)}`;
    const p = pdfPage(c, page);
    return p ? `${base}#page=${p}` : base;
  };
  const chip = (v) => `<span class="chip v-${v}" title="${esc(scaleById[v].label)}">${esc(scaleById[v].short)}</span>`;
  const contestedTag = (p) => (p.contested ? '<span class="chip chip-muted" title="Há divergência relevante entre juristas ou no STF">controverso</span>' : '');
  const avatar = (c, cls = '') => `<span class="avatar ${cls}" style="--c:${c.color}" aria-hidden="true">${esc(c.initials)}</span>`;
  const countBy = (list) => D.legalScale.reduce((acc, s) => ((acc[s.id] = list.filter((p) => p.verdict === s.id).length), acc), {});
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const ext = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`;
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
  const FISCAL = {
    gasto: { label: 'Aumenta gastos', cls: 'f-gasto' },
    economia: { label: 'Economiza ou arrecada', cls: 'f-economia' },
    neutro: { label: 'Sem efeito direto', cls: 'f-neutro' },
    incerto: { label: 'Efeito incerto', cls: 'f-incerto' }
  };
  const fiscalChip = (p) => `<span class="chip ${FISCAL[p.fiscal.effect].cls}">${FISCAL[p.fiscal.effect].label}</span>`;
  const countFiscal = (list) => Object.keys(FISCAL).reduce((acc, k) => ((acc[k] = list.filter((p) => p.fiscal.effect === k).length), acc), {});

  /* ==========================================================
     Texto rico: leis/decisões viram links, artigos da CF apontam
     para o texto oficial e termos do glossário ganham explicação.
     ========================================================== */
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const refByMatch = Object.fromEntries(D.refs.map((r) => [r.match.toLowerCase(), r.url]));
  const termByAlias = {};
  D.glossary.forEach((g, i) => (g.aliases || []).forEach((a) => (termByAlias[a.toLowerCase()] = i)));
  const alternatives = [...Object.keys(refByMatch), ...Object.keys(termByAlias)]
    .sort((a, b) => b.length - a.length)
    .map(reEsc);
  const RICH_RE = new RegExp(`(?<![\\p{L}\\d])(${alternatives.join('|')}|Arts?\\. \\d+(?:º|°)?)(?![\\p{L}\\d])`, 'giu');

  function rich(text, { terms = true, skipTerm = -1 } = {}) {
    const used = new Set();
    let out = '';
    let last = 0;
    const src = String(text ?? '');
    src.replace(RICH_RE, (m, _g, offset) => {
      out += esc(src.slice(last, offset));
      last = offset + m.length;
      const k = m.toLowerCase();
      if (refByMatch[k]) {
        out += `<a class="ref" href="${esc(refByMatch[k])}" target="_blank" rel="noopener">${esc(m)}</a>`;
      } else if (/^arts?\./i.test(m)) {
        const n = m.match(/\d+/)[0];
        out += `<a class="ref" href="${esc(D.constitutionUrl)}#art${n}" target="_blank" rel="noopener" title="Abrir a Constituição no Planalto">${esc(m)}</a>`;
      } else if (terms && termByAlias[k] !== undefined && termByAlias[k] !== skipTerm && !used.has(termByAlias[k])) {
        used.add(termByAlias[k]);
        out += `<button type="button" class="term" data-term="${termByAlias[k]}" aria-describedby="tip">${esc(m)}</button>`;
      } else {
        out += esc(m);
      }
      return m;
    });
    return out + esc(src.slice(last));
  }

  /* ---------- Dica do glossário ---------- */
  function initTooltips() {
    const tip = $('#tip');
    let current = null;
    const show = (el) => {
      const g = D.glossary[+el.dataset.term];
      tip.innerHTML = `<b>${esc(g.term)}</b>${esc(g.definition)}`;
      tip.hidden = false;
      const r = el.getBoundingClientRect();
      const w = Math.min(320, innerWidth - 24);
      tip.style.width = `${w}px`;
      const left = Math.max(12, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 12));
      const below = r.bottom + 10 + tip.offsetHeight < innerHeight;
      tip.style.left = `${left}px`;
      tip.style.top = `${below ? r.bottom + 8 : r.top - tip.offsetHeight - 8}px`;
      current = el;
    };
    const hide = () => { tip.hidden = true; current = null; };
    document.addEventListener('mouseover', (e) => { const t = e.target.closest('.term'); if (t) show(t); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest('.term')) hide(); });
    document.addEventListener('focusin', (e) => { const t = e.target.closest('.term'); if (t) show(t); else if (current) hide(); });
    document.addEventListener('click', (e) => {
      const t = e.target.closest('.term');
      if (t) { e.stopPropagation(); current === t && !tip.hidden ? hide() : show(t); }
      else if (current) hide();
    }, true);
    addEventListener('scroll', hide, { passive: true });
    $('#modal-body').addEventListener('scroll', hide, { passive: true });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current) { hide(); e.stopImmediatePropagation(); } });
  }

  /* ==========================================================
     Tema claro/escuro
     ========================================================== */
  function initTheme() {
    const btn = $('#theme-btn');
    const isDark = () => {
      const t = document.documentElement.getAttribute('data-theme');
      return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    };
    const paint = () => {
      btn.innerHTML = icon(isDark() ? 'sun' : 'moon', 18);
      btn.setAttribute('aria-label', isDark() ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    };
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('raiox-theme', next); } catch (e) { /* armazenamento indisponível */ }
      paint();
    });
    paint();
  }

  /* ==========================================================
     Hero e escada
     ========================================================== */
  const statCard = (s, cls = 'stat') => `
    <div class="${cls}"><div class="stat-label">${esc(s.label)}</div><div class="stat-value">${esc(s.value)}</div>
    <div class="stat-note">${esc(s.note)}</div><a class="stat-src" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.source)}</a></div>`;

  function renderHero() {
    $('#hero-faces').innerHTML = D.candidates.map((c) => `<span class="face" style="--c:${c.color}" title="${esc(c.name)}">${esc(c.initials)}</span>`).join('');
    $('#hero-count').textContent = `${D.meta.analyzed} planos · ${allProposals.length} propostas checadas · ${D.meta.registeredCandidates} candidaturas registradas no TSE`;
    $('#hero-stats').innerHTML = ['selic', 'dbgg', 'rigidez', 'mvi'].map((id) => statCard(D.indicators.find((i) => i.id === id))).join('');
  }

  function renderLadder() {
    const counts = countBy(allProposals);
    $('#ladder').innerHTML = D.legalScale.map((s, i) => `
      <div class="rung v-${s.id}">
        <div class="rung-step">${i + 1}</div>
        <h3>${esc(s.label)}</h3>
        <div class="who">${esc(s.who)}</div>
        <p>${rich(s.desc)}</p>
        <div class="count">${counts[s.id]} <small>${counts[s.id] === 1 ? 'proposta' : 'propostas'}</small></div>
      </div>`).join('');
  }

  /* ==========================================================
     Cartões de candidatos
     ========================================================== */
  function verdictBar(list, { legend = true } = {}) {
    const counts = countBy(list);
    const total = list.length;
    const bar = D.legalScale.filter((s) => counts[s.id]).map((s) => `<i class="v-${s.id}" style="width:${(counts[s.id] / total) * 100}%" title="${esc(s.label)}: ${counts[s.id]}"></i>`).join('');
    const leg = legend ? `<div class="vbar-legend">${D.legalScale.filter((s) => counts[s.id]).map((s) => `<span class="v-${s.id}"><i></i>${counts[s.id]} ${esc(s.short)}</span>`).join('')}</div>` : '';
    return `<div class="vbar" role="img" aria-label="${D.legalScale.map((s) => `${s.label}: ${counts[s.id]}`).join(', ')}">${bar}</div>${leg}`;
  }

  function renderCandidates() {
    $('#cand-grid').innerHTML = D.candidates.map((c) => {
      const counts = countBy(c.proposals);
      const hard = counts.vedado + counts.pec;
      return `
      <article class="cand-card" style="--c:${c.color}">
        <div class="cand-id">
          ${avatar(c)}
          <div>
            <h3 class="cand-name">${esc(c.shortName)}</h3>
            <div class="cand-party">${esc(c.party)}${c.number ? ` · nº ${esc(c.number)}` : ''}</div>
          </div>
        </div>
        <p class="cand-thesis">${esc(c.thesis)}</p>
        <div class="cand-stats">
          <div><b>${c.proposals.length}</b> propostas analisadas</div>
          <div><b>${hard}</b> exigem emenda constitucional ou são barradas</div>
        </div>
        ${verdictBar(c.proposals)}
        <div class="cand-foot">
          <a class="btn btn-primary" href="#dossie/${c.id}">Ver análise ${icon('arrow', 15)}</a>
          <a class="link-quiet" href="${pdfUrl(c)}" target="_blank" rel="noopener">Plano original (PDF)</a>
        </div>
      </article>`;
    }).join('');
    $('#cand-note').innerHTML = `Há ${D.meta.registeredCandidates} candidaturas à Presidência registradas no TSE. Este projeto analisa os ${D.meta.analyzed} planos reunidos no repositório; a seleção não é um ranking. <a href="#transparencia">Ver método</a>.`;
  }

  /* ==========================================================
     Filtros e matriz de propostas
     ========================================================== */
  function renderFilters() {
    $('#theme-filter').innerHTML = [`<button data-theme-f="all" aria-pressed="true">Todos os temas</button>`]
      .concat(D.themes.map((t) => `<button data-theme-f="${t.id}" aria-pressed="false">${esc(t.label)}</button>`)).join('');
    $('#cand-filter').innerHTML = D.candidates.map((c) => `<button data-cand-f="${c.id}" aria-pressed="true"><span class="dot" style="background:${c.color}"></span>${esc(c.shortName)}</button>`).join('');
    $('#verdict-filter').innerHTML = [`<button data-verdict-f="all" aria-pressed="true">Qualquer exigência</button>`]
      .concat(D.legalScale.map((s) => `<button data-verdict-f="${s.id}" aria-pressed="false">${esc(s.label)}</button>`)).join('');

    const single = (group, key, prop) => $(group).addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state[key] = b.dataset[prop];
      $$(`${group} button`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      renderMatrix();
    });
    single('#theme-filter', 'theme', 'themeF');
    single('#verdict-filter', 'verdict', 'verdictF');
    $('#cand-filter').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const id = b.dataset.candF;
      if (state.cands.has(id) && state.cands.size > 1) state.cands.delete(id); else state.cands.add(id);
      $$('#cand-filter button').forEach((x) => x.setAttribute('aria-pressed', String(state.cands.has(x.dataset.candF))));
      renderMatrix();
    });
    let t;
    $('#search').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = e.target.value; renderMatrix(); }, 120);
    });
  }

  const propRow = (p) => `
    <a class="prop" href="#p/${p.key}">
      <span class="prop-main">
        <span class="prop-title">${esc(p.title)}</span>
        <span class="prop-plain">${esc(p.plain)}</span>
      </span>
      <span class="prop-side">${chip(p.verdict)}${contestedTag(p)}</span>
      ${icon('chevron', 18)}
    </a>`;

  function renderMatrix() {
    const q = norm(state.q.trim());
    const list = allProposals.filter((p) =>
      (state.theme === 'all' || p.theme === state.theme) &&
      state.cands.has(p.cand.id) &&
      (state.verdict === 'all' || p.verdict === state.verdict) &&
      (!q || norm([p.title, p.plain, p.legal, p.quote || '', p.cand.name].join(' ')).includes(q))
    );

    $('#matrix-count').textContent = `${list.length} de ${allProposals.length} propostas`;

    if (!list.length) {
      $('#matrix').innerHTML = `<div class="empty">Nenhuma proposta encontrada com esses filtros. Tente outro termo ou limpe os filtros.</div>`;
      return;
    }

    $('#matrix').innerHTML = D.themes.filter((t) => list.some((p) => p.theme === t.id)).map((t) => {
      const rows = D.candidates.filter((c) => list.some((p) => p.theme === t.id && p.cand.id === c.id)).map((c) => `
        <div class="theme-row">
          <div class="row-who">${avatar(c, 'avatar-sm')}<span>${esc(c.shortName)}</span></div>
          <div class="row-items">${list.filter((p) => p.theme === t.id && p.cand.id === c.id).map(propRow).join('')}</div>
        </div>`).join('');
      return `<section class="theme-block"><h3 class="theme-head">${esc(t.label)}</h3>${rows}</section>`;
    }).join('');
  }

  /* ==========================================================
     Frente a frente (comparação)
     ========================================================== */
  const cmpPair = () => [...state.cmp].sort((a, b) => candIndex[a] - candIndex[b]);
  const cmpHash = () => `#comparar/${state.cmp.join(',')}`;
  const cmpShareUrl = () => new URL(`share/comparar--${cmpPair().join('--')}.html`, location.href).href;

  function initCompare() {
    const opts = D.candidates.map((c) => `<option value="${c.id}">${esc(c.shortName)}</option>`).join('');
    $('#cmp-a').innerHTML = opts;
    $('#cmp-b').innerHTML = opts;
    $('#cmp-swap').innerHTML = icon('swap', 18);
    const onChange = () => {
      state.cmp = [$('#cmp-a').value, $('#cmp-b').value];
      history.replaceState(null, '', cmpHash());
      renderCompare();
    };
    $('#cmp-a').addEventListener('change', onChange);
    $('#cmp-b').addEventListener('change', onChange);
    $('#cmp-swap').addEventListener('click', () => {
      state.cmp.reverse();
      $('#cmp-a').value = state.cmp[0];
      $('#cmp-b').value = state.cmp[1];
      onChange();
    });
    renderCompare();
  }

  function renderCompare() {
    const [a, b] = state.cmp.map((id) => candById[id]);
    $('#cmp-a').value = a.id;
    $('#cmp-b').value = b.id;
    const [x, y] = state.cmp;
    $('#cmp-share').innerHTML = shareBar({
      url: cmpShareUrl(),
      text: `${a.shortName} e ${b.shortName} frente a frente: o que cada um propõe e o que a Constituição permite`,
      compact: true
    });

    const head = (c) => `
      <div class="cmp-head" style="--c:${c.color}">
        ${avatar(c)}
        <div>
          <div class="cmp-name">${esc(c.shortName)}</div>
          <div class="cand-party">${esc(c.party)} · ${plural(c.proposals.length, 'proposta', 'propostas')}</div>
        </div>
      </div>
      <p class="cmp-thesis">${esc(c.thesis)}</p>
      ${verdictBar(c.proposals)}`;

    const cell = (c, theme) => {
      const ps = allProposals.filter((p) => p.cand.id === c.id && p.theme === theme);
      return ps.length
        ? ps.map((p) => `<a class="cmp-item" href="#p/${p.key}"><span>${esc(p.title)}</span>${chip(p.verdict)}</a>`).join('')
        : '<p class="cmp-empty">Sem proposta analisada neste tema</p>';
    };

    $('#cmp').innerHTML = (x === y ? '<p class="note">Escolha dois candidatos diferentes para comparar.</p>' : '') + `
      <div class="cmp-grid cmp-top"><div>${head(a)}</div><div>${head(b)}</div></div>
      ${D.themes.map((t) => `
        <div class="cmp-theme">
          <h3>${esc(t.label)}</h3>
          <div class="cmp-grid">
            <div class="cmp-col" style="--c:${a.color}">${cell(a, t.id)}</div>
            <div class="cmp-col" style="--c:${b.color}">${cell(b, t.id)}</div>
          </div>
        </div>`).join('')}`;
  }

  /* ==========================================================
     Radar CF/88
     ========================================================== */
  function articleHits() {
    const hits = {};
    allProposals.forEach((p) => p.arts.forEach((a) => (hits[a] = hits[a] || []).push(p)));
    return hits;
  }

  function renderRadar() {
    const hits = articleHits();
    const ids = Object.keys(hits).sort((a, b) => hits[b].length - hits[a].length);
    const card = (id) => {
      const a = D.articles[id];
      const cands = [...new Set(hits[id].map((p) => p.cand.id))].map((cid) => candById[cid]);
      return `
      <button class="art-card" data-article="${id}">
        <span class="art-num">${esc(a.title)}</span>
        <span class="art-topic">${esc(a.topic)}</span>
        <p>${esc(a.plain)}</p>
        <span class="art-foot"><span class="art-who">${cands.map((c) => avatar(c, 'avatar-xs')).join('')}</span><span>${plural(hits[id].length, 'proposta', 'propostas')}</span></span>
      </button>`;
    };
    const top = ids.slice(0, 6);
    const rest = ids.slice(6);
    $('#radar').innerHTML = top.map(card).join('');
    $('#radar-more').innerHTML = rest.length ? `
      <details class="more"><summary>Mais ${rest.length} artigos citados</summary>
        <div class="art-chips">${rest.map((id) => `<button class="art-chip" data-article="${id}"><b>${esc(D.articles[id].title)}</b> ${esc(D.articles[id].topic)}</button>`).join('')}</div>
      </details>` : '';
  }

  /* ==========================================================
     Orçamento
     ========================================================== */
  function renderBudget() {
    const b = D.budget;
    $('#budget-note').textContent = b.note;
    const pct = (v) => (v / b.total) * 100;
    const fmt = (v) => (v >= 1000 ? `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri` : `R$ ${v} bi`);

    $('#budget-stack').innerHTML = b.items.map((i) => `
      <button data-bitem="${i.id}" style="--bc:${i.color}; width:${pct(i.value)}%" aria-label="${esc(i.label)}: ${fmt(i.value)} (${pct(i.value).toFixed(1)}%)">
        ${pct(i.value) > 9 ? `<span>${pct(i.value).toFixed(0)}%</span>` : ''}
      </button>`).join('');

    const group = (g, title) => `<div class="bl-col"><div class="bl-group">${title}</div>` + b.items.filter((i) => i.group === g).map((i) => `
      <div class="bl-item" data-bitem="${i.id}" style="--bc:${i.color}"><i></i><span>${esc(i.label)}</span><b>${fmt(i.value)}</b><em>${pct(i.value).toFixed(1)}%</em></div>`).join('') + '</div>';
    const obrig = b.items.filter((i) => i.group === 'obrig').reduce((s, i) => s + i.value, 0);
    $('#budget-legend').innerHTML =
      group('obrig', `Obrigatórias · ${pct(obrig).toFixed(0)}% · já têm dono`) +
      group('livre', `Discricionárias · ${(100 - pct(obrig)).toFixed(0)}% · decididas a cada ano`);

    const highlight = (id) => $$('[data-bitem]').forEach((el) => el.classList.toggle('on', el.dataset.bitem === id));
    $$('[data-bitem]').forEach((el) => {
      el.addEventListener('mouseenter', () => highlight(el.dataset.bitem));
      el.addEventListener('focus', () => highlight(el.dataset.bitem));
      el.addEventListener('mouseleave', () => highlight(null));
    });

    const max = Math.max(FREE_SPACE, ...b.promises.map((p) => p.perYear));
    $('#promises').innerHTML = `
      <div class="fn-row fn-last" style="--c: var(--brand)">
        <div class="fn-label"><b>Espaço livre do Executivo</b><span>o que o presidente pode decidir em 2026</span></div>
        <div class="fn-bar"><i style="width:${(FREE_SPACE / max) * 100}%"></i></div>
        <div class="fn-val">R$ ${FREE_SPACE} bi<small>por ano</small></div>
      </div>` + b.promises.map((p) => {
      const c = candById[p.candidate];
      return `
      <div class="fn-row fn-promise" style="--c:${c.color}">
        <div class="fn-label"><b>${esc(p.label)}</b><span><em class="fn-who">${esc(c.shortName)}</em> · ${esc(p.note)}</span></div>
        <div class="fn-bar"><i style="width:${(p.perYear / max) * 100}%"></i></div>
        <div class="fn-val">R$ ${p.perYear} bi<small>por ano${p.perYear > FREE_SPACE ? ` · ${(p.perYear / FREE_SPACE).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}× o espaço livre` : ''}</small></div>
      </div>`;
    }).join('');
  }

  function renderFunnel() {
    const f = D.budget.funnel;
    const max = f[0].value;
    const fmt = (v) => (v >= 1000 ? `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri` : `R$ ${v} bi`);
    $('#funnel').innerHTML = f.map((step, i) => `
      <div class="fn-row${step.out ? ' fn-out' : ''}${i === f.length - 1 ? ' fn-last' : ''}">
        <div class="fn-label"><b>${step.out ? '<span class="fn-minus">−</span>' : ''}${esc(step.label)}</b><span>${esc(step.note)}</span></div>
        <div class="fn-bar"><i style="width:${Math.max(0.6, (step.value / max) * 100)}%"></i></div>
        <div class="fn-val">${fmt(step.value)}<small>${Math.round((step.value / max) * 100)}%</small></div>
      </div>`).join('');
  }

  function renderDebt() {
    const d = D.budget.debtSeries;
    const W = 720, H = 260, L = 44, R = 16, T = 16, B = 34;
    const ys = d.map((x) => x.value);
    const min = Math.floor((Math.min(...ys) - 5) / 10) * 10;
    const maxV = Math.ceil((Math.max(...ys) + 3) / 10) * 10;
    const x = (i) => L + (i / (d.length - 1)) * (W - L - R);
    const y = (v) => T + (1 - (v - min) / (maxV - min)) * (H - T - B);
    const path = d.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
    const ticks = [];
    for (let v = min; v <= maxV; v += 10) ticks.push(v);
    const last = d[d.length - 1];
    $('#debt-chart').innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="line-chart" role="img" aria-label="Dívida bruta do governo geral, de ${d[0].year} a ${last.year}, em % do PIB">
        ${ticks.map((v) => `<g><line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" class="tick">${v}%</text></g>`).join('')}
        ${d.map((p, i) => (i % 2 === 0 || i === d.length - 1) ? `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" class="tick">${esc(p.year.replace('jul/', ''))}</text>` : '').join('')}
        <path d="${path}" class="line"/>
        ${d.map((p, i) => `<g class="pt" data-i="${i}"><circle cx="${x(i)}" cy="${y(p.value)}" r="9" class="hit"/><circle cx="${x(i)}" cy="${y(p.value)}" r="${i === d.length - 1 ? 5 : 3.5}" class="dot"/></g>`).join('')}
        <text x="${x(d.length - 1) - 10}" y="${y(last.value) - 12}" text-anchor="end" class="lbl">${last.value.toLocaleString('pt-BR')}% (${esc(last.year)})</text>
        <text x="${x(0) + 8}" y="${y(d[0].value) + 18}" class="lbl">${d[0].value.toLocaleString('pt-BR')}%</text>
      </svg>
      <div class="chart-tip" id="debt-tip" hidden></div>`;
    const tip = $('#debt-tip');
    const svg = $('#debt-chart svg');
    $$('#debt-chart .pt').forEach((g) => {
      const show = () => {
        const p = d[+g.dataset.i];
        tip.textContent = `${p.year}: ${p.value.toLocaleString('pt-BR')}% do PIB`;
        tip.hidden = false;
        const r = g.querySelector('.dot').getBoundingClientRect();
        const box = svg.getBoundingClientRect();
        tip.style.left = `${Math.min(Math.max(r.left - box.left + r.width / 2, 60), box.width - 60)}px`;
        tip.style.top = `${r.top - box.top - 10}px`;
      };
      g.addEventListener('mouseenter', show);
      g.addEventListener('mouseleave', () => { tip.hidden = true; });
      g.addEventListener('focus', show);
    });
    $('#debt-note').textContent = D.budget.debtNote;
    $('#debt-table').innerHTML = `<table><thead><tr><th>Ano</th><th>% do PIB</th></tr></thead><tbody>${d.map((p) => `<tr><td>${esc(p.year)}</td><td>${p.value.toLocaleString('pt-BR')}</td></tr>`).join('')}</tbody></table>`;
    $('#debt-facts').innerHTML = D.budget.debtFacts.map((f) => `<div class="fact"><span class="stat-label">${esc(f.label)}</span><div class="stat-value">${esc(f.value)}</div><div class="stat-note">${esc(f.note)}</div><a class="stat-src" href="${esc(f.url)}" target="_blank" rel="noopener">fonte</a></div>`).join('');
  }

  function renderTimeline() {
    $('#timeline').innerHTML = D.budget.timeline.map((t) => `<li><b>${esc(t.year)}</b><span>${rich(t.text, { terms: false })}</span></li>`).join('');
  }

  function renderBalance() {
    $('#balance').innerHTML = `
      <table class="bal-table">
        <thead><tr><th>Candidato</th><th><span class="th-long">Aumentam gastos</span><span class="th-short">Gastam</span></th><th><span class="th-long">Economizam ou arrecadam</span><span class="th-short">Economizam</span></th><th><span class="th-long">Neutras ou incertas</span><span class="th-short">Neutras</span></th><th></th></tr></thead>
        <tbody>${D.candidates.map((c) => {
          const f = countFiscal(c.proposals);
          return `<tr><td><a class="bal-who" href="#dossie/${c.id}/economia">${avatar(c, 'avatar-xs')}<span>${esc(c.shortName)}</span></a></td><td class="f-gasto"><b>${f.gasto}</b></td><td class="f-economia"><b>${f.economia}</b></td><td><b>${f.neutro + f.incerto}</b></td><td class="bal-more"><a class="link" href="#dossie/${c.id}/economia">Ver economia</a></td></tr>`;
        }).join('')}</tbody>
      </table>
      <p class="stat-note">Contagem das propostas analisadas neste site, não do plano inteiro. O tamanho de cada efeito varia: uma proposta pode custar R$ 10 bi e outra, R$ 200 bi.</p>`;
  }

  /* ---------- Cifras (aba Economia do dossiê) ---------- */
  const kindLabel = { gasto: 'gasto', corte: 'corte', meta: 'meta', fundo: 'fundo externo', 'diagnóstico': 'diagnóstico' };

  function figuresChart(c) {
    const figs = c.economic.figures || [];
    const withValue = figs.filter((f) => f.value);
    const max = Math.max(FREE_SPACE * 1.25, ...withValue.map((f) => f.value));
    const refLeft = (FREE_SPACE / max) * 100;
    const rows = figs.map((f) => `
      <div class="fig-row">
        <div class="fig-top">
          <span>${esc(f.label)} <span class="fig-kind">${esc(kindLabel[f.kind] || f.kind)}</span></span>
          <a class="link-quiet" href="${pdfUrl(c, f.page)}" target="_blank" rel="noopener">p. ${esc(f.page)}</a>
        </div>
        ${f.value
          ? `<div class="fig-track"><i style="width:${(f.value / max) * 100}%;${f.kind === 'corte' ? 'background:var(--muted)' : ''}"></i><b class="fig-ref" style="left:${refLeft}%"></b></div>
             <small>${esc(f.display)}${/\/ano/.test(f.display) ? '' : ` · cerca de R$ ${f.value} bi por ano`}</small>`
          : `<small>${esc(f.display)}</small>`}
      </div>`).join('');
    return `
      <div class="panel">
        <div class="panel-top"><b>Cifras citadas no plano</b><span class="fig-legend"><b class="fig-ref-key"></b>R$ ${FREE_SPACE} bi/ano livres no orçamento de 2026</span></div>
        ${rows}
        ${c.economic.figuresNote ? `<p class="stat-note" style="margin-top:8px">${esc(c.economic.figuresNote)}</p>` : ''}
      </div>`;
  }

  /* ==========================================================
     Contexto, correções, glossário, rodapé
     ========================================================== */
  function renderContext() {
    $('#ctx-grid').innerHTML = D.indicators.map((s) => statCard(s, 'ctx-card')).join('');
    $('#trilemma').innerHTML = D.trilemma.map((t, i) => `<div class="tri-item"><h3>${i + 1}. ${esc(t.title)}</h3><p>${rich(t.desc)}</p></div>`).join('');
  }

  function renderFixes() {
    const fix = (f) => `
      <div class="fix">
        <div class="fix-head"><span class="fix-kind">${esc(f.kind)}</span>${esc(f.who)}</div>
        <div class="fix-was">${esc(f.was)}</div>
        <div class="fix-now">${rich(f.now, { terms: false })}</div>
      </div>`;
    $('#fixes').innerHTML = D.corrections.slice(0, 6).map(fix).join('');
    const rest = D.corrections.slice(6);
    $('#fixes-more').innerHTML = rest.length ? `<details class="more"><summary>Ver as outras ${rest.length} correções</summary><div class="fix-grid">${rest.map(fix).join('')}</div></details>` : '';
    $('#sources').innerHTML = D.sources.map((s) => `<li>${ext(s.url, esc(s.text))}</li>`).join('');
  }

  function renderGlossary() {
    $('#gloss').innerHTML = D.glossary.map((g, i) => `<details id="termo-${i}"><summary>${esc(g.term)}</summary><p>${rich(g.definition, { skipTerm: i })}</p></details>`).join('');
  }

  function renderFooter() {
    $('#foot-docs').innerHTML = D.candidates.map((c) => `<li><a href="${pdfUrl(c)}" target="_blank" rel="noopener">${esc(c.shortName)} (PDF)</a></li>`).join('');
    $('#foot-updated').textContent = `Atualizado em ${D.meta.updated}`;
  }

  /* ==========================================================
     Compartilhamento
     ========================================================== */
  function copyLink(url, btn) {
    const done = () => {
      const old = btn.innerHTML;
      btn.innerHTML = `${icon('check', 16)}<span>Copiado</span>`;
      btn.classList.add('ok');
      setTimeout(() => { btn.innerHTML = old; btn.classList.remove('ok'); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, () => prompt('Copie o link:', url));
    } else {
      prompt('Copie o link:', url);
    }
  }

  function shareBar({ url, text, compact = false }) {
    return `
      <div class="share${compact ? ' share-compact' : ''}" data-share-url="${esc(url)}" data-share-text="${esc(text)}">
        ${compact ? '' : '<span class="share-label">Compartilhar</span>'}
        <button class="share-btn" data-copy>${icon('link')}<span>Copiar link</span></button>
        <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a>
        <a class="share-btn" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">${icon('x')}<span>X</span></a>
        ${navigator.share ? `<button class="share-btn" data-native-share>${icon('share')}<span>Mais</span></button>` : ''}
      </div>`;
  }

  /* ==========================================================
     Modal
     ========================================================== */
  const modal = $('#modal');
  let lastFocus = null;

  function openModal(headHtml, bodyHtml, color) {
    if (!modal.classList.contains('open')) lastFocus = document.activeElement;
    modal.style.setProperty('--c', color || 'var(--brand)');
    $('#modal-head').innerHTML = headHtml;
    $('#modal-body').innerHTML = bodyHtml;
    $('#modal-body').scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    ($('[data-close-btn]', modal) || $('.modal-panel', modal)).focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (/^#(p|dossie)\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  const closeBtn = `<button class="icon-btn" data-close-btn data-close aria-label="Fechar">${icon('close', 18)}</button>`;

  function proposalCard(p, { withWho = false } = {}) {
    const c = p.cand;
    return `
      <article class="prop-card v-${p.verdict}" id="prop-${p.id}">
        <header class="prop-card-head">
          <a class="prop-card-title" href="#p/${p.key}">${withWho ? `<span class="prop-card-who" style="--c:${c.color}">${esc(c.shortName)}</span>` : ''}${esc(p.title)}</a>
          <span class="prop-side">${chip(p.verdict)}${contestedTag(p)}</span>
        </header>
        <p class="prop-card-plain">${esc(p.plain)}</p>
        ${p.quote ? `<blockquote class="pull"><p>${esc(p.quote)}</p><cite>${esc(c.document.title)}, p. ${esc(p.page)}</cite></blockquote>` : ''}
        <div class="prop-card-cols">
          <div><h4 class="label">O que diz a Constituição</h4><p>${rich(p.legal)}</p></div>
          <div><h4 class="label">Efeito nas contas públicas</h4><p class="fiscal-line">${fiscalChip(p)}<span>${rich(p.fiscal.note)}</span></p></div>
        </div>
        <footer class="prop-card-foot">
          <a class="pill" href="${pdfUrl(c, p.page)}" target="_blank" rel="noopener">${icon('doc', 14)} Ver no plano, p. ${esc(p.page)}</a>
          ${p.arts.map((a) => `<button class="pill" data-article="${a}">${esc(D.articles[a].title)}</button>`).join('')}
        </footer>
      </article>`;
  }

  function openDossier(id, tab = 'geral') {
    const c = candById[id];
    if (!c) return;
    const tabs = [['geral', 'Visão geral'], ['propostas', `Propostas`], ['economia', 'Economia'], ['contexto', 'Diagnóstico']];
    const head = `
      <div class="modal-head-row">
        <div class="modal-who">
          ${avatar(c, 'avatar-lg')}
          <div>
            <div class="sub">${esc(c.party)}${c.number ? ` · nº ${esc(c.number)}` : ''} · vice: ${esc(c.vice)}</div>
            <h2 id="modal-title">${esc(c.name)}</h2>
          </div>
        </div>
        ${closeBtn}
      </div>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" data-cid="${c.id}" aria-selected="${k === tab}">${esc(l)}${k === 'propostas' ? ` <small>${c.proposals.length}</small>` : ''}</button>`).join('')}</div>`;
    openModal(head, dossierBody(c, tab), c.color);
  }

  function dossierBody(c, tab) {
    const mine = allProposals.filter((p) => p.cand.id === c.id);
    if (tab === 'propostas') {
      const v = countBy(mine);
      const f = countFiscal(mine);
      const sentence = D.legalScale.filter((sc) => v[sc.id]).map((sc) => `<b>${v[sc.id]}</b> ${sc.id === 'exec' ? 'o governo faz sozinho' : sc.id === 'lei' ? (v[sc.id] === 1 ? 'precisa de lei' : 'precisam de lei') : sc.id === 'lc' ? (v[sc.id] === 1 ? 'precisa de lei complementar' : 'precisam de lei complementar') : sc.id === 'pec' ? (v[sc.id] === 1 ? 'exige emenda constitucional' : 'exigem emenda constitucional') : (v[sc.id] === 1 ? 'esbarra na Constituição' : 'esbarram na Constituição')}`).join(', ');
      return `
        <div class="quick">
          <h3>Leitura rápida</h3>
          <p class="lead">Das ${mine.length} propostas analisadas, ${sentence}. Nas contas públicas, <b>${f.gasto}</b> ${f.gasto === 1 ? 'aumenta' : 'aumentam'} gastos, <b>${f.economia}</b> ${f.economia === 1 ? 'economiza ou arrecada' : 'economizam ou arrecadam'} e <b>${f.neutro + f.incerto}</b> ${f.neutro + f.incerto === 1 ? 'tem' : 'têm'} efeito neutro ou incerto.</p>
          ${verdictBar(mine)}
          <ol class="index">
            ${D.themes.filter((t) => mine.some((p) => p.theme === t.id)).map((t) => `
              <li><span class="index-theme">${esc(t.label)}</span>
                ${mine.filter((p) => p.theme === t.id).map((p) => `<a href="#prop-${p.id}" data-jump="prop-${p.id}" class="v-${p.verdict}"><i></i><span>${esc(p.title)}</span><small>${esc(scaleById[p.verdict].short)}</small></a>`).join('')}
              </li>`).join('')}
          </ol>
        </div>
        ${D.themes.filter((t) => mine.some((p) => p.theme === t.id)).map((t) =>
          `<h3>${esc(t.label)}</h3>` + mine.filter((p) => p.theme === t.id).map((p) => proposalCard(p)).join('')
        ).join('')}`;
    }
    if (tab === 'economia') {
      const f = countFiscal(mine);
      const col = (k) => `
        <div class="bal-col ${FISCAL[k].cls}">
          <div class="bal-head"><b>${f[k]}</b> ${esc(FISCAL[k].label.toLowerCase())}</div>
          ${mine.filter((p) => p.fiscal.effect === k).map((p) => `<a href="#p/${p.key}">${esc(p.title)}</a>`).join('') || '<span class="cmp-empty">nenhuma</span>'}
        </div>`;
      return `
        <h3>${esc(c.economic.headline)}</h3>
        <div class="start">
          <div><span class="stat-label">Ponto de partida</span><div class="stat-value">82,5%</div><div class="stat-note">do PIB em dívida bruta (jul/2026), em alta</div></div>
          <div><span class="stat-label">Juros da dívida</span><div class="stat-value">~R$ 1,1 tri</div><div class="stat-note">incorporados em 2025, 8,9 pontos do PIB</div></div>
          <div><span class="stat-label">Espaço livre</span><div class="stat-value">R$ ${FREE_SPACE} bi</div><div class="stat-note">por ano para o presidente decidir</div></div>
        </div>
        <h3>Balanço das propostas nas contas públicas</h3>
        <div class="balance">${col('gasto')}${col('economia')}${col('neutro')}${f.incerto ? col('incerto') : ''}</div>
        ${figuresChart(c)}
        <div class="two-col">
          <div><h3>De onde viria o dinheiro, segundo o plano</h3><ul class="bullets">${c.economic.funding.map((x) => `<li>${rich(x)}</li>`).join('')}</ul></div>
          <div><h3>O que o plano não responde</h3><ul class="bullets gaps">${c.economic.gaps.map((x) => `<li>${rich(x)}</li>`).join('')}</ul></div>
        </div>
        <h3>Nossa leitura</h3>
        <ul class="bullets">${c.economic.points.map((x) => `<li>${rich(x)}</li>`).join('')}</ul>
        <p>${rich(c.economic.analysis)}</p>`;
    }
    if (tab === 'contexto') {
      return `
        <dl class="kv">
          <div><dt>Diagnóstico do plano</dt><dd>${rich(c.context.diagnosis)}</dd></div>
          <div><dt>Resposta proposta</dt><dd>${rich(c.context.solution)}</dd></div>
          <div><dt>Ponto cego</dt><dd>${rich(c.context.critique)}</dd></div>
        </dl>`;
    }
    const other = D.candidates.find((x) => x.id !== c.id).id;
    const v = countBy(mine);
    const f = countFiscal(mine);
    return `
      <blockquote class="motto"><p>${esc(c.motto.text)}</p><cite>${esc(c.document.title)}${c.motto.page ? `, p. ${esc(c.motto.page)}` : ''} · ${esc(c.document.pages)}</cite></blockquote>
      <p class="lead">${rich(c.thesis)}</p>
      <p>${rich(c.summary)}</p>
      <div class="key-row">
        <div><b>${mine.length}</b><span>propostas analisadas</span></div>
        <div><b>${v.pec + v.vedado}</b><span>exigem emenda ou são barradas</span></div>
        <div><b>${f.gasto}</b><span>aumentam gastos</span></div>
        <div><b>${f.economia}</b><span>economizam ou arrecadam</span></div>
      </div>
      <h3>Perfil jurídico</h3>
      ${verdictBar(mine)}
      <div class="btn-row">
        <button class="btn btn-primary" data-tab="propostas" data-cid="${c.id}">Ler as ${c.proposals.length} propostas ${icon('arrow', 15)}</button>
        <a class="btn btn-ghost" href="${pdfUrl(c)}" target="_blank" rel="noopener">Plano original (PDF)</a>
        <a class="btn btn-ghost" href="#comparar/${c.id},${other}" data-close>Comparar com outro candidato</a>
      </div>`;
  }

  function openProposal(key) {
    const p = byKey[key];
    if (!p) return;
    const c = p.cand;
    const s = scaleById[p.verdict];
    const siblings = allProposals.filter((x) => x.cand.id === c.id);
    const i = siblings.indexOf(p);
    const prev = siblings[(i - 1 + siblings.length) % siblings.length];
    const next = siblings[(i + 1) % siblings.length];
    const head = `
      <div class="modal-head-row">
        <div class="modal-who">${avatar(c, 'avatar-lg')}<div><div class="sub">${esc(c.name)} · ${esc(themeById[p.theme].label)}</div><h2 id="modal-title">${esc(p.title)}</h2></div></div>
        ${closeBtn}
      </div>`;
    const body = `
      <p class="lead">${esc(p.plain)}</p>
      ${p.quote ? `<blockquote class="pull"><p>${esc(p.quote)}</p><cite>${esc(c.document.title)}, p. ${esc(p.page)} · <a href="${pdfUrl(c, p.page)}" target="_blank" rel="noopener">abrir no PDF</a></cite></blockquote>` : ''}
      <div class="verdict v-${p.verdict}">
        <div class="verdict-step">Degrau ${D.legalScale.indexOf(s) + 1} de 5${p.contested ? ' · tema controverso' : ''}</div>
        <div class="verdict-label">${esc(s.label)}</div>
        <div class="verdict-who">${esc(s.who)}</div>
        <p>${rich(s.desc)}</p>
      </div>
      <h3>O que diz a Constituição</h3>
      <p>${rich(p.legal)}</p>
      <h3>Efeito nas contas públicas</h3>
      <p class="fiscal-line">${fiscalChip(p)}<span>${rich(p.fiscal.note)}</span></p>
      <div class="pill-row">
        <a class="pill" href="${pdfUrl(c, p.page)}" target="_blank" rel="noopener">${icon('doc', 14)} Ver no plano, p. ${esc(p.page)}</a>
        ${p.arts.map((a) => `<button class="pill" data-article="${a}">${esc(D.articles[a].title)} · ${esc(D.articles[a].topic)}</button>`).join('')}
      </div>
      ${shareBar({ url: new URL(`share/${c.id}--${p.id}.html`, location.href).href, text: `${c.shortName}: “${p.title}”. O que a Constituição diz sobre isso` })}
      <nav class="prop-nav" aria-label="Outras propostas de ${esc(c.shortName)}">
        <a href="#p/${prev.key}"><small>Anterior</small>${esc(prev.title)}</a>
        <a href="#p/${next.key}"><small>Próxima</small>${esc(next.title)}</a>
      </nav>
      <p class="btn-row"><a class="btn btn-ghost" href="#dossie/${c.id}/propostas">Todas as propostas de ${esc(c.shortName)}</a></p>`;
    openModal(head, body, c.color);
    document.title = `${p.title} · ${c.shortName} · Raio-X 2026`;
  }

  function openArticle(id) {
    const a = D.articles[id];
    const list = allProposals.filter((p) => p.arts.includes(id));
    const head = `
      <div class="modal-head-row">
        <div><div class="sub">Constituição Federal de 1988</div><h2 id="modal-title">${esc(a.title)}</h2><div class="sub-strong">${esc(a.topic)}</div></div>
        ${closeBtn}
      </div>`;
    const body = `
      <div class="law-text">
        <p>${esc(a.text)}</p>
        <a class="link-quiet" href="${esc(D.constitutionUrl)}#art${(a.title.match(/\d+/) || [''])[0]}" target="_blank" rel="noopener">Texto oficial no Planalto ${icon('external', 13)}</a>
      </div>
      <div class="note"><b>Em português simples</b><p>${rich(a.plain)}</p></div>
      <h3>${plural(list.length, 'proposta que esbarra', 'propostas que esbarram')} neste artigo</h3>
      <div class="art-list">
        ${list.map((p) => `
          <a class="art-item" href="#p/${p.key}">
            ${avatar(p.cand, 'avatar-sm')}
            <span class="art-item-main"><b>${esc(p.title)}</b><span>${esc(p.cand.shortName)} · ${esc(p.plain)}</span></span>
            <span class="prop-side">${chip(p.verdict)}</span>
          </a>`).join('')}
      </div>`;
    openModal(head, body);
  }

  /* ==========================================================
     Roteamento por hash
     ========================================================== */
  const BASE_TITLE = document.title;

  // Rola até a seção sem animação; repete depois das fontes carregarem,
  // porque a troca de fonte muda a altura da página e cancela a rolagem suave.
  function jumpTo(el) {
    const go = () => el.scrollIntoView({ behavior: 'instant', block: 'start' });
    go();
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(go);
    if (document.readyState !== 'complete') addEventListener('load', go, { once: true });
  }

  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    let m;
    document.title = BASE_TITLE;
    if ((m = h.match(/^p\/([\w-]+\/[\w-]+)$/)) && byKey[m[1]]) return openProposal(m[1]);
    if ((m = h.match(/^dossie[/-]([\w-]+)(?:\/(geral|propostas|economia|contexto))?$/)) && candById[m[1]]) return openDossier(m[1], m[2] || 'geral');
    if ((m = h.match(/^comparar\/([\w-]+),([\w-]+)$/)) && candById[m[1]] && candById[m[2]]) {
      if (modal.classList.contains('open')) closeModal();
      state.cmp = [m[1], m[2]];
      renderCompare();
      jumpTo($('#comparar'));
      return;
    }
    if (modal.classList.contains('open')) closeModal();
  }

  function initModal() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-article],[data-tab],[data-close],[data-copy],[data-native-share],[data-jump]');
      if (!t) return;
      if (t.dataset.jump) {
        e.preventDefault();
        const el = document.getElementById(t.dataset.jump);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1200); }
        return;
      }
      if (t.dataset.close !== undefined) {
        if (t.tagName !== 'A') closeModal();
        return;
      }
      if (t.dataset.article) return openArticle(t.dataset.article);
      if (t.dataset.copy !== undefined) return copyLink(t.closest('.share').dataset.shareUrl, t);
      if (t.dataset.nativeShare !== undefined) {
        const s = t.closest('.share').dataset;
        navigator.share({ title: document.title, text: s.shareText, url: s.shareUrl }).catch(() => {});
        return;
      }
      if (t.dataset.tab) {
        const c = candById[t.dataset.cid];
        $$('.tabs button', modal).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t.dataset.tab)));
        $('#modal-body').innerHTML = dossierBody(c, t.dataset.tab);
        $('#modal-body').scrollTop = 0;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const f = $$('button, a[href], input, select, [tabindex]:not([tabindex="-1"])', modal).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $('.modal-panel', modal).setAttribute('tabindex', '-1');
    addEventListener('hashchange', route);
    route();
  }

  /* ==========================================================
     Abertura: vídeo de fundo e contadores
     ========================================================== */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHeroMedia() {
    const hero = $('#topo');
    const v = $('#hero-video');
    const img = $('#hero-poster');
    if (!v) return;
    img.addEventListener('error', () => { img.remove(); if (!hero.classList.contains('video-on')) hero.classList.add('no-media'); });
    const fail = () => { v.remove(); hero.classList.remove('video-on'); if (!document.contains(img)) hero.classList.add('no-media'); };
    // O <video> só falha de vez quando a última <source> falha
    const sources = $$('source', v);
    (sources[sources.length - 1] || v).addEventListener('error', fail);
    v.addEventListener('error', fail);
    if (reduceMotion) { v.remove(); return; }
    v.addEventListener('playing', () => hero.classList.add('video-on'), { once: true });
    // Só toca quando visível; poupa bateria e banda
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .1 });
    io.observe(v);
  }

  function tween(el, from, to, format, ms = 900) {
    if (reduceMotion) { el.textContent = format(to); return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = format(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- A posse ---------- */
  function initPosse() {
    const card = $('#posse-card');
    if (!card) return;
    const num = $('#posse-num'), unit = $('#posse-unit'), bar = $('#posse-bar'), label = $('#posse-label'), sub = $('#posse-sub'), dots = $('#posse-dots');
    const TOTAL = 6530;
    const steps = [
      { v: 6530, label: 'Orçamento autorizado para 2027', sub: '100% do que a lei autoriza gastar' },
      { v: 3393, label: 'Depois dos juros e da rolagem da dívida', sub: 'R$ 3,1 tri a menos, 48% do total' },
      { v: 2556, label: 'Depois das transferências a estados e municípios', sub: 'Despesa primária da União' },
      { v: 256, label: 'Depois das despesas obrigatórias', sub: 'R$ 2,3 tri já têm dono' },
      { v: 206, label: 'Livre para o presidente decidir', sub: '3% do orçamento, depois das emendas', warn: true },
      { dots: true, label: 'Quórum para mudar a Constituição', sub: '3/5 de cada Casa, em dois turnos' },
      { v: 206, label: 'Cada promessa precisa caber aqui', sub: 'ou tirar dinheiro de outro lugar', warn: true }
    ];
    const camara = $('#dots-camara'), senado = $('#dots-senado');
    camara.innerHTML = Array.from({ length: 513 }, () => '<i></i>').join('');
    senado.innerHTML = Array.from({ length: 81 }, () => '<i></i>').join('');
    let cur = 0;
    let shown = TOTAL;
    const fmt = (v) => (v >= 1000 ? (v / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(v).toLocaleString('pt-BR'));
    const apply = (i) => {
      const st = steps[i];
      label.textContent = st.label;
      sub.textContent = st.sub;
      card.classList.toggle('warn', !!st.warn);
      if (st.dots) {
        dots.hidden = false;
        $('.posse-number', card).hidden = true;
        $('.posse-bar', card).hidden = true;
        const light = (el, n) => $$('i', el).forEach((d, k) => setTimeout(() => d.classList.add('on'), reduceMotion ? 0 : Math.min(k * 3, 900)) && k < n);
        $$('i', camara).forEach((d) => d.classList.remove('on'));
        $$('i', senado).forEach((d) => d.classList.remove('on'));
        $$('i', camara).slice(0, 308).forEach((d, k) => setTimeout(() => d.classList.add('on'), reduceMotion ? 0 : k * 2));
        $$('i', senado).slice(0, 49).forEach((d, k) => setTimeout(() => d.classList.add('on'), reduceMotion ? 0 : 300 + k * 8));
        void light;
        return;
      }
      dots.hidden = true;
      $('.posse-number', card).hidden = false;
      $('.posse-bar', card).hidden = false;
      const to = st.v;
      const unitTo = to >= 1000 ? 'trilhões' : 'bilhões';
      // Evita animar entre unidades diferentes (tri → bi)
      const from = (shown >= 1000) === (to >= 1000) ? shown : to;
      unit.textContent = unitTo;
      tween(num, from, to, fmt);
      bar.style.width = `${Math.max(1.2, (to / TOTAL) * 100)}%`;
      shown = to;
    };
    apply(0);
    $$('.posse-step')[0].classList.add('active');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = +en.target.dataset.step;
        $$('.posse-step').forEach((el) => el.classList.toggle('active', el === en.target));
        if (i !== cur) { cur = i; apply(i); }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    $$('.posse-step').forEach((el) => io.observe(el));
  }

  /* ---------- Contadores nos indicadores ---------- */
  function initCounters() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const raw = el.textContent.trim();
        const m = raw.match(/^([^0-9]*)([0-9][0-9.,]*)(.*)$/);
        if (!m) return;
        const numStr = m[2];
        const decimals = (numStr.split(',')[1] || '').length;
        const value = parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
        if (!isFinite(value)) return;
        const fmtN = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        const span = document.createElement('span');
        el.textContent = '';
        el.append(m[1], span, m[3]);
        tween(span, 0, value, fmtN, 1100);
      });
    }, { threshold: .6 });
    $$('.stats-strip .stat-value, .ctx-card .stat-value, .big-number').forEach((el) => io.observe(el));
  }

  /* ==========================================================
     Navegação e progresso
     ========================================================== */
  function initChrome() {
    const menuBtn = $('#menu-btn');
    const mnav = $('#mobile-nav');
    menuBtn.addEventListener('click', () => {
      const open = mnav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    mnav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { mnav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });

    const bar = $('#progress');
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.width = `${(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100}%`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const links = $$('.nav a');
    const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ==========================================================
     Init
     ========================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderHero();
    initHeroMedia();
    initPosse();
    renderLadder();
    renderCandidates();

    const rest = () => {
      renderFilters();
      renderMatrix();
      initCompare();
      renderRadar();
      renderBudget();
      renderFunnel();
      renderDebt();
      renderTimeline();
      renderBalance();
      renderContext();
      renderFixes();
      renderGlossary();
      renderFooter();
      initTooltips();
      initCounters();
      initChrome();
      initModal();
      const target = /^#[a-z-]+$/.test(location.hash) && document.getElementById(location.hash.slice(1));
      if (target) jumpTo(target);
    };
    if (/^#(p|dossie|comparar)[/-]/.test(location.hash) || /^#[a-z-]+$/.test(location.hash)) rest();
    else if ('requestIdleCallback' in window) requestIdleCallback(rest, { timeout: 400 });
    else setTimeout(rest, 0);
  });
})();
