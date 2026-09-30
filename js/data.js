/**
 * Raio-X dos Planos de Governo — Eleições 2026
 * ------------------------------------------------------------
 * Base de dados do site. Cada proposta aponta a página do documento
 * original (pasta /planos) e recebe uma classificação jurídica:
 * qual é o instrumento MÍNIMO necessário para tirá-la do papel.
 *
 * Revisão: setembro de 2026. Todas as propostas foram conferidas
 * contra o texto dos PDFs; indicadores trazem fonte e data.
 */

const ELECTION_DATA = {
  meta: {
    updated: "30 de setembro de 2026",
    registeredCandidates: 13,
    analyzed: 5
  },

  /* ------------------------------------------------------------------
     Escada de viabilidade jurídica (do mais fácil ao impossível)
     ------------------------------------------------------------------ */
  legalScale: [
    {
      id: "exec",
      short: "Só o governo",
      step: "Degrau 1",
      label: "Basta o governo",
      who: "Presidente e ministérios",
      desc: "Decreto, portaria, programa ou gestão. Depende de orçamento, mas não precisa do Congresso para existir."
    },
    {
      id: "lei",
      short: "Lei",
      step: "Degrau 2",
      label: "Precisa de lei",
      who: "Maioria simples no Congresso",
      desc: "Lei ordinária ou medida provisória. Metade + 1 dos presentes em cada Casa."
    },
    {
      id: "lc",
      short: "Lei complementar",
      step: "Degrau 3",
      label: "Lei complementar",
      who: "257 deputados e 41 senadores",
      desc: "Maioria absoluta. Exigida quando a Constituição reserva o tema (ex.: emprego das Forças Armadas, finanças públicas)."
    },
    {
      id: "pec",
      short: "PEC",
      step: "Degrau 4",
      label: "Emenda à Constituição",
      who: "308 deputados e 49 senadores, 2 turnos",
      desc: "PEC: 3/5 em dois turnos nas duas Casas. É o quórum mais alto do sistema — e o presidente nem vota nem sanciona."
    },
    {
      id: "vedado",
      short: "Inconstitucional",
      step: "Degrau 5",
      label: "Barrado pela Constituição",
      who: "Nem PEC resolve (ou alto risco no STF)",
      desc: "Choca com cláusula pétrea (Art. 60, §4º) ou com precedente firme do STF. Tende a ser anulado."
    }
  ],

  themes: [
    { id: "seguranca", label: "Segurança e Justiça", icon: "🛡️" },
    { id: "fiscal", label: "Contas públicas", icon: "📊" },
    { id: "economia", label: "Economia e trabalho", icon: "🏗️" },
    { id: "social", label: "Saúde, educação e social", icon: "🏥" },
    { id: "instituicoes", label: "Instituições e poder", icon: "🏛️" },
    { id: "ambiente", label: "Meio ambiente e energia", icon: "🌱" }
  ],

  /* ------------------------------------------------------------------
     Candidatos
     ------------------------------------------------------------------ */
  candidates: [
    /* =============================== LULA =============================== */
    {
      id: "lula",
      name: "Luiz Inácio Lula da Silva",
      shortName: "Lula",
      number: "13",
      party: "PT",
      coalition: "PT, PSB, PV, PCdoB, PDT, PSOL e Rede (logos na capa do programa)",
      vice: "Geraldo Alckmin (PSB)",
      color: "#C8102E",
      initials: "LU",
      document: {
        title: "Diretrizes para o Programa de Transformação do Brasil",
        file: "Programa-de-Governo-LULA-13.pdf",
        pages: "84 páginas impressas (42 folhas duplas no PDF)",
        // PDF em folhas duplas: a imagem k contém as páginas impressas k e 85−k
        pageMap: "saddle84"
      },
      motto: { text: "O que nos move são os sonhos do povo brasileiro.", page: null },
      thesis: "Continuidade: manter o arcabouço fiscal, ampliar programas sociais e usar o Estado para puxar a reindustrialização.",
      summary: "O programa é, em grande parte, um balanço do atual mandato seguido de compromissos de continuidade. Várias medidas que costumam ser apresentadas como promessas — isenção de IR até R$ 5 mil, reforma tributária do consumo, COP30 — aparecem no documento como fatos já realizados. As novidades mais concretas são o fim da escala 6x1 com jornada de 40 horas, a PEC da Segurança Pública e a regulação das plataformas digitais.",
      proposals: [
        {
          theme: "economia",
          title: "Fim da escala 6x1 e jornada de 40 horas sem corte de salário",
          plain: "Reduzir a jornada semanal máxima de 44 para 40 horas e acabar com a escala de seis dias de trabalho para um de folga.",
          page: 75,
          quote: "assegurar o fim da escala 6x1 e a redução da jornada de trabalho para 40 horas, sem redução salarial",
          verdict: "lei",
          contested: true,
          legal: "A Constituição fixa apenas um teto (44h semanais, Art. 7º, XIII); por isso, parte dos juristas entende que uma lei ordinária pode reduzir a jornada. Na prática, a tramitação no Congresso vem sendo feita por PEC, o que eleva o quórum para 3/5.",
          arts: ["art7"]
        },
        {
          theme: "economia",
          title: "Continuar a valorização do salário mínimo",
          plain: "Manter reajustes do mínimo acima da inflação.",
          page: 74,
          quote: "o novo mandato de Lula dará continuidade à política de valorização do salário mínimo",
          verdict: "lei",
          legal: "O valor do mínimo é fixado em lei. Não há obstáculo constitucional, mas há efeito fiscal: aposentadorias do piso e o BPC não podem ser menores que o mínimo (Arts. 201, §2º e 203, V). Desde a Lei 15.077/2024, o ganho real fica limitado à faixa de 0,6% a 2,5% do arcabouço.",
          arts: ["art201"]
        },
        {
          theme: "fiscal",
          title: "Manter o novo arcabouço fiscal",
          plain: "Seguir limitando o crescimento dos gastos à regra criada em 2023 (LC 200/2023).",
          page: 49,
          quote: "manteremos o novo arcabouço fiscal, que controlou o crescimento das despesas",
          verdict: "exec",
          legal: "A regra já está em vigor; mantê-la não exige nova norma. O desafio é econômico: gastos obrigatórios crescem mais rápido que o limite, espremendo investimentos.",
          arts: []
        },
        {
          theme: "seguranca",
          title: "PEC da Segurança Pública e Ministério da Segurança",
          plain: "Dar à União papel de coordenação nacional da segurança e criar um ministério próprio para o tema.",
          page: 27,
          verdict: "pec",
          legal: "Mudar a divisão de competências do Art. 144 exige emenda constitucional. A PEC não pode esvaziar a autonomia dos estados sobre suas polícias, pois a forma federativa é cláusula pétrea. O ministério, em si, sai por lei.",
          arts: ["art144", "art60"]
        },
        {
          theme: "instituicoes",
          title: "Regulação das redes sociais e plataformas digitais",
          plain: "Criar regras de responsabilidade e transparência para as big techs e os algoritmos.",
          page: 16,
          verdict: "lei",
          contested: true,
          legal: "Pode ser feita por lei, mas precisa respeitar a liberdade de expressão e a vedação à censura prévia (Arts. 5º, IX e 220). Em 2025 o STF já ampliou a responsabilidade das plataformas ao julgar o Art. 19 do Marco Civil.",
          arts: ["art5"]
        },
        {
          theme: "economia",
          title: "Petrobras de volta à distribuição e ação contra a volatilidade de preços",
          plain: "A estatal voltaria a vender combustível na ponta, e o governo seguiria usando subvenções para amortecer choques de preço.",
          page: 67,
          quote: "A Petrobras deverá retornar ao segmento de distribuição de combustíveis",
          verdict: "exec",
          contested: true,
          legal: "É decisão de gestão do acionista controlador, mas a Petrobras é empresa de capital aberto: a Lei das Estatais (13.303/2016) e o Art. 173 exigem interesse público definido em lei e respeito aos acionistas minoritários. Subvenções dependem de previsão orçamentária.",
          arts: ["art173"]
        },
        {
          theme: "social",
          title: "Fila única digital na saúde por risco clínico",
          plain: "Organizar consultas e exames especializados pela gravidade do caso, e não pela ordem de chegada (programa Agora Tem Especialistas).",
          page: 37,
          verdict: "exec",
          legal: "Política de gestão do SUS, compatível com o Art. 196. Exige pactuação com estados e municípios, que executam a maior parte do atendimento.",
          arts: []
        },
        {
          theme: "ambiente",
          title: "Desmatamento líquido zero até 2030",
          plain: "Compensar toda a perda de vegetação com recuperação até 2030.",
          page: 71,
          quote: "continuaremos trabalhando para alcançar o desmatamento líquido zero até 2030",
          verdict: "exec",
          legal: "Meta de política pública, alinhada ao dever de proteção do Art. 225. Não depende de mudança legal.",
          arts: ["art225"]
        }
      ],
      economic: {
        headline: "Promessas de continuidade num orçamento que já está no limite",
        points: [
          "Gastos obrigatórios (Previdência, BPC, pisos) crescem acima do teto de 2,5% real do arcabouço.",
          "A política do salário mínimo aumenta automaticamente benefícios do INSS e do BPC.",
          "Dívida bruta em alta (82,5% do PIB em jul/2026) limita novas despesas."
        ],
        analysis: "Os pisos de saúde e educação crescem com a receita, e a Previdência cresce com o salário mínimo e o envelhecimento da população. Como o arcabouço limita o total de gastos, cada real a mais nessas rubricas sai dos investimentos e do custeio da máquina. Sem mudar regras de despesas obrigatórias, o plano depende de aumento de arrecadação para fechar a conta. O documento não detalha fontes para o fim da escala 6x1 no setor público nem o custo das subvenções a combustíveis."
      },
      context: {
        diagnosis: "O país teria sido reconstruído depois de anos de desmonte institucional e social.",
        solution: "Renda das famílias como motor da economia, Estado indutor de investimentos e reindustrialização verde.",
        critique: "O documento fala pouco de envelhecimento populacional e do peso crescente da Previdência, e aposta em mais receita num Congresso resistente a aumentar impostos."
      }
    },

    /* ========================== FLÁVIO BOLSONARO ========================= */
    {
      id: "flavio_bolsonaro",
      name: "Flávio Bolsonaro",
      shortName: "Flávio Bolsonaro",
      number: "22",
      party: "PL",
      coalition: "Não informada no documento",
      vice: "Alfredo Gaspar",
      color: "#1E4FD8",
      initials: "FB",
      document: {
        title: "Para o Brasil Vencer o Atraso",
        file: "FLAVIO-BOLSONARO-PARA-O-BRASIL-VENCER-O-ATRASO-1-1.pdf",
        pages: "76 páginas",
        pageMap: "direct"
      },
      motto: { text: "O Brasil precisa de uma alternativa liberal, conservadora, reformista e corajosa.", page: 12 },
      thesis: "Ordem primeiro: endurecimento penal, forças militares nas fronteiras e um choque liberal com corte de gastos e burocracia.",
      summary: "O plano se define como “liberal, conservador e reformista”. Na segurança, propõe cinco presídios de segurança máxima no modelo de El Salvador, fim da progressão de regime para crimes hediondos, redução da maioridade penal e castração química de estupradores. Na economia, promete R$ 900 bilhões em infraestrutura em quatro anos (via PPPs, concessões, BNDES e securitização de ativos), redução gradual de encargos da conta de luz e liberação do fracking. No campo institucional, propõe fim da reeleição e uma reforma do Judiciário que limita decisões individuais de ministros do STF.",
      proposals: [
        {
          theme: "seguranca",
          title: "5 presídios de segurança máxima no modelo de El Salvador",
          plain: "Criar um complexo federal (“TREVA”) sem celular, sem visita íntima e com visitas monitoradas.",
          page: 14,
          quote: "O Brasil terá 5 novos presídios de segurança máxima no modelo adotado por El Salvador.",
          verdict: "lei",
          legal: "Construir presídios é ato do Executivo; mudar regras de visita e disciplina exige alterar a Lei de Execução Penal. O limite é o Art. 5º, XLIX: o Estado deve garantir a integridade física e moral do preso — ponto em que o modelo salvadorenho é criticado internacionalmente.",
          arts: ["art5"]
        },
        {
          theme: "seguranca",
          title: "Fim da progressão de regime para crimes hediondos",
          plain: "Condenados por crimes hediondos cumpririam toda a pena em regime fechado.",
          page: 15,
          quote: "acabar com a progressão de regime de quem comete crimes hediondos.",
          verdict: "vedado",
          legal: "O STF já declarou inconstitucional exatamente essa regra (HC 82.959/2006 e Súmula Vinculante 26): vedar a progressão fere a individualização da pena (Art. 5º, XLVI), que é garantia individual e cláusula pétrea.",
          arts: ["art5", "art60"]
        },
        {
          theme: "seguranca",
          title: "Maioridade penal aos 16 anos (e punição a partir dos 14 para crimes graves)",
          plain: "Adolescentes passariam a responder como adultos por crimes.",
          page: 13,
          quote: "O novo governo do Brasil vai apoiar e sancionar a redução da maioridade penal de 18 para 16 anos.",
          verdict: "pec",
          contested: true,
          legal: "A idade penal está no Art. 228 da Constituição; só PEC muda — e o presidente não sanciona PEC. Há forte debate se o Art. 228 é cláusula pétrea (garantia individual); a punição a partir de 14 anos amplia esse risco.",
          arts: ["art228", "art60"]
        },
        {
          theme: "seguranca",
          title: "Castração química obrigatória para estupradores condenados",
          plain: "Aplicar tratamento hormonal compulsório a condenados por estupro e abuso infantil.",
          page: 14,
          quote: "aprovar e implementar a castração química de criminosos que abusam de mulheres e crianças",
          verdict: "vedado",
          contested: true,
          legal: "Se imposta como pena, esbarra na proibição de penas cruéis (Art. 5º, XLVII, “e”) e no direito à integridade física do preso (XLIX). Versões voluntárias, como tratamento em troca de benefícios, são mais defensáveis.",
          arts: ["art5"]
        },
        {
          theme: "seguranca",
          title: "“Bandido armado com fuzil na mão vai ser abatido”",
          plain: "Autorizar as forças de segurança a atirar em criminosos armados com fuzil.",
          page: 13,
          quote: "Bandido armado com fuzil na mão vai ser abatido pelas forças de segurança.",
          verdict: "vedado",
          contested: true,
          legal: "O Brasil não tem pena de morte (Art. 5º, XLVII, “a”). Matar só é lícito em legítima defesa, própria ou de terceiros, diante de ameaça atual (Código Penal, arts. 23 e 25). Como política genérica de “abate”, a proposta não tem base legal; dentro da legítima defesa, já é permitido hoje.",
          arts: ["art5"]
        },
        {
          theme: "seguranca",
          title: "Marinha e Aeronáutica ocupando portos e aeroportos de forma permanente",
          plain: "Tropas especiais militares fariam o controle permanente de portos e aeroportos.",
          page: 15,
          quote: "vamos usar tropas especiais da Marinha e da Aeronáutica para ocupar e monitorar, de forma permanente, os portos e aeroportos",
          verdict: "lc",
          contested: true,
          legal: "O emprego das Forças Armadas é regulado por lei complementar (LC 97/1999, Art. 142, §1º). A Constituição, porém, entrega à Polícia Federal a polícia marítima, aeroportuária e de fronteiras (Art. 144, §1º, III). Transferir essa função de forma permanente pode exigir PEC.",
          arts: ["art142"]
        },
        {
          theme: "social",
          title: "Voucher-creche quando faltar vaga na rede pública",
          plain: "Se não houver vaga pública, a família recebe um voucher para usar em creche privada credenciada até surgir a vaga.",
          page: 21,
          quote: "a família receberá um voucher-creche para acesso à rede privada credenciada até a vaga pública surgir",
          verdict: "lei",
          contested: true,
          legal: "Creche é dever do Estado (Art. 208, IV). Repassar verba a creches comunitárias, confessionais ou filantrópicas sem fins lucrativos já é permitido (Art. 213). Pagar escolas com fins lucrativos é controverso: o §1º do Art. 213 só prevê bolsas para ensino fundamental e médio. Creche também é atribuição dos municípios (Art. 211, §2º).",
          arts: ["art213"]
        },
        {
          theme: "economia",
          title: "R$ 900 bilhões em infraestrutura em 4 anos",
          plain: "Rodovias, ferrovias (Ferrogrão), hidrovias, portos e aeroportos com PPPs, concessões, BNDES e securitização de ativos da União.",
          page: 51,
          quote: "Vamos investir R$ 900 bilhões em quatro anos em rodovias, hidrovias, portos, aeroportos e ferrovias.",
          verdict: "exec",
          legal: "Concessões e PPPs já têm marco legal. O desafio é financeiro: são cerca de R$ 225 bi por ano, mais que todo o espaço discricionário do Executivo (cerca de R$ 206 bi em 2026). O plano não diz quanto viria do setor privado. A Ferrogrão depende do STF, que julga a ADI 6553 sobre o Parque do Jamanxim.",
          arts: ["art225"]
        },
        {
          theme: "ambiente",
          title: "Licença ambiental concedida automaticamente se o órgão não decidir no prazo",
          plain: "Se o governo demorar demais para analisar, a licença sai sozinha.",
          page: 50,
          quote: "Se não decidir nem se manifestar dentro desse prazo, a licença deve ser concedida",
          verdict: "vedado",
          legal: "O STF já derrubou licenciamento ambiental automático (ADI 6808, 2022). O Art. 225, §1º, IV exige estudo prévio de impacto para atividades potencialmente degradantes. Prazos com consequências administrativas para o órgão são possíveis; a aprovação tácita, não.",
          arts: ["art225"]
        },
        {
          theme: "ambiente",
          title: "Liberar o fracking (gás não convencional)",
          plain: "Permitir a extração de gás de xisto por fraturamento hidráulico, “cumprindo a lei”.",
          page: 52,
          quote: "permitir a exploração do gás não convencional (fracking) com responsabilidade ambiental e cumprindo a lei",
          verdict: "exec",
          contested: true,
          legal: "A ANP pode licitar blocos, mas há leis estaduais proibindo o fracking (ex.: Paraná) e decisões da Justiça Federal que já suspenderam leilões por falta de estudos. Exige licenciamento com EIA (Art. 225).",
          arts: ["art225"]
        },
        {
          theme: "instituicoes",
          title: "Reforma do Judiciário: fim do foro criminal no STF e limite a decisões monocráticas",
          plain: "O STF deixaria de julgar autoridades em processos criminais, e as decisões individuais de ministros seriam limitadas.",
          page: 65,
          quote: "Limitação das decisões monocráticas do STF, privilegiando as decisões colegiadas",
          verdict: "pec",
          legal: "As competências do STF estão no Art. 102; alterá-las exige PEC. Reorganizar competências não viola a separação de Poderes por si só; o que seria vedado é esvaziar a independência do Judiciário (Arts. 2º e 60, §4º, III).",
          arts: ["art102", "art2"]
        },
        {
          theme: "instituicoes",
          title: "Fim da reeleição para presidente",
          plain: "Mandatos presidenciais sem direito a um segundo período consecutivo.",
          page: 66,
          verdict: "pec",
          legal: "A reeleição está no Art. 14, §5º (EC 16/1997). Retirá-la exige PEC, que é juridicamente viável.",
          arts: ["art14"]
        }
      ],
      economic: {
        headline: "Grandes cifras de investimento sem dizer quem paga",
        points: [
          "R$ 900 bi em 4 anos ≈ 1,7% do PIB por ano (PIB de 2025: R$ 12,7 tri).",
          "Corte de encargos da conta de luz (CDE) é gradual e preserva a tarifa social.",
          "Meio milhão de novas vagas prisionais em 4 anos tem custo de construção e de custeio."
        ],
        analysis: "O plano combina corte de gastos (“Tesouraço”), redução de encargos e uma meta de crescimento de 4% ao ano com um programa de infraestrutura maior do que todo o orçamento livre do governo. A viabilidade depende de o setor privado bancar a maior parte, e investidores exigem segurança jurídica e ambiental — justamente o ponto em que propostas como a licença tácita tendem a ser judicializadas. O documento também não estima o custo de manter meio milhão de presos a mais."
      },
      context: {
        diagnosis: "A perda de território para o crime organizado seria o principal entrave à vida das famílias e à economia.",
        solution: "Autoridade da lei, isolamento de lideranças criminosas, desregulamentação e investimento privado em logística.",
        critique: "Várias medidas penais já foram testadas e derrubadas no STF. O plano não trata do custo fiscal do encarceramento em massa nem da origem dos recursos para a infraestrutura."
      }
    },

    /* =========================== RONALDO CAIADO ========================== */
    {
      id: "ronaldo_caiado",
      name: "Ronaldo Caiado",
      shortName: "Ronaldo Caiado",
      number: "55",
      party: "PSD",
      coalition: "Não informada no documento",
      vice: "Gilberto Kassab (PSD)",
      color: "#0F766E",
      initials: "RC",
      document: {
        title: "Plano de Governo — Muito pra mostrar, nada pra esconder (2027 a 2030)",
        file: "Plano-de-Governo-Ronaldo-Caiado-Presidente.pdf",
        pages: "100 páginas, 26 temas",
        pageMap: "direct"
      },
      motto: { text: "Muito pra mostrar, nada pra esconder.", page: 1 },
      thesis: "Segurança como responsabilidade direta da Presidência, com facções tratadas como terrorismo e ajuste fiscal gradual sem aumento de impostos.",
      summary: "Documento técnico de 100 páginas e 26 temas. O eixo central é a segurança: a Presidência assume responsabilidade direta pelo tema, facções como PCC e CV são enquadradas como “terrorismo doméstico” quando cumprirem critérios cumulativos, há penas mínimas de 35 a 45 anos e um regime prisional especial (REDAD). No fiscal, propõe que as despesas obrigatórias cresçam abaixo do PIB nominal, sem cortes lineares nem aumento de impostos, e renegociar com o Congresso os critérios das emendas. Também propõe fim da reeleição a partir de 2027 e voto distrital misto.",
      proposals: [
        {
          theme: "seguranca",
          title: "Facções como “terrorismo doméstico”, com penas mínimas de 35 a 45 anos",
          plain: "Nova lei enquadraria facções que têm comando, território, armas e poder econômico como organizações terroristas.",
          page: 17,
          verdict: "lei",
          contested: true,
          legal: "Exige mudar a Lei 13.260/2016, que hoje só considera terrorismo o ato movido por xenofobia ou preconceito. Os critérios cumulativos reduzem o risco de enquadrar grupos demais. Penas mínimas tão altas podem ser questionadas por desproporcionalidade, e o cumprimento continua limitado a 40 anos (Art. 75 do Código Penal).",
          arts: ["art5"]
        },
        {
          theme: "seguranca",
          title: "Regime prisional especial (REDAD): progressão só após 90% da pena e monitoramento de conversas com advogados",
          plain: "Líderes de facção ficariam isolados, com conversas com advogados monitoradas e quase sem direito a progressão.",
          page: 17,
          quote: "monitoramento obrigatório de todas as conversas com advogados, e direito à progressão somente após cumprimento de 90% da pena",
          verdict: "lei",
          contested: true,
          legal: "Exigir 90% da pena para progredir chega muito perto da proibição total derrubada pelo STF (HC 82.959). Monitorar sempre as conversas com advogados choca com a ampla defesa (Art. 5º, LV) e a inviolabilidade da advocacia (Art. 133). O próprio plano prevê supervisão judicial (p. 19), o que reduz, mas não elimina, o risco.",
          arts: ["art5"]
        },
        {
          theme: "seguranca",
          title: "Forças Armadas contra o crime organizado sem precisar decretar GLO",
          plain: "Militares atuariam de forma regular no combate às facções, sem o decreto de Garantia da Lei e da Ordem.",
          page: 17,
          quote: "permite que as Forças Armadas sejam integradas ao enfrentamento do crime organizado sem acionamento da GLO",
          verdict: "lc",
          contested: true,
          legal: "A LC 97/1999 só admite o emprego em segurança interna de forma episódica, esgotadas as polícias. Mudar isso exige lei complementar. Ao julgar a ADI 6457 (2024), o STF reforçou que esse emprego é excepcional (Art. 142).",
          arts: ["art142"]
        },
        {
          theme: "seguranca",
          title: "Perda de bens do crime independentemente da ação penal",
          plain: "Bens e criptoativos de facções poderiam ser tomados em processo próprio, com inversão do ônus da prova e venda antecipada.",
          page: 17,
          quote: "perda patrimonial autônoma, que poderá ser requerida independentemente da ação penal",
          verdict: "lei",
          contested: true,
          legal: "O confisco de bens ligados ao tráfico já está no Art. 243, parágrafo único. Uma ação civil de perdimento é defensável por lei, mas exige contraditório e devido processo (Art. 5º, LIV e LV). A inversão do ônus da prova é o ponto mais sensível.",
          arts: ["art5"]
        },
        {
          theme: "fiscal",
          title: "Despesas obrigatórias crescendo abaixo do PIB, sem cortes lineares nem aumento de impostos",
          plain: "Frear gastos como Previdência e folha para que cresçam menos que a economia.",
          page: 12,
          quote: "Fazer as despesas obrigatórias crescerem abaixo do PIB nominal",
          verdict: "lei",
          contested: true,
          legal: "Parte dessas despesas está amarrada à própria Constituição: benefício mínimo igual ao salário mínimo, pisos de saúde e educação. Sem PEC, a meta depende sobretudo de crescimento econômico e do controle de fraudes.",
          arts: ["art201", "art198"]
        },
        {
          theme: "fiscal",
          title: "Novos critérios para as emendas parlamentares, pactuados com o Congresso",
          plain: "Reduzir a pulverização das emendas e exigir planejamento, transparência e resultado.",
          page: 13,
          quote: "Pactuar com o Congresso critérios de planejamento, transparência, manutenção, custo total e resultado",
          verdict: "pec",
          legal: "Transparência pode vir por lei e já é exigida pelo STF (ADPF 854). Porém a execução obrigatória das emendas está no Art. 166, §§ 9º a 20 (ECs 86, 100 e 126), e mudá-la exige PEC aprovada pelos próprios parlamentares.",
          arts: ["art166"]
        },
        {
          theme: "instituicoes",
          title: "Fim da reeleição, valendo já para o mandato iniciado em 2027",
          plain: "O próprio Caiado abriria mão de concorrer a um segundo mandato.",
          page: 8,
          verdict: "pec",
          legal: "Exige PEC alterando o Art. 14, §5º. Aplicar a regra ao próprio mandato é possível, porque restringe o direito do próprio titular.",
          arts: ["art14"]
        },
        {
          theme: "instituicoes",
          title: "Voto distrital misto para deputados",
          plain: "Parte dos deputados seria eleita por distritos e parte por lista partidária.",
          page: 10,
          verdict: "pec",
          contested: true,
          legal: "O Art. 45 manda eleger deputados “pelo sistema proporcional”. Há quem defenda que o distrital misto, por manter a proporcionalidade, poderia vir por lei; a posição majoritária é que exige PEC.",
          arts: ["art45"]
        },
        {
          theme: "social",
          title: "Regulação inteligente do SUS: da fila cronológica à prioridade clínica",
          plain: "Consultas e cirurgias seriam agendadas pela gravidade e pelo prazo clínico, não pela ordem de chegada.",
          page: 76,
          verdict: "exec",
          legal: "É gestão do SUS, compatível com os Arts. 196 e 198. Depende de pactuação com estados e municípios.",
          arts: []
        }
      ],
      economic: {
        headline: "O ajuste mais detalhado, mas amarrado a gastos que a Constituição protege",
        points: [
          "Meta: despesas obrigatórias crescendo abaixo do PIB nominal.",
          "Promete não aumentar impostos nem fazer cortes lineares.",
          "Fundo antiterrorismo “não contingenciável” reduz a flexibilidade do orçamento."
        ],
        analysis: "É o plano com a regra fiscal mais explícita. O problema é que a maior despesa obrigatória, a Previdência, está indexada ao salário mínimo pela Constituição, e os pisos de saúde e educação crescem junto com a receita. Sem mexer nessas vinculações, conter o gasto abaixo do PIB depende de crescimento forte. Outro ponto: o plano cria fundos que não podem ser contingenciados, o que torna o orçamento ainda mais rígido."
      },
      context: {
        diagnosis: "O país estaria refém da “polarização estéril” e de um Estado fraco diante do crime organizado.",
        solution: "Autoridade na segurança, gestão por metas e coalizão pragmática com o Congresso.",
        critique: "A governabilidade dependerá de negociar com os mesmos partidos cujas emendas o plano quer reorganizar."
      }
    },

    /* =========================== AUGUSTO CURY ============================ */
    {
      id: "augusto_cury",
      name: "Augusto Cury",
      shortName: "Augusto Cury",
      number: "70",
      party: "Avante",
      coalition: "Não informada no documento",
      vice: "Júlio Delgado (Avante)",
      color: "#7C3AED",
      initials: "AC",
      document: {
        title: "Cultura da Paz em uma Sociedade Polarizada e Adoecida",
        file: "Plano_gov_Augusto_Cury_2026.pdf",
        pages: "200 páginas, 18 projetos",
        pageMap: "direct"
      },
      motto: { text: "Estamos todos no mesmo barco, chamado família brasileira.", page: 3 },
      thesis: "Pacificar um país “emocionalmente adoecido”: educação socioemocional, empreendedorismo em massa e telemedicina.",
      summary: "O plano mais extenso da eleição, com 200 páginas, 18 projetos e 20 teses. A tese central é que a sociedade está adoecida pela polarização. As propostas incluem escola em tempo integral com Gestão da Emoção, Educação Financeira e Empreendedorismo no currículo; a política Brasil Neuroinclusivo; um novo órgão para gerar 10 milhões de empreendedores; o Brasil Oásis no Semiárido; e a maior plataforma pública de telemedicina do mundo. No campo institucional, propõe adotar o semipresidencialismo e reformar o STF, com 9 ministros e mandato de 8 anos.",
      proposals: [
        {
          theme: "instituicoes",
          title: "Semipresidencialismo, com Primeiro-Ministro escolhido pelo Parlamento",
          plain: "O presidente dividiria o governo com um primeiro-ministro que depende do apoio da maioria parlamentar.",
          page: 60,
          verdict: "pec",
          contested: true,
          legal: "Mudar o sistema de governo exige PEC. Como o presidencialismo foi escolhido em plebiscito (1993), muitos juristas defendem que uma mudança precisaria de nova consulta popular.",
          arts: ["art60"]
        },
        {
          theme: "instituicoes",
          title: "STF com 9 ministros, mandato de 8 anos e escolha pelas carreiras jurídicas",
          plain: "O presidente deixaria de indicar ministros; magistratura, MP e OAB escolheriam. Mínimo de 3 mulheres.",
          page: 64,
          quote: "Propomos ainda reduzir a composição do STF para nove ministros",
          verdict: "pec",
          legal: "A composição e a forma de escolha estão no Art. 101; mudá-las exige PEC. É viável, desde que preserve a independência do Judiciário (Art. 60, §4º, III). Reduzir cadeiras enquanto há ministros em exercício traz questões de transição.",
          arts: ["art102", "art2"]
        },
        {
          theme: "social",
          title: "Gestão da Emoção, Educação Financeira e Empreendedorismo no currículo",
          plain: "Três novos pilares nas escolas, dentro do tempo integral.",
          page: 75,
          verdict: "exec",
          legal: "A União define diretrizes nacionais (Art. 22, XXIV) e a BNCC já inclui competências socioemocionais. A aplicação depende das redes estaduais e municipais e deve respeitar o pluralismo pedagógico (Art. 206, III).",
          arts: []
        },
        {
          theme: "social",
          title: "Brasil Neuroinclusivo",
          plain: "Política nacional para estudantes com autismo, TDAH, dislexia e altas habilidades, com formação de professores.",
          page: 81,
          verdict: "exec",
          legal: "Alinhada à Lei Brasileira de Inclusão e à Lei 12.764/2012 (autismo). É implementável por programa federal com recursos.",
          arts: []
        },
        {
          theme: "economia",
          title: "10 milhões de novos empreendedores e “Banco do Empreendedor”",
          plain: "Crédito de até R$ 20 mil a 5% ou 6% ao ano, via 10 mil clubes, coordenados por uma Secretaria ou Ministério do Empreendedorismo.",
          page: 98,
          quote: "Crédito De Até R$ 20.000,00; Juros Civilizados (5% a 6% ao ano)",
          verdict: "lei",
          legal: "Criar banco ou empresa pública exige lei específica (Art. 37, XIX), e criar ministério também (Art. 88). Juros abaixo da Selic, hoje em 13,75%, dependem de subsídio no orçamento, a chamada equalização (LRF, art. 26).",
          arts: []
        },
        {
          theme: "social",
          title: "Tele Saúde Brasil",
          plain: "Maior plataforma pública de telemedicina do mundo, com atendimento digital em até 30 minutos nos casos compatíveis.",
          page: 161,
          quote: "meta nacional de atendimento digital em até trinta minutos para os casos compatíveis com telemedicina",
          verdict: "exec",
          legal: "A telessaúde já tem base na Lei 14.510/2022. Exige proteção de dados sensíveis (LGPD) e integração com o SUS de estados e municípios.",
          arts: []
        },
        {
          theme: "economia",
          title: "Brasil Oásis no Semiárido",
          plain: "Irrigação de precisão e agroindústria em 1.477 municípios (31 milhões de pessoas), com meta de multiplicar por dez a exportação de frutas.",
          page: 114,
          verdict: "exec",
          legal: "É política de desenvolvimento regional, compatível com o Art. 3º, III. Precisa de outorga de água e licenciamento ambiental. O principal limite é orçamentário.",
          arts: []
        },
        {
          theme: "seguranca",
          title: "Polícia FOCO: converter 5% dos servidores municipais em força de segurança",
          plain: "Servidores já existentes nas prefeituras seriam remanejados para uma força municipal de prevenção.",
          page: 45,
          verdict: "vedado",
          contested: true,
          legal: "Guardas municipais são constitucionais (Art. 144, §8º), e o STF permite que façam policiamento preventivo. Mas transferir servidores de outra carreira para a função sem novo concurso viola o Art. 37, II e a Súmula Vinculante 43. A saída legal seria abrir concurso próprio.",
          arts: ["art37", "art144"]
        },
        {
          theme: "fiscal",
          title: "Déficit próximo de zero “sem aventuras fiscais”",
          plain: "Compromisso genérico com equilíbrio das contas.",
          page: 36,
          quote: "Nossa meta será perseguir o déficit próximo de zero, sem aventuras fiscais",
          verdict: "exec",
          legal: "É meta de política fiscal, fixada anualmente na LDO. Não há obstáculo jurídico; o desafio é conciliá-la com o custo dos 18 projetos.",
          arts: []
        }
      ],
      economic: {
        headline: "Muitos projetos novos e poucas fontes de financiamento",
        points: [
          "18 projetos nacionais, vários com novos órgãos e fundos.",
          "Crédito subsidiado em escala nacional com a Selic a 13,75%.",
          "O plano não aponta cortes em Previdência ou folha para compensar."
        ],
        analysis: "O plano acerta ao antecipar efeitos da inteligência artificial no emprego e ao tratar saúde mental como tema econômico. Mas soma escola integral nacional, infraestrutura hídrica no Semiárido, telemedicina e crédito barato a milhões de pequenos negócios, enquanto promete déficit próximo de zero. Sem apontar cortes ou novas receitas, os projetos dependem de PPPs, de lucros de estatais (citados como fonte do Banco do Empreendedor) e da boa vontade do Congresso."
      },
      context: {
        diagnosis: "Um país “emocionalmente adoecido” por ansiedade, polarização e medo do desemprego tecnológico.",
        solution: "Capital humano, inclusão neurodivergente, empreendedorismo e cooperativismo.",
        critique: "Mudanças profundas como o semipresidencialismo e a reforma do STF exigem maioria de 3/5 num Congresso fragmentado, e o plano não explica como formar essa maioria."
      }
    },

    /* ============================ RENAN SANTOS =========================== */
    {
      id: "renan_santos",
      name: "Renan Santos",
      shortName: "Renan Santos",
      number: null,
      party: "Missão",
      coalition: "Não informada no documento",
      vice: "Aroldo Medina",
      color: "#B7791F",
      initials: "RS",
      document: {
        title: "O Futuro é Glorioso — Resumo executivo do Livro Amarelo",
        file: "proposta-missao-renan-santos.pdf",
        pages: "51 páginas (resumo de obra com mais de 500)",
        pageMap: "direct"
      },
      motto: { text: "O futuro é glorioso.", page: 3 },
      thesis: "Ruptura com a “Nova República”: ajuste fiscal duro, Direito Penal do Inimigo e reorganização do mapa municipal.",
      summary: "O resumo do Livro Amarelo, com 51 páginas de uma obra de mais de 500, é o plano mais radical e o mais explícito sobre mudanças constitucionais. No fiscal, propõe uma PEC antes da posse para desindexar benefícios do salário mínimo e desvincular os pisos de saúde e educação, citando um ajuste necessário de R$ 250 bi por ano (estimativa atribuída a Mansueto Almeida). Na segurança, propõe o Direito Penal do Inimigo, aplicado “por sucessivos decretos de Estado de Defesa em áreas sob comando das facções”. O plano também propõe reduzir drasticamente o número de municípios, substituir o Bolsa Família por frentes de trabalho, abolir cotas e acabar com a autonomia universitária. O próprio texto afirma que alguns objetivos “dependem de nova ordem constitucional”.",
      proposals: [
        {
          theme: "seguranca",
          title: "Direito Penal do Inimigo (Jakobs)",
          plain: "Membros de facções seriam tratados como “inimigos”: perda de direitos políticos e civis, restrição de locomoção e penas desproporcionais.",
          page: 12,
          quote: "medidas preventivas e penas desproporcionais àqueles que demonstram não aceitar o pacto social",
          verdict: "vedado",
          legal: "Cassar direitos políticos fora das hipóteses do Art. 15 é proibido; perdê-los exige condenação transitada em julgado. Penas desproporcionais e medidas sem culpa formada ferem o devido processo e a presunção de inocência (Art. 5º, LIV e LVII), que são cláusulas pétreas. O documento diz que as medidas seriam “compatíveis com a Constituição”, mas não explica como.",
          arts: ["art5", "art60", "art15"]
        },
        {
          theme: "seguranca",
          title: "“Sucessivos decretos de Estado de Defesa” em áreas dominadas por facções",
          plain: "Usar o Estado de Defesa, que permite restringir direitos, de forma repetida para combater o crime.",
          page: 12,
          quote: "se daria por sucessivos decretos de Estado de Defesa em áreas sob comando das facções",
          verdict: "vedado",
          legal: "O Estado de Defesa dura no máximo 30 dias, prorrogáveis uma única vez (Art. 136, §2º), e precisa de aprovação do Congresso em 10 dias. Se não bastar, o caminho constitucional é o Estado de Sítio, com autorização prévia do Congresso, e não decretos em série. Mesmo nessas situações, só se restringem direitos específicos, como reunião e sigilo de correspondência; o devido processo não pode ser suspenso.",
          arts: ["art136"]
        },
        {
          theme: "fiscal",
          title: "Desindexar aposentadorias e benefícios assistenciais do salário mínimo",
          plain: "Benefícios seriam corrigidos só pela inflação, mesmo que o salário mínimo tenha aumento real.",
          page: 10,
          quote: "desindexação de benefícios previdenciários e assistenciais do salário mínimo (corrigindo-os apenas pela inflação)",
          verdict: "pec",
          contested: true,
          legal: "A Constituição proíbe benefício previdenciário abaixo do mínimo (Art. 201, §2º) e garante o BPC de um salário mínimo (Art. 203, V). Mudar isso exige PEC. Há debate se direitos sociais são cláusula pétrea (vedação de retrocesso), mas o STF nunca anulou uma emenda com esse argumento.",
          arts: ["art201", "art60"]
        },
        {
          theme: "fiscal",
          title: "Desvincular os pisos de saúde e educação",
          plain: "O governo deixaria de ser obrigado a gastar percentuais mínimos da receita em saúde e educação.",
          page: 10,
          quote: "desvinculação dos pisos de saúde e educação da receita",
          verdict: "pec",
          legal: "Os pisos estão nos Arts. 198, §2º e 212, e só uma PEC pode mudá-los. Há precedente: o Teto de Gastos (EC 95/2016) mudou a regra dos pisos e não foi anulado pelo STF. É juridicamente possível; o custo é político e social.",
          arts: ["art198"]
        },
        {
          theme: "instituicoes",
          title: "Grande Consolidação Municipal: de 5.570 para cerca de 1.650 municípios",
          plain: "Fundir municípios pequenos e sem receita própria, por meio da PEC 188/2019 e de um novo marco legal.",
          page: 15,
          quote: "A consolidação não será imposição de Brasília sobre o território.",
          verdict: "pec",
          contested: true,
          legal: "Hoje, fundir municípios exige lei estadual, plebiscito e uma lei complementar federal que nunca foi aprovada (Art. 18, §4º). Por isso o plano recorre a uma PEC. Uma fusão em massa sem consulta às populações pode ser questionada como ofensa à forma federativa, que é cláusula pétrea.",
          arts: ["art18", "art60"]
        },
        {
          theme: "instituicoes",
          title: "Cláusula Antimáfia: STJ dissolve prefeituras capturadas pelo crime",
          plain: "O mandato seria extinto e uma comissão federal administraria o município por até 24 meses.",
          page: 18,
          quote: "o mandato eletivo é extinto e o município passa a ser gerido por uma comissão extraordinária federal por até 24 meses",
          verdict: "pec",
          contested: true,
          legal: "A União não pode intervir em municípios de estados; só o Estado pode, e nos casos do Art. 35. Os mandatos também só se perdem nas hipóteses constitucionais. O plano fala em “lei”, mas seria preciso uma PEC, com risco de ferir a autonomia municipal (Arts. 18 e 60, §4º, I).",
          arts: ["art18", "art60"]
        },
        {
          theme: "social",
          title: "Trocar o Bolsa Família por “Frentes Cidadãs” de trabalho",
          plain: "A transferência de renda seria substituída por frentes de trabalho remuneradas.",
          page: 21,
          verdict: "lei",
          contested: true,
          legal: "O Bolsa Família é criado por lei (Lei 14.601/2023). Desde a EC 114/2021, porém, a Constituição garante renda básica a quem está em vulnerabilidade (Art. 6º, parágrafo único). Exigir trabalho como condição é juridicamente discutível para quem não pode trabalhar.",
          arts: ["art6"]
        },
        {
          theme: "social",
          title: "Abolir cotas e substituir a autonomia universitária por “alinhamento estratégico”",
          plain: "Fim da reserva de vagas e universidades federais subordinadas a metas do governo.",
          page: 32,
          quote: "substituindo a autonomia universitária por uma perspectiva de alinhamento estratégico",
          verdict: "pec",
          legal: "As cotas estão em lei (12.711/2012); o STF as considerou constitucionais, mas não obrigatórias, então revogá-las é possível por lei. Já a autonomia universitária está no Art. 207, e acabar com ela exige PEC.",
          arts: ["art207"]
        },
        {
          theme: "economia",
          title: "Zonas Econômicas Especiais no Nordeste (modelos Shenzhen e Shannon)",
          plain: "Áreas com suspensão de tributos de importação e regime próprio de IBS/CBS para atrair indústria exportadora.",
          page: 35,
          verdict: "lc",
          contested: true,
          legal: "Incentivos regionais são permitidos (Art. 151, I), e as ZPEs já existem por lei (11.508/2007). Criar um regime específico de IBS/CBS exige lei complementar e, se não estiver entre as exceções da reforma tributária (EC 132/2023), PEC.",
          arts: []
        },
        {
          theme: "social",
          title: "“Crime de favelização” e demolição administrativa em 48 horas",
          plain: "Punir loteadores ilegais e demolir construções não habitadas em áreas públicas ou de risco sem ordem judicial.",
          page: 49,
          quote: "o objetivo final, a demolição de toda construção ilegal, depende de nova ordem constitucional",
          verdict: "lei",
          contested: true,
          legal: "Tipificar o crime exige lei. Demolições precisam de contraditório (Art. 5º, LV) e respeito ao direito à moradia (Art. 6º). O próprio plano admite que a meta final só seria possível com “nova ordem constitucional”.",
          arts: ["art5", "art6"]
        }
      ],
      economic: {
        headline: "O maior ajuste fiscal proposto, com risco de choque de curto prazo",
        points: [
          "Ajuste citado: R$ 250 bi por ano, cerca de 2% do PIB (estimativa atribuída a Mansueto Almeida).",
          "Economia projetada pela PEC: R$ 1,1 tri até 2031.",
          "Desfavelização custaria R$ 1,2 a 1,5 tri em 10 anos, segundo o próprio plano."
        ],
        analysis: "Um ajuste desse tamanho estabilizaria a dívida mais rápido que qualquer outro plano. Mas quem paga são sobretudo aposentados do piso e beneficiários do BPC, que sustentam o comércio de milhares de pequenas cidades. As Zonas Econômicas Especiais levam anos para gerar empregos que compensem essa perda de renda. O plano também propõe gastos altíssimos, como os R$ 1,2 a 1,5 tri em desfavelização e a duplicação do investimento em infraestrutura de 2% para 4% do PIB, sem mostrar a conta consolidada."
      },
      context: {
        diagnosis: "A “Nova República” teria falhado: democracia esvaziada, oligarquias regionais e um Estado leniente com o crime.",
        solution: "Refundação nacional “dentro dos limites da democracia representativa”, com choque fiscal, ordem e reindustrialização.",
        critique: "Boa parte das medidas centrais esbarra em cláusulas pétreas ou exige 3/5 do Congresso. O próprio texto reconhece que algumas dependem de “nova ordem constitucional”."
      }
    }
  ],

  /* ------------------------------------------------------------------
     Radar CF/88 — os artigos citados nas análises
     ------------------------------------------------------------------ */
  articles: {
    art2: { title: "Art. 2º", topic: "Separação dos Poderes", text: "São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.", plain: "Nenhum Poder pode anular ou controlar o outro. É cláusula pétrea." },
    art5: { title: "Art. 5º", topic: "Direitos e garantias individuais", text: "XLVI – a lei regulará a individualização da pena (...); XLVII – não haverá penas: a) de morte, salvo em caso de guerra declarada (...); b) de caráter perpétuo; (...) e) cruéis; XLIX – é assegurado aos presos o respeito à integridade física e moral; LIV – ninguém será privado da liberdade ou de seus bens sem o devido processo legal; LVII – ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.", plain: "O coração da Constituição. Nem emenda constitucional pode abolir essas garantias." },
    art6: { title: "Art. 6º", topic: "Direitos sociais e renda básica", text: "São direitos sociais a educação, a saúde, a alimentação, o trabalho, a moradia (...). Parágrafo único. Todo brasileiro em situação de vulnerabilidade social terá direito a uma renda básica familiar, garantida pelo poder público em programa permanente de transferência de renda (...).", plain: "Desde 2021, a transferência de renda aos vulneráveis é um direito constitucional." },
    art7: { title: "Art. 7º, XIII", topic: "Jornada de trabalho", text: "duração do trabalho normal não superior a oito horas diárias e quarenta e quatro semanais, facultada a compensação de horários e a redução da jornada, mediante acordo ou convenção coletiva de trabalho.", plain: "A Constituição fixa um teto de 44h por semana, não um piso." },
    art14: { title: "Art. 14", topic: "Direitos políticos e reeleição", text: "§ 3º São condições de elegibilidade, na forma da lei: (...) V – a filiação partidária; § 5º O Presidente da República (...) poderá ser reeleito para um único período subsequente.", plain: "Não existe candidatura sem partido no Brasil. A reeleição pode ser extinta por PEC." },
    art15: { title: "Art. 15", topic: "Perda de direitos políticos", text: "É vedada a cassação de direitos políticos, cuja perda ou suspensão só se dará nos casos de: (...) III – condenação criminal transitada em julgado, enquanto durarem seus efeitos; (...)", plain: "Ninguém perde direitos políticos por decisão do governo; só nas hipóteses listadas." },
    art18: { title: "Art. 18, §4º", topic: "Criação e fusão de municípios", text: "A criação, a incorporação, a fusão e o desmembramento de Municípios, far-se-ão por lei estadual, dentro do período determinado por Lei Complementar Federal, e dependerão de consulta prévia, mediante plebiscito, às populações dos Municípios envolvidos (...).", plain: "Fundir cidades exige plebiscito local e uma lei complementar federal que nunca foi aprovada." },
    art37: { title: "Art. 37, II", topic: "Concurso público", text: "a investidura em cargo ou emprego público depende de aprovação prévia em concurso público de provas ou de provas e títulos (...).", plain: "Não se muda um servidor de carreira sem novo concurso (Súmula Vinculante 43)." },
    art45: { title: "Art. 45", topic: "Sistema eleitoral da Câmara", text: "A Câmara dos Deputados compõe-se de representantes do povo, eleitos, pelo sistema proporcional, em cada Estado, em cada Território e no Distrito Federal.", plain: "Trocar o sistema proporcional exige, em regra, emenda constitucional." },
    art60: { title: "Art. 60", topic: "Emendas e cláusulas pétreas", text: "§ 2º A proposta será discutida e votada em cada Casa do Congresso Nacional, em dois turnos, considerando-se aprovada se obtiver, em ambos, três quintos dos votos (...). § 4º Não será objeto de deliberação a proposta de emenda tendente a abolir: I – a forma federativa de Estado; II – o voto direto, secreto, universal e periódico; III – a separação dos Poderes; IV – os direitos e garantias individuais.", plain: "Define o quórum de PEC e os quatro temas que nem emenda pode abolir." },
    art102: { title: "Arts. 101 e 102", topic: "Composição e competência do STF", text: "Art. 101. O Supremo Tribunal Federal compõe-se de onze Ministros (...). Art. 102. Compete ao Supremo Tribunal Federal, precipuamente, a guarda da Constituição, cabendo-lhe: I – processar e julgar, originariamente: (...) b) nas infrações penais comuns, o Presidente da República, o Vice-Presidente, os membros do Congresso Nacional (...).", plain: "Número de ministros e o que o STF julga só mudam por PEC." },
    art136: { title: "Art. 136", topic: "Estado de Defesa", text: "O Presidente da República pode (...) decretar estado de defesa para preservar ou prontamente restabelecer, em locais restritos e determinados, a ordem pública ou a paz social ameaçadas por grave e iminente instabilidade institucional (...). § 2º O tempo de duração do estado de defesa não será superior a trinta dias, podendo ser prorrogado uma vez, por igual período (...).", plain: "Medida excepcional: no máximo 60 dias, com aval do Congresso." },
    art142: { title: "Arts. 142 e 144", topic: "Forças Armadas e segurança pública", text: "Art. 142. As Forças Armadas (...) destinam-se à defesa da Pátria, à garantia dos poderes constitucionais e, por iniciativa de qualquer destes, da lei e da ordem. § 1º Lei complementar estabelecerá as normas gerais (...) no emprego das Forças Armadas. Art. 144, § 1º, III – [cabe à Polícia Federal] exercer as funções de polícia marítima, aeroportuária e de fronteiras.", plain: "Militares só atuam na segurança interna de forma excepcional; portos e aeroportos são da PF." },
    art144: { title: "Art. 144", topic: "Segurança pública e federalismo", text: "A segurança pública, dever do Estado, direito e responsabilidade de todos, é exercida (...) através dos seguintes órgãos: polícia federal; (...) polícias civis; polícias militares (...). § 8º Os Municípios poderão constituir guardas municipais (...).", plain: "Cada ente tem sua polícia. A União coordena, mas não comanda as polícias estaduais." },
    art166: { title: "Art. 166, §§ 9º a 20", topic: "Emendas parlamentares impositivas", text: "§ 9º As emendas individuais ao projeto de lei orçamentária serão aprovadas no limite de 2% (dois por cento) da receita corrente líquida (...). § 11. É obrigatória a execução orçamentária e financeira das programações oriundas de emendas individuais (...).", plain: "O governo é obrigado a pagar as emendas individuais e de bancada." },
    art173: { title: "Art. 173", topic: "Estado empresário", text: "(...) a exploração direta de atividade econômica pelo Estado só será permitida quando necessária aos imperativos da segurança nacional ou a relevante interesse coletivo, conforme definidos em lei.", plain: "Estatais competem no mercado sob regras de mercado." },
    art198: { title: "Arts. 198 e 212", topic: "Pisos de saúde e educação", text: "Art. 198, § 2º, I – no caso da União, a receita corrente líquida (...), não podendo ser inferior a 15% (quinze por cento). Art. 212. A União aplicará, anualmente, nunca menos de dezoito (...) por cento, no mínimo, da receita resultante de impostos (...) na manutenção e desenvolvimento do ensino.", plain: "Mínimos obrigatórios de gasto. Podem ser alterados por PEC (houve precedente em 2016)." },
    art201: { title: "Arts. 201, §2º e 203, V", topic: "Benefício mínimo = salário mínimo", text: "Art. 201, § 2º Nenhum benefício que substitua o salário de contribuição ou o rendimento do trabalho do segurado terá valor mensal inferior ao salário mínimo. Art. 203, V – a garantia de um salário mínimo de benefício mensal à pessoa portadora de deficiência e ao idoso que comprovem não possuir meios de prover à própria manutenção (...).", plain: "Por isso cada aumento real do mínimo pesa bilhões na Previdência e no BPC." },
    art207: { title: "Art. 207", topic: "Autonomia universitária", text: "As universidades gozam de autonomia didático-científica, administrativa e de gestão financeira e patrimonial (...).", plain: "O governo não pode dirigir o conteúdo e a gestão das universidades." },
    art213: { title: "Art. 213", topic: "Verba pública para escolas privadas", text: "Os recursos públicos serão destinados às escolas públicas, podendo ser dirigidos a escolas comunitárias, confessionais ou filantrópicas (...). § 1º Os recursos (...) poderão ser destinados a bolsas de estudo para o ensino fundamental e médio (...) quando houver falta de vagas e cursos regulares da rede pública na localidade (...).", plain: "Dinheiro público vai para escola pública ou sem fins lucrativos; bolsas só no fundamental e médio." },
    art225: { title: "Art. 225", topic: "Meio ambiente", text: "Todos têm direito ao meio ambiente ecologicamente equilibrado (...). § 1º (...) IV – exigir, na forma da lei, para instalação de obra ou atividade potencialmente causadora de significativa degradação do meio ambiente, estudo prévio de impacto ambiental (...).", plain: "Obras de impacto exigem estudo prévio. O STF barra licença automática." },
    art228: { title: "Art. 228", topic: "Maioridade penal", text: "São penalmente inimputáveis os menores de dezoito anos, sujeitos às normas da legislação especial.", plain: "Idade penal está na Constituição. Há debate se é cláusula pétrea." }
  },

  /* ------------------------------------------------------------------
     Orçamento federal 2026 (LOA) — despesa primária, valores aproximados
     ------------------------------------------------------------------ */
  budget: {
    total: 2556,
    note: "Despesa primária da União em 2026, sem transferências a estados e municípios e sem juros e rolagem da dívida. Valores aproximados em R$ bilhões.",
    items: [
      { id: "prev", label: "Previdência (INSS)", value: 1100, group: "obrig", color: "#8B1E3F" },
      { id: "pessoal", label: "Servidores ativos e inativos", value: 440, group: "obrig", color: "#B23A48" },
      { id: "bf", label: "Bolsa Família", value: 158, group: "obrig", color: "#C75D2C" },
      { id: "bpc", label: "BPC (idosos e pessoas com deficiência)", value: 122, group: "obrig", color: "#D98A2B" },
      { id: "outras", label: "Outras obrigatórias (abono, seguro-desemprego, Fundeb, pisos, precatórios…)", value: 480, group: "obrig", color: "#A1887F" },
      { id: "emendas", label: "Emendas parlamentares", value: 50, group: "livre", color: "#2563EB" },
      { id: "livre", label: "Livre para o Executivo (investimentos e custeio)", value: 206, group: "livre", color: "#0B7A4B" }
    ],
    promises: [
      { candidate: "flavio_bolsonaro", label: "Infraestrutura de R$ 900 bi em 4 anos", perYear: 225, note: "Público e privado, sem divisão informada" },
      { candidate: "renan_santos", label: "Ajuste fiscal citado (corte)", perYear: 250, note: "Economia, não gasto novo" },
      { candidate: "renan_santos", label: "Desfavelização (R$ 1,2–1,5 tri em 10 anos)", perYear: 135, note: "Média anual do próprio plano" },
      { candidate: "lula", label: "Brasil Contra o Crime Organizado", perYear: 10, note: "Valor total citado no plano" }
    ]
  },

  /* ------------------------------------------------------------------
     Indicadores (com fonte e data)
     ------------------------------------------------------------------ */
  indicators: [
    { id: "selic", label: "Taxa Selic", value: "13,75%", note: "ao ano, após 5º corte seguido", source: "Copom/BCB · 16/09/2026" },
    { id: "ipca", label: "Inflação (IPCA 12 meses)", value: "4,22%", note: "juro real perto de 9% ao ano", source: "IBGE · ago/2026" },
    { id: "dbgg", label: "Dívida bruta", value: "82,5%", note: "do PIB, em alta", source: "BCB · jul/2026" },
    { id: "rigidez", label: "Orçamento obrigatório", value: "~90%", note: "da despesa primária já tem destino fixo", source: "LOA 2026" },
    { id: "emendas", label: "Emendas parlamentares", value: "R$ 61 bi", note: "previstas; R$ 37,8 bi de execução obrigatória", source: "LOA 2026" },
    { id: "mvi", label: "Mortes violentas", value: "40.775", note: "em 2025 (−8,2%); 19,1 por 100 mil", source: "Anuário FBSP 2026" },
    { id: "letal", label: "Mortes por intervenção policial", value: "6.602", note: "em 2025, maior número desde 2016", source: "Anuário FBSP 2026" },
    { id: "pib", label: "PIB 2025", value: "R$ 12,7 tri", note: "crescimento de 2,3%", source: "IBGE · mar/2026" }
  ],

  trilemma: [
    { title: "Dívida", desc: "Com a dívida em 82,5% do PIB e juro real perto de 9%, promessas sem fonte de receita pressionam câmbio, juros e inflação." },
    { title: "Constituição", desc: "Direitos individuais, federalismo e separação de Poderes não podem ser abolidos nem por emenda. Pisos e benefícios mínimos só mudam com 3/5 do Congresso." },
    { title: "Congresso", desc: "Nenhum presidente aprova PEC sozinho: são 308 deputados e 49 senadores, num Parlamento que controla cerca de R$ 61 bi em emendas." }
  ],

  /* ------------------------------------------------------------------
     O que corrigimos na versão anterior (transparência)
     ------------------------------------------------------------------ */
  corrections: [
    { who: "Augusto Cury", kind: "Fato", was: "“Candidatura Independente / Humanista”", now: "Candidato pelo Avante, com vice Júlio Delgado. Candidatura sem partido é proibida (Art. 14, §3º, V)." },
    { who: "Todos", kind: "Metadados", was: "Lemas, coligações e vices atribuídos sem fonte (ex.: “Coligação Ordem e Liberdade”, “Frente Ampla pela Cultura da Paz”)", now: "Lemas tirados dos documentos, com página; vices conforme registro no TSE; coligação marcada como não informada quando o plano não a cita." },
    { who: "Lula", kind: "Atribuição", was: "O plano teria “intenção expressa” de rever a privatização da Eletrobras e pressionar o Banco Central", now: "Nada disso está no documento. O plano defende concessões e fala só em “redução sustentada dos juros”." },
    { who: "Lula", kind: "Fato", was: "“Federação Brasil da Esperança (PT/PCdoB/PV/PSB/PSOL/REDE)”", now: "A capa traz PT, PSB, PV, PCdoB, PDT, PSOL e Rede. A federação Brasil da Esperança é só PT, PCdoB e PV." },
    { who: "Flávio Bolsonaro", kind: "Distorção", was: "Voucher-creche “universal” para rede privada com fins lucrativos", now: "Voucher supletivo, só onde faltar vaga pública e até a vaga surgir, pago à família para a rede “credenciada”." },
    { who: "Flávio Bolsonaro", kind: "Distorção", was: "“Tesouraço na Censura” seria limitar o STF e barrar investigações", now: "O Tesouraço trata de estruturas de “Ministério da Verdade”. As mudanças no STF estão na Reforma do Judiciário (p. 65)." },
    { who: "Flávio Bolsonaro", kind: "Exagero", was: "Cumprimento integral de pena, sem progressão, para todos os crimes", now: "Fim da progressão só para crimes hediondos, o que o STF já declarou inconstitucional." },
    { who: "Ronaldo Caiado", kind: "Atribuição", was: "“Comando Nacional” subordinaria as polícias dos estados", now: "O plano prevê um conselho com governadores e cooperação federativa; não há subordinação." },
    { who: "Augusto Cury", kind: "Distorção", was: "Tele Saúde para “zerar a fila do SUS em até 50 dias”", now: "Os 50 dias são a espera atual. A meta é atendimento digital em até 30 minutos nos casos compatíveis." },
    { who: "Renan Santos", kind: "Distorção", was: "Fusão “compulsória” de municípios “por decreto”, vouchers na saúde e “tributação zero” nas ZEEs", now: "O plano diz que a consolidação “não será imposição de Brasília” e usaria PEC. Não há vouchers na saúde, e as ZEEs teriam suspensão de tributos aduaneiros e regime próprio de IBS/CBS." },
    { who: "Renan Santos", kind: "Exagero", was: "Estado de Defesa “permanente”", now: "O texto fala em “sucessivos decretos… em áreas sob comando das facções”, o que já é inconstitucional sem o exagero." },
    { who: "Indicadores", kind: "Dados", was: "Selic 10,75%, dívida 78,6% do PIB, 39,5 mil homicídios, orçamento “de R$ 5,6 tri” com 94,3% obrigatório", now: "Selic 13,75% (set/2026), dívida 82,5% (jul/2026), 40.775 mortes violentas (2025), cerca de 90% de despesa obrigatória na LOA 2026." },
    { who: "Análise jurídica", kind: "Direito", was: "Desvincular pisos “colide com jurisprudência consolidada do STF”", now: "Exige PEC, mas há precedente de mudança por emenda (EC 95/2016) que o STF não anulou." },
    { who: "Método", kind: "Método", was: "Notas de “viabilidade fiscal” com precisão falsa (62%, 54%, 38%…)", now: "Substituídas por análise qualitativa e pela escada de instrumentos jurídicos, com critério explícito." },
    { who: "Recorte", kind: "Transparência", was: "“Os 5 principais candidatos”", now: "Há 13 candidaturas registradas. O site analisa os 5 planos que estão no repositório (Romeu Zema, do Novo, por exemplo, não está incluído)." }
  ],

  glossary: [
    { term: "Cláusula pétrea", definition: "Parte da Constituição que nem emenda pode abolir (Art. 60, §4º): forma federativa, voto direto e secreto, separação dos Poderes e direitos e garantias individuais." },
    { term: "PEC (Proposta de Emenda à Constituição)", definition: "Altera o texto da Constituição. Precisa de 3/5 dos votos em dois turnos na Câmara (308 deputados) e no Senado (49 senadores). O presidente não pode vetar nem sancionar." },
    { term: "Lei complementar", definition: "Lei exigida pela Constituição para certos temas. Precisa de maioria absoluta: 257 deputados e 41 senadores." },
    { term: "Arcabouço fiscal (LC 200/2023)", definition: "Regra que substituiu o Teto de Gastos. As despesas podem crescer entre 0,6% e 2,5% acima da inflação por ano: até 70% do crescimento da receita, ou 50% se a meta de resultado for descumprida." },
    { term: "Desindexação", definition: "Desligar a correção automática de um valor, como aposentadorias, de um índice como o salário mínimo. No Brasil, o benefício mínimo do INSS e o BPC são atrelados ao mínimo pela Constituição." },
    { term: "Estado de Defesa (Art. 136)", definition: "Medida excepcional para restabelecer a ordem em locais determinados. Dura no máximo 30 dias, prorrogáveis uma vez, e precisa de aprovação do Congresso. Permite restringir apenas direitos específicos, como reunião e sigilo de comunicações." },
    { term: "GLO (Garantia da Lei e da Ordem)", definition: "Decreto que autoriza as Forças Armadas a atuar temporariamente em segurança pública quando as polícias não dão conta (LC 97/1999)." },
    { term: "Direito Penal do Inimigo", definition: "Teoria do jurista alemão Günther Jakobs segundo a qual certos criminosos perderiam o status de cidadão e seriam neutralizados sem as garantias comuns. É incompatível com as garantias do Art. 5º." },
    { term: "Individualização da pena", definition: "Garantia de que a pena e sua execução considerem o caso concreto (Art. 5º, XLVI). Por isso o STF derrubou o regime integralmente fechado para crimes hediondos." },
    { term: "Emendas impositivas", definition: "Parcela do orçamento indicada por deputados e senadores que o governo é obrigado a executar (Art. 166)." },
    { term: "Regra de Ouro (Art. 167, III)", definition: "Proíbe o governo de se endividar para pagar despesas correntes, como salários e benefícios, sem autorização especial do Congresso por maioria absoluta. Desde 2019 essa autorização é pedida todos os anos." },
    { term: "Zona Econômica Especial", definition: "Área com regras tributárias e aduaneiras próprias para atrair indústrias exportadoras. No Brasil existem as ZPEs (Lei 11.508/2007) e a Zona Franca de Manaus." }
  ],

  sources: [
    "Constituição da República Federativa do Brasil de 1988 (texto consolidado).",
    "Planos de governo registrados pelos candidatos (pasta /planos deste repositório).",
    "Banco Central do Brasil — Copom (16/09/2026) e Estatísticas Fiscais (jul/2026).",
    "IBGE — IPCA (ago/2026) e Contas Nacionais (PIB 2025).",
    "Lei Orçamentária Anual 2026 e relatórios da Consultoria de Orçamento do Congresso.",
    "Fórum Brasileiro de Segurança Pública — Anuário 2026 (dados de 2025).",
    "STF — HC 82.959, SV 26, SV 43, ADI 6808, ADI 6457, ADI 6553, ADPF 186, ADPF 854.",
    "TSE — registros de candidatura 2026."
  ]
};
