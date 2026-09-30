/**
 * Raio-X dos Planos de Governo 2026 — interface
 * Renderiza tudo a partir de ELECTION_DATA (js/data.js). Sem dependências.
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
  const allProposals = D.candidates.flatMap((c) => c.proposals.map((p, i) => ({ ...p, cand: c, key: `${c.id}:${i}` })));
  const byKey = Object.fromEntries(allProposals.map((p) => [p.key, p]));

  const state = { theme: 'all', cands: new Set(D.candidates.map((c) => c.id)), verdict: 'all', q: '' };

  /* ---------- Helpers ---------- */
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
  const contestedTag = (p) => (p.contested ? '<span class="chip" style="--vc: var(--muted); --vbg: var(--bg-alt);" title="Há divergência relevante entre juristas ou no STF">controverso</span>' : '');
  const avatar = (c, cls = '') => `<span class="avatar ${cls}" style="--c:${c.color}" aria-hidden="true">${esc(c.initials)}</span>`;
  const countBy = (list) => D.legalScale.reduce((acc, s) => ((acc[s.id] = list.filter((p) => p.verdict === s.id).length), acc), {});

  /* ---------- Tema claro/escuro ---------- */
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

  /* ---------- Hero ---------- */
  function renderHero() {
    $('#hero-faces').innerHTML = D.candidates.map((c) => `<span class="face" style="--c:${c.color}" title="${esc(c.name)}">${esc(c.initials)}</span>`).join('');
    $('#hero-count').textContent = `${D.meta.analyzed} planos · ${allProposals.length} propostas checadas · ${D.meta.registeredCandidates} candidaturas registradas no TSE`;
    const pick = ['selic', 'dbgg', 'rigidez', 'mvi'];
    $('#hero-stats').innerHTML = pick.map((id) => {
      const s = D.indicators.find((i) => i.id === id);
      return `<div class="stat reveal"><div class="stat-label">${esc(s.label)}</div><div class="stat-value">${esc(s.value)}</div><div class="stat-note">${esc(s.note)}</div><span class="stat-src">${esc(s.source)}</span></div>`;
    }).join('');
  }

  /* ---------- Escada ---------- */
  function renderLadder() {
    const counts = countBy(allProposals);
    $('#ladder').innerHTML = D.legalScale.map((s) => `
      <div class="rung v-${s.id}">
        <div class="rung-step">${esc(s.step)}</div>
        <h4>${esc(s.label)}</h4>
        <div class="who">${esc(s.who)}</div>
        <p>${esc(s.desc)}</p>
        <div class="count">${counts[s.id]}<small>propostas analisadas</small></div>
      </div>`).join('');
  }

  /* ---------- Cards de candidatos ---------- */
  function verdictBar(list) {
    const counts = countBy(list);
    const total = list.length;
    const bar = D.legalScale.filter((s) => counts[s.id]).map((s) => `<i class="v-${s.id}" style="width:${(counts[s.id] / total) * 100}%" title="${esc(s.label)}: ${counts[s.id]}"></i>`).join('');
    const legend = D.legalScale.filter((s) => counts[s.id]).map((s) => `<span><b>${counts[s.id]}</b> ${esc(s.label.toLowerCase())}</span>`).join('');
    return `<div class="vbar" role="img" aria-label="${D.legalScale.map((s) => `${s.label}: ${counts[s.id]}`).join(', ')}">${bar}</div><div class="vbar-legend">${legend}</div>`;
  }

  function renderCandidates() {
    const order = { vedado: 0, pec: 1, lc: 2, lei: 3, exec: 4 };
    $('#cand-grid').innerHTML = D.candidates.map((c) => {
      const highlights = [...c.proposals].sort((a, b) => order[a.verdict] - order[b.verdict]).slice(0, 3);
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
            <h5>Perfil jurídico das ${c.proposals.length} propostas</h5>
            <div style="margin-top: 8px;">${verdictBar(c.proposals)}</div>
          </div>
          <div>
            <h5>Propostas que mais exigem</h5>
            <ul class="mini-list" style="margin-top: 8px;">
              ${highlights.map((p) => `<li><span>${esc(p.title)}</span>${chip(p.verdict)}</li>`).join('')}
            </ul>
          </div>
          <div class="cand-foot">
            <button class="btn btn-c" data-dossier="${c.id}">Abrir dossiê</button>
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

  /* ---------- Filtros e matriz ---------- */
  function renderFilters() {
    $('#theme-filter').innerHTML = [`<button data-theme-f="all" aria-pressed="true">Todos os temas</button>`]
      .concat(D.themes.map((t) => `<button data-theme-f="${t.id}" aria-pressed="false">${t.icon} ${esc(t.label)}</button>`)).join('');
    $('#cand-filter').innerHTML = D.candidates.map((c) => `<button data-cand-f="${c.id}" aria-pressed="true"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${c.color};margin-right:6px"></span>${esc(c.shortName)}</button>`).join('');
    $('#verdict-filter').innerHTML = [`<button data-verdict-f="all" aria-pressed="true">Todos os degraus</button>`]
      .concat(D.legalScale.map((s) => `<button data-verdict-f="${s.id}" aria-pressed="false">${esc(s.label)}</button>`)).join('');

    $('#theme-filter').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state.theme = b.dataset.themeF;
      $$('#theme-filter button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      renderMatrix();
    });
    $('#verdict-filter').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state.verdict = b.dataset.verdictF;
      $$('#verdict-filter button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      renderMatrix();
    });
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

  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

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
          <div class="row-items">
            ${list.filter((p) => p.theme === t.id && p.cand.id === c.id).map((p) => `
              <button class="prop" data-prop="${p.key}">
                <span class="prop-title">${esc(p.title)}</span>
                <span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${chip(p.verdict)}${contestedTag(p)}</span>
                <span class="prop-plain">${esc(p.plain)}</span>
                <span class="prop-more">Ver análise e fonte (p. ${esc(p.page)}) →</span>
              </button>`).join('')}
          </div>
        </div>`).join('');
      return `<section class="theme-block"><div class="theme-head"><span class="ti" aria-hidden="true">${t.icon}</span><h3>${esc(t.label)}</h3></div>${rows}</section>`;
    }).join('');
  }

  /* ---------- Radar CF/88 ---------- */
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
    const top = ids.slice(0, 6), rest = ids.slice(6);
    $('#radar').innerHTML = top.map(card).join('');
    $('#radar-more').innerHTML = rest.length ? `
      <details class="more"><summary>Mais ${rest.length} artigos citados ↓</summary>
        <div class="art-chips">${rest.map((id) => `<button class="art-chip" data-article="${id}"><b>${esc(D.articles[id].title)}</b> ${esc(D.articles[id].topic)} <span>${hits[id].length}</span></button>`).join('')}</div>
      </details>` : '';
  }

  /* ---------- Orçamento ---------- */
  function renderBudget() {
    const b = D.budget;
    $('#budget-note').textContent = b.note;
    const pct = (v) => ((v / b.total) * 100);
    const fmt = (v) => (v >= 1000 ? `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri` : `R$ ${v} bi`);

    $('#budget-stack').innerHTML = b.items.map((i) => `
      <button role="listitem" data-bitem="${i.id}" style="--bc:${i.color}; width:${pct(i.value)}%" aria-label="${esc(i.label)}: ${fmt(i.value)} (${pct(i.value).toFixed(1)}%)">
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

    const free = b.items.find((i) => i.id === 'livre').value;
    const max = Math.max(free, ...b.promises.map((p) => p.perYear));
    $('#promises').innerHTML = `
      <div class="promise" style="--c: var(--brand)">
        <div class="promise-top"><span>Espaço livre do Executivo</span><span>R$ ${free} bi/ano</span></div>
        <div class="promise-bar"><i style="width:${(free / max) * 100}%"></i></div>
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

  /* ---------- Contexto, correções, glossário ---------- */
  function renderContext() {
    $('#ctx-grid').innerHTML = D.indicators.map((s) => `
      <div class="ctx-card reveal"><div class="stat-label">${esc(s.label)}</div><div class="stat-value">${esc(s.value)}</div><p>${esc(s.note)}</p><span class="stat-src">${esc(s.source)}</span></div>`).join('');
    $('#trilemma').innerHTML = `<div style="grid-column:1/-1"><h3 style="font-family:var(--font-display);font-size:1.5rem">O trilema de qualquer presidente</h3><p class="lede" style="font-size:1rem">Toda promessa precisa passar por estas três travas ao mesmo tempo.</p></div>` +
      D.trilemma.map((t, i) => `<div class="tri-item"><h4>${i + 1}. ${esc(t.title)}</h4><p>${esc(t.desc)}</p></div>`).join('');
  }

  function renderFixes() {
    const fix = (f) => `
      <div class="fix reveal">
        <div class="fix-head"><span class="fix-kind">${esc(f.kind)}</span>${esc(f.who)}</div>
        <div class="fix-was">${esc(f.was)}</div>
        <div class="fix-now">${esc(f.now)}</div>
      </div>`;
    $('#fixes').innerHTML = D.corrections.slice(0, 6).map(fix).join('');
    const rest = D.corrections.slice(6);
    $('#fixes-more').innerHTML = rest.length ? `<details class="more"><summary>Ver as outras ${rest.length} correções ↓</summary><div class="fix-grid">${rest.map(fix).join('')}</div></details>` : '';
    $('#sources').innerHTML = D.sources.map((s) => `<li>${esc(s)}</li>`).join('');
  }

  function renderGlossary() {
    $('#gloss').innerHTML = D.glossary.map((g) => `<details class="reveal"><summary>${esc(g.term)}</summary><p>${esc(g.definition)}</p></details>`).join('');
  }

  function renderFooter() {
    $('#foot-docs').innerHTML = D.candidates.map((c) => `<li><a href="${pdfUrl(c)}" target="_blank" rel="noopener">${esc(c.shortName)} (PDF)</a></li>`).join('');
    $('#foot-updated').textContent = `Atualizado em ${D.meta.updated}`;
  }

  /* ---------- Modal ---------- */
  const modal = $('#modal');
  let lastFocus = null;

  function openModal(headHtml, bodyHtml, color) {
    lastFocus = document.activeElement;
    modal.style.setProperty('--c', color || 'var(--brand)');
    $('#modal-head').innerHTML = headHtml;
    $('#modal-body').innerHTML = bodyHtml;
    $('#modal-body').scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const close = $('[data-close-btn]', modal);
    (close || $('.modal-panel', modal)).focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
    if (location.hash.startsWith('#dossie-')) history.replaceState(null, '', location.pathname + location.search);
  }

  const closeBtn = `<button class="icon-btn" data-close-btn data-close aria-label="Fechar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`;

  function proposalCard(p, withWho = false) {
    const c = p.cand;
    return `
      <article class="analysis-card">
        <div class="analysis-top">
          <b>${withWho ? `${esc(c.shortName)}: ` : ''}${esc(p.title)}</b>
          <span style="display:flex;gap:6px;flex-wrap:wrap">${chip(p.verdict)}${contestedTag(p)}</span>
        </div>
        <p>${esc(p.plain)}</p>
        ${p.quote ? `<blockquote class="quote">“${esc(p.quote)}”<cite>${esc(c.document.title)}, p. ${esc(p.page)}</cite></blockquote>` : ''}
        <dl class="kv">
          <div><dt>O que diz a Constituição</dt><dd>${esc(p.legal)}</dd></div>
        </dl>
        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:10px">
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
    history.replaceState(null, '', `#dossie-${c.id}`);
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
        <ul class="mini-list" style="margin-bottom:16px">${c.economic.points.map((x) => `<li>• ${esc(x)}</li>`).join('')}</ul>
        <p>${esc(c.economic.analysis)}</p>`;
    }
    if (tab === 'contexto') {
      return `
        <div class="analysis-card"><dl class="kv">
          <div><dt>Diagnóstico do plano</dt><dd>${esc(c.context.diagnosis)}</dd></div>
          <div><dt>Resposta proposta</dt><dd>${esc(c.context.solution)}</dd></div>
          <div><dt>Ponto cego</dt><dd>${esc(c.context.critique)}</dd></div>
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
      <p>${esc(c.summary)}</p>
      <h3>Perfil jurídico</h3>
      ${verdictBar(c.proposals)}
      <p style="margin-top:18px"><a class="btn btn-ghost" href="${pdfUrl(c)}" target="_blank" rel="noopener">Ler o plano completo (PDF) ↗</a></p>`;
  }

  function openProposal(key) {
    const p = byKey[key];
    const c = p.cand;
    const head = `
      <div class="modal-head-row">
        <div style="display:flex;gap:14px;align-items:center">${avatar(c)}<div><div class="sub">${esc(c.name)} · ${themeById[p.theme].icon} ${esc(themeById[p.theme].label)}</div><h2 id="modal-title">${esc(p.title)}</h2></div></div>
        ${closeBtn}
      </div><div style="height:18px"></div>`;
    const s = scaleById[p.verdict];
    const body = proposalCard(p) + `
      <div class="explain" style="margin-top:16px">
        <span class="explain-icon" aria-hidden="true">?</span>
        <div><strong>O que significa “${esc(s.label)}”</strong><p>${esc(s.desc)} <b>${esc(s.who)}.</b></p></div>
      </div>
      <p style="margin-top:8px"><button class="btn btn-ghost" data-dossier="${c.id}">Ver o dossiê completo de ${esc(c.shortName)}</button></p>`;
    openModal(head, body, c.color);
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
      <blockquote class="quote">${esc(a.text)}<cite>CF/88</cite></blockquote>
      <div class="explain"><span class="explain-icon" aria-hidden="true">i</span><div><strong>Em português simples</strong><p>${esc(a.plain)}</p></div></div>
      <h3>Propostas que esbarram neste artigo</h3>
      ${list.map((p) => proposalCard(p, true)).join('')}`;
    openModal(head, body);
  }

  function initModal() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-dossier],[data-prop],[data-article],[data-tab],[data-close]');
      if (!t) return;
      if (t.dataset.close !== undefined) return closeModal();
      if (t.dataset.dossier) return openDossier(t.dataset.dossier);
      if (t.dataset.prop) return openProposal(t.dataset.prop);
      if (t.dataset.article) return openArticle(t.dataset.article);
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
        const f = $$('button, a[href], input, [tabindex]:not([tabindex="-1"])', modal).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $('.modal-panel', modal).setAttribute('tabindex', '-1');
    const m = location.hash.match(/^#dossie-(.+)$/);
    if (m && candById[m[1]]) openDossier(m[1]);
  }

  /* ---------- Navegação, progresso, animações ---------- */
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

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderHero();
    renderLadder();
    renderCandidates();
    renderFilters();
    renderMatrix();
    renderRadar();
    renderBudget();
    renderContext();
    renderFixes();
    renderGlossary();
    renderFooter();
    initModal();
    initChrome();
  });
})();
