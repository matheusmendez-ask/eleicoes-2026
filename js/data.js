/**
 * Base de Dados Oficial e Analítica dos Planos de Governo - Presidência do Brasil 2026
 * Extraído diretamente dos documentos originais e confrontado com a Constituição Federal de 1988
 * e com o cenário macroeconômico nacional.
 */

const ELECTION_DATA = {
  meta: {
    year: "2026",
    title: "Raio-X Constitucional e Econômico dos Planos de Governo",
    subtitle: "Análise independente e aprofundada dos 5 principais projetos para o Brasil",
    lastUpdated: "Setembro de 2026",
    frameworks: [
      "Constituição da República Federativa do Brasil de 1988 (CF/88)",
      "Lei Complementar nº 200/2023 (Novo Arcabouço Fiscal)",
      "Lei de Responsabilidade Fiscal (LC nº 101/2000)",
      "Orçamento Geral da União (OGU)",
      "Lei das Diretrizes e Bases da Educação (Lei nº 9.394/96)"
    ]
  },

  countryContext: {
    title: "Panorama Macroeconômico e Desafios Estruturais do Brasil (2026)",
    summary: "O próximo presidente da República assumirá um país com estabilidade monetária consolidada, mas sob severo estresse fiscal, rigidez orçamentária extrema, polarização institucional e avanço de facções criminosas transnacionais.",
    indicators: [
      {
        id: "dbgg",
        label: "Dívida Bruta (DBGG / PIB)",
        value: "78,6%",
        status: "critical",
        statusText: "Zona de Alerta",
        description: "A Dívida Bruta do Governo Geral segue em trajetória de alta, limitando a capacidade de endividamento soberano e elevando o prêmio de risco exigido pelo mercado financeiro.",
        icon: "activity"
      },
      {
        id: "selic",
        label: "Taxa Básica de Juros (Selic)",
        value: "10,75% a.a.",
        status: "warning",
        statusText: "Juros Reais Elevados",
        description: "Os juros reais brasileiros continuam entre os mais altos do mundo (~6,5% real), encarecendo o custo da rolagem da dívida pública em mais de R$ 720 bilhões ao ano.",
        icon: "trending-up"
      },
      {
        id: "orcamento_rigido",
        label: "Rigidez Orçamentária",
        value: "94,3%",
        status: "critical",
        statusText: "Quase Totalmente Engessado",
        description: "Mais de 94% do Orçamento Geral da União é composto por despesas obrigatórias (Previdência, folha salarial, pisos de saúde e educação, precatórios), restando menos de 6% para investimentos livres.",
        icon: "lock"
      },
      {
        id: "emendas",
        label: "Emendas Parlamentares",
        value: "R$ 53,2 bi/ano",
        status: "warning",
        statusText: "Poder do Congresso",
        description: "O Congresso Nacional controla a maior fatia proporcional de orçamento discricionário do Ocidente por meio de emendas impositivas, restringindo a coordenação do Executivo.",
        icon: "briefcase"
      },
      {
        id: "seguranca",
        label: "Homicídios e Crime Organizado",
        value: "39.500 mortes/ano",
        status: "critical",
        statusText: "Ameaça à Soberania",
        description: "Consolidação de duas facções hegemônicas (PCC e CV) com domínio de rotas fluviais e portuárias internacionais, milícias urbanas e lavagem via criptoativos e fintechs.",
        icon: "shield-alert"
      },
      {
        id: "clima",
        label: "Vulnerabilidade Climática",
        value: "1.470+ municípios em seca/crise",
        status: "warning",
        statusText: "Risco Hídrico & Agro",
        description: "Secas severas nas bacias do Amazonas e do Pantanal geram risco de estresse energético hidrelétrico e perdas de produtividade na safra de grãos.",
        icon: "cloud-rain"
      }
    ],
    trilemma: {
      title: "O Trilema Republicano Brasileiro",
      description: "Qualquer plano de governo no Brasil precisa equilibrar três forças mutuamente tensionadas pela Constituição e pela economia política:",
      axes: [
        {
          title: "1. Rigor Fiscal e Sustentabilidade da Dívida",
          desc: "Sem equilíbrio primário, a rolagem da dívida explode, o risco-país sobe, o dólar dispara e a inflação corrói a renda dos mais pobres."
        },
        {
          title: "2. Garantias Constitucionais e Direitos Sociais",
          desc: "A CF/88 consagra pisos intransponíveis na saúde e educação, indexação salarial da previdência e cláusulas pétreas protetivas que não podem ser cortadas sem choque constitucional."
        },
        {
          title: "3. Governabilidade com o Congresso Hiperfragmentado",
          desc: "Nenhum presidente governa sem negociar com um Parlamento fortalecido, detentor de bilhões em emendas orçamentárias obrigatórias e poder de veto sobre reformas."
        }
      ]
    }
  },

  candidates: [
    {
      id: "lula",
      name: "Luiz Inácio Lula da Silva",
      shortName: "Lula",
      party: "Partido dos Trabalhadores (PT)",
      coalition: "Federação Brasil da Esperança (PT / PCdoB / PV / PSB / PSOL / REDE)",
      vice: "Geraldo Alckmin (PSB)",
      color: "#E11D48",
      accentColor: "#F43F5E",
      lightColor: "#FFE4E6",
      avatarInitials: "LS",
      documentTitle: "Programa de Governo Lula 13: Diretrizes para a Reconstrução e Transformação do Brasil",
      pdfFile: "Programa-de-Governo-LULA-13.pdf",
      totalPages: 42,
      officialMotto: "Reconstruir o Brasil com Soberania, Democracia e Inclusão Social",
      orientation: "Centro-esquerda desenvolvimentista / Social-democracia",
      
      summary: "O programa de governo da Coligação Brasil da Esperança propõe a consolidação de um projeto nacional de desenvolvimento centrado no combate à miséria, fortalecimento do mercado interno de consumo, valorização continuada do salário mínimo, e restauração do papel indutor e planejador do Estado brasileiro. O plano defende a substituição definitiva de tetos fiscais rígidos por mecanismos flexíveis e anticíclicos (o Arcabouço Fiscal), a reindustrialização orientada à transição ecológica (Nova Indústria Brasil - NIB), o fortalecimento estratégico de estatais como a Petrobras e os bancos públicos (BNDES, BB, Caixa), e uma ampla reforma tributária progressiva que 'coloque o pobre no orçamento e o rico no imposto de renda'.",

      pillars: [
        {
          title: "Combate à Fome e Proteção Social Integral",
          description: "Manutenção do Bolsa Família com adicionais por primeira infância e gestante, restauração dos estoques reguladores da Conab, ampliação do Farmácia Popular e do programa Minha Casa Minha Vida com subsídio integral à Faixa 1."
        },
        {
          title: "Nova Indústria Brasil (NIB) & Transição Ecológica",
          description: "Reindustrialização voltada à descarbonização, liderança na bioeconomia amazônica, investimentos massivos via Novo PAC e retomada dos investimentos da Petrobras em refino, fertilizantes e energias limpas."
        },
        {
          title: "Reforma Tributária sobre Renda e Consumo",
          description: "Regulamentação do IVA Dual (IBS/CBS) para desonerar a produção e a cesta básica, aliada à isenção do Imposto de Renda para rendimentos de até R$ 5.000 e tributação de lucros, dividendos e super-ricos."
        },
        {
          title: "Fortalecimento do Trabalho e dos Direitos Sociais",
          description: "Política permanente de aumento real do salário mínimo (inflação + crescimento do PIB), regulação protetiva para trabalhadores de aplicativos/plataformas digitais e fortalecimento das negociações coletivas sindicais."
        },
        {
          title: "Meio Ambiente, Clima e Soberania Global",
          description: "Desmatamento zero na Amazônia até 2030, fortalecimento dos órgãos fiscalizadores (Ibama, ICMBio, Funai), protagonismo na COP30 e reinserção ativa do Brasil nos BRICS e no Sul Global."
        }
      ],

      constitutionalLimitations: {
        headline: "Segurança jurídica de privatizações, limites fiscais do Art. 167 e autonomia do Banco Central",
        riskLevel: "Moderado a Alto",
        riskBadge: "Tensão Regulatória & Orçamentária",
        articles: [
          {
            article: "Art. 5º, XXXVI da CF/88",
            topic: "Segurança Jurídica, Ato Jurídico Perfeito e Direito Adquirido",
            quote: "A lei não prejudicará o direito adquirido, o ato jurídico perfeito e a coisa julgada.",
            impact: "A intenção expressa no plano e em declarações governamentais de rever modelos de desestatização já consolidados (como a privatização da Eletrobras e a redefinição do poder de voto da União) colide com a garantia do ato jurídico perfeito e os contratos de concessão pactuados com investidores internacionais, gerando insegurança jurídica e judicialização no STF."
          },
          {
            article: "Art. 167, III da CF/88",
            topic: "A 'Regra de Ouro' e Limite ao Endividamento para Custeio",
            quote: "É vedada a realização de operações de créditos que excedam o montante das despesas de capital, ressalvadas as autorizadas mediante créditos suplementares ou especiais com finalidade precisa.",
            impact: "O aumento contínuo de despesas correntes obrigatórias (previdência, benefícios sociais e salários) sem aumento correspondente e garantido de receitas primárias pode violar a Regra de Ouro constitucional, exigindo frequentes pedidos de exceção ao Congresso Nacional."
          },
          {
            article: "Art. 192 da CF/88 c/c LC nº 179/2021",
            topic: "Autonomia Operacional do Banco Central do Brasil",
            quote: "O sistema financeiro nacional, estruturado de forma a promover o desenvolvimento equilibrado do País (...), será regulado por leis complementares.",
            impact: "As pressões políticas do Executivo para forçar cortes acelerados da taxa Selic ou alterar a governança do Copom encontram barreira intransponível na Lei Complementar 179/2021, que fixou mandatos não coincidentes com o mandato presidencial para a diretoria do BC."
          }
        ]
      },

      economicLimitations: {
        headline: "Dívida Bruta em expansão, inflação de serviços e rigidez do Arcabouço Fiscal (LC 200/2023)",
        fiscalViability: "Média (62%)",
        metrics: [
          { label: "Impacto Primário Projetado", value: "Déficit zero difícil de sustentar sem receitas atípicas" },
          { label: "Crescimento de Despesas", value: "Travado em 2,5% a.a. acima do IPCA pelo Arcabouço" },
          { label: "Pressão sobre a DBGG", value: "Risco de alcançar 82% a 84% do PIB até 2028" }
        ],
        analysis: "A principal restrição econômica do modelo de Lula é a rigidez estrutural do gasto público combinada com a dinâmica da dívida. A política de reajuste do salário mínimo com base no PIB de dois anos anteriores impõe um crescimento vegetativo anual de dezenas de bilhões de reais na Previdência e no BPC. Como o próprio Arcabouço Fiscal criado pelo governo impõe um limite máximo de crescimento de despesas de 2,5% ao ano acima da inflação, e os pisos de saúde e educação crescem com a receita, o espaço para gastos discricionários e investimentos (PAC) encolhe a cada ano. Sem reformas estruturais nos benefícios obrigatórios, o governo depende criticamente de aumentos constantes de arrecadação e taxação, correndo risco de exaustão da carga tributária sobre o setor produtivo."
      },

      countryContextResponse: {
        diagnosis: "O plano diagnostica que o Brasil foi vítima de um desmonte institucional e social nos anos anteriores, com aumento da miséria e enfraquecimento das políticas de proteção.",
        solution: "Propõe que a recuperação da renda das famílias mais pobres atue como motor anticíclico da economia, com o Estado liderando grandes investimentos em infraestrutura e inovação verde.",
        critique: "A resposta do plano subestima o envelhecimento populacional acelerado e o peso das despesas previdenciárias sobre o Orçamento da União, apostando excessivamente no aumento contínuo da receita em um ambiente de Congresso conservador e resistente à elevação de impostos."
      }
    },

    {
      id: "flavio_bolsonaro",
      name: "Flávio Bolsonaro",
      shortName: "Flávio Bolsonaro",
      party: "Partido Liberal (PL)",
      coalition: "Coligação Ordem e Liberdade (PL / PP / Republicanos - base conservadora)",
      vice: "A definir (perfil técnico / militar ou agro)",
      color: "#2563EB",
      accentColor: "#3B82F6",
      lightColor: "#DBEAFE",
      avatarInitials: "FB",
      documentTitle: "Para o Brasil Vencer o Atraso",
      pdfFile: "FLAVIO-BOLSONARO-PARA-O-BRASIL-VENCER-O-ATRASO-1-1.pdf",
      totalPages: 76,
      officialMotto: "Ordem, Liberdade e o Brasil que Não Volta Atrás",
      orientation: "Direita conservadora / Liberal-reformista",

      summary: "O plano de governo 'Para o Brasil Vencer o Atraso' estrutura-se na visão de que a insegurança pública, o inchaço estatal e a burocracia sufocam as famílias e quem produz. Apresenta o pilar 'Brasil sem Medo', que adota medidas duras contra o narcotráfico e o crime organizado com base no modelo de penitenciárias de segurança máxima de El Salvador (Bukele), militarização de portos, aeroportos e fronteiras pelas Forças Armadas, e cumprimento integral da pena sem benefícios de progressão fácil. Na economia, propõe um choque liberal com corte de gastos ('Tesouraço nos gastos públicos'), desregulamentação agressiva via Lei de Liberdade Econômica, atração de R$ 900 bilhões em investimentos privados em 4 anos para ferrovias (Ferrogrão) e hidrovias, vouchers-creche universais para incentivar o trabalho feminino, exploração de gás não convencional (fracking) e limites institucionais à atuação da Suprema Corte ('Tesouraço na Censura').",

      pillars: [
        {
          title: "Brasil sem Medo: Modelo Bukele e Cerco Militar ao Crime",
          description: "Construção de 5 novos presídios federais de segurança máxima espelhados no modelo salvadorenho, tropas permanentes da Marinha e Aeronáutica em portos e aeroportos, Força Aérea armada nas fronteiras, fim de saidinhas e cumprimento integral de pena."
        },
        {
          title: "Brasil por Elas: Voucher-Creche Universal",
          description: "Subsídio público direto à rede privada conveniada para garantir vagas de creche em período integral a todas as crianças da primeira infância, viabilizando o ingresso e a permanência de mães no mercado de trabalho formal e informal."
        },
        {
          title: "Tesouraço na Burocracia & Choque de Desregulamentação",
          description: "Ampliação profunda da Lei de Liberdade Econômica, unificação de cadastros com Inteligência Artificial, eliminação de licenças prévias para pequenos e médios negócios e simplificação de tributos."
        },
        {
          title: "Mega-Infraestrutura e Energia Barata (R$ 900 bi)",
          description: "Destravamento imediato da Ferrovia Ferrogrão, desenvolvimento de Corredores Logísticos Inteligentes, exploração de Gás Não Convencional (fracking), redução das contas de luz via cortes na CDE e incentivo a Data Centers."
        },
        {
          title: "Pacto Federativo e Limites Institucionais aos Poderes",
          description: "'Mais Brasil, Menos Brasília', fortalecimento financeiro direto aos municípios e combate rigoroso ao ativismo judicial com estabelecimento de limites estritos à atuação do STF ('Tesouraço na Censura')."
        }
      ],

      constitutionalLimitations: {
        headline: "Direitos fundamentais dos presos (Art. 5º), pacto federativo policial e limites ao Judiciário",
        riskLevel: "Alto",
        riskBadge: "Fricção com Cláusulas Pétreas",
        articles: [
          {
            article: "Art. 5º, XLVII, 'b' e XLVI da CF/88",
            topic: "Vedação de Penas Perpétuas e Individualização da Execução Penal",
            quote: "Não haverá penas: (...) de caráter perpétuo; (...) de banimento; (...) cruéis; e a lei regulará a individualização da pena.",
            impact: "A proposta de importação do modelo penal salvadorenho com aprisionamento sem perspectiva de progressão de regime, cumprimento integral sem individualização e endurecimento drástico do isolamento fere cláusula pétrea (Art. 60, § 4º, IV) e tratados internacionais de direitos humanos (Pacto de San José da Costa Rica ratificado pelo Brasil)."
          },
          {
            article: "Art. 2º da CF/88",
            topic: "Separação e Harmonia entre os Poderes da República",
            quote: "São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.",
            impact: "Propostas de 'Tesouraço na Censura' que pretendam coibir investigações criminais da Suprema Corte ou criar mecanismos do Executivo para anular decisões judiciais ferem a separação de poderes (cláusula pétrea do Art. 60, § 4º, III)."
          },
          {
            article: "Art. 213 da CF/88",
            topic: "Destinação dos Recursos Públicos à Educação",
            quote: "Os recursos públicos serão destinados às escolas públicas, podendo ser dirigidos a escolas comunitárias, confessionais ou filantrópicas, definidas em lei, que comprovem finalidade não-lucrativa.",
            impact: "O repasse direto de vouchers-creche públicos a estabelecimentos educacionais privados com finalidade lucrativa encontra forte óbice constitucional e jurisprudencial no STF, que limita repasses públicos ao setor privado educacional apenas para entidades sem fins lucrativos."
          },
          {
            article: "Art. 225 da CF/88",
            topic: "Direito ao Meio Ambiente Equilibrado e Princípio da Precaução",
            quote: "Todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à sadia qualidade de vida (...).",
            impact: "A exploração comercial de gás de folhelho por fraturamento hidráulico (fracking) e a implantação da ferrovia Ferrogrão atravessando terras e unidades de conservação protegidas já são alvo de liminares no STF por risco de contaminação de aquíferos e violação à consulta prévia de povos indígenas (Convenção 169 da OIT)."
          }
        ]
      },

      economicLimitations: {
        headline: "Financiamento de R$ 900 bi sem aumento de imposto, custo do sistema prisional e risco ambiental",
        fiscalViability: "Média-Baixa (54%)",
        metrics: [
          { label: "Investimento em Infraestrutura Prometido", value: "R$ 900 bilhões em 4 anos (2,1% do PIB/ano)" },
          { label: "Custo Carcerário Adicional", value: "5 novos presídios federais + milhares de novas vagas" },
          { label: "Sustentabilidade da Receita", value: "Dependente de concessões privadas e corte de subsídios" }
        ],
        analysis: "Prometer um programa de R$ 900 bilhões de infraestrutura e simultaneamente propor cortes maciços de impostos e encargos do setor elétrico (CDE) cria um abismo orçamentário que as contas públicas não conseguem cobrir sozinhas. Toda a viabilidade do plano repousa sobre a atração de capital privado doméstico e internacional através de concessões e privatizações. Contudo, em um cenário de Dívida Bruta em 78% do PIB e juros globais elevados, os investidores internacionais exigem rigorosa governança ambiental (ESG) e segurança jurídica — elementos que entram em conflito com as propostas de flexibilização ambiental para fracking e aceleração de ferrovias em áreas sensíveis."
      },

      countryContextResponse: {
        diagnosis: "Identifica a criminalidade e a perda do controle territorial para o narcotráfico como o gargalo número um da economia brasileira, que paralisa o comércio e a vida das famílias.",
        solution: "Aposta na autoridade da lei, no isolamento severo das lideranças criminosas, no fortalecimento do agro e na desregulamentação para gerar empregos.",
        critique: "A proposta apoia-se em soluções penais punitivistas que historicamente sobrecarregam o sistema carcerário brasileiro sem atingir a raiz financeira do crime organizado e desconsidera os custos bilionários de manutenção contínua das Forças Armadas nas ruas e presídios federais."
      }
    },

    {
      id: "ronaldo_caiado",
      name: "Ronaldo Caiado",
      shortName: "Ronaldo Caiado",
      party: "Partido Social Democrático (PSD)",
      coalition: "Coligação Pacto pela Eficiência (PSD / União Brasil / Solidariedade - centro-conservador)",
      vice: "Gilberto Kassab (PSD)",
      color: "#0284C7",
      accentColor: "#0EA5E9",
      lightColor: "#E0F2FE",
      avatarInitials: "RC",
      documentTitle: "Plano de Governo Ronaldo Caiado Presidente: Muito pra mostrar, nada pra esconder (2027 a 2030)",
      pdfFile: "Plano-de-Governo-Ronaldo-Caiado-Presidente.pdf",
      totalPages: 100,
      officialMotto: "Autoridade, Pacificação Democrática e o Estado Eficiente",
      orientation: "Centro-direita institucional / Conservadorismo fiscal e de autoridade",

      summary: "Com uma das trajetórias mais sólidas da política nacional (médico, produtor rural, deputado, senador e governador reeleito de Goiás com recordes de aprovação), Ronaldo Caiado apresenta um plano robusto de 100 páginas dividido em 26 temas estratégicos, tendo Gilberto Kassab como vice. O documento propõe nacionalizar a bem-sucedida política de segurança pública de Goiás com tolerância zero, criação do Sistema Integrado de Proteção à Soberania Nacional, enquadramento de facções como 'terrorismo doméstico' e confisco massivo de patrimônio e criptoativos criminosos para custear a polícia. No campo fiscal, propõe estabilização plurianual responsável, impedindo o crescimento de despesas correntes acima do PIB potencial sem cortes cegos em serviços essenciais, auditoria severa contra fraudes em benefícios sociais, reordenamento transparente das emendas parlamentares com o Congresso, e agregação de valor ao Agronegócio e à Mineração Estratégica.",

      pillars: [
        {
          title: "Segurança de Tolerância Zero & Combate ao Terrorismo Doméstico",
          description: "Criação do Sistema Integrado de Proteção à Soberania Nacional, Comando Nacional de Combate ao Terrorismo Doméstico (enquadramento penal de facções), asfixia patrimonial do crime e criação de fundo policial alimentado por bens confiscados."
        },
        {
          title: "Estabilização Fiscal Plurianual e Controle das Despesas",
          description: "Travar o crescimento das despesas obrigatórias abaixo da capacidade do PIB, contenção de criação de novos gastos de pessoal sem compensação permanente, auditoria eletrônica contra fraudes nos benefícios sociais e estabilização da Dívida/PIB."
        },
        {
          title: "Reforma Política e Governança por Competência (Tema 3)",
          description: "Superação da fragmentação partidária e do fisiologismo no Congresso; imposição de critérios técnicos de integridade e capacidade para ministros e dirigentes de estatais, regidos por contratos de gestão e metas objetivas."
        },
        {
          title: "Agronegócio Integrado e Mineração Estratégica (Temas 7 e 17)",
          description: "Superação do modelo de exportação exclusiva de grãos brutos em direção à agroindústria sustentável; fundo garantidor privado de crédito agrícola, seguro rural acessível e soberania nacional em fertilizantes e terras raras."
        },
        {
          title: "Saúde Regionalizada e SUS Inteligente (Tema 25)",
          description: "Fila única transparente, combate à espera de especialistas por meio de policlínicas estaduais descentralizadas, atenção primária integrada e triagem inteligente para zerar filas cirúrgicas."
        }
      ],

      constitutionalLimitations: {
        headline: "Tipificação de terrorismo doméstico, impositividade das emendas (Art. 166) e autonomia federativa",
        riskLevel: "Moderado",
        riskBadge: "Tensão Federativa & Penal",
        articles: [
          {
            article: "Art. 5º, XLIII da CF/88 c/c Lei nº 13.260/2016",
            topic: "Mandado de Criminalização do Terrorismo e Princípio da Tipicidade Estrita",
            quote: "A lei considerará crimes inafiançáveis e insuscetíveis de graça ou anistia a prática da tortura, o tráfico ilícito de entorpecentes e drogas afins, o terrorismo e os definidos como crimes hediondos (...).",
            impact: "A Lei Antiterrorismo brasileira exige elemento subjetivo específico (motivação de xenofobia, discriminação ou preconceito de raça, cor, etnia ou religião). Enquadrar facções que buscam lucro financeiro como terroristas domésticos exige alteração legislativa delicada no Congresso e pode sofrer impugnação no STF por desvio de tipicidade penal."
          },
          {
            article: "Art. 166, §§ 9º ao 19 da CF/88",
            topic: "Impositividade Constitucional das Emendas Parlamentares",
            quote: "As emendas individuais ao projeto de lei orçamentária serão aprovadas no limite de 2% da receita corrente líquida (...), sendo a execução orçamentária e financeira obrigatória.",
            impact: "A proposta de Caiado de 'reordenar as emendas parlamentares pactuando critérios técnicos com o Congresso' esbarra na impositividade constitucional forjada pelas Emendas Constitucionais 86, 100 e 105, que retiraram o controle discricionário do Presidente da República sobre esses recursos."
          },
          {
            article: "Art. 144 da CF/88",
            topic: "Autonomia Federativa das Polícias dos Estados",
            quote: "A segurança pública, dever do Estado, direito e responsabilidade de todos, é exercida para a preservação da ordem pública e da incolumidade das pessoas e do patrimônio, através dos seguintes órgãos: (...) polícias civis e polícias militares.",
            impact: "A centralização da segurança em um 'Comando Nacional' federal não pode subordinar hierarquicamente os governadores de estado e suas corporações policiais sem ferir a autonomia dos entes federados (cláusula pétrea do pacto federativo, Art. 60, § 4º, I)."
          }
        ]
      },

      economicLimitations: {
        headline: "Indexação da previdência, equalização de juros no crédito rural e rigidez do OGU",
        fiscalViability: "Alta-Média (74%)",
        metrics: [
          { label: "Estratégia Fiscal", value: "Contenção de despesas obrigatórias sem corte cego" },
          { label: "Custo do Plano Safra", value: "Exige dezenas de bi em equalização com Selic em 10,75%" },
          { label: "Capacidade de Investimento", value: "Depende de alavancagem com fundos privados garantidores" }
        ],
        analysis: "Dentre os candidatos, Caiado apresenta uma das estratégias de gestão fiscal mais experimentadas (já tendo recuperado a capacidade de pagamento do estado de Goiás e aderido ao Regime de Recuperação Fiscal com sucesso). Contudo, no plano federal, impedir o crescimento vegetativo de despesas obrigatórias esbarra no fato de que aposentadorias e o BPC estão amarrados ao salário mínimo pela própria Constituição. Além disso, o setor agropecuário exige subsídios bilionários do Tesouro Nacional para a equalização de juros do Plano Safra; em um ambiente de Selic a 10,75%, o custo fiscal do crédito agrícola atinge patamares recordes, disputando espaço com os investimentos em ferrovias e saneamento."
      },

      countryContextResponse: {
        diagnosis: "Diagnostica que o Brasil é refém de uma polarização infantilizante e da fraqueza do Estado perante o crime organizado e os interesses corporativos no Congresso.",
        solution: "Propõe pacificação pragmática por meio da autoridade moral, segurança com pulso firme e gestão técnica de coalizão profissional (articulada com a habilidade partidária de Gilberto Kassab).",
        critique: "A governabilidade dependerá de acomodar o apetite do chamado 'Centrão', que comanda o PSD e partidos aliados, colocando à prova a promessa de gestão técnica e contratos de resultados contra indicações meramente políticas."
      }
    },

    {
      id: "augusto_cury",
      name: "Augusto Cury",
      shortName: "Augusto Cury",
      party: "Candidatura Independente / Humanista",
      coalition: "Frente Ampla pela Cultura da Paz e Saúde Emocional",
      vice: "A definir (perfil educacional / científico)",
      color: "#8B5CF6",
      accentColor: "#A855F7",
      lightColor: "#F3E8FF",
      avatarInitials: "AC",
      documentTitle: "Plano de Governo Augusto Cury 2026: Cultura da Paz em uma Sociedade Polarizada e Adoecida",
      pdfFile: "Plano_gov_Augusto_Cury_2026.pdf",
      totalPages: 200,
      officialMotto: "Educar a Emoção, Pacificar a Sociedade, Libertar o Empreendedorismo",
      orientation: "Humanismo centrista / Desenvolvimentismo socioemocional e preventivo",

      summary: "Com um dos documentos mais extensos e detalhados da eleição (200 páginas e 18 grandes projetos de Estado), o médico psiquiatra, professor e escritor mais lido do Brasil, Augusto Cury, traz uma visão revolucionária e heterodoxa para a Presidência da República. Seu plano parte da tese central de que 'o Brasil não está dividido em dois barcos (direita x esquerda), mas em uma sociedade adoecida emocionalmente pela polarização'. Suas propostas prioritárias incluem: 'A Revolução da Educação' com tempo integral e desenvolvimento de pensadores críticos; o 'Brasil Neuroinclusivo' (acolhimento a autistas, TDAH, disléxicos); a criação de uma Secretaria/Ministério do Empreendedorismo para fomentar 10 milhões de microempresas contra a epidemia de desemprego da IA; o 'Brasil Oásis' para revitalizar o Semiárido de 31 milhões de pessoas; a maior rede de telemedicina pública do mundo no SUS ('Tele Saúde Brasil'); e o projeto 'FATO - Força de Alerta Total' para segurança 4.0 preventiva.",

      pillars: [
        {
          title: "Cultura da Paz e Pacificação da Mente Social",
          description: "Superação da histeria e polarização política destrutiva através do ensino obrigatório de Gestão da Emoção, mediação pacífica de conflitos nas escolas e órgãos públicos, e pacificação institucional."
        },
        {
          title: "Revolução da Educação & Brasil Neuroinclusivo (Projetos 1 e 2)",
          description: "Escola de tempo integral voltada a formar pensadores e não repetidores de dados; política nacional de inclusão ativa para estudantes com TEA (autismo), TDAH, dislexia e altas habilidades."
        },
        {
          title: "10 Milhões de Microempresas contra o Desemprego da IA (Projetos 4 e 5)",
          description: "Criação do Ministério/Secretaria da Economia Distribuída para financiar e apoiar 10 milhões de pequenos negócios, prevenindo a crise de automação e substituição de postos por robótica e IA."
        },
        {
          title: "Brasil Oásis & BEE nas Estradas (Projetos 6 e 7)",
          description: "Transformação do Semiárido brasileiro (1.477 municípios) em fronteira tecnológica agroecológica e exportadora de frutas; conversão da malha rodoviária em polos turísticos e comerciais dinâmicos."
        },
        {
          title: "Tele Saúde Brasil & Segurança Preventiva FATO (Projetos 13 e 18)",
          description: "Criação da maior plataforma pública de telemedicina do planeta para zerar a fila de consultas especializadas do SUS em até 50 dias; Sistema FATO (Segurança 4.0) com IA e cooperação policial integrada."
        }
      ],

      constitutionalLimitations: {
        headline: "Autonomia pedagógica (Art. 206), criação de ministérios (Art. 61) e integridade do SUS",
        riskLevel: "Baixo a Moderado",
        riskBadge: "Tensão Regulatória & LRF",
        articles: [
          {
            article: "Art. 206, II e III da CF/88 c/c LDB (Lei nº 9.394/96)",
            topic: "Liberdade de Aprender e Pluralismo de Ideias Pedagógicas",
            quote: "O ensino será ministrado com base nos seguintes princípios: (...) liberdade de aprender, ensinar, pesquisar e divulgar o pensamento, a arte e o saber; pluralismo de idéias e de concepções pedagógicas.",
            impact: "A imposição pelo governo federal de metodologias uniformes de inteligência socioemocional ou gestão da mente nas grades curriculares de todas as redes municipais e estaduais pode sofrer questionamentos por ferir a autonomia pedagógica das escolas e a competência concorrente de estados e municípios (Art. 24, IX e Art. 211)."
          },
          {
            article: "Art. 61, § 1º, II, 'e' e Art. 169 da CF/88",
            topic: "Criação de Ministérios e Limites com Despesa de Pessoal",
            quote: "São de iniciativa privativa do Presidente da República as leis que disponham sobre: (...) criação e extinção de Ministérios e órgãos da administração pública (...). A despesa com pessoal ativo e inativo da União (...) não poderá exceder os limites estabelecidos em lei complementar.",
            impact: "A proliferação de novas secretarias, novos ministérios (Empreendedorismo) e agências executivas para gerir os 18 projetos esbarra nas restrições de criação de despesas correntes de pessoal da Lei de Responsabilidade Fiscal e exige prévia autorização orçamentária na LDO e LOA."
          },
          {
            article: "Art. 196 e Art. 199 da CF/88",
            topic: "Universalidade da Saúde Pública e Complementariedade Privada",
            quote: "A saúde é direito de todos e dever do Estado (...). A assistência à saúde é livre à iniciativa privada. As instituições privadas poderão participar de forma complementar do SUS (...).",
            impact: "A migração em larga escala do atendimento especializado do SUS para a 'Tele Saúde' requer garantir a integralidade do cuidado médico e a soberania dos prontuários eletrônicos de saúde, respeitando a LGPD e evitando a privatização velada de dados clínicos dos cidadãos."
          }
        ]
      },

      economicLimitations: {
        headline: "Meta de déficit zero vs financiamento dos 18 megaprojetos e viabilidade legislativa",
        fiscalViability: "Média (60%)",
        metrics: [
          { label: "Meta Fiscal Declarada", value: "Déficit público próximo de zero sem choques brutais" },
          { label: "Impacto Financeiro Previsto", value: "Crédito a 10 milhões de microempresas + obras hídricas" },
          { label: "Dependência Política", value: "Exige aprovação de dotações orçamentárias pelo Congresso" }
        ],
        analysis: "O plano de Augusto Cury é visionário ao antecipar os impactos da Inteligência Artificial sobre o mercado de trabalho e ao reconhecer a saúde mental como fator crítico de produtividade do país. Economicamente, contudo, há um descompasso entre a meta austera de 'déficit público próximo de zero' e o custo bilionário de implantar escolas em tempo integral em todo o país, estruturar obras hídricas nos 1.477 municípios do Semiárido ('Brasil Oásis') e subsidiar crédito para 10 milhões de pequenos negócios. Como o plano não especifica cortes em áreas sensíveis como a Previdência ou a folha salarial dos Três Poderes, seus programas dependeriam da boa vontade do Congresso na realocação de emendas ou de complexas parcerias público-privadas (PPPs)."
      },

      countryContextResponse: {
        diagnosis: "Diagnostica o Brasil como um país doente emocionalmente, com índices alarmantes de ansiedade, depressão e desesperança entre jovens e educadores, exacerbados pelo ódio nas redes sociais e pela iminência do desemprego tecnológico.",
        solution: "Aposta no desenvolvimento do capital humano, na inclusão neurodivergente, na gestão socioemocional e no microempreendedorismo cooperativo como antídoto para a revolução digital.",
        critique: "Apesar de extremamente sensível às dores humanas reais da população, a tese carece de pragmatismo político tradicional para negociar com um Parlamento fisiológico que costuma exigir contrapartidas orçamentárias imediatas e cargos em troca de apoio."
      }
    },

    {
      id: "renan_santos",
      name: "Renan Santos",
      shortName: "Renan Santos",
      party: "Partido Missão (MBL)",
      coalition: "Candidatura Própria / Movimento Brasil Livre (MBL)",
      vice: "A definir (quadro técnico / liderança jovem)",
      color: "#FACC15",
      accentColor: "#EAB308",
      lightColor: "#FEF9C3",
      avatarInitials: "RS",
      documentTitle: "Livro Amarelo - Missão 2026: O Futuro é Glorioso (Resumo Executivo do Plano de 500 págs.)",
      pdfFile: "proposta-missao-renan-santos.pdf",
      totalPages: 51,
      officialMotto: "Sepultar a Nova República e Refundar a Potência Nacional",
      orientation: "Nacional-liberal radical / Desenvolvimentismo de choque e ordem",

      summary: "O Partido Missão entrega uma proposta que se declara o primeiro 'livro como plano de governo' da história brasileira (resumo de uma obra de mais de 500 páginas). O plano diagnostica a falência absoluta do arranjo da Nova República instaurada pela CF/88 e propõe medidas de choque radical: no campo fiscal, um corte de R$ 250 bilhões anuais ('Um Remédio Amargo') com desindexação da previdência do salário mínimo e desvinculação obrigatória dos pisos de saúde e educação (PEC do Equilíbrio Fiscal); na segurança, a aplicação imediata do 'Direito Penal do Inimigo' (Günther Jakobs) com decretação sucessiva de Estado de Defesa (Art. 136) para suspender garantias de faccionados ('Prendeu, Matou?'); no pacto federativo, a 'Grande Consolidação Municipal', fundindo compulsoriamente milhares de prefeituras inviáveis; e na economia, a implantação de Zonas Econômicas Especiais (ZEE) no Nordeste e Norte (modelo chinês/Shenzhen) com reindustrialização acelerada.",

      pillars: [
        {
          title: "Ajuste Fiscal de R$ 250 Bilhões ('Um Remédio Amargo')",
          description: "PEC de Transição do Equilíbrio Fiscal no dia 1: desindexação dos benefícios previdenciários e do BPC do salário mínimo (corrigidos apenas pelo IPCA), desvinculação dos pisos constitucionais de saúde e educação, e reforma administrativa."
        },
        {
          title: "Direito Penal do Inimigo & Estado de Defesa Permanente ('Prendeu, Matou?')",
          description: "Declaração de Guerra Aberta ao Crime no dia 1; aplicação da doutrina de Jakobs com suspensão de garantias processuais para facções; uso contínuo de decretos de Estado de Defesa (Art. 136), intervenções federais e GLO pesada."
        },
        {
          title: "A Grande Consolidação Municipal & Pacto Federativo",
          description: "Reorganização territorial drástica: fusão forçada de milhares de municípios fiscalmente inviáveis em unidades com escala econômica sustentável; revisão da bancada parlamentar desproporcional do Norte e Nordeste no Congresso."
        },
        {
          title: "Zonas Econômicas Especiais (ZEE) & Reindustrialização (Missão Rondon)",
          description: "Criação de enclaves de liberdade econômica e tributação zero para indústrias de exportação de alta tecnologia no Nordeste e Norte (modelo Shenzhen); retomada dos investimentos em infraestrutura pesada."
        },
        {
          title: "SUS Fila Zero & Formação de Elites ('Chega de Saudade')",
          description: "Adoção de vouchers na saúde privada e gestão corporativa do SUS; formação meritocrática de novas elites científicas, estéticas e estatais, sepultando o corporativismo burocrático da Nova República."
        }
      ],

      constitutionalLimitations: {
        headline: "Violação frontal de cláusulas pétreas (Art. 60), Estado de Defesa contínuo (Art. 136) e fusão municipal (Art. 18)",
        riskLevel: "Crítico / Extremo",
        riskBadge: "Inconstitucionalidade Flagrante",
        articles: [
          {
            article: "Art. 60, § 4º, IV c/c Art. 5º da CF/88",
            topic: "Cláusula Pétrea dos Direitos e Garantias Individuais e Devido Processo",
            quote: "Não será objeto de deliberação a proposta de emenda tendente a abolir: (...) os direitos e garantias individuais. Ninguém será privado da liberdade ou de seus bens sem o devido processo legal (Art. 5º, LIV).",
            impact: "A formalização do 'Direito Penal do Inimigo' (que trata investigados como inimigos desprovidos de direitos de cidadão) e a suspensão permanente de garantias individuais violam o núcleo intangível da Constituição Federal de 1988. Nem mesmo por Emenda Constitucional tais garantias podem ser abolidas, sendo fatalmente declaradas nulas pelo STF."
          },
          {
            article: "Art. 136, § 2º da CF/88",
            topic: "Limites Temporais e Materiais do Estado de Defesa",
            quote: "O tempo de duração do estado de defesa não será superior a trinta dias, podendo ser prorrogado uma vez, por igual período, se persistirem as razões que justificaram a sua decretação.",
            impact: "A proposta explícita do Livro Amarelo de governar por 'sucessivos decretos de Estado de Defesa' para combater o crime comum deturpa a natureza excepcional de crise institucional da medida, caracterizando desvio de finalidade e infração político-constitucional passível de impeachment (Art. 85 da CF/88)."
          },
          {
            article: "Art. 198, § 2º e Art. 212 da CF/88",
            topic: "Pisos Constitucionais Vinculados de Saúde e Educação",
            quote: "A União aplicará, anualmente, nunca menos de dezoito (...) por cento da receita resultante de impostos na manutenção e desenvolvimento do ensino. A União destinará (...) no mínimo 15% da receita corrente líquida em ações e serviços públicos de saúde.",
            impact: "A desvinculação completa dos pisos da saúde e educação, além de exigir quórum de 3/5 em dois turnos na Câmara e no Senado, colide com a jurisprudência consolidada do STF sobre a vedação ao retrocesso social (proibição de desmonte de direitos prestacionais fundamentais)."
          },
          {
            article: "Art. 18, § 4º da CF/88",
            topic: "Requisitos Constitucionais Rígidos para Fusão de Municípios",
            quote: "A criação, a incorporação, a fusão e o desmembramento de Municípios, far-se-ão por lei estadual, dentro do período determinado por Lei Complementar Federal, e dependerão de consulta prévia, mediante plebiscito, às populações dos Municípios envolvidos (...).",
            impact: "O governo federal não tem poder para fundir municípios por decreto ou lei ordinária própria. A Constituição exige Lei Complementar do Congresso, Estudos de Viabilidade Municipal e aprovação obrigatória por plebiscito pelas populações locais de cada município afetado."
          }
        ]
      },

      economicLimitations: {
        headline: "Choque recessivo por contração súbita de R$ 250 bi, colapso de economias locais e risco soberano",
        fiscalViability: "Baixa (38%)",
        metrics: [
          { label: "Corte Fiscal Pretendido", value: "R$ 250 bilhões anuais (2,3% do PIB)" },
          { label: "Impacto em Cidades Pequenas", value: "70% dos municípios dependem do FPM e de aposentadorias do INSS" },
          { label: "Risco de Mercado (CDS)", value: "Instabilidade institucional extrema pode disparar fuga de capitais" }
        ],
        analysis: "Embora um ajuste fiscal de R$ 250 bilhões atendesse com folga aos anseios de sustentabilidade da dívida pública, sua execução em um único mandato via corte de reajustes reais de aposentadorias e do BPC causaria um violento choque recessivo keynesiano no consumo das famílias. No Brasil profundo, em mais de 3.000 cidades pequenas, a economia do comércio e dos serviços sobrevive quase exclusivamente da injeção mensal de benefícios da previdência básica e do funcionalismo. Cortar abruptamente essa circulação de renda provocaria colapso fiscal nas pequenas cidades antes que as indústrias das Zonas Econômicas Especiais (que demoram anos para maturar) pudessem gerar empregos compensatórios. Além disso, medidas de exceção jurídica e Estados de Defesa contínuos afugentam investidores globais que temem insegurança institucional."
      },

      countryContextResponse: {
        diagnosis: "Diagnostica que a 'Nova República' de 1988 faliu moral, jurídica e economicamente, tendo gerado uma cleptocracia sustentada pelo loteamento partidário e um Estado leniente com facções criminosas.",
        solution: "Propõe uma refundação nacional inspirada no salto industrial do nacional-desenvolvimentismo (Vargas 2.0), combinada com choque de capitalismo desregulamentado e mão de ferro sem trégua contra o crime.",
        critique: "A proposta depende da destruição ou neutralização das instituições vigentes (Congresso, governadores e STF), demandando uma concentração quase ditatorial de poderes que é inteiramente rejeitada pela ordem democrática brasileira e pela comunidade internacional."
      }
    }
  ],

  constitutionalRadarArticles: [
    {
      articleId: "art5",
      title: "Artigo 5º da CF/88",
      topic: "Direitos e Garantias Fundamentais & Cláusulas Pétreas",
      status: "critical",
      summary: "Consagra o devido processo legal, presunção de inocência, vedação a penas perpétuas e integridade física dos presos. É cláusula pétrea (Art. 60, § 4º, IV).",
      fullText: "Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes: (...) XLVI - a lei regulará a individualização da pena (...); XLVII - não haverá penas: a) de morte, salvo em caso de guerra declarada (...); b) de caráter perpétuo; c) de trabalhos forçados; d) de banimento; e) cruéis; LIV - ninguém será privado da liberdade ou de seus bens sem o devido processo legal; LVII - ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.",
      affectedCandidates: [
        {
          id: "renan_santos",
          candidateName: "Renan Santos",
          friction: "Violação do Devido Processo e Direitos Fundamentais ao propor o 'Direito Penal do Inimigo' (Günther Jakobs), suspendendo garantias constitucionais de membros de facções."
        },
        {
          id: "flavio_bolsonaro",
          candidateName: "Flávio Bolsonaro",
          friction: "Adoção do modelo salvadorenho de encarceramento estrito sem progressão ou individualização, beirando a pena cruel e desproporcional."
        },
        {
          id: "ronaldo_caiado",
          candidateName: "Ronaldo Caiado",
          friction: "Enquadramento penal amplo de facções como 'terrorismo doméstico' e confisco sumário prévio de ativos e criptoativos antes do trânsito em julgado."
        }
      ]
    },

    {
      articleId: "art136",
      title: "Artigo 136 da CF/88",
      topic: "Estado de Defesa e Limites do Estado de Exceção",
      status: "critical",
      summary: "Delimita taxativamente o Estado de Defesa a no máximo 30 dias (prorrogável uma única vez) e apenas em casos gravíssimos de calamidade ou comoção institucional.",
      fullText: "O Presidente da República pode, ouvidos o Conselho da República e o Conselho de Defesa Nacional, decretar estado de defesa na vigência do qual podem ser restritos direitos como sigilo de correspondência e de comunicação e liberdade de reunião (...). § 2º O tempo de duração do estado de defesa não será superior a trinta dias, podendo ser prorrogado uma vez, por igual período, se persistirem as razões que justificaram a sua decretação.",
      affectedCandidates: [
        {
          id: "renan_santos",
          candidateName: "Renan Santos",
          friction: "Proposta explícita de sucessivos decretos contínuos de Estado de Defesa para combater o crime organizado comum, violando o prazo máximo improrrogável de 60 dias totais da CF/88."
        }
      ]
    },

    {
      articleId: "art18",
      title: "Artigo 18, § 4º da CF/88",
      topic: "Requisitos Constitucionais para Fusão e Criação de Municípios",
      status: "high",
      summary: "Exige Lei Complementar Federal, Estudos de Viabilidade Municipal e plebiscito prévio com voto obrigatório das populações locais.",
      fullText: "A criação, a incorporação, a fusão e o desmembramento de Municípios, far-se-ão por lei estadual, dentro do período determinado por Lei Complementar Federal, e dependerão de consulta prévia, mediante plebiscito, às populações dos Municípios envolvidos, após divulgação dos Estudos de Viabilidade Municipal, apresentados e publicados na forma da lei.",
      affectedCandidates: [
        {
          id: "renan_santos",
          candidateName: "Renan Santos",
          friction: "A 'Grande Consolidação Municipal' pretende fundir de forma compulsória milhares de prefeituras inviáveis, o que esbarra na exigência indeclinável de plebiscitos locais e leis estaduais."
        }
      ]
    },

    {
      articleId: "art198_212",
      title: "Artigos 198 e 212 da CF/88",
      topic: "Pisos Constitucionais Obrigatórios da Saúde e da Educação",
      status: "high",
      summary: "Fixam que percentuais mínimos das receitas tributárias líquidas da União (15% da RCL em saúde e 18% de impostos em educação) devem ser obrigatoriamente aplicados nessas pastas.",
      fullText: "Art. 198, § 2º A União, os Estados, o Distrito Federal e os Municípios aplicarão, anualmente, em ações e serviços públicos de saúde recursos mínimos derivados da aplicação de percentuais calculados sobre (...) a receita corrente líquida. Art. 212 A União aplicará, anualmente, nunca menos de dezoito, e os Estados, o Distrito Federal e os Municípios vinte e cinco por cento, no mínimo, da receita resultante de impostos, compreendida a proveniente de transferências, na manutenção e desenvolvimento do ensino.",
      affectedCandidates: [
        {
          id: "renan_santos",
          candidateName: "Renan Santos",
          friction: "Proposta de desvinculação completa dos pisos para economizar dezenas de bilhões; esbarra no princípio da vedação do retrocesso social e na cláusula de direitos sociais fundamentais."
        },
        {
          id: "lula",
          candidateName: "Lula",
          friction: "O crescimento rígido dos pisos constitucionais sob as regras vigentes consome todo o espaço do Arcabouço Fiscal, forçando o aperto orçamentário em investimentos e manutenção de ministérios."
        },
        {
          id: "ronaldo_caiado",
          candidateName: "Ronaldo Caiado",
          friction: "Tentativa de conter o crescimento vegetativo de despesas obrigatórias sem mexer nos pisos cria estrangulamento imediato nas despesas correntes da União."
        }
      ]
    },

    {
      articleId: "art166",
      title: "Artigo 166 da CF/88",
      topic: "Impositividade das Emendas Parlamentares e Poder Orçamentário do Congresso",
      status: "medium",
      summary: "Determina que as emendas parlamentares individuais e de bancada possuem execução financeira compulsória e vinculante pelo Executivo.",
      fullText: "Art. 166, § 9º As emendas individuais ao projeto de lei orçamentária serão aprovadas no limite de 2% (dois por cento) da receita corrente líquida do exercício anterior (...), sendo a execução orçamentária e financeira da despesa obrigatória e de forma equitativa.",
      affectedCandidates: [
        {
          id: "ronaldo_caiado",
          candidateName: "Ronaldo Caiado",
          friction: "A promessa de 'reordenar emendas parlamentares por critérios técnicos de planejamento' depende do aval do próprio Congresso, que dificilmente abrirá mão de seu poder impositivo constitucional."
        },
        {
          id: "lula",
          candidateName: "Lula",
          friction: "A impositividade das emendas drena de R$ 40 a R$ 53 bilhões anuais que o governo planejava destinar prioritariamente a obras estratégicas do Novo PAC."
        }
      ]
    },

    {
      articleId: "art173_213",
      title: "Artigos 173 e 213 da CF/88",
      topic: "Intervenção do Estado na Economia & Destinação de Verbas à Educação Privada",
      status: "medium",
      summary: "Regulam os limites da exploração direta da atividade econômica pelo Estado e restringem repasses de recursos públicos à iniciativa privada educacional.",
      fullText: "Art. 173 Ressalvados os casos previstos nesta Constituição, a exploração direta de atividade econômica pelo Estado só será permitida quando necessária aos imperativos da segurança nacional ou a relevante interesse coletivo (...). Art. 213 Os recursos públicos serão destinados às escolas públicas, podendo ser dirigidos a escolas comunitárias, confessionais ou filantrópicas (...).",
      affectedCandidates: [
        {
          id: "flavio_bolsonaro",
          candidateName: "Flávio Bolsonaro",
          friction: "A entrega generalizada de 'vouchers-creche' para instituições privadas comerciais lucrativas viola a destinação preferencial da verba pública às escolas públicas do Art. 213."
        },
        {
          id: "lula",
          candidateName: "Lula",
          friction: "A utilização de empresas estatais (Petrobras, bancos públicos) para subsidiar preços e intervir diretamente em mercados privados colide com as regras concorrenciais do Art. 173 e a Lei das Estatais (Lei 13.303/16)."
        }
      ]
    },

    {
      articleId: "art2",
      title: "Artigo 2º da CF/88",
      topic: "Separação e Harmonia entre os Poderes da República",
      status: "high",
      summary: "Institui a independência e harmonia dos Três Poderes, consagrado como cláusula pétrea no Art. 60, § 4º, III.",
      fullText: "São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.",
      affectedCandidates: [
        {
          id: "flavio_bolsonaro",
          candidateName: "Flávio Bolsonaro",
          friction: "Medidas destinadas a intervir em decisões do STF ou barrar investigações criminais de corte superior sob a bandeira de 'Tesouraço na Censura' ameaçam a harmonia e independência do Judiciário."
        },
        {
          id: "renan_santos",
          candidateName: "Renan Santos",
          friction: "O enfrentamento aberto à estrutura dos poderes e a intenção de subverter a Nova República e o Congresso afrontam diretamente o pacto de 1988."
        }
      ]
    }
  ],

  budgetBreakdown: {
    totalEstimatedBudget: "R$ 5,6 Trilhões",
    mandatoryPercentage: 94.3,
    discretionaryPercentage: 5.7,
    mandatoryItems: [
      { label: "Previdência Social (INSS e Servidores)", value: "R$ 985 bi", percent: 42.5 },
      { label: "Pessoal e Encargos da União (Folha)", value: "R$ 380 bi", percent: 16.4 },
      { label: "Pisos Constitucionais de Saúde e Educação", value: "R$ 310 bi", percent: 13.3 },
      { label: "Benefícios Assistenciais (BPC / Bolsa Família)", value: "R$ 260 bi", percent: 11.2 },
      { label: "Precatórios e Sentenças Judiciais", value: "R$ 105 bi", percent: 4.5 },
      { label: "Emendas Parlamentares Impositivas", value: "R$ 53 bi", percent: 2.3 },
      { label: "Outras Despesas Obrigatórias por Lei", value: "R$ 95 bi", percent: 4.1 }
    ],
    discretionaryItems: [
      { label: "Investimentos em Infraestrutura, Obras e PAC", value: "R$ 68 bi", percent: 52.3 },
      { label: "Custeio Administrativo, Universidades e Defesa", value: "R$ 62 bi", percent: 47.7 }
    ]
  },

  glossary: [
    {
      term: "Cláusula Pétrea (Art. 60, § 4º da CF/88)",
      definition: "Dispositivo constitucional imutável que não pode ser abolido ou restringido nem mesmo por Emenda Constitucional aprovada pelo Congresso. Inclui o federalismo, o voto direto, secreto e periódico, a separação dos poderes e os direitos e garantias individuais."
    },
    {
      term: "Direito Penal do Inimigo (DPI)",
      definition: "Teoria penal formulada pelo jurista alemão Günther Jakobs, que defende tratar certos indivíduos (como terroristas e membros de facções extremas) não como cidadãos portadores de direitos processuais, mas como 'inimigos' do Estado que devem ser neutralizados preventivamente sem garantias normais. É amplamente considerada inconstitucional no ordenamento brasileiro."
    },
    {
      term: "Arcabouço Fiscal (Lei Complementar nº 200/2023)",
      definition: "Regra fiscal que substituiu o Teto de Gastos no governo Lula. Limita o crescimento real da despesa pública entre 0,6% e 2,5% ao ano acima da inflação, vinculado ao desempenho da arrecadação de receitas (70% do crescimento das receitas em caso de cumprimento de meta, ou 50% em caso de descumprimento)."
    },
    {
      term: "Desindexação Orçamentária",
      definition: "Processo de retirar a vinculação automática de benefícios sociais, aposentadorias ou tributos a índices como o salário mínimo. No Brasil, se o salário mínimo sobe com ganho real, todas as aposentadorias do INSS de piso sobem automaticamente, gerando um efeito dominó de bilhões de reais nas contas públicas."
    },
    {
      term: "Estado de Defesa (Art. 136 da CF/88)",
      definition: "Medida de exceção decretada pelo Presidente da República para preservar ou restabelecer a ordem pública ou a paz social ameaçadas por grave e iminente instabilidade institucional ou calamidades naturais de grandes proporções. Tem prazo constitucional rígido máximo de 30 dias prorrogável uma única vez."
    },
    {
      term: "Emendas Impositivas (Art. 166 da CF/88)",
      definition: "Parcela do Orçamento Geral da União indicada diretamente por deputados e senadores cuja execução financeira é mandatória e obrigatória pelo Executivo, sem possibilidade de cancelamento discricionário pelo Presidente da República."
    },
    {
      term: "Zonas Econômicas Especiais (ZEE)",
      definition: "Áreas geográficas delimitadas com regimes jurídicos, tributários e aduaneiros altamente diferenciados do restante do país, criadas para atrair capitais estrangeiros e acelerar a industrialização voltada à exportação (modelo celebrizado em Shenzhen na China)."
    },
    {
      term: "Regra de Ouro (Art. 167, III da CF/88)",
      definition: "Norma constitucional que proíbe o governo de emitir dívida pública para pagar despesas correntes (como salários de servidores e contas do dia a dia). O endividamento só é permitido para realizar investimentos em obras/equipamentos ou refinanciar a própria dívida."
    }
  ]
};
