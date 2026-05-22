import type { ArtigoMeta } from "./types";

export const artigos: ArtigoMeta[] = [
  // CTFL
  { slug: "o-que-e-ctfl", titulo: "O que é o CTFL v4.0: guia completo", descricao: "Entenda o que é o exame CTFL v4.0 do ISTQB, como funciona, quem deve fazer e o que esperar no dia da prova.", secao: "ctfl", tempoLeitura: 8, nivel: "iniciante" },
  { slug: "como-se-preparar-ctfl", titulo: "Como se preparar para o CTFL: passo a passo", descricao: "Plano de estudo detalhado para o CTFL v4.0: cronograma, recursos recomendados, dicas de simulado e estratégias para a prova.", secao: "ctfl", tempoLeitura: 10, nivel: "iniciante" },
  { slug: "fundamentos-de-teste", titulo: "Fundamentos de Teste de Software (Cap. 1 CTFL)", descricao: "Os 7 princípios do teste, conceitos de erro, defeito e falha, atividades e papéis no processo de teste.", secao: "ctfl", tempoLeitura: 12, nivel: "iniciante" },
  { slug: "teste-no-ciclo-de-vida", titulo: "Teste no Ciclo de Vida de Software (Cap. 2 CTFL)", descricao: "Modelos de desenvolvimento, níveis de teste (unitário, integração, sistema, aceite) e tipos de teste.", secao: "ctfl", tempoLeitura: 12, nivel: "iniciante" },
  { slug: "teste-estatico", titulo: "Teste Estático (Cap. 3 CTFL)", descricao: "Revisões de código, análise estática, benefícios do teste estático e como aplicar em projetos reais.", secao: "ctfl", tempoLeitura: 9, nivel: "intermediário" },
  { slug: "analise-e-modelagem-de-teste", titulo: "Análise e Modelagem de Teste (Cap. 4 CTFL)", descricao: "Técnicas caixa-preta (partição de equivalência, valor-limite, tabela de decisão, transição de estado) e caixa-branca.", secao: "ctfl", tempoLeitura: 14, nivel: "intermediário" },
  { slug: "gerenciamento-de-atividades-de-teste", titulo: "Gerenciamento de Atividades de Teste (Cap. 5 CTFL)", descricao: "Planejamento, estimativa, monitoramento, controle de teste, gestão de riscos e defeitos.", secao: "ctfl", tempoLeitura: 11, nivel: "intermediário" },
  { slug: "ferramentas-de-suporte-ao-teste", titulo: "Ferramentas de Suporte ao Teste (Cap. 6 CTFL)", descricao: "Categorias de ferramentas de teste, automação, como selecionar e implementar ferramentas em projetos.", secao: "ctfl", tempoLeitura: 9, nivel: "intermediário" },
  { slug: "glossario-ctfl", titulo: "Glossário CTFL v4.0: 50+ termos essenciais", descricao: "Definições de todos os termos-chave do syllabus CTFL v4.0 do ISTQB, com exemplos práticos.", secao: "ctfl", tempoLeitura: 15, nivel: "iniciante" },
  // Playwright
  { slug: "o-que-e-playwright", titulo: "O que é Playwright: automação moderna de testes web", descricao: "Introdução ao Playwright, comparação com Selenium e Cypress, casos de uso e por que aprender em 2025.", secao: "playwright", tempoLeitura: 8, nivel: "iniciante" },
  { slug: "playwright-para-iniciantes", titulo: "Playwright para iniciantes: primeiros passos", descricao: "Como instalar o Playwright, escrever o primeiro teste, executar e interpretar resultados.", secao: "playwright", tempoLeitura: 10, nivel: "iniciante" },
  { slug: "locators-e-page-object-model", titulo: "Locators, assertivas e Page Object Model no Playwright", descricao: "Como usar locators robustos, escrever assertivas eficientes e organizar testes com o padrão POM.", secao: "playwright", tempoLeitura: 12, nivel: "intermediário" },
  { slug: "playwright-em-ci-cd", titulo: "Playwright em CI/CD: boas práticas e relatórios", descricao: "Integrar Playwright em GitHub Actions, gerar relatórios HTML, depurar falhas e escalar a suíte de testes.", secao: "playwright", tempoLeitura: 11, nivel: "intermediário" },
  // English for QA
  { slug: "ingles-para-qa", titulo: "Inglês para QA: por que é essencial e como começar", descricao: "Por que o inglês é indispensável na carreira de QA, vocabulário básico e como desenvolver o idioma do zero.", secao: "ingles", tempoLeitura: 8, nivel: "iniciante" },
  { slug: "vocabulario-tecnico-qa-ingles", titulo: "Vocabulário técnico de QA em inglês: bug reports e terminologia", descricao: "Os termos técnicos de teste mais usados em inglês: como escrever bug reports, user stories e documentação.", secao: "ingles", tempoLeitura: 10, nivel: "iniciante" },
  { slug: "comunicacao-qa-ingles", titulo: "Comunicação em inglês para QA: dailies, reviews e retrospectivas", descricao: "Frases e expressões para participar de reuniões ágeis em inglês como QA: daily, planning, review e retro.", secao: "ingles", tempoLeitura: 10, nivel: "intermediário" },
  { slug: "entrevista-tecnica-qa-ingles", titulo: "Preparação para entrevistas técnicas de QA em inglês", descricao: "As perguntas mais comuns em entrevistas de QA em inglês, como responder e vocabulário específico para cada tema.", secao: "ingles", tempoLeitura: 12, nivel: "intermediário" },
];

export const artigosPorSecao = {
  ctfl: artigos.filter(a => a.secao === "ctfl"),
  playwright: artigos.filter(a => a.secao === "playwright"),
  ingles: artigos.filter(a => a.secao === "ingles"),
};
