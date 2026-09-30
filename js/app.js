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
    String(text ?? '').replace(RICH_RE, (m, _g, offset) => {
      out += esc(text.slice(last, offset));
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
    return out + esc(String(text ?? '').slice(last));
  }

  /* ---------- Dica flutuante do glossário ---------- */
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
    const icon = $('#theme-icon');
    const isDark = () => {
      const t = document.documentElement.getAttribute('data-theme');
      return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    };
    const paint = () => {
      icon.innerHTML = isDark()
        ? '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
        : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
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
    <div class="${cls} reveal"><div class="stat-label">${esc(s.label)}</div><div class="stat-value">${esc(s.value)}</div>
    <div class="stat-note">${esc(s.note)}</div><a class="stat-src" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.source)} ↗</a></div>`;

  function renderHero() {
    $('#hero-faces').innerHTML = D.candidates.map((c) => `<span class="face" style="--c:${c.color}" title="${esc(c.name)}">${esc(c.initials)}</span>`).join('');
    $('#hero-count').textContent = `${D.meta.analyzed} planos · ${allProposals.length} propostas checadas · ${D.meta.registeredCandidates} candidaturas registradas no TSE`;
    $('#hero-stats').innerHTML = ['selic', 'dbgg', 'rigidez', 'mvi'].map((id) => statCard(D.indicators.find((i) => i.id === id))).join('');
  }

  function renderLadder() {
    const counts = countBy(allProposals);
    $('#ladder').innerHTML = D.legalScale.map((s) => `
      <div class="rung v-${s.id}">
        <div class="rung-step">${esc(s.step)}</div>
        <h3>${esc(s.label)}</h3>
        <div class="who">${esc(s.who)}</div>
        <p>${rich(s.desc)}</p>
        <div class="count">${counts[s.id]}<small>propostas analisadas</small></div>
      </div>`).join('');
  }

  /* ==========================================================
     Cartões de candidatos
     ========================================================== */
  function verdictBar(list) {
    const counts = countBy(list);
    const total = list.length;
    const bar = D.legalScale.filter((s) => counts[s.id]).map((s) => `<i class="v-${s.id}" style="width:${(counts[s.id] / total) * 100}%" title="${esc(s.label)}: ${counts[s.id]}"></i>`).join('');
    const legend = D.legalScale.filter((s) => counts[s.id]).map((s) => `<span><b>${counts[s.id]}</b> ${esc(s.label.toLowerCase())}</span>`).join('');
    return `<div class="vbar" role="img" aria-label="${D.legalScale.map((s) => `${s.label}: ${counts[s.id]}`).join(', ')}">${bar}</div><div class="vbar-legend">${legend}</div>`;
  }

  const verdictOrder = { vedado: 0, pec: 1, lc: 2, lei: 3, exec: 4 };

  function renderCandidates() {
    $('#cand-grid').innerHTML = D.candidates.map((c) => {
      const highlights = [...c.proposals].sort((a, b) => verdictOrder[a.verdict] - verdictOrder[b.verdict]).slice(0, 3);
      return `
      <article class="cand-card reveal" style="--c:${c.color}">
        <div class="cand-top">
          <div class="cand-id">
            ${avatar(c)}
            <div>
              <h3 class="cand-name">${esc(c.shortName)}</h3>
              <div class="cand-party">${esc(c.party)}${c.number ? ` · ${esc(c.number)}` : ''} · vice: ${esc(c.vice)}</div>
            </div>
          </div>
          <p class="cand-thesis">${esc(c.thesis)}</p>
        </div>
        <div class="cand-body">
          <div>
            <h4>Perfil jurídico das ${c.proposals.length} propostas</h4>
            <div style="margin-top: 8px;">${verdictBar(c.proposals)}</div>
          </div>
          <div>
            <h4>Propostas que mais exigem</h4>
            <ul class="mini-list" style="margin-top: 8px;">
              ${highlights.map((p) => `<li><span>${esc(p.title)}</span>${chip(p.verdict)}</li>`).join('')}
            </ul>
          </div>
          <div class="cand-foot">
            <a class="btn btn-c" href="#dossie/${c.id}">Abrir dossiê</a>
            <a class="btn btn-ghost" href="${pdfUrl(c)}" target="_blank" rel="noopener">PDF original</a>
          </div>
        </div>
      </article>`;
    }).join('') + `
      <article class="cand-card cand-note reveal">
        <div class="cand-body" style="justify-content:center">
          <span class="eyebrow">Recorte</span>
          <h3 class="cand-name">Por que só cinco?</h3>
          <p class="cand-thesis" style="margin:0">Há ${D.meta.registeredCandidates} candidaturas à Presidência registradas no TSE. Analisamos os ${D.meta.analyzed} planos reunidos neste projeto. Isso não é um ranking nem indica quem são os “principais”.</p>
          <a class="btn btn-ghost" href="#transparencia" style="align-self:flex-start">Ver método</a>
        </div>
      </article>`;
  }

  /* ==========================================================
     Filtros e matriz de propostas
     ========================================================== */
  function renderFilters() {
    $('#theme-filter').innerHTML = [`<button data-theme-f="all" aria-pressed="true">Todos os temas</button>`]
      .concat(D.themes.map((t) => `<button data-theme-f="${t.id}" aria-pressed="false">${t.icon} ${esc(t.label)}</button>`)).join('');
    $('#cand-filter').innerHTML = D.candidates.map((c) => `<button data-cand-f="${c.id}" aria-pressed="true"><span class="dot" style="background:${c.color}"></span>${esc(c.shortName)}</button>`).join('');
    $('#verdict-filter').innerHTML = [`<button data-verdict-f="all" aria-pressed="true">Todos os degraus</button>`]
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

  const propButton = (p, compact = false) => `
    <a class="prop${compact ? ' prop-compact' : ''}" href="#p/${p.key}">
      <span class="prop-title">${esc(p.title)}</span>
      <span class="prop-chips">${chip(p.verdict)}${contestedTag(p)}</span>
      ${compact ? '' : `<span class="prop-plain">${esc(p.plain)}</span><span class="prop-more">Ver análise e fonte (p. ${esc(p.page)}) →</span>`}
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
          <div class="row-who">${avatar(c)}<span>${esc(c.shortName)}</span></div>
          <div class="row-items">${list.filter((p) => p.theme === t.id && p.cand.id === c.id).map((p) => propButton(p)).join('')}</div>
        </div>`).join('');
      return `<section class="theme-block"><div class="theme-head"><span class="ti" aria-hidden="true">${t.icon}</span><h3>${esc(t.label)}</h3></div>${rows}</section>`;
    }).join('');
  }

  /* ==========================================================
     Frente a frente (comparação)
     ========================================================== */
  function initCompare() {
    const opts = D.candidates.map((c) => `<option value="${c.id}">${esc(c.shortName)}</option>`).join('');
    $('#cmp-a').innerHTML = opts;
    $('#cmp-b').innerHTML = opts;
    const onChange = () => {
      state.cmp = [$('#cmp-a').value, $('#cmp-b').value];
      history.replaceState(null, '', `#comparar/${state.cmp.join(',')}`);
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
    $('#cmp-share').addEventListener('click', (e) => copyLink(new URL(`#comparar/${state.cmp.join(',')}`, location.href).href, e.currentTarget));
    renderCompare();
  }

  function renderCompare() {
    const [a, b] = state.cmp.map((id) => candById[id]);
    $('#cmp-a').value = a.id;
    $('#cmp-b').value = b.id;
    const head = (c) => `
      <div class="cmp-head" style="--c:${c.color}">
        <div class="cand-id">${avatar(c)}<div><div class="cand-name">${esc(c.shortName)}</div><div class="cand-party">${esc(c.party)} · ${c.proposals.length} propostas</div></div></div>
        <p class="cmp-thesis">${esc(c.thesis)}</p>
        ${verdictBar(c.proposals)}
      </div>`;
    const col = (c, theme) => {
      const ps = allProposals.filter((p) => p.cand.id === c.id && p.theme === theme);
      return ps.length ? ps.map((p) => propButton(p, true)).join('') : '<p class="cmp-empty">Nenhuma proposta analisada neste tema.</p>';
    };
    const same = a.id === b.id ? '<p class="cmp-warn">Escolha dois candidatos diferentes para comparar.</p>' : '';
    $('#cmp').innerHTML = same + `
      <div class="cmp-grid">${head(a)}${head(b)}</div>
      ${D.themes.map((t) => `
        <div class="cmp-theme">
          <h3><span aria-hidden="true">${t.icon}</span> ${esc(t.label)}</h3>
          <div class="cmp-grid"><div class="cmp-col" style="--c:${a.color}">${col(a, t.id)}</div><div class="cmp-col" style="--c:${b.color}">${col(b, t.id)}</div></div>
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
      <button class="art-card reveal" data-article="${id}">
        <span class="eyebrow">${hits[id].length} proposta${hits[id].length > 1 ? 's' : ''}</span>
        <span class="art-num">${esc(a.title)}</span>
        <span class="art-topic">${esc(a.topic)}</span>
        <p>${esc(a.plain)}</p>
        <span class="art-who">${cands.map((c) => avatar(c)).join('')}</span>
      </button>`;
    };
    const top = ids.slice(0, 6);
    const rest = ids.slice(6);
    $('#radar').innerHTML = top.map(card).join('');
    $('#radar-more').innerHTML = rest.length ? `
      <details class="more"><summary>Mais ${rest.length} artigos citados ↓</summary>
        <div class="art-chips">${rest.map((id) => `<button class="art-chip" data-article="${id}"><b>${esc(D.articles[id].title)}</b> ${esc(D.articles[id].topic)} <span>${hits[id].length}</span></button>`).join('')}</div>
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

    const group = (g, title) => `<div class="bl-group">${title}</div>` + b.items.filter((i) => i.group === g).map((i) => `
      <div class="bl-item" data-bitem="${i.id}" style="--bc:${i.color}"><i></i><span>${esc(i.label)}</span><b>${fmt(i.value)}</b><em>${pct(i.value).toFixed(1)}%</em></div>`).join('');
    const obrig = b.items.filter((i) => i.group === 'obrig').reduce((s, i) => s + i.value, 0);
    $('#budget-legend').innerHTML =
      group('obrig', `Obrigatórias · ${pct(obrig).toFixed(0)}%`) +
      group('livre', `Discricionárias · ${(100 - pct(obrig)).toFixed(0)}%`);

    const highlight = (id) => $$('[data-bitem]').forEach((el) => el.classList.toggle('on', el.dataset.bitem === id));
    $$('[data-bitem]').forEach((el) => {
      el.addEventListener('mouseenter', () => highlight(el.dataset.bitem));
      el.addEventListener('focus', () => highlight(el.dataset.bitem));
      el.addEventListener('mouseleave', () => highlight(null));
    });

    const max = Math.max(FREE_SPACE, ...b.promises.map((p) => p.perYear));
    $('#promises').innerHTML = `
      <div class="promise" style="--c: var(--brand)">
        <div class="promise-top"><span>Espaço livre do Executivo</span><span>R$ ${FREE_SPACE} bi/ano</span></div>
        <div class="promise-bar"><i style="width:${(FREE_SPACE / max) * 100}%"></i></div>
      </div>` + b.promises.map((p) => {
      const c = candById[p.candidate];
      return `
      <div class="promise" style="--c:${c.color}">
        <div class="promise-top"><span>${esc(c.shortName)}: ${esc(p.label)}</span><span>R$ ${p.perYear} bi/ano</span></div>
        <div class="promise-bar"><i style="width:${(p.perYear / max) * 100}%"></i></div>
        <small>${esc(p.note)}</small>
      </div>`;
    }).join('');
  }

  /* ---------- Gráfico de cifras (aba Economia do dossiê) ---------- */
  const kindLabel = { gasto: 'gasto', corte: 'corte/economia', meta: 'meta', fundo: 'fundo externo', 'diagnóstico': 'diagnóstico' };

  function figuresChart(c) {
    const figs = c.economic.figures || [];
    const withValue = figs.filter((f) => f.value);
    const max = Math.max(FREE_SPACE * 1.25, ...withValue.map((f) => f.value));
    const refLeft = (FREE_SPACE / max) * 100;
    const rows = figs.map((f) => `
      <div class="fig-row">
        <div class="fig-top">
          <span>${esc(f.label)} <span class="fig-kind k-${f.kind === 'corte' ? 'corte' : 'gasto'}">${esc(kindLabel[f.kind] || f.kind)}</span></span>
          <a class="src-link" href="${pdfUrl(c, f.page)}" target="_blank" rel="noopener">p. ${esc(f.page)}</a>
        </div>
        ${f.value
          ? `<div class="fig-track"><i style="width:${(f.value / max) * 100}%;${f.kind === 'corte' ? 'background:var(--muted)' : ''}"></i><b class="fig-ref" style="left:${refLeft}%"></b></div>
             <small>${esc(f.display)}${/\/ano/.test(f.display) ? '' : ` · ≈ R$ ${f.value} bi por ano`}</small>`
          : `<small>${esc(f.display)}</small>`}
      </div>`).join('');
    return `
      <div class="analysis-card">
        <div class="analysis-top"><b>Cifras citadas no plano</b><span class="fig-legend"><b class="fig-ref-key"></b>R$ ${FREE_SPACE} bi/ano livres do Executivo (2026)</span></div>
        ${rows || ''}
        ${c.economic.figuresNote ? `<p class="stat-note" style="margin-top:8px">${esc(c.economic.figuresNote)}</p>` : ''}
      </div>`;
  }

  /* ==========================================================
     Contexto, correções, glossário, rodapé
     ========================================================== */
  function renderContext() {
    $('#ctx-grid').innerHTML = D.indicators.map((s) => statCard(s, 'ctx-card')).join('');
    $('#trilemma').innerHTML = `<div style="grid-column:1/-1"><h3 style="font-family:var(--font-display);font-size:1.5rem">O trilema de qualquer presidente</h3><p class="lede" style="font-size:1rem">Toda promessa precisa passar por estas três travas ao mesmo tempo.</p></div>` +
      D.trilemma.map((t, i) => `<div class="tri-item"><h4>${i + 1}. ${esc(t.title)}</h4><p>${rich(t.desc)}</p></div>`).join('');
  }

  function renderFixes() {
    const fix = (f) => `
      <div class="fix reveal">
        <div class="fix-head"><span class="fix-kind">${esc(f.kind)}</span>${esc(f.who)}</div>
        <div class="fix-was">${esc(f.was)}</div>
        <div class="fix-now">${rich(f.now, { terms: false })}</div>
      </div>`;
    $('#fixes').innerHTML = D.corrections.slice(0, 6).map(fix).join('');
    const rest = D.corrections.slice(6);
    $('#fixes-more').innerHTML = rest.length ? `<details class="more"><summary>Ver as outras ${rest.length} correções ↓</summary><div class="fix-grid">${rest.map(fix).join('')}</div></details>` : '';
    $('#sources').innerHTML = D.sources.map((s) => `<li>${ext(s.url, esc(s.text))} ↗</li>`).join('');
  }

  function renderGlossary() {
    $('#gloss').innerHTML = D.glossary.map((g, i) => `<details class="reveal" id="termo-${i}"><summary>${esc(g.term)}</summary><p>${rich(g.definition, { skipTerm: i })}</p></details>`).join('');
  }

  function renderFooter() {
    $('#foot-docs').innerHTML = D.candidates.map((c) => `<li><a href="${pdfUrl(c)}" target="_blank" rel="noopener">${esc(c.shortName)} (PDF)</a></li>`).join('');
    $('#foot-updated').textContent = `Atualizado em ${D.meta.updated}`;
  }

  /* ==========================================================
     Compartilhamento
     ========================================================== */
  const shareFile = (p) => `share/${p.cand.id}--${p.id}.html`;

  function copyLink(url, btn) {
    const done = () => {
      const old = btn.innerHTML;
      btn.innerHTML = '✓ Link copiado';
      btn.classList.add('ok');
      setTimeout(() => { btn.innerHTML = old; btn.classList.remove('ok'); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, () => prompt('Copie o link:', url));
    } else {
      prompt('Copie o link:', url);
    }
  }

  function shareBar(p) {
    const url = new URL(shareFile(p), location.href).href;
    const text = `${p.cand.shortName}: “${p.title}” — o que a Constituição diz sobre isso`;
    return `
      <div class="share" data-share-url="${esc(url)}" data-share-text="${esc(text)}">
        <span class="share-label">Compartilhar</span>
        <button class="share-btn" data-copy>🔗 Copiar link</button>
        ${navigator.share ? '<button class="share-btn" data-native-share>📤 Enviar…</button>' : ''}
        <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="share-btn" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">X</a>
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

  const closeBtn = `<button class="icon-btn" data-close-btn data-close aria-label="Fechar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`;

  function proposalCard(p, { withWho = false, link = true } = {}) {
    const c = p.cand;
    return `
      <article class="analysis-card">
        <div class="analysis-top">
          ${link ? `<a class="analysis-title" href="#p/${p.key}">${withWho ? `${esc(c.shortName)}: ` : ''}${esc(p.title)}</a>` : `<span class="sub">Classificação jurídica</span>`}
          <span class="prop-chips">${chip(p.verdict)}${contestedTag(p)}</span>
        </div>
        <p>${esc(p.plain)}</p>
        ${p.quote ? `<blockquote class="quote">“${esc(p.quote)}”<cite>${esc(c.document.title)}, p. ${esc(p.page)}</cite></blockquote>` : ''}
        <dl class="kv">
          <div><dt>O que diz a Constituição</dt><dd>${rich(p.legal)}</dd></div>
        </dl>
        <div class="card-links">
          <a class="src-link" href="${pdfUrl(c, p.page)}" target="_blank" rel="noopener">Abrir no PDF, p. ${esc(p.page)} ↗</a>
          ${p.arts.map((a) => `<button class="src-link" data-article="${a}">${esc(D.articles[a].title)}</button>`).join('')}
        </div>
      </article>`;
  }

  function openDossier(id, tab = 'geral') {
    const c = candById[id];
    if (!c) return;
    const tabs = [['geral', 'Visão geral'], ['propostas', `Propostas (${c.proposals.length})`], ['economia', 'Economia'], ['contexto', 'Diagnóstico']];
    const head = `
      <div class="modal-head-row">
        <div style="display:flex;gap:14px;align-items:center">
          ${avatar(c)}
          <div><h2 id="modal-title">${esc(c.name)}</h2><div class="sub">${esc(c.party)}${c.number ? ` · ${esc(c.number)}` : ''} · vice: ${esc(c.vice)}</div></div>
        </div>
        ${closeBtn}
      </div>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" data-cid="${c.id}" aria-selected="${k === tab}">${esc(l)}</button>`).join('')}</div>`;
    openModal(head, dossierBody(c, tab), c.color);
  }

  function dossierBody(c, tab) {
    if (tab === 'propostas') {
      return D.themes.filter((t) => c.proposals.some((p) => p.theme === t.id)).map((t) =>
        `<h3>${t.icon} ${esc(t.label)}</h3>` + allProposals.filter((p) => p.cand.id === c.id && p.theme === t.id).map((p) => proposalCard(p)).join('')
      ).join('');
    }
    if (tab === 'economia') {
      return `
        <h3>${esc(c.economic.headline)}</h3>
        ${figuresChart(c)}
        <ul class="bullets">${c.economic.points.map((x) => `<li>${rich(x)}</li>`).join('')}</ul>
        <p>${rich(c.economic.analysis)}</p>`;
    }
    if (tab === 'contexto') {
      return `
        <div class="analysis-card"><dl class="kv">
          <div><dt>Diagnóstico do plano</dt><dd>${rich(c.context.diagnosis)}</dd></div>
          <div><dt>Resposta proposta</dt><dd>${rich(c.context.solution)}</dd></div>
          <div><dt>Ponto cego</dt><dd>${rich(c.context.critique)}</dd></div>
        </dl></div>`;
    }
    return `
      <div class="meta-grid">
        <div class="meta"><span>Documento</span><b>${esc(c.document.title)}</b></div>
        <div class="meta"><span>Extensão</span><b>${esc(c.document.pages)}</b></div>
        <div class="meta"><span>Coligação</span><b>${esc(c.coalition)}</b></div>
      </div>
      <blockquote class="quote">“${esc(c.motto.text)}”<cite>${c.motto.page ? `p. ${esc(c.motto.page)}` : 'abertura do programa'}</cite></blockquote>
      <h3>Em resumo</h3>
      <p>${rich(c.summary)}</p>
      <h3>Perfil jurídico</h3>
      ${verdictBar(c.proposals)}
      <p style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn btn-ghost" href="${pdfUrl(c)}" target="_blank" rel="noopener">Ler o plano completo (PDF) ↗</a>
        <a class="btn btn-ghost" href="#comparar/${c.id},${D.candidates.find((x) => x.id !== c.id).id}" data-close>Comparar com outro candidato</a>
      </p>`;
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
        <div style="display:flex;gap:14px;align-items:center">${avatar(c)}<div><div class="sub">${esc(c.name)} · ${themeById[p.theme].icon} ${esc(themeById[p.theme].label)}</div><h2 id="modal-title">${esc(p.title)}</h2></div></div>
        ${closeBtn}
      </div><div style="height:18px"></div>`;
    const body = proposalCard(p, { link: false }) + shareBar(p) + `
      <div class="explain" style="margin-top:16px">
        <span class="explain-icon" aria-hidden="true">?</span>
        <div><strong>O que significa “${esc(s.label)}”</strong><p>${rich(s.desc)} <b>${esc(s.who)}.</b></p></div>
      </div>
      <nav class="prop-nav" aria-label="Outras propostas de ${esc(c.shortName)}">
        <a href="#p/${prev.key}">← ${esc(prev.title)}</a>
        <a href="#p/${next.key}">${esc(next.title)} →</a>
      </nav>
      <p style="margin-top:12px"><a class="btn btn-ghost" href="#dossie/${c.id}">Ver o dossiê completo de ${esc(c.shortName)}</a></p>`;
    openModal(head, body, c.color);
    document.title = `${p.title} · ${c.shortName} · Raio-X 2026`;
  }

  function openArticle(id) {
    const a = D.articles[id];
    const list = allProposals.filter((p) => p.arts.includes(id));
    const head = `
      <div class="modal-head-row">
        <div><div class="sub">Constituição Federal de 1988</div><h2 id="modal-title">${esc(a.title)} · ${esc(a.topic)}</h2></div>
        ${closeBtn}
      </div><div style="height:18px"></div>`;
    const body = `
      <blockquote class="quote">${esc(a.text)}<cite>${ext(D.constitutionUrl, 'CF/88 no site do Planalto ↗')}</cite></blockquote>
      <div class="explain"><span class="explain-icon" aria-hidden="true">i</span><div><strong>Em português simples</strong><p>${rich(a.plain)}</p></div></div>
      <h3>Propostas que esbarram neste artigo</h3>
      ${list.map((p) => proposalCard(p, { withWho: true })).join('')}`;
    openModal(head, body);
  }

  /* ==========================================================
     Roteamento por hash
     ========================================================== */
  const BASE_TITLE = document.title;

  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    let m;
    document.title = BASE_TITLE;
    if ((m = h.match(/^p\/([\w-]+\/[\w-]+)$/)) && byKey[m[1]]) return openProposal(m[1]);
    if ((m = h.match(/^dossie[/-]([\w-]+)$/)) && candById[m[1]]) return openDossier(m[1]);
    if ((m = h.match(/^comparar\/([\w-]+),([\w-]+)$/)) && candById[m[1]] && candById[m[2]]) {
      if (modal.classList.contains('open')) closeModal();
      state.cmp = [m[1], m[2]];
      renderCompare();
      $('#comparar').scrollIntoView();
      return;
    }
    if (modal.classList.contains('open')) closeModal();
  }

  function initModal() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-article],[data-tab],[data-close],[data-copy],[data-native-share]');
      if (!t) return;
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
        $$('.tabs button', modal).forEach((b) => b.setAttribute('aria-selected', String(b === t)));
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
     Navegação, progresso, animações
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

      const rev = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      $$('.reveal').forEach((el) => rev.observe(el));
    } else {
      $$('.reveal').forEach((el) => el.classList.add('in'));
    }
  }

  /* ==========================================================
     Init
     ========================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // Primeiro o que aparece na tela inicial; o resto quando o navegador estiver livre
    initTheme();
    renderHero();
    renderLadder();
    renderCandidates();

    const rest = () => {
      renderFilters();
      renderMatrix();
      initCompare();
      renderRadar();
      renderBudget();
      renderContext();
      renderFixes();
      renderGlossary();
      renderFooter();
      initTooltips();
      initChrome();
      initModal();
      // Link direto para uma seção (#orcamento etc.): rola depois que ela existe
      const target = /^#[a-z-]+$/.test(location.hash) && document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    };
    if (/^#(p|dossie|comparar)[/-]/.test(location.hash) || /^#[a-z-]+$/.test(location.hash)) rest();
    else if ('requestIdleCallback' in window) requestIdleCallback(rest, { timeout: 400 });
    else setTimeout(rest, 0);
  });
})();
