// -------------------------------------------------------
// MAPA COMPLETO — Todos os capítulos e tópicos CTFL v4.0
// Usado pelas páginas de capítulo e tópico
// -------------------------------------------------------

export type TopicoMeta = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  xp: number;
};

export type CapituloMeta = {
  numero: number;
  titulo: string;
  descricao: string;
  semana: number;
  peso: string;
  cor: string;
  topicos: TopicoMeta[];
};

export const mapaCaptulos: Record<number, CapituloMeta> = {
  1: {
    numero: 1,
    titulo: "Fundamentos de Teste",
    descricao: "A base de tudo que um bom QA precisa saber",
    semana: 1,
    peso: "27%",
    cor: "#c9a84c",
    topicos: [
      { id: "por-que-testar", numero: 1, titulo: "Por que testar?", subtitulo: "Entenda o propósito real do teste de software", xp: 40 },
      { id: "7-principios", numero: 2, titulo: "Os 7 Princípios do Teste", subtitulo: "A sabedoria de décadas de QA em 7 lições", xp: 50 },
      { id: "erro-defeito-falha", numero: 3, titulo: "Erro, Defeito e Falha", subtitulo: "Três palavras que todo QA precisa saber diferenciar", xp: 40 },
      { id: "atividades-e-papeis", numero: 4, titulo: "Atividades e Papéis no Teste", subtitulo: "O que um QA faz, com quem trabalha e como se organiza", xp: 45 },
    ],
  },
  2: {
    numero: 2,
    titulo: "Ciclo de Vida de Desenvolvimento",
    descricao: "Como o teste se encaixa em cada modelo de desenvolvimento",
    semana: 2,
    peso: "17%",
    cor: "#7c9e6e",
    topicos: [
      { id: "modelos-desenvolvimento", numero: 1, titulo: "Modelos de Desenvolvimento", subtitulo: "Cascata, V-Model, Ágil, DevOps e shift-left", xp: 45 },
      { id: "niveis-teste", numero: 2, titulo: "Níveis de Teste", subtitulo: "Da unidade ao aceite — os 4 níveis da pirâmide", xp: 40 },
      { id: "tipos-teste", numero: 3, titulo: "Tipos de Teste", subtitulo: "Funcional, não-funcional, caixa-branca e regressão", xp: 40 },
      { id: "teste-manutencao", numero: 4, titulo: "Teste de Manutenção", subtitulo: "Como testar um sistema que já está em produção", xp: 35 },
    ],
  },
  3: {
    numero: 3,
    titulo: "Teste Estático",
    descricao: "Encontrar defeitos sem executar uma linha de código",
    semana: 3,
    peso: "10%",
    cor: "#6e8fa8",
    topicos: [
      { id: "fundamentos-estatico", numero: 1, titulo: "Fundamentos do Teste Estático", subtitulo: "Teste estático vs. dinâmico e seus benefícios", xp: 35 },
      { id: "processo-revisao", numero: 2, titulo: "Processo de Revisão", subtitulo: "Informal, walkthrough, técnica e inspeção formal", xp: 45 },
      { id: "analise-estatica", numero: 3, titulo: "Análise Estática com Ferramentas", subtitulo: "Linters, métricas de código e análise de fluxo", xp: 35 },
    ],
  },
  4: {
    numero: 4,
    titulo: "Análise e Modelagem de Testes",
    descricao: "As técnicas que todo QA certificado precisa dominar",
    semana: 4,
    peso: "25%",
    cor: "#c9a84c",
    topicos: [
      { id: "particao-equivalencia", numero: 1, titulo: "Partição de Equivalência", subtitulo: "Testando tudo sem testar tudo — classes de dados", xp: 50 },
      { id: "analise-valor-limite", numero: 2, titulo: "Análise de Valor Limite", subtitulo: "Onde os bugs moram: nas fronteiras dos intervalos", xp: 50 },
      { id: "tabela-decisao", numero: 3, titulo: "Teste de Tabela de Decisão", subtitulo: "Quando as regras de negócio ficam complexas", xp: 50 },
      { id: "transicao-estado", numero: 4, titulo: "Teste de Transição de Estado", subtitulo: "Sistemas com memória — estados e transições", xp: 50 },
      { id: "caixa-branca", numero: 5, titulo: "Técnicas de Caixa-Branca", subtitulo: "Cobertura de instrução e decisão no código", xp: 45 },
      { id: "baseado-experiencia", numero: 6, titulo: "Técnicas Baseadas em Experiência", subtitulo: "Error guessing, exploratório e checklist", xp: 40 },
    ],
  },
  5: {
    numero: 5,
    titulo: "Gerenciamento de Testes",
    descricao: "Planejar, monitorar e controlar a atividade de teste",
    semana: 6,
    peso: "17%",
    cor: "#9e7c6e",
    topicos: [
      { id: "planejamento-teste", numero: 1, titulo: "Planejamento do Teste", subtitulo: "Plano de teste, abordagem e critérios de entrada/saída", xp: 45 },
      { id: "monitoramento-controle", numero: 2, titulo: "Monitoramento e Controle", subtitulo: "Métricas, relatórios de progresso e conclusão", xp: 40 },
      { id: "gestao-risco", numero: 3, titulo: "Gestão de Risco no Teste", subtitulo: "Risco de produto, projeto e teste baseado em risco", xp: 45 },
      { id: "gestao-defeitos", numero: 4, titulo: "Gestão de Defeitos", subtitulo: "Relatório, ciclo de vida e classificação de defeitos", xp: 40 },
    ],
  },
  6: {
    numero: 6,
    titulo: "Ferramentas de Teste",
    descricao: "O arsenal do QA moderno e como usar com inteligência",
    semana: 7,
    peso: "5%",
    cor: "#6e7c9e",
    topicos: [
      { id: "ferramentas-suporte", numero: 1, titulo: "Ferramentas de Suporte ao Teste", subtitulo: "Categorias de ferramentas e quando usar cada uma", xp: 35 },
      { id: "automacao-teste", numero: 2, titulo: "Automação de Teste", subtitulo: "Benefícios, riscos e ROI da automação", xp: 40 },
      { id: "selecao-ferramenta", numero: 3, titulo: "Seleção e Introdução de Ferramentas", subtitulo: "PoC, piloto e critérios de seleção", xp: 35 },
    ],
  },
};

export default mapaCaptulos;