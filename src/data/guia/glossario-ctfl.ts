import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "glossario-ctfl",
  titulo: "Glossário CTFL v4.0: 50+ termos essenciais",
  descricao: "Definições de todos os termos-chave do syllabus CTFL v4.0 do ISTQB, com exemplos práticos.",
  secao: "ctfl",
  tempoLeitura: 15,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Termos Fundamentais (A–E)",
      conteudo: `<p><strong>Análise de Valor Limite (Boundary Value Analysis):</strong> técnica de caixa-preta que testa os valores nos limites das partições de equivalência, onde defeitos se concentram.</p>
<p><strong>Automação de Teste:</strong> uso de ferramentas para executar testes automaticamente, reduzindo esforço manual em tarefas repetitivas.</p>
<p><strong>Base de Teste (Test Basis):</strong> toda informação usada para derivar casos de teste — requisitos, especificações, código-fonte, modelos.</p>
<p><strong>Bug:</strong> sinônimo informal de defeito. Ver Defeito.</p>
<p><strong>Caso de Teste (Test Case):</strong> conjunto de precondições, entradas, ações, resultados esperados e pós-condições que verificam um comportamento específico do software.</p>
<p><strong>Cobertura (Coverage):</strong> percentual de um item de cobertura (instrução, branch, requisito) exercitado pelos testes executados.</p>
<p><strong>Critério de Entrada (Entry Criteria):</strong> condições que devem ser atendidas para iniciar uma atividade de teste.</p>
<p><strong>Critério de Saída (Exit Criteria):</strong> condições que devem ser atendidas para encerrar uma atividade de teste.</p>
<p><strong>Defeito (Defect):</strong> imperfeição num artefato de trabalho que pode causar falha. Sinônimo: bug, fault.</p>`,
    },
    {
      titulo: "Termos Fundamentais (E–M)",
      conteudo: `<p><strong>Erro (Error):</strong> ação humana que produz um resultado incorreto, levando à introdução de um defeito.</p>
<p><strong>Falha (Failure):</strong> comportamento incorreto observado quando o sistema é executado, causado por um defeito.</p>
<p><strong>Inspeção (Inspection):</strong> tipo mais formal de revisão estática, com papéis definidos, processo documentado e métricas.</p>
<p><strong>Nível de Teste (Test Level):</strong> grupo de atividades de teste organizadas e gerenciadas juntas (unitário, integração, sistema, aceite).</p>
<p><strong>Manutenção de Teste (Test Maintenance):</strong> modificação e atualização dos testes para refletir mudanças no software ou no ambiente.</p>
<p><strong>Modelo V:</strong> modelo de desenvolvimento onde cada fase de desenvolvimento tem uma fase correspondente de teste.</p>`,
    },
    {
      titulo: "Termos Fundamentais (O–Z)",
      conteudo: `<p><strong>Objetivo de Teste (Test Objective):</strong> razão ou propósito de um teste — ex: encontrar defeitos, ganhar confiança, cumprir requisito regulatório.</p>
<p><strong>Oráculo de Teste (Test Oracle):</strong> fonte usada para determinar o resultado esperado de um teste. Ex: especificação, comportamento de sistema anterior, conhecimento especialista.</p>
<p><strong>Partição de Equivalência (Equivalence Partitioning):</strong> técnica de caixa-preta que divide dados de entrada em grupos onde todos os valores se comportam da mesma forma.</p>
<p><strong>Plano de Teste (Test Plan):</strong> documento que descreve objetivos, escopo, abordagem, recursos e cronograma do teste.</p>
<p><strong>Prioridade (Priority):</strong> urgência de correção de um defeito do ponto de vista do negócio.</p>
<p><strong>Severidade (Severity):</strong> impacto técnico de um defeito no sistema.</p>
<p><strong>Suíte de Testes (Test Suite):</strong> conjunto de casos de teste agrupados para execução conjunta.</p>
<p><strong>Teste de Aceite (Acceptance Testing):</strong> nível de teste que valida se o sistema atende às necessidades do negócio.</p>
<p><strong>Teste Exploratório (Exploratory Testing):</strong> abordagem onde design e execução ocorrem simultaneamente, guiados por aprendizagem durante o teste.</p>
<p><strong>Teste Estático (Static Testing):</strong> exame de artefatos sem execução do software.</p>
<p><strong>Tipo de Teste (Test Type):</strong> grupo de atividades de teste focadas num objetivo específico — funcional, não-funcional, caixa-branca, etc.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual é a diferença entre defeito e falha segundo o CTFL?",
      opcoes: [
        "São sinônimos — ambos descrevem o mesmo problema",
        "Defeito é o problema no artefato; falha é o comportamento incorreto observado na execução",
        "Defeito é causado pelo testador; falha é causada pelo desenvolvedor",
        "Defeito é mais grave que falha",
      ],
      correta: 1,
      explicacao: "Defeito existe no artefato (código, documento) — é o problema em si. Falha é o comportamento incorreto observado quando o software com defeito é executado. Um defeito pode existir sem gerar falha (se a condição que o ativa nunca ocorrer).",
    },
    {
      pergunta: "O que é um 'oráculo de teste'?",
      opcoes: [
        "Uma ferramenta de IA que prevê onde estão os defeitos",
        "A fonte usada para determinar o resultado esperado de um teste",
        "O testador mais experiente da equipe",
        "O documento de requisitos aprovado pelo cliente",
      ],
      correta: 1,
      explicacao: "O oráculo de teste é qualquer fonte que permite determinar se o resultado do teste está correto ou não. Pode ser uma especificação, o comportamento de uma versão anterior do sistema, um especialista de domínio, ou uma fórmula matemática.",
    },
    {
      pergunta: "O que é uma 'suíte de testes'?",
      opcoes: [
        "O ambiente completo de teste (hardware + software)",
        "Conjunto de casos de teste agrupados para execução conjunta",
        "O relatório final do ciclo de testes",
        "A documentação de todos os defeitos encontrados",
      ],
      correta: 1,
      explicacao: "Uma suíte de testes (test suite) é um agrupamento de casos de teste que serão executados juntos, geralmente por terem escopo ou contexto relacionados — ex: suíte de regressão, suíte de smoke test.",
    },
    {
      pergunta: "Qual é a diferença entre critério de entrada e critério de saída?",
      opcoes: [
        "Critério de entrada é para o projeto; critério de saída é para o produto",
        "Critério de entrada define quando o teste COMEÇA; critério de saída define quando o teste TERMINA",
        "São usados em diferentes tipos de teste: funcional e não-funcional",
        "Critério de entrada é obrigatório; critério de saída é opcional",
      ],
      correta: 1,
      explicacao: "Critério de entrada (entry criteria): condições para iniciar o teste — ex: build disponível, ambiente configurado. Critério de saída (exit criteria): condições para encerrar — ex: 95% dos casos executados, zero bugs críticos abertos.",
    },
    {
      pergunta: "Qual é a definição de 'base de teste'?",
      opcoes: [
        "O ambiente de teste (servidor, banco de dados, ferramentas)",
        "A equipe responsável pelos testes",
        "Toda informação usada para derivar casos de teste",
        "O conjunto de defeitos conhecidos do sistema",
      ],
      correta: 2,
      explicacao: "A base de teste inclui tudo que é usado para identificar o que testar: requisitos, especificações funcionais, código-fonte, modelos de arquitetura, histórias de usuário, regras de negócio documentadas.",
    },
  ],
};
