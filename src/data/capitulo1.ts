// -------------------------------------------------------
// CAPÍTULO 1 — FUNDAMENTOS DE TESTE
// Estrutura: Capítulo > Tópicos > Etapas (narrativa, cards, vídeo, simulado)
// -------------------------------------------------------

export type Card = {
  emoji: string;
  titulo: string;
  explicacao: string;
  exemplo: string;
};

export type Questao = {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};

export type Topico = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  xp: number;
  narrativa: { titulo: string; paragrafos: string[] };
  cards: Card[];
  video: { titulo: string; descricao: string; url: string | null; duracao: string };
  questoes: Questao[];
};

export type Capitulo = {
  numero: number;
  titulo: string;
  descricao: string;
  semana: number;
  peso: string;
  cor: string;
  topicos: Topico[];
};

// -------------------------------------------------------
const capitulo1: Capitulo = {
  numero: 1,
  titulo: "Fundamentos de Teste",
  descricao: "A base de tudo que um bom QA precisa saber",
  semana: 1,
  peso: "27%",
  cor: "#c9a84c",
  topicos: [

    // ====================================================
    // TÓPICO 1 — POR QUE TESTAR?
    // ====================================================
    {
      id: "por-que-testar",
      numero: 1,
      titulo: "Por que testar?",
      subtitulo: "Entenda o propósito real do teste de software",
      xp: 40,
      narrativa: {
        titulo: "O dia que o bug chegou antes do QA 🔥",
        paragrafos: [
          "Em 1962, a NASA perdeu a sonda Mariner 1 por causa de um hífen ausente no código. Custo: US$ 18 milhões. Causa: ausência de um teste adequado.",
          "Em 1999, a Mars Climate Orbiter se perdeu no espaço porque uma equipe usava medidas em metros e outra em pés — e ninguém testou a integração entre os dois sistemas.",
          "Esses não são casos isolados. Bugs custam bilhões de dólares por ano à indústria global. E a maioria poderia ter sido evitada com testes.",
          "Mas testar não é só 'encontrar bugs'. É sobre confiança, qualidade e entregar valor real ao usuário. Vamos entender o porquê de verdade? 🚀",
        ],
      },
      cards: [
        {
          emoji: "🎯",
          titulo: "Objetivo principal: reduzir risco",
          explicacao: "O teste existe para reduzir o risco de falhas em produção. Não elimina 100% dos problemas, mas aumenta a confiança no software.",
          exemplo: "Um sistema bancário testado tem menos chance de processar transações erradas, protegendo banco e clientes.",
        },
        {
          emoji: "💰",
          titulo: "Custo de não testar",
          explicacao: "Defeitos encontrados em produção custam até 100x mais do que os mesmos defeitos encontrados durante o desenvolvimento.",
          exemplo: "Um bug nos requisitos custa 1h para corrigir. O mesmo bug em produção pode custar dias de retrabalho, perda de clientes e reputação.",
        },
        {
          emoji: "✅",
          titulo: "Teste vs. Qualidade",
          explicacao: "Teste é uma parte do processo de garantia de qualidade (QA), mas não é sinônimo. QA envolve processos, revisões, métricas e cultura.",
          exemplo: "Uma empresa pode ter QA excelente (bons processos, revisões de código) mas ainda assim ter bugs — o teste complementa o processo.",
        },
        {
          emoji: "🤝",
          titulo: "Confiança para o negócio",
          explicacao: "O teste fornece informações objetivas sobre a qualidade do produto, permitindo que stakeholders tomem decisões informadas sobre o lançamento.",
          exemplo: "Com relatórios de teste, o gerente de produto pode decidir com dados se lança agora ou aguarda correções.",
        },
        {
          emoji: "📋",
          titulo: "Conformidade e regulamentação",
          explicacao: "Em setores como saúde, finanças e aviação, testes são obrigatórios por lei. Não testar pode resultar em multas e processos judiciais.",
          exemplo: "Sistemas de prontuário eletrônico no Brasil precisam seguir normas da ANVISA que exigem validação e testes documentados.",
        },
      ],
      video: {
        titulo: "Por que testar? — A visão do QA moderno",
        descricao: "Um vídeo curto explicando o papel estratégico do teste de software nas empresas hoje.",
        url: null,
        duracao: "~4 min",
      },
      questoes: [
        {
          pergunta: "Qual é o principal objetivo do teste de software segundo o CTFL?",
          opcoes: [
            "Eliminar todos os defeitos do software",
            "Reduzir o risco de falhas e aumentar a confiança no produto",
            "Garantir que o software funciona em todos os dispositivos",
            "Substituir o processo de revisão de código",
          ],
          correta: 1,
          explicacao: "O teste não elimina todos os defeitos (isso é impossível), mas reduz o risco de falhas e fornece informações para tomada de decisão.",
        },
        {
          pergunta: "Uma empresa decide não testar um módulo de baixa prioridade para economizar tempo. Qual é o principal risco dessa decisão?",
          opcoes: [
            "O software ficará mais lento",
            "Defeitos podem chegar à produção com custo de correção muito maior",
            "A equipe de dev ficará sobrecarregada",
            "O prazo de entrega será afetado",
          ],
          correta: 1,
          explicacao: "Defeitos encontrados em produção custam significativamente mais para corrigir do que os mesmos defeitos encontrados antes. O custo não é só financeiro — inclui reputação e confiança.",
        },
        {
          pergunta: "Qual a diferença entre Teste e Garantia de Qualidade (QA)?",
          opcoes: [
            "São a mesma coisa, apenas nomes diferentes",
            "QA é mais caro que o teste",
            "Teste é uma atividade de detecção; QA é um processo mais amplo de prevenção e melhoria",
            "QA só é usado em empresas grandes",
          ],
          correta: 2,
          explicacao: "Teste foca em encontrar defeitos (detecção). QA é mais amplo e envolve processos, revisões, métricas e cultura para prevenir defeitos.",
        },
      ],
    },

    // ====================================================
    // TÓPICO 2 — OS 7 PRINCÍPIOS DO TESTE
    // ====================================================
    {
      id: "7-principios",
      numero: 2,
      titulo: "Os 7 Princípios do Teste",
      subtitulo: "A sabedoria de décadas de QA em 7 lições",
      xp: 50,
      narrativa: {
        titulo: "Antes de testar, entenda o jogo 🎮",
        paragrafos: [
          "Imagina que você acabou de entrar num time de desenvolvimento. O produto vai pra produção em 2 semanas e o dev te fala: 'é só testar tudo, tá?' — como se fosse simples assim.",
          "Mas 'testar tudo' é impossível. Literalmente. Um formulário com 5 campos e 3 opções cada já tem centenas de combinações. Um sistema real tem milhões.",
          "Foi exatamente pra resolver isso que a indústria criou os 7 Princípios do Teste. Eles não são regras burocráticas — são a sabedoria de décadas de QAs que erraram (caro) antes de você.",
          "Dominar esses princípios é o que separa quem 'clica em botões' de quem pensa estrategicamente sobre qualidade. Bora? 🚀",
        ],
      },
      cards: [
        {
          emoji: "🚫",
          titulo: "1. Teste mostra presença de defeitos",
          explicacao: "O teste pode provar que defeitos existem, mas nunca pode provar que o software está 100% livre de problemas.",
          exemplo: "Você testou o login por 3 dias e não achou nada. Isso não significa perfeição — significa que seus testes não encontraram defeitos naquele escopo.",
        },
        {
          emoji: "♾️",
          titulo: "2. Teste exaustivo é impossível",
          explicacao: "Testar todas as combinações possíveis de entradas e condições é inviável. Por isso usamos técnicas para escolher os testes mais importantes.",
          exemplo: "Um campo de senha com 8 caracteres tem mais combinações do que estrelas na Via Láctea. Usamos técnicas como partição de equivalência para cobrir o essencial.",
        },
        {
          emoji: "⏰",
          titulo: "3. Teste antecipado economiza",
          explicacao: "Quanto mais cedo um defeito é encontrado, mais barato é corrigi-lo. Um bug achado em produção pode custar 100x mais do que o mesmo bug achado nos requisitos.",
          exemplo: "Revisar os requisitos antes de codar encontra ambiguidades que, se virassem código, custariam dias de retrabalho.",
        },
        {
          emoji: "🎯",
          titulo: "4. Agrupamento de defeitos",
          explicacao: "A maioria dos defeitos está concentrada em poucos módulos. Foque seus esforços nas áreas mais complexas ou com histórico de problemas.",
          exemplo: "O módulo de pagamento de um e-commerce tem 3x mais bugs que o restante. Faz sentido testá-lo com muito mais cuidado.",
        },
        {
          emoji: "🐛",
          titulo: "5. Paradoxo do pesticida",
          explicacao: "Repetir os mesmos testes vai, com o tempo, parar de encontrar novos bugs. Revise e crie novos testes regularmente.",
          exemplo: "Sua suite de regressão rodou 6 meses sem falhar. Isso pode ser ótimo... ou pode ser que ela parou de ser eficaz.",
        },
        {
          emoji: "🌍",
          titulo: "6. Teste depende do contexto",
          explicacao: "Não existe uma abordagem única. Testar um app bancário exige muito mais rigor do que testar um app de to-do list.",
          exemplo: "Um bug de UI num app de notas = irritante. O mesmo bug num sistema de UTI hospitalar = potencialmente fatal.",
        },
        {
          emoji: "✨",
          titulo: "7. Ausência de erros é uma ilusão",
          explicacao: "Mesmo sem bugs, o software pode ser inútil se não atender às necessidades reais do usuário. Qualidade vai além de 'sem defeitos'.",
          exemplo: "O sistema foi entregue sem nenhum bug... mas ninguém usa porque a UX é horrível e não resolve o problema do cliente.",
        },
      ],
      video: {
        titulo: "Os 7 Princípios em 5 minutos",
        descricao: "Assiste esse vídeo antes do simulado para fixar cada princípio com exemplos visuais.",
        url: null,
        duracao: "~5 min",
      },
      questoes: [
        {
          pergunta: "Um QA testou exaustivamente o módulo de login e não encontrou nenhum defeito. O que isso significa?",
          opcoes: [
            "O módulo está livre de defeitos",
            "Os testes foram bem executados e o módulo é confiável",
            "O teste reduziu o risco mas não garante ausência de defeitos",
            "É necessário refazer todos os testes para confirmar",
          ],
          correta: 2,
          explicacao: "Princípio 1: o teste pode mostrar presença de defeitos, mas nunca provar que estão todos ausentes.",
        },
        {
          pergunta: "A equipe roda os mesmos testes de regressão há 8 meses sem encontrar falhas. Qual princípio explica por que isso pode ser um problema?",
          opcoes: [
            "Teste antecipado economiza",
            "Paradoxo do pesticida",
            "Agrupamento de defeitos",
            "Ausência de erros é uma ilusão",
          ],
          correta: 1,
          explicacao: "Princípio 5 — Paradoxo do pesticida: testes repetidos perdem eficácia ao longo do tempo. A suite precisa ser revisada regularmente.",
        },
        {
          pergunta: "O sistema foi entregue sem nenhum bug registrado, mas os usuários reclamam que ele não resolve suas necessidades. Qual princípio se aplica?",
          opcoes: [
            "Teste exaustivo é impossível",
            "Agrupamento de defeitos",
            "Ausência de erros é uma ilusão",
            "Teste antecipado economiza",
          ],
          correta: 2,
          explicacao: "Princípio 7: ausência de defeitos técnicos não significa qualidade. O software precisa atender às necessidades reais dos usuários.",
        },
        {
          pergunta: "Durante a revisão dos requisitos, o QA identificou uma ambiguidade que geraria retrabalho enorme se fosse para o código. Qual princípio justifica esse trabalho antecipado?",
          opcoes: [
            "Paradoxo do pesticida",
            "Teste mostra presença de defeitos",
            "Teste antecipado economiza",
            "Agrupamento de defeitos",
          ],
          correta: 2,
          explicacao: "Princípio 3: defeitos encontrados cedo custam muito menos para corrigir.",
        },
      ],
    },

    // ====================================================
    // TÓPICO 3 — ERRO, DEFEITO E FALHA
    // ====================================================
    {
      id: "erro-defeito-falha",
      numero: 3,
      titulo: "Erro, Defeito e Falha",
      subtitulo: "Três palavras que todo QA precisa saber diferenciar",
      xp: 40,
      narrativa: {
        titulo: "Quando o dev fala 'não é bug, é feature' 😅",
        paragrafos: [
          "Você reporta um problema. O dev diz 'não reproduzo aqui'. O gerente pergunta se é um bug ou uma falha. O cliente só sabe que 'o sistema não funciona'.",
          "Essa confusão de termos é real no dia a dia de qualquer time de tecnologia. E no exame CTFL, essa distinção vale questões.",
          "A diferença entre erro, defeito e falha parece sutil, mas muda completamente como você comunica problemas e onde você foca a investigação.",
          "Vamos aprender de uma vez por todas — com exemplos do mundo real que você vai lembrar na hora da prova e no trabalho. 🎯",
        ],
      },
      cards: [
        {
          emoji: "🧠",
          titulo: "Erro (Error) — a origem humana",
          explicacao: "Um erro é uma ação humana que produz um resultado incorreto. É o engano cometido por uma pessoa — desenvolvedor, analista ou qualquer envolvido.",
          exemplo: "O dev confunde >= com > ao escrever uma condição. Esse engano mental é o erro.",
        },
        {
          emoji: "🐞",
          titulo: "Defeito (Defect/Bug) — o problema no artefato",
          explicacao: "O defeito é a manifestação do erro no código, documento ou outro artefato. É o problema físico, registrado e visível no produto.",
          exemplo: "A linha de código com >= onde deveria ser > é o defeito. Ele existe no código, pode ser encontrado e corrigido.",
        },
        {
          emoji: "💥",
          titulo: "Falha (Failure) — o comportamento errado",
          explicacao: "A falha é quando o defeito é ativado durante a execução e o sistema apresenta comportamento diferente do esperado.",
          exemplo: "O usuário tenta fazer login com a senha correta e o sistema recusa. Isso é a falha — o comportamento errado que o usuário experimenta.",
        },
        {
          emoji: "🔗",
          titulo: "A cadeia: Erro → Defeito → Falha",
          explicacao: "Nem todo defeito causa falha (pode nunca ser executado). Nem toda falha tem causa óbvia. O QA investiga essa cadeia para reportar bem.",
          exemplo: "Um defeito num código de exportação de PDF só causa falha quando o usuário exporta. Se ninguém usa esse recurso, o defeito existe mas não gera falha visível.",
        },
        {
          emoji: "📝",
          titulo: "Como reportar corretamente",
          explicacao: "No relatório de bug: descreva a falha (o que o usuário vê), aponte o defeito (onde está no código/sistema) e investigue o erro (o que causou).",
          exemplo: "Falha: 'Login recusa senha correta'. Defeito: 'Condição >= na linha 42 do AuthService'. Erro: 'Dev confundiu operador de comparação'.",
        },
      ],
      video: {
        titulo: "Erro, Defeito e Falha — diferença na prática",
        descricao: "Exemplos reais do dia a dia de QA para nunca mais confundir esses três conceitos.",
        url: null,
        duracao: "~4 min",
      },
      questoes: [
        {
          pergunta: "Um desenvolvedor digitou '=' onde deveria usar '==', causando um comportamento incorreto no sistema. Como classificar cada elemento?",
          opcoes: [
            "O '=' digitado = falha; o comportamento incorreto = defeito",
            "O engano do dev = erro; o '=' no código = defeito; o comportamento incorreto = falha",
            "Tudo isso junto é chamado de bug",
            "O '=' no código = erro; o comportamento = defeito",
          ],
          correta: 1,
          explicacao: "Erro = engano humano (dev digitou errado). Defeito = o problema no artefato (o '=' no código). Falha = comportamento incorreto em execução.",
        },
        {
          pergunta: "Um defeito existe no módulo de geração de relatórios anuais, mas o sistema nunca gerou esse relatório desde que foi implantado. O que podemos afirmar?",
          opcoes: [
            "O defeito causou falhas que passaram despercebidas",
            "O defeito existe mas nenhuma falha foi observada",
            "Não existe defeito se não houve falha",
            "O defeito foi corrigido automaticamente",
          ],
          correta: 1,
          explicacao: "Nem todo defeito causa falha. Um defeito pode existir no código e nunca ser ativado se o caminho de execução que o contém nunca for percorrido.",
        },
        {
          pergunta: "O usuário reporta: 'Quando clico em salvar, a página trava'. Como o QA deve classificar esse reporte?",
          opcoes: [
            "É um erro do usuário",
            "É uma falha — o comportamento incorreto observado pelo usuário",
            "É um defeito no banco de dados",
            "É um erro de configuração do servidor",
          ],
          correta: 1,
          explicacao: "O que o usuário descreve é sempre uma falha — o comportamento inesperado. O QA investiga para encontrar o defeito que a causou.",
        },
      ],
    },

    // ====================================================
    // TÓPICO 4 — ATIVIDADES E PAPÉIS
    // ====================================================
    {
      id: "atividades-e-papeis",
      numero: 4,
      titulo: "Atividades e Papéis no Teste",
      subtitulo: "O que um QA faz, com quem trabalha e como se organiza",
      xp: 45,
      narrativa: {
        titulo: "Um dia na vida de um QA 👷",
        paragrafos: [
          "Muita gente ainda acha que QA é a pessoa que 'fica clicando no sistema'. Se você já ouviu isso, este tópico vai te dar os argumentos para responder.",
          "O processo de teste tem atividades bem definidas, desde entender o que precisa ser testado até reportar os resultados para a liderança. É um trabalho estratégico.",
          "E não é só você. Um processo de teste envolve analistas, testadores, líderes de teste, desenvolvedores e stakeholders — cada um com seu papel.",
          "Entender essas atividades e papéis é fundamental tanto para o exame quanto para você se posicionar melhor no seu time. Vamos lá! 💼",
        ],
      },
      cards: [
        {
          emoji: "📐",
          titulo: "Planejamento do teste",
          explicacao: "Define o escopo, objetivos, abordagem, recursos e cronograma. Resulta no Plano de Teste — o documento guia de toda a atividade.",
          exemplo: "O QA lead define: testar o módulo de checkout, usando testes funcionais e de performance, em 2 sprints, com 2 testadores.",
        },
        {
          emoji: "🔍",
          titulo: "Análise do teste",
          explicacao: "Identifica o que testar a partir dos requisitos, histórias de usuário, riscos e critérios de aceite. Resulta nas condições de teste.",
          exemplo: "A partir da história 'usuário faz login com e-mail e senha', o analista identifica condições: login válido, senha errada, usuário inexistente, etc.",
        },
        {
          emoji: "✏️",
          titulo: "Modelagem do teste",
          explicacao: "Transforma as condições em casos de teste detalhados com passos, dados de entrada e resultados esperados.",
          exemplo: "Condição 'senha errada' vira caso de teste: Dado usuário válido / Quando digita senha incorreta / Então exibe mensagem de erro específica.",
        },
        {
          emoji: "⚙️",
          titulo: "Implementação do teste",
          explicacao: "Prepara o ambiente, dados de teste e scripts (manuais ou automatizados) para executar os casos de teste.",
          exemplo: "Configura o banco de dados de teste, cria usuários fictícios e prepara os scripts Playwright para rodar o cenário de login.",
        },
        {
          emoji: "▶️",
          titulo: "Execução do teste",
          explicacao: "Roda os testes, registra os resultados e reporta os defeitos encontrados com evidências.",
          exemplo: "Executa os 50 casos de teste do sprint, encontra 3 defeitos, abre tickets no Jira com prints e passos para reproduzir.",
        },
        {
          emoji: "📊",
          titulo: "Conclusão do teste",
          explicacao: "Avalia se os critérios de saída foram atingidos, gera relatório final e documenta lições aprendidas.",
          exemplo: "Ao final do sprint: 95% dos casos passaram, 2 bugs críticos corrigidos, 1 bug de baixa prioridade aceito pelo PO para próxima sprint.",
        },
        {
          emoji: "👥",
          titulo: "Papéis: Analista vs. Testador",
          explicacao: "O Analista de Teste foca em análise e modelagem (o quê testar). O Testador foca em implementação e execução (como testar). Em times menores, uma pessoa faz os dois.",
          exemplo: "Em startups, o QA faz tudo. Em empresas maiores, há analistas que escrevem os casos e testadores que executam e automatizam.",
        },
      ],
      video: {
        titulo: "O dia a dia do QA — atividades e papéis reais",
        descricao: "Como essas atividades se encaixam numa sprint ágil real e qual é o papel de cada pessoa.",
        url: null,
        duracao: "~5 min",
      },
      questoes: [
        {
          pergunta: "Qual atividade do processo de teste resulta no Plano de Teste?",
          opcoes: [
            "Análise do teste",
            "Modelagem do teste",
            "Planejamento do teste",
            "Conclusão do teste",
          ],
          correta: 2,
          explicacao: "O Planejamento define escopo, objetivos, abordagem e recursos — e resulta no Plano de Teste.",
        },
        {
          pergunta: "Um QA recebe uma história de usuário e identifica todas as situações que precisam ser verificadas (login válido, senha errada, conta bloqueada...). Qual atividade está realizando?",
          opcoes: [
            "Modelagem do teste",
            "Análise do teste",
            "Execução do teste",
            "Implementação do teste",
          ],
          correta: 1,
          explicacao: "Análise do teste: identificar o que testar a partir dos requisitos. O resultado são as condições de teste.",
        },
        {
          pergunta: "Qual é a principal diferença entre Analista de Teste e Testador?",
          opcoes: [
            "O Analista testa sistemas mais complexos",
            "O Testador é mais experiente que o Analista",
            "O Analista foca em análise e modelagem; o Testador foca em implementação e execução",
            "São papéis idênticos com nomes diferentes",
          ],
          correta: 2,
          explicacao: "Analista = o quê testar (análise, modelagem). Testador = como testar (implementação, execução). Em times menores, uma pessoa assume os dois papéis.",
        },
        {
          pergunta: "Após o término de uma sprint, o QA verifica se os critérios de saída foram atingidos e documenta lições aprendidas. Qual atividade é essa?",
          opcoes: [
            "Execução do teste",
            "Planejamento do teste",
            "Análise do teste",
            "Conclusão do teste",
          ],
          correta: 3,
          explicacao: "Conclusão do teste: avalia os resultados finais, verifica critérios de saída e documenta aprendizados para os próximos ciclos.",
        },
      ],
    },
  ],
};

export default capitulo1;