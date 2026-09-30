/**
 * Brasil 2026 - Raio-X dos Planos de Governo
 * Interactive Logic, Filtering, Comparison Engine, Radar, Simulator and Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// App State
const state = {
  activeSearchQuery: '',
  activeTopicFilter: 'all',
  selectedCandidateIds: ['lula', 'flavio_bolsonaro', 'ronaldo_caiado', 'augusto_cury', 'renan_santos'],
  activeComparisonAxis: 'overview',
  activeScenarioId: 'cenario_missao',
  selectedModalCandidateId: 'lula',
  activeModalTab: 'summary',
  isDarkMode: true
};

function initApp() {
  initTheme();
  renderCandidateCards();
  renderComparator();
  renderConstitutionalRadar();
  renderBudgetSimulator();
  renderGlossary();
  setupEventListeners();
}

/* ==========================================================================
   THEME TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('ben_election_theme') || 'dark';
  setTheme(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
}

function setTheme(theme) {
  state.isDarkMode = (theme === 'dark');
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('ben_election_theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('ben_election_theme', 'dark');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const iconContainer = document.getElementById('theme-toggle-icon');
  if (!iconContainer) return;
  if (state.isDarkMode) {
    // Sun icon for dark mode (click to switch to light)
    iconContainer.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  } else {
    // Moon icon for light mode (click to switch to dark)
    iconContainer.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

/* ==========================================================================
   CANDIDATE CARDS (MAIN VIEW)
   ========================================================================== */
function renderCandidateCards() {
  const container = document.getElementById('candidates-cards-grid');
  if (!container) return;

  const query = state.activeSearchQuery.toLowerCase().trim();
  const filter = state.activeTopicFilter;

  const filteredCandidates = ELECTION_DATA.candidates.filter(c => {
    // Search query matching
    const searchMatch = !query || 
      c.name.toLowerCase().includes(query) ||
      c.party.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query) ||
      c.officialMotto.toLowerCase().includes(query) ||
      c.pillars.some(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) ||
      c.constitutionalLimitations.articles.some(a => a.article.toLowerCase().includes(query) || a.topic.toLowerCase().includes(query) || a.impact.toLowerCase().includes(query));

    // Topic filter matching
    let topicMatch = true;
    if (filter === 'seguranca') {
      topicMatch = c.pillars.some(p => p.title.toLowerCase().includes('segurança') || p.title.toLowerCase().includes('crime') || p.description.toLowerCase().includes('crime'));
    } else if (filter === 'fiscal') {
      topicMatch = c.economicLimitations.headline.toLowerCase().includes('fiscal') || c.pillars.some(p => p.title.toLowerCase().includes('fiscal') || p.title.toLowerCase().includes('ajuste') || p.title.toLowerCase().includes('tribut'));
    } else if (filter === 'constituicao') {
      topicMatch = c.constitutionalLimitations.articles.length > 0;
    } else if (filter === 'social') {
      topicMatch = c.pillars.some(p => p.title.toLowerCase().includes('saúde') || p.title.toLowerCase().includes('educação') || p.title.toLowerCase().includes('social'));
    } else if (filter === 'infra') {
      topicMatch = c.pillars.some(p => p.title.toLowerCase().includes('infraestrutura') || p.title.toLowerCase().includes('indústria') || p.title.toLowerCase().includes('agro'));
    }

    return searchMatch && topicMatch;
  });

  if (filteredCandidates.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Nenhum plano encontrado para o termo pesquisado.</p>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Tente pesquisar por termos como "segurança", "fiscal", "educação", "agro" ou limpe os filtros.</p>
        <button id="btn-reset-filters" style="margin-top: 1rem; background: var(--accent-cyan); color: #000; border: none; font-weight: 700; padding: 0.5rem 1.25rem; border-radius: 8px; cursor: pointer;">Limpar Filtros</button>
      </div>
    `;
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    return;
  }

  container.innerHTML = filteredCandidates.map(c => {
    const firstArticle = c.constitutionalLimitations.articles[0] || {};
    const riskBadgeClass = getRiskBadgeClass(c.constitutionalLimitations.riskLevel);

    return `
      <article class="candidate-card" style="--candidate-color: ${c.color}; --candidate-glow: ${c.color}33;">
        <div>
          <!-- Header -->
          <div class="card-top">
            <div class="card-candidate-info">
              <div class="candidate-avatar">
                <span>${c.avatarInitials}</span>
              </div>
              <div class="candidate-names">
                <h3 class="candidate-card-name">${c.name}</h3>
                <span class="candidate-party-badge">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${c.color};"></span>
                  ${c.party}
                </span>
              </div>
            </div>
            <span class="doc-pages-badge" title="Páginas do documento original">${c.totalPages} págs.</span>
          </div>

          <!-- Document banner -->
          <div class="card-doc-meta">
            <div class="doc-title-text" title="${c.documentTitle}">${c.documentTitle}</div>
            <div class="doc-motto-text">"${c.officialMotto}"</div>
          </div>

          <!-- Summary excerpt -->
          <p class="card-summary-text">${c.summary}</p>

          <!-- Core Pillars (Top 3) -->
          <div class="card-pillars-list">
            ${c.pillars.slice(0, 3).map(p => `
              <div class="pillar-item-mini">
                <span class="pillar-bullet">&#9670;</span>
                <div><strong>${p.title}:</strong> ${truncate(p.description, 85)}</div>
              </div>
            `).join('')}
          </div>

          <!-- Constitutional Limitation Alert -->
          <div class="card-alert-block card-alert-constitutional">
            <div class="alert-block-header">
              <span class="alert-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Limitação Constitucional
              </span>
              <span class="alert-risk-pill ${riskBadgeClass}">${c.constitutionalLimitations.riskLevel}</span>
            </div>
            <p class="alert-summary-text">${c.constitutionalLimitations.headline}</p>
            ${firstArticle.quote ? `
              <div class="citation-preview">
                <strong>${firstArticle.article}:</strong> "${truncate(firstArticle.quote, 90)}"
              </div>
            ` : ''}
          </div>

          <!-- Economic Limitation Alert -->
          <div class="card-alert-block card-alert-economic">
            <div class="alert-block-header">
              <span class="alert-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Limitação Econômica
              </span>
              <span class="alert-risk-pill risk-pill-med">Viabilidade: ${c.economicLimitations.fiscalViability}</span>
            </div>
            <p class="alert-summary-text">${c.economicLimitations.headline}</p>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="card-footer">
          <button class="btn-open-dossier" data-candidate-id="${c.id}" id="btn-dossier-${c.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Explorar Dossiê Completo
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Attach event listeners to card dossier buttons
  container.querySelectorAll('.btn-open-dossier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const candidateId = e.currentTarget.getAttribute('data-candidate-id');
      openDossierModal(candidateId);
    });
  });
}

function getRiskBadgeClass(level) {
  if (level.includes('Crítico') || level.includes('Extremo')) return 'risk-pill-crit';
  if (level.includes('Alto')) return 'risk-pill-high';
  if (level.includes('Moderado')) return 'risk-pill-med';
  return 'risk-pill-low';
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

/* ==========================================================================
   INTERACTIVE COMPARATOR ENGINE
   ========================================================================== */
function renderComparator() {
  renderCandidateSelectorChips();
  renderComparisonGrid();
}

function renderCandidateSelectorChips() {
  const container = document.getElementById('candidate-selector-chips');
  if (!container) return;

  container.innerHTML = ELECTION_DATA.candidates.map(c => {
    const isSelected = state.selectedCandidateIds.includes(c.id);
    return `
      <button class="cand-chip ${isSelected ? 'selected' : ''}" 
              data-cand-id="${c.id}" 
              style="--chip-color: ${c.color}; --chip-glow: ${c.color}44;">
        <span class="chip-circle"></span>
        ${c.shortName}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.cand-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-cand-id');
      toggleCandidateSelection(id);
    });
  });
}

function toggleCandidateSelection(id) {
  if (state.selectedCandidateIds.includes(id)) {
    // Don't allow deselecting all
    if (state.selectedCandidateIds.length > 1) {
      state.selectedCandidateIds = state.selectedCandidateIds.filter(item => item !== id);
    }
  } else {
    state.selectedCandidateIds.push(id);
  }
  renderCandidateSelectorChips();
  renderComparisonGrid();
}

function renderComparisonGrid() {
  const container = document.getElementById('comparison-grid');
  if (!container) return;

  const selectedCandidates = ELECTION_DATA.candidates.filter(c => state.selectedCandidateIds.includes(c.id));
  const axis = state.activeComparisonAxis;

  container.style.gridTemplateColumns = `repeat(${selectedCandidates.length}, minmax(280px, 1fr))`;

  container.innerHTML = selectedCandidates.map(c => {
    let contentHtml = '';

    if (axis === 'overview') {
      contentHtml = `
        <div class="comp-content-block">
          <span class="comp-block-label">Lema Oficial</span>
          <p class="comp-block-text" style="font-weight: 700; color: var(--text-primary); font-style: italic;">"${c.officialMotto}"</p>
        </div>
        <div class="comp-content-block">
          <span class="comp-block-label">Orientação Política</span>
          <p class="comp-block-text">${c.orientation}</p>
        </div>
        <div class="comp-content-block">
          <span class="comp-block-label">Resumo Executivo</span>
          <p class="comp-block-text">${c.summary}</p>
        </div>
      `;
    } else if (axis === 'security') {
      const secPillar = c.pillars.find(p => p.title.toLowerCase().includes('segurança') || p.title.toLowerCase().includes('crime') || p.title.toLowerCase().includes('medo') || p.title.toLowerCase().includes('fato'));
      contentHtml = `
        <div class="comp-content-block">
          <span class="comp-block-label">Proposta Principal de Segurança</span>
          <p class="comp-block-text" style="font-weight: 700; color: var(--text-primary);">${secPillar ? secPillar.title : 'Eixo de Segurança Integrada'}</p>
          <p class="comp-block-text">${secPillar ? secPillar.description : 'Proposta diluída nos eixos transversais de cidadania e pacificação.'}</p>
        </div>
        <div class="comp-content-block">
          <span class="comp-block-label">Conflito com o Art. 5º / Art. 144</span>
          <p class="comp-block-text">${c.constitutionalLimitations.headline}</p>
        </div>
      `;
    } else if (axis === 'fiscal') {
      contentHtml = `
        <div class="comp-content-block">
          <span class="comp-block-label">Estratégia Fiscal & Orçamentária</span>
          <p class="comp-block-text" style="font-weight: 700; color: var(--text-primary);">${c.economicLimitations.headline}</p>
          <p class="comp-block-text">${c.economicLimitations.analysis}</p>
        </div>
        <div class="comp-content-block">
          <span class="comp-block-label">Índice de Viabilidade Fiscal</span>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono);">${c.economicLimitations.fiscalViability}</div>
        </div>
      `;
    } else if (axis === 'social') {
      const socialPillars = c.pillars.filter(p => p.title.toLowerCase().includes('educação') || p.title.toLowerCase().includes('saúde') || p.title.toLowerCase().includes('fome') || p.title.toLowerCase().includes('mulher') || p.title.toLowerCase().includes('criança'));
      contentHtml = `
        <div class="comp-content-block">
          <span class="comp-block-label">Pisos e Programas Sociais</span>
          ${socialPillars.map(p => `
            <div style="margin-bottom: 0.75rem;">
              <strong style="color: var(--text-primary); font-size: 0.86rem;">${p.title}:</strong>
              <div style="font-size: 0.84rem; color: var(--text-secondary);">${p.description}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (axis === 'constitutional') {
      contentHtml = `
        <div class="comp-content-block">
          <span class="comp-block-label">Risco Constitucional: ${c.constitutionalLimitations.riskLevel}</span>
          <p class="comp-block-text" style="font-weight: 700; color: #FB7185;">${c.constitutionalLimitations.headline}</p>
        </div>
        ${c.constitutionalLimitations.articles.map(art => `
          <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #FB7185; padding: 0.65rem 0.85rem; border-radius: 4px; margin-bottom: 0.65rem;">
            <div style="font-family: var(--font-mono); font-weight: 700; font-size: 0.8rem; color: #FB7185;">${art.article}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted); font-style: italic; margin: 0.2rem 0;">"${truncate(art.quote, 110)}"</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${art.impact}</div>
          </div>
        `).join('')}
      `;
    } else if (axis === 'economic') {
      contentHtml = `
        <div class="comp-content-block">
          <span class="comp-block-label">Diagnóstico de Restrição Macroeconômica</span>
          <p class="comp-block-text">${c.economicLimitations.analysis}</p>
        </div>
        <div class="comp-content-block">
          <span class="comp-block-label">Métricas Fiscais Chave</span>
          ${c.economicLimitations.metrics.map(m => `
            <div style="display:flex; justify-content:space-between; font-size: 0.82rem; padding: 0.35rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span style="color:var(--text-muted);">${m.label}:</span>
              <strong style="color:var(--text-primary); text-align:right;">${m.value}</strong>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="comparison-column" style="--col-color: ${c.color};">
        <div class="comp-col-header">
          <div class="comp-col-avatar">${c.avatarInitials}</div>
          <div>
            <h4 class="comp-col-name">${c.shortName}</h4>
            <div class="comp-col-party">${c.party}</div>
          </div>
        </div>
        ${contentHtml}
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   CONSTITUTIONAL RADAR (CF/88)
   ========================================================================== */
function renderConstitutionalRadar() {
  const container = document.getElementById('constitutional-radar-grid');
  if (!container) return;

  container.innerHTML = ELECTION_DATA.constitutionalRadarArticles.map(art => {
    const statusClass = art.status === 'critical' ? 'risk-pill-crit' : art.status === 'high' ? 'risk-pill-high' : 'risk-pill-med';
    const statusLabel = art.status === 'critical' ? 'Tensão Crítica' : art.status === 'high' ? 'Alto Impacto' : 'Atenção Média';

    return `
      <div class="radar-card" data-article-id="${art.articleId}">
        <div class="radar-card-header">
          <span class="radar-art-badge">${art.title}</span>
          <span class="radar-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <h3 class="radar-card-title">${art.topic}</h3>
        <p class="radar-card-desc">${art.summary}</p>

        <div style="margin-top: 1rem;">
          <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Candidatos com Atrito Constitucional:</div>
          <div class="radar-affected-chips">
            ${art.affectedCandidates.map(cand => `
              <span class="radar-aff-chip" title="${cand.friction}">${cand.candidateName}</span>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 1.25rem; font-size: 0.78rem; color: var(--accent-cyan); font-weight: 700; display: flex; align-items: center; gap: 0.35rem;">
          <span>Ler Texto do Artigo & Análise</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.radar-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const artId = e.currentTarget.getAttribute('data-article-id');
      openArticleModal(artId);
    });
  });
}

function openArticleModal(artId) {
  const art = ELECTION_DATA.constitutionalRadarArticles.find(a => a.articleId === artId);
  if (!art) return;

  const modal = document.getElementById('dossier-modal');
  const container = document.getElementById('modal-dynamic-content');
  if (!modal || !container) return;

  document.getElementById('modal-candidate-name').innerText = art.title;
  document.getElementById('modal-candidate-party').innerText = art.topic;
  document.getElementById('modal-avatar-badge').innerText = "CF";
  document.getElementById('modal-header-hero').style.setProperty('--modal-accent', '#38BDF8');

  // Hide modal tab navigation for article view
  document.getElementById('modal-tabs-nav').style.display = 'none';

  container.innerHTML = `
    <div style="padding: 1rem 0;">
      <div style="background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38BDF8; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h4 style="color: #38BDF8; font-family: var(--font-mono); font-size: 1.05rem; margin-bottom: 0.5rem;">Texto Integral da Constituição Federal de 1988</h4>
        <p style="font-family: var(--font-mono); font-size: 0.88rem; color: var(--text-primary); line-height: 1.6;">${art.fullText}</p>
      </div>

      <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-primary);">Conflito Específico com os Planos de Governo</h4>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${art.affectedCandidates.map(c => `
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-weight: 800; color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 0.4rem;">${c.candidateName}</div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55;">${c.friction}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/* ==========================================================================
   BUDGET SIMULATOR (OGU EXPLORER)
   ========================================================================== */
function renderBudgetSimulator() {
  const mandatoryContainer = document.getElementById('budget-mandatory-list');
  const discretionaryContainer = document.getElementById('budget-discretionary-list');

  if (mandatoryContainer) {
    mandatoryContainer.innerHTML = ELECTION_DATA.budgetBreakdown.mandatoryItems.map(item => `
      <div class="budget-item-row">
        <span class="budget-item-name">
          <span style="display:inline-block; width:8px; height:8px; border-radius:2px; background:#E11D48;"></span>
          ${item.label}
        </span>
        <span class="budget-item-val">${item.value}</span>
      </div>
    `).join('');
  }

  if (discretionaryContainer) {
    discretionaryContainer.innerHTML = ELECTION_DATA.budgetBreakdown.discretionaryItems.map(item => `
      <div class="budget-item-row">
        <span class="budget-item-name">
          <span style="display:inline-block; width:8px; height:8px; border-radius:2px; background:#06B6D4;"></span>
          ${item.label}
        </span>
        <span class="budget-item-val" style="color:#38BDF8;">${item.value}</span>
      </div>
    `).join('');
  }

  setupSimulatorScenarios();
}

function setupSimulatorScenarios() {
  const scenarios = {
    cenario_missao: {
      title: "Proposta Missão: Corte Fiscal de R$ 250 bi / Desindexação Total",
      impact: "A proposta retira R$ 250 bi anuais ao desindexar benefícios previdenciários e do BPC do salário mínimo e revogar os pisos da saúde e educação.",
      fiscalVerdict: "Equilibraria o resultado primário com forte superávit, reduzindo o crescimento nominal da DBGG.",
      constitutionalHurdle: "Inconstitucionalidade gravíssima. A desvinculação dos pisos da saúde/educação colide com a vedação ao retrocesso social (Arts. 198 e 212) e a desindexação de aposentadorias enfrenta quórum de PEC de 3/5 no Congresso.",
      socialImpact: "Impacto recessivo drástico no consumo popular e falência do comércio em mais de 3.000 municípios dependentes da circulação dos benefícios do INSS."
    },
    cenario_flavio: {
      title: "Proposta Flávio: Mega-Infraestrutura de R$ 900 bi + Redução de Encargos",
      impact: "Aloca R$ 900 bilhões em 4 anos em ferrovias e hidrovias, reduz encargos da conta de luz (CDE) e promete corte geral de impostos.",
      fiscalVerdict: "Inviável com recursos puramente fiscais da União. Exige captação maciça de capital privado via concessões.",
      constitutionalHurdle: "A destinação de verba pública para vouchers-creche em rede privada lucrativa colide com o Art. 213 da CF/88. A liberação de fracking e aceleração de ferrovias viola o Art. 225 e consulta a terras indígenas.",
      socialImpact: "Aceleração logística para o agronegócio do Centro-Oeste, porém com risco de desassistência a creches públicas permanentes se o voucher for suspenso."
    },
    cenario_caiado: {
      title: "Proposta Caiado: Trava de Despesas Obrigatórias e Combate ao Terrorismo",
      impact: "Impede o crescimento das despesas obrigatórias acima do PIB potencial, reordena emendas parlamentares e cria Fundo Policial via confisco patrimonial.",
      fiscalVerdict: "Abordagem fiscal pragmática plurianual, ancorando a confiança do mercado na trajetória da Dívida Bruta.",
      constitutionalHurdle: "A reordenação de emendas esbarra na impositividade constitucional (Art. 166). O enquadramento de facções como 'terrorismo doméstico' desafia a tipicidade estrita e o confisco cautelar sem trânsito em julgado testa o Art. 5º, LIV.",
      socialImpact: "Forte ganho de coordenação federativa na segurança pública, reduzindo homicídios e desmantelando lavagem de capitais do crime."
    },
    cenario_cury: {
      title: "Proposta Cury: 10 Milhões de Microempresas, Tele Saúde e Educação Integral",
      impact: "Criação do Ministério do Empreendedorismo, crédito orientado para 10 mi de MEIs, universalização da telemedicina no SUS e escolas em tempo integral socioemocionais.",
      fiscalVerdict: "A meta de 'déficit zero' entra em conflito com os custos bilionários de investimento nas obras hídricas do Semiárido (Brasil Oásis) e no aparelhamento de tempo integral sem corte explícito de despesas.",
      constitutionalHurdle: "A uniformização de grade curricular de gestão emocional colide com a autonomia pedagógica das escolas (Art. 206) e competências municipais/estaduais.",
      socialImpact: "Atenção humanística pioneira à crise epidêmica de saúde mental e preparação da juventude contra o desemprego gerado pela Inteligência Artificial."
    },
    cenario_lula: {
      title: "Proposta Lula: Ganho Real do Salário Mínimo, Novo PAC e Arcabouço Fiscal",
      impact: "Reajuste do salário mínimo com base no PIB, consolidação do Bolsa Família, reindustrialização verde via bancos públicos (BNDES) e investimentos do Novo PAC.",
      fiscalVerdict: "O crescimento inercial da Previdência e dos pisos da saúde/educação pressiona o teto de 2,5% do Arcabouço Fiscal, exigindo arrecadação extraordinária contínua e risco de romper a Regra de Ouro (Art. 167, III).",
      constitutionalHurdle: "Tentativas de reverter desestatizações (Eletrobras) ou alterar a governança de agências e do Banco Central esbarram no ato jurídico perfeito (Art. 5º, XXXVI) e na LC 179/2021.",
      socialImpact: "Redução da pobreza extrema e dinamização do consumo das famílias de baixa renda, com o desafio de sustentar a inflação de serviços sob controle."
    }
  };

  const scenarioButtons = document.querySelectorAll('.scenario-pill-btn');
  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      scenarioButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const scnId = e.currentTarget.getAttribute('data-scenario');
      renderScenarioDetails(scenarios[scnId]);
    });
  });

  // Initial scenario render
  renderScenarioDetails(scenarios['cenario_missao']);
}

function renderScenarioDetails(scn) {
  const container = document.getElementById('scenario-result-box');
  if (!container || !scn) return;

  container.innerHTML = `
    <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">${scn.title}</h4>
    <p style="color: var(--text-secondary); margin-bottom: 0.75rem;"><strong>Impacto Proposto:</strong> ${scn.impact}</p>
    
    <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.65rem 0.85rem; border-radius: 4px; margin-bottom: 0.6rem;">
      <strong style="color: var(--accent-cyan); font-size: 0.78rem; text-transform: uppercase;">Veredito Fiscal:</strong>
      <div style="color: var(--text-primary); font-size: 0.85rem; margin-top: 0.2rem;">${scn.fiscalVerdict}</div>
    </div>

    <div style="background: rgba(225, 29, 72, 0.08); border-left: 3px solid var(--accent-ruby); padding: 0.65rem 0.85rem; border-radius: 4px; margin-bottom: 0.6rem;">
      <strong style="color: #FB7185; font-size: 0.78rem; text-transform: uppercase;">Obstáculo Constitucional:</strong>
      <div style="color: var(--text-primary); font-size: 0.85rem; margin-top: 0.2rem;">${scn.constitutionalHurdle}</div>
    </div>

    <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid var(--accent-amber); padding: 0.65rem 0.85rem; border-radius: 4px;">
      <strong style="color: #FBBF24; font-size: 0.78rem; text-transform: uppercase;">Consequência Socioeconômica:</strong>
      <div style="color: var(--text-primary); font-size: 0.85rem; margin-top: 0.2rem;">${scn.socialImpact}</div>
    </div>
  `;
}

/* ==========================================================================
   GLOSSARY RENDERING
   ========================================================================== */
function renderGlossary() {
  const container = document.getElementById('glossary-grid');
  if (!container) return;

  container.innerHTML = ELECTION_DATA.glossary.map(item => `
    <div class="glossary-card">
      <h4 class="glossary-term">${item.term}</h4>
      <p class="glossary-def">${item.definition}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   OFFICIAL DOSSIER MODAL
   ========================================================================== */
function openDossierModal(candidateId) {
  const candidate = ELECTION_DATA.candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  state.selectedModalCandidateId = candidateId;
  state.activeModalTab = 'summary';

  const modal = document.getElementById('dossier-modal');
  const modalHero = document.getElementById('modal-header-hero');
  const tabsNav = document.getElementById('modal-tabs-nav');
  
  if (!modal || !modalHero) return;

  // Restore tabsNav display if previously hidden by article view
  if (tabsNav) tabsNav.style.display = 'flex';

  modalHero.style.setProperty('--modal-accent', candidate.color);
  document.getElementById('modal-candidate-name').innerText = candidate.name;
  document.getElementById('modal-candidate-party').innerText = `${candidate.party} • ${candidate.officialMotto}`;
  document.getElementById('modal-avatar-badge').innerText = candidate.avatarInitials;
  document.getElementById('modal-avatar-badge').style.background = candidate.color;

  // Reset tab buttons
  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === 'summary') btn.classList.add('active');
  });

  renderModalTabContent(candidate, 'summary');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDossierModal() {
  const modal = document.getElementById('dossier-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderModalTabContent(candidate, tabKey) {
  const container = document.getElementById('modal-dynamic-content');
  if (!container) return;

  let html = '';

  if (tabKey === 'summary') {
    html = `
      <div class="modal-tab-panel active">
        <!-- Document Metadata Card -->
        <div class="modal-doc-meta-box">
          <div>
            <div class="modal-meta-item-label">Arquivo Original Analisado</div>
            <div class="modal-meta-item-value" style="font-family: var(--font-mono);">${candidate.pdfFile}</div>
          </div>
          <div>
            <div class="modal-meta-item-label">Extensão do Documento</div>
            <div class="modal-meta-item-value">${candidate.totalPages} páginas registradas</div>
          </div>
          <div>
            <div class="modal-meta-item-label">Candidato a Vice-Presidente</div>
            <div class="modal-meta-item-value">${candidate.vice || 'A definir na convenção'}</div>
          </div>
        </div>

        <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.85rem; color: var(--text-primary);">Síntese Estratégica do Plano de Governo</h3>
        <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem;">${candidate.summary}</p>

        <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-primary);">Todos os Pilares Principais Registrados</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${candidate.pillars.map((p, idx) => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem;">
                <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; color: ${candidate.color}; background: ${candidate.color}22; padding: 0.15rem 0.5rem; border-radius: 4px;">Pilar 0${idx+1}</span>
                <strong style="color: var(--text-primary); font-size: 1rem;">${p.title}</strong>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55;">${p.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (tabKey === 'constitutional') {
    html = `
      <div class="modal-tab-panel active">
        <div style="background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.75rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #FB7185;">Diagnóstico Jurídico-Constitucional (CF/88)</h3>
            <span class="alert-risk-pill ${getRiskBadgeClass(candidate.constitutionalLimitations.riskLevel)}">${candidate.constitutionalLimitations.riskLevel}</span>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-primary); font-weight: 600;">${candidate.constitutionalLimitations.headline}</p>
        </div>

        <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem;">Dispositivos Constitucionais Desafiados com Citação Formal</h4>
        ${candidate.constitutionalLimitations.articles.map(art => `
          <div class="law-citation-card">
            <div class="law-citation-header">
              <span class="law-article-badge">${art.article}</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${art.topic}</span>
            </div>
            <div class="law-quote-box">
              "${art.quote}"
            </div>
            <div class="law-impact-text">
              <strong style="color: #FB7185;">Por que infringe ou gera atrito:</strong> ${art.impact}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabKey === 'economic') {
    html = `
      <div class="modal-tab-panel active">
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.75rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #FBBF24;">Análise de Limitações Econômicas e Fiscais</h3>
            <span class="alert-risk-pill risk-pill-med">Viabilidade: ${candidate.economicLimitations.fiscalViability}</span>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-primary); font-weight: 600;">${candidate.economicLimitations.headline}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.75rem;">
          ${candidate.economicLimitations.metrics.map(m => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${m.label}</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${m.value}</div>
            </div>
          `).join('')}
        </div>

        <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.75rem;">Impacto Estrutural na Dívida Pública e no Orçamento</h4>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7;">${candidate.economicLimitations.analysis}</p>
      </div>
    `;
  } else if (tabKey === 'country') {
    html = `
      <div class="modal-tab-panel active">
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 1.25rem; color: var(--text-primary);">Como este Plano Responde ao Contexto do Brasil</h3>
        
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem;">
          <h4 style="font-size: 0.9rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 0.4rem;">1. Diagnóstico do País pelo Candidato</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${candidate.countryContextResponse.diagnosis}</p>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem;">
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #10B981; text-transform: uppercase; margin-bottom: 0.4rem;">2. A Solução Estrutural Apresentada</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${candidate.countryContextResponse.solution}</p>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #F43F5E; text-transform: uppercase; margin-bottom: 0.4rem;">3. Crítica Independente & Ponto Cego</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${candidate.countryContextResponse.critique}</p>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/* ==========================================================================
   EVENT LISTENERS SETUP
   ========================================================================== */
function setupEventListeners() {
  // Live Search Input
  const searchInput = document.getElementById('search-candidates-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.activeSearchQuery = e.target.value;
      renderCandidateCards();
    });
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.activeTopicFilter = e.currentTarget.getAttribute('data-filter');
      renderCandidateCards();
    });
  });

  // Comparator Axis Tabs
  const axisTabs = document.querySelectorAll('.axis-tab-btn');
  axisTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      axisTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.activeComparisonAxis = e.currentTarget.getAttribute('data-axis');
      renderComparisonGrid();
    });
  });

  // Modal Tab Navigation
  const modalTabs = document.querySelectorAll('.modal-tab-btn');
  modalTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      modalTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const tabKey = e.currentTarget.getAttribute('data-tab');
      state.activeModalTab = tabKey;
      const candidate = ELECTION_DATA.candidates.find(c => c.id === state.selectedModalCandidateId);
      if (candidate) renderModalTabContent(candidate, tabKey);
    });
  });

  // Modal Close Buttons
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseSecondary = document.getElementById('modal-close-secondary');
  const modalBackdrop = document.getElementById('dossier-modal');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDossierModal);
  if (modalCloseSecondary) modalCloseSecondary.addEventListener('click', closeDossierModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeDossierModal();
    });
  }

  // Print Button
  const printBtn = document.getElementById('modal-print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDossierModal();
  });
}

function resetFilters() {
  state.activeSearchQuery = '';
  state.activeTopicFilter = 'all';
  const searchInput = document.getElementById('search-candidates-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
  });
  renderCandidateCards();
}
