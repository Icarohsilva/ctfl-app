import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "ingles-para-qa",
  titulo: "Inglês para QA: por que é essencial e como começar",
  descricao: "Por que o inglês é indispensável na carreira de QA, vocabulário básico e como desenvolver o idioma do zero.",
  secao: "ingles",
  tempoLeitura: 8,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Por que o inglês é essencial para QA?",
      conteudo: `<p>O inglês é a língua franca da tecnologia, e na área de QA isso é especialmente verdadeiro:</p>
<ul>
<li><strong>Documentação técnica:</strong> toda documentação do Selenium, Playwright, Cypress, JIRA, ferramentas de CI/CD está em inglês. Ler fluentemente economiza horas de tradução e evita mal-entendidos.</li>
<li><strong>Certificações:</strong> o syllabus oficial do ISTQB é em inglês. Mesmo traduzido, muitos termos técnicos não têm equivalente exato em português.</li>
<li><strong>Vagas internacionais e remoto:</strong> as melhores vagas remotas — muitas com salários em dólar ou euro — exigem inglês para comunicação com o time.</li>
<li><strong>Bug reports e comunicação:</strong> em times com desenvolvedores de outros países, bugs, histórias de usuário e code reviews são escritos em inglês.</li>
<li><strong>Comunidade:</strong> Stack Overflow, GitHub Issues, conferências de QA — tudo em inglês.</li>
</ul>`,
    },
    {
      titulo: "Vocabulário básico: termos que você vai usar todo dia",
      conteudo: `<p>Mesmo com inglês básico, dominar esses termos já muda sua comunicação:</p>
<ul>
<li><strong>Bug / Defect:</strong> defeito de software</li>
<li><strong>Test case:</strong> caso de teste</li>
<li><strong>Test suite:</strong> conjunto de casos de teste</li>
<li><strong>Sprint:</strong> ciclo de desenvolvimento no Scrum</li>
<li><strong>Backlog:</strong> lista de itens a fazer</li>
<li><strong>User story:</strong> história de usuário</li>
<li><strong>Acceptance criteria:</strong> critérios de aceite</li>
<li><strong>Release:</strong> versão liberada do software</li>
<li><strong>Deploy:</strong> publicação do software no servidor</li>
<li><strong>Regression:</strong> regressão — funcionalidade que parou de funcionar</li>
<li><strong>Smoke test:</strong> teste rápido de sanidade básica</li>
<li><strong>Hotfix:</strong> correção urgente em produção</li>
</ul>`,
    },
    {
      titulo: "Como desenvolver o inglês tendo base zero",
      conteudo: `<p>A melhor estratégia combina <strong>imersão técnica</strong> com <strong>prática ativa</strong>:</p>
<ul>
<li><strong>Leia documentação técnica em inglês:</strong> comece com documentação do Playwright ou JIRA. Use o tradutor para termos desconhecidos, mas não traduza tudo — force-se a inferir pelo contexto.</li>
<li><strong>Escreva seus bug reports em inglês:</strong> mesmo que só você veja, crie o hábito. Templates de bug report em inglês estão no próximo artigo.</li>
<li><strong>Assista com legenda em inglês:</strong> conteúdo técnico (YouTube, talks de conferências) com legenda em inglês ajuda a conectar som e texto.</li>
<li><strong>Apps de idioma com foco técnico:</strong> o curso English for QA do TestPath combina vocabulário específico de QA com lições progressivas e avaliação de pronúncia por IA.</li>
<li><strong>Participe de comunidades em inglês:</strong> responda e pergunte em fóruns como Stack Overflow e GitHub Issues.</li>
</ul>`,
    },
    {
      titulo: "Em quanto tempo você consegue comunicar em inglês para QA?",
      conteudo: `<p>Uma estimativa realista:</p>
<ul>
<li><strong>30 dias de estudo focado (30min/dia):</strong> consegue escrever bug reports básicos e ler documentação com auxílio do tradutor</li>
<li><strong>3 meses:</strong> lê documentação fluidamente, escreve emails e comentários de code review em inglês</li>
<li><strong>6 meses:</strong> participa de reuniões simples, entende dailies e planning em inglês</li>
<li><strong>1 ano:</strong> conduz conversas técnicas e entrevistas com desenvolvedores estrangeiros</li>
</ul>
<p>O segredo não é velocidade — é <strong>consistência</strong>. 20 minutos por dia por um ano supera 3 horas por dia por um mês.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "O que é um 'hotfix' em inglês técnico de QA?",
      opcoes: [
        "Um teste de performance em ambiente quente (produção)",
        "Uma correção urgente aplicada diretamente em produção",
        "Um recurso novo adicionado fora do sprint",
        "Um bug de alta prioridade ainda não corrigido",
      ],
      correta: 1,
      explicacao: "Hotfix é uma correção urgente aplicada diretamente em produção (ou em uma branch de release), sem passar pelo ciclo normal de desenvolvimento e sprint. É usado quando um bug crítico afeta usuários em produção.",
    },
    {
      pergunta: "O que significa 'acceptance criteria' em histórias de usuário?",
      opcoes: [
        "Os critérios para aceitar um novo membro na equipe",
        "As condições que devem ser atendidas para a história de usuário ser considerada concluída",
        "A lista de bugs que devem ser corrigidos antes do release",
        "Os requisitos não-funcionais do sistema",
      ],
      correta: 1,
      explicacao: "Acceptance criteria (critérios de aceite) definem as condições que uma história de usuário deve satisfazer para ser considerada 'done'. São usados pelo QA para criar casos de teste e pelo Product Owner para validar a entrega.",
    },
    {
      pergunta: "O que é um 'smoke test'?",
      opcoes: [
        "Teste de performance sob carga alta (como 'fumaça' de esforço intenso)",
        "Teste rápido das funcionalidades básicas para verificar que o build está minimamente estável",
        "Teste exploratório sem roteiro definido",
        "Teste de segurança que verifica vulnerabilidades críticas",
      ],
      correta: 1,
      explicacao: "Smoke test (ou sanity test) é um conjunto pequeno de testes que verifica as funcionalidades críticas básicas do sistema após um novo build. Se o smoke test falha, o build é rejeitado antes de testes mais profundos.",
    },
    {
      pergunta: "Por que o inglês técnico de QA é diferente do inglês geral?",
      opcoes: [
        "Não é diferente — inglês geral é suficiente para trabalhar em QA",
        "O inglês de QA tem vocabulário específico (bug, sprint, deploy, regression) que não aparece no inglês cotidiano",
        "O inglês de QA é mais formal e usa gramática diferente",
        "O inglês de QA é baseado em inglês britânico, não americano",
      ],
      correta: 1,
      explicacao: "O inglês técnico de QA inclui jargão específico (sprint, backlog, regression, hotfix, deploy, smoke test) que não faz parte do vocabulário cotidiano. Dominar esse vocabulário técnico específico é o primeiro passo mais produtivo para QAs.",
    },
    {
      pergunta: "Qual é a estratégia mais eficiente para desenvolver inglês para QA?",
      opcoes: [
        "Fazer um curso intensivo de inglês geral por 3 meses",
        "Combinar imersão em conteúdo técnico em inglês com prática ativa de escrita",
        "Traduzir toda a documentação para português antes de ler",
        "Esperar ter nível B2 geral antes de usar inglês no trabalho",
      ],
      correta: 1,
      explicacao: "A combinação de imersão técnica (ler docs em inglês, assistir talks) com prática ativa (escrever bug reports em inglês, participar de fóruns) cria aprendizado contextualizado e mais rápido do que cursos de inglês geral desconectados do trabalho.",
    },
  ],
};
