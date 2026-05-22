import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "entrevista-tecnica-qa-ingles",
  titulo: "Preparação para entrevistas técnicas de QA em inglês",
  descricao: "As perguntas mais comuns em entrevistas de QA em inglês, como responder e vocabulário específico para cada tema.",
  secao: "ingles",
  tempoLeitura: 12,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "As perguntas mais comuns e como responder",
      conteudo: `<p>Entrevistas de QA em inglês costumam começar com perguntas conceituais:</p>
<p><strong>"What is the difference between verification and validation?"</strong></p>
<p>Resposta modelo: "Verification checks that we're building the product right — it focuses on the process and whether we're following the requirements. Validation checks that we're building the right product — it focuses on the outcome and whether the product meets the user's actual needs."</p>
<p><strong>"Can you explain the difference between severity and priority?"</strong></p>
<p>Resposta modelo: "Severity is the technical impact of a bug — how badly it breaks the system. Priority is the business urgency — how quickly it needs to be fixed. A spelling mistake on the homepage has low severity but could have high priority because it's the first thing customers see."</p>`,
    },
    {
      titulo: "Perguntas sobre automação",
      conteudo: `<p><strong>"What automation framework have you worked with?"</strong></p>
<p>Resposta modelo: "I've primarily worked with Playwright for end-to-end testing. I appreciate how it handles modern web apps — async/await, multiple browsers, built-in trace and screenshot on failure. I've also worked with the Page Object Model pattern to keep tests maintainable."</p>
<p><strong>"How do you decide what to automate?"</strong></p>
<p>Resposta modelo: "I prioritize automating tests that are: frequently executed (like regression and smoke tests), stable (the feature is unlikely to change often), and have clear expected outcomes. I avoid automating exploratory tests or one-time scenarios — the ROI isn't there."</p>`,
    },
    {
      titulo: "Perguntas sobre processo e Agile",
      conteudo: `<p><strong>"How do you integrate QA in an Agile team?"</strong></p>
<p>Resposta modelo: "I believe QA should be involved from the beginning — during story refinement, not just at the end. I collaborate with developers on acceptance criteria, write test cases before development starts (shift-left), and participate in code reviews when changes touch critical flows. Testing is a team responsibility, not a gate at the end."</p>
<p><strong>"How do you handle tight deadlines when there's not enough time to test everything?"</strong></p>
<p>Resposta modelo: "I use risk-based testing. I map out the features by business impact and probability of failure, and focus my testing time on the highest-risk areas. I communicate clearly with the team about what was tested and what wasn't, so everyone understands the release risk."</p>`,
    },
    {
      titulo: "Perguntas comportamentais (behavioral questions)",
      conteudo: `<p>Entrevistas internacionais frequentemente usam o método STAR (Situation, Task, Action, Result):</p>
<p><strong>"Tell me about a time you found a critical bug close to release."</strong></p>
<p>Estrutura STAR em inglês:</p>
<ul>
<li><strong>Situation:</strong> "We were 2 days from releasing a payment feature when..."</li>
<li><strong>Task:</strong> "My job was to run the final regression suite."</li>
<li><strong>Action:</strong> "I found that the total amount was being calculated incorrectly for orders with discounts. I immediately documented the bug with steps to reproduce and escalated to the lead developer."</li>
<li><strong>Result:</strong> "The team fixed it in 4 hours. We delayed the release by one day but avoided shipping a bug that would have affected every discounted order."</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Em inglês, qual é a diferença entre 'verification' e 'validation'?",
      opcoes: [
        "São sinônimos — ambos significam verificar o software",
        "Verification verifica se estamos construindo o produto corretamente; validation verifica se estamos construindo o produto correto",
        "Verification é teste automático; validation é teste manual",
        "Verification é feito pelo QA; validation é feito pelo cliente",
      ],
      correta: 1,
      explicacao: "Verification: 'Are we building the product right?' (seguindo os requisitos e processo). Validation: 'Are we building the right product?' (atendendo às necessidades reais do usuário). É uma distinção clássica de entrevistas de QA.",
    },
    {
      pergunta: "O método STAR para responder perguntas comportamentais em inglês significa:",
      opcoes: [
        "Skills, Tasks, Achievements, Results",
        "Situation, Task, Action, Result",
        "Strategy, Timeline, Approach, Review",
        "Strengths, Thinking, Analysis, Response",
      ],
      correta: 1,
      explicacao: "STAR: Situation (contexto), Task (sua responsabilidade), Action (o que você fez), Result (o resultado). É o framework padrão para responder 'Tell me about a time when...' em entrevistas internacionais.",
    },
    {
      pergunta: "Como você explica 'risk-based testing' para um entrevistador em inglês?",
      opcoes: [
        "'I test based on what is risky to test'",
        "'I prioritize testing based on business impact and probability of failure to focus effort on highest-risk areas'",
        "'I only test features that have a risk of breaking'",
        "'Risk-based testing means I automate all critical tests'",
      ],
      correta: 1,
      explicacao: "A definição profissional de risk-based testing combina dois fatores: impacto no negócio e probabilidade de falha. Você foca o tempo de teste nas áreas com maior produto de risco × impacto, comunicando o que foi e não foi testado.",
    },
    {
      pergunta: "Como você explica sua experiência com Playwright em uma entrevista em inglês?",
      opcoes: [
        "'I know Playwright, it's good for testing.'",
        "'I've worked with Playwright for E2E testing — I use Page Object Model and value its built-in auto-waiting and multi-browser support.'",
        "'Playwright is the framework I use for automation.'",
        "'I have experience with Playwright and other tools.'",
      ],
      correta: 1,
      explicacao: "A resposta profissional menciona: o contexto de uso (E2E testing), um padrão de design utilizado (POM), e características específicas que você valoriza (auto-waiting, multi-browser). Detalhes técnicos demonstram conhecimento real, não apenas familiaridade com o nome.",
    },
    {
      pergunta: "O que significa 'shift-left' no contexto de QA em inglês?",
      opcoes: [
        "Mover a equipe de QA para o lado esquerdo do escritório",
        "Envolver QA mais cedo no ciclo de desenvolvimento, antes do desenvolvimento começar",
        "Priorizar testes de unidade em vez de testes de sistema",
        "Automatizar todos os testes manuais existentes",
      ],
      correta: 1,
      explicacao: "'Shift-left' é o conceito de antecipar o QA no ciclo — em vez de testar só no final, o QA participa desde o refinamento de histórias, escreve critérios de aceite antes do desenvolvimento e revisa requisitos. Reduz retrabalho por encontrar problemas mais cedo.",
    },
  ],
};
