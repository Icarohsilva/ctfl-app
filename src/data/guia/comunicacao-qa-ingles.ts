import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "comunicacao-qa-ingles",
  titulo: "Comunicação em inglês para QA: dailies, reviews e retrospectivas",
  descricao: "Frases e expressões para participar de reuniões ágeis em inglês como QA: daily, planning, review e retro.",
  secao: "ingles",
  tempoLeitura: 10,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Daily Standup em inglês",
      conteudo: `<p>A daily standup segue o mesmo formato em qualquer idioma: o que fiz, o que vou fazer, algum impedimento. Em inglês:</p>
<p><strong>O que você fez ontem:</strong></p>
<ul>
<li>"Yesterday I finished testing the login flow — found 2 bugs and logged them in JIRA."</li>
<li>"I completed the regression test suite for the payment module."</li>
<li>"I reviewed the test cases for the new feature with the dev team."</li>
</ul>
<p><strong>O que você vai fazer hoje:</strong></p>
<ul>
<li>"Today I'm going to test the checkout flow."</li>
<li>"I'll be working on automating the smoke test suite."</li>
<li>"I'm planning to verify the hotfix for bug QA-123."</li>
</ul>
<p><strong>Impedimentos:</strong></p>
<ul>
<li>"I'm blocked — the test environment is down. Can someone from DevOps help?"</li>
<li>"I need clarification on the acceptance criteria for story #456 before I can start."</li>
<li>"No blockers from my side."</li>
</ul>`,
    },
    {
      titulo: "Sprint Planning em inglês",
      conteudo: `<p>Durante o planning, o QA precisa fazer perguntas sobre as histórias e critérios de aceite:</p>
<p><strong>Pedindo esclarecimentos:</strong></p>
<ul>
<li>"What's the expected behavior when the user leaves this field empty?"</li>
<li>"Are there any edge cases we should consider for this feature?"</li>
<li>"What are the acceptance criteria for this story?"</li>
<li>"Should this work the same way on mobile as on desktop?"</li>
</ul>
<p><strong>Estimando esforço de teste:</strong></p>
<ul>
<li>"Testing this story will take about 2 days — it has a lot of edge cases."</li>
<li>"I can test this quickly — it's a minor UI change."</li>
<li>"We'll need to run a full regression for this change since it touches the core authentication module."</li>
</ul>`,
    },
    {
      titulo: "Sprint Review em inglês",
      conteudo: `<p>Na review, o QA frequentemente apresenta o que foi testado e os resultados:</p>
<p><strong>Apresentando resultados de teste:</strong></p>
<ul>
<li>"The feature is working as expected. All 15 test cases passed."</li>
<li>"We found 3 bugs during testing. 2 were fixed before the release; 1 is a known issue tracked in QA-234."</li>
<li>"The payment flow has been tested on Chrome, Firefox, and Safari. No issues found."</li>
</ul>
<p><strong>Apresentando riscos:</strong></p>
<ul>
<li>"There's still a known issue with IE11 compatibility. We're monitoring it."</li>
<li>"Performance tests show a slight degradation under load — within acceptable limits but worth watching."</li>
</ul>`,
    },
    {
      titulo: "Retrospectiva em inglês",
      conteudo: `<p>Na retro, o QA contribui com observações sobre o processo de qualidade:</p>
<p><strong>O que funcionou bem (What went well):</strong></p>
<ul>
<li>"The early involvement of QA in the story refinement really helped — we caught ambiguities before development started."</li>
<li>"The automated regression suite saved us a lot of manual testing time this sprint."</li>
</ul>
<p><strong>O que pode melhorar (What could be better):</strong></p>
<ul>
<li>"We need a more stable test environment — it was down twice this sprint, blocking testing."</li>
<li>"Stories are often missing clear acceptance criteria, which makes it hard to define test cases upfront."</li>
</ul>
<p><strong>Ações (Action items):</strong></p>
<ul>
<li>"I'll create a template for acceptance criteria that the team can use starting next sprint."</li>
<li>"We'll add a QA environment health check to our daily checklist."</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Como você diz em inglês que está bloqueado porque o ambiente de teste está fora do ar?",
      opcoes: [
        "'My test environment is not working, please help.'",
        "'I'm blocked — the test environment is down. Can someone from DevOps help?'",
        "'I cannot test because environment has problem.'",
        "'Testing is blocked by infrastructure issues.'",
      ],
      correta: 1,
      explicacao: "A frase profissional comunica: o estado (I'm blocked), o motivo específico (test environment is down) e o pedido de ajuda (Can someone from DevOps help?). Direto, claro e acionável.",
    },
    {
      pergunta: "Durante o sprint planning, como você pergunta sobre casos extremos (edge cases) de uma funcionalidade?",
      opcoes: [
        "'What about the strange cases?'",
        "'Are there any edge cases we should consider for this feature?'",
        "'What if something wrong happens with the feature?'",
        "'Do you have all the cases documented?'",
      ],
      correta: 1,
      explicacao: "'Are there any edge cases we should consider?' é a forma profissional de perguntar sobre cenários extremos ou incomuns que podem revelar bugs. 'Edge case' é o termo técnico correto no vocabulário de QA.",
    },
    {
      pergunta: "Como apresentar na sprint review que todos os testes passaram?",
      opcoes: [
        "'All tests are OK.'",
        "'The feature is working as expected. All 15 test cases passed.'",
        "'Testing is done, no problems found.'",
        "'We finished testing the feature.'",
      ],
      correta: 1,
      explicacao: "A resposta profissional especifica: que a funcionalidade atende ao esperado, quantos casos foram executados e o resultado. Detalhes concretos tornam o relatório mais confiável do que afirmações genéricas.",
    },
    {
      pergunta: "Na retrospectiva, como você propõe uma melhoria para o processo?",
      opcoes: [
        "'We need better acceptance criteria.'",
        "'Stories are often missing clear acceptance criteria — I'll create a template for next sprint.'",
        "'Acceptance criteria are always incomplete.'",
        "'The team should write better stories.'",
      ],
      correta: 1,
      explicacao: "A forma profissional identifica o problema (missing acceptance criteria), evita culpar pessoas, e propõe uma ação concreta (I'll create a template). Observações sem ação proposta geram pouco valor na retro.",
    },
    {
      pergunta: "O que significa 'known issue' em inglês técnico?",
      opcoes: [
        "Um bug que foi identificado e corrigido",
        "Um problema que foi identificado, documentado e aceito — mas ainda não corrigido",
        "Um bug que ocorre apenas em ambientes conhecidos (dev/staging)",
        "Uma funcionalidade que ainda não foi implementada",
      ],
      correta: 1,
      explicacao: "'Known issue' é um problema já identificado e documentado no sistema de rastreamento (JIRA), mas que não será corrigido neste ciclo. O time tem conhecimento dele e o produto pode ser liberado assim mesmo, com essa limitação documentada.",
    },
  ],
};
