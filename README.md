# Raio-X dos Planos de Governo 2026

**O que os candidatos prometem, e o que a Constituição e o orçamento deixam fazer.**

Site de jornalismo de dados que analisa, proposta por proposta, os planos de governo de cinco candidatos à Presidência nas eleições de 2026: Lula, Flávio Bolsonaro, Ronaldo Caiado, Augusto Cury e Renan Santos.

Cada proposta passa por três filtros:

1. **Está no plano?** Tem página e citação literal do PDF oficial, com link que abre na página certa.
2. **O que precisa mudar na lei?** É classificada numa escada de 5 degraus: *só o governo → lei → lei complementar → emenda constitucional → inconstitucional*.
3. **Cabe no orçamento?** O site compara as promessas com o espaço livre real do orçamento federal de 2026.

## Destaques

- **48 propostas** checadas contra o texto original, com base jurídica explicada em linguagem simples.
- **Escada da Constituição**: um explicador visual do quórum que cada tipo de mudança exige.
- **Matriz filtrável** por tema, candidato e degrau jurídico, com busca que ignora acentos.
- **Radar da CF/88**: os artigos mais "testados" pelos planos, com o texto e as propostas afetadas.
- **Orçamento interativo**: para onde vai a despesa primária da União e quanto sobra.
- **Registro de correções**: tudo o que estava errado na versão anterior e como foi corrigido.
- Tema claro/escuro, layout responsivo, navegação por teclado, `prefers-reduced-motion` e impressão.

## Tecnologia

HTML, CSS e JavaScript puros, sem framework, sem build e sem rastreadores.

```
index.html      estrutura e textos fixos
css/styles.css  design system (tokens, tema escuro, componentes)
js/data.js      base de dados: candidatos, propostas, artigos, orçamento, indicadores
js/app.js       renderização, filtros, modais e interações
planos/         PDFs originais dos planos de governo
```

Toda a interface é gerada a partir de `js/data.js`. Para adicionar uma proposta, inclua um objeto em `candidates[].proposals` com `theme`, `title`, `plain`, `page`, `verdict`, `legal` e `arts`.

## Rodando localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Para publicar no GitHub Pages: *Settings → Pages → Deploy from branch → `main` / root*.

## Método e limites

- A classificação jurídica indica o **instrumento mínimo** para implementar a proposta como está escrita. O selo "controverso" marca divergência relevante entre juristas ou no STF.
- O site não dá notas nem ranking e não avalia se uma proposta é boa ou ruim. Também não substitui um parecer jurídico.
- Há 13 candidaturas registradas no TSE; o recorte de cinco planos não representa um juízo sobre quem são os "principais".
- Indicadores: BCB (Selic de 16/09/2026; dívida de jul/2026), IBGE (IPCA de ago/2026; PIB de 2025), LOA 2026 e Anuário do Fórum Brasileiro de Segurança Pública 2026.

---

Desenvolvido por **Matheus Mendez**.
