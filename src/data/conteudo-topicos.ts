// -------------------------------------------------------
// CONTEÚDO FIXO — 24 tópicos CTFL v4.0
// Narrativa + Cards por tópico
// -------------------------------------------------------

export type Card = {
  emoji: string;
  titulo: string;
  explicacao: string;
  exemplo: string;
};

export type ConteudoTopico = {
  narrativa: { titulo: string; paragrafos: string[] };
  cards: Card[];
  dicaEstudo: string;
};

const conteudo: Record<string, ConteudoTopico> = {

  // ====================================================
  // CAPÍTULO 1
  // ====================================================

  "por-que-testar": {
    narrativa: {
      titulo: "O dia que o bug chegou antes do QA 🔥",
      paragrafos: [
        "Em 1962, a NASA perdeu a sonda Mariner 1 por causa de um hífen ausente no código. Custo: US$ 18 milhões. Causa: ausência de um teste adequado.",
        "Em 1999, a Mars Climate Orbiter se perdeu no espaço porque uma equipe usava metros e outra pés — ninguém testou a integração. Mais US$ 327 milhões perdidos.",
        "Esses não são casos isolados. Bugs custam bilhões por ano à indústria. E a maioria poderia ter sido evitada com testes adequados.",
        "Mas testar não é só encontrar bugs. É sobre confiança, qualidade e entregar valor real. Vamos entender o porquê de verdade? 🚀",
      ],
    },
    cards: [
      { emoji: "🎯", titulo: "Objetivo principal: reduzir risco", explicacao: "O teste existe para reduzir o risco de falhas em produção. Não elimina 100% dos problemas, mas aumenta a confiança no software entregue.", exemplo: "Um sistema bancário bem testado tem muito menos chance de processar transações duplicadas, protegendo banco e clientes." },
      { emoji: "💰", titulo: "Custo de não testar", explicacao: "Defeitos encontrados em produção custam até 100x mais do que os mesmos defeitos encontrados durante o desenvolvimento.", exemplo: "Um bug nos requisitos custa 1h para corrigir. O mesmo bug em produção pode custar dias de retrabalho, perda de clientes e reputação." },
      { emoji: "✅", titulo: "Teste vs. Qualidade (QA)", explicacao: "Teste é uma parte do processo de QA, mas não é sinônimo. QA envolve processos, revisões, métricas e cultura de qualidade.", exemplo: "Uma empresa pode ter QA excelente com bons processos e revisões de código, mas ainda assim ter bugs — o teste complementa o processo." },
      { emoji: "🤝", titulo: "Confiança para o negócio", explicacao: "O teste fornece informações objetivas sobre a qualidade do produto, permitindo que stakeholders tomem decisões informadas sobre o lançamento.", exemplo: "Com relatórios de teste, o gerente de produto pode decidir com dados se lança agora ou aguarda mais correções." },
      { emoji: "📋", titulo: "Conformidade e regulamentação", explicacao: "Em setores como saúde, finanças e aviação, testes são obrigatórios por lei. Não testar pode resultar em multas e processos judiciais.", exemplo: "Sistemas de prontuário eletrônico no Brasil precisam seguir normas da ANVISA que exigem validação e testes documentados." },
    ],
    dicaEstudo: "Foque na diferença entre Teste e QA — essa distinção aparece muito no exame. Lembre: teste detecta, QA previne.",
  },

  "7-principios": {
    narrativa: {
      titulo: "Antes de testar, entenda o jogo 🎮",
      paragrafos: [
        "Imagina que você acabou de entrar num time. O produto vai pra produção em 2 semanas e o dev te fala: 'é só testar tudo, tá?' — como se fosse simples assim.",
        "Mas testar tudo é impossível. Um formulário com 5 campos e 3 opções cada já tem centenas de combinações. Um sistema real tem milhões.",
        "Foi exatamente pra resolver isso que a indústria criou os 7 Princípios do Teste. São a sabedoria de décadas de QAs que erraram caro antes de você.",
        "Dominar esses princípios é o que separa quem clica em botões de quem pensa estrategicamente sobre qualidade. Bora? 🚀",
      ],
    },
    cards: [
      { emoji: "🚫", titulo: "1. Teste mostra presença de defeitos", explicacao: "O teste pode provar que defeitos existem, mas nunca pode provar que o software está 100% livre de problemas.", exemplo: "Você testou o login por 3 dias e não achou nada. Isso não significa perfeição — significa que seus testes não encontraram defeitos naquele escopo." },
      { emoji: "♾️", titulo: "2. Teste exaustivo é impossível", explicacao: "Testar todas as combinações possíveis de entradas e condições é inviável. Usamos técnicas para escolher os testes mais importantes.", exemplo: "Um campo de senha com 8 caracteres tem mais combinações do que estrelas na Via Láctea. Usamos partição de equivalência para cobrir o essencial." },
      { emoji: "⏰", titulo: "3. Teste antecipado economiza", explicacao: "Quanto mais cedo um defeito é encontrado, mais barato é corrigi-lo. Um bug em produção pode custar 100x mais do que o mesmo bug nos requisitos.", exemplo: "Revisar os requisitos antes de codar encontra ambiguidades que, se virassem código, custariam dias de retrabalho." },
      { emoji: "🎯", titulo: "4. Agrupamento de defeitos", explicacao: "A maioria dos defeitos está concentrada em poucos módulos. Foque seus esforços nas áreas mais complexas ou com histórico de problemas.", exemplo: "O módulo de pagamento de um e-commerce tem 3x mais bugs que o restante. Faz sentido testá-lo com muito mais cuidado." },
      { emoji: "🐛", titulo: "5. Paradoxo do pesticida", explicacao: "Repetir os mesmos testes vai, com o tempo, parar de encontrar novos bugs. Revise e crie novos testes regularmente.", exemplo: "Sua suite de regressão rodou 6 meses sem falhar. Isso pode ser ótimo... ou pode ser que ela parou de ser eficaz. Revise!" },
      { emoji: "🌍", titulo: "6. Teste depende do contexto", explicacao: "Não existe uma abordagem única. Testar um app bancário exige muito mais rigor do que testar um app de lista de tarefas.", exemplo: "Um bug de UI num app de notas é irritante. O mesmo bug num sistema de UTI hospitalar pode ser fatal." },
      { emoji: "✨", titulo: "7. Ausência de erros é uma ilusão", explicacao: "Mesmo sem bugs, o software pode ser inútil se não atender às necessidades reais do usuário. Qualidade vai além de sem defeitos.", exemplo: "O sistema foi entregue sem nenhum bug... mas ninguém usa porque a UX é horrível e não resolve o problema do cliente." },
    ],
    dicaEstudo: "Memorize os 7 princípios pela ordem e pelo número — o exame costuma perguntar qual princípio se aplica a uma situação específica.",
  },

  "erro-defeito-falha": {
    narrativa: {
      titulo: "Quando o dev fala 'não é bug, é feature' 😅",
      paragrafos: [
        "Você reporta um problema. O dev diz 'não reproduzo aqui'. O gerente pergunta se é um bug ou uma falha. O cliente só sabe que o sistema não funciona.",
        "Essa confusão de termos é real no dia a dia de qualquer time de tecnologia. E no exame CTFL, essa distinção vale questões.",
        "A diferença entre erro, defeito e falha parece sutil, mas muda completamente como você comunica problemas e onde foca a investigação.",
        "Vamos aprender de uma vez por todas — com exemplos do mundo real que você vai lembrar na hora da prova e no trabalho. 🎯",
      ],
    },
    cards: [
      { emoji: "🧠", titulo: "Erro — a origem humana", explicacao: "Um erro é uma ação humana que produz um resultado incorreto. É o engano cometido por uma pessoa — dev, analista ou qualquer envolvido.", exemplo: "O dev confunde >= com > ao escrever uma condição. Esse engano mental é o erro." },
      { emoji: "🐞", titulo: "Defeito — o problema no artefato", explicacao: "O defeito é a manifestação do erro no código, documento ou outro artefato. É o problema físico, registrado e visível no produto.", exemplo: "A linha de código com >= onde deveria ser > é o defeito. Ele existe no código, pode ser encontrado e corrigido." },
      { emoji: "💥", titulo: "Falha — o comportamento errado", explicacao: "A falha é quando o defeito é ativado durante a execução e o sistema apresenta comportamento diferente do esperado.", exemplo: "O usuário tenta fazer login com a senha correta e o sistema recusa. Isso é a falha — o comportamento errado que o usuário experimenta." },
      { emoji: "🔗", titulo: "A cadeia: Erro → Defeito → Falha", explicacao: "Nem todo defeito causa falha — pode nunca ser executado. Nem toda falha tem causa óbvia. O QA investiga essa cadeia para reportar bem.", exemplo: "Um defeito num código de exportação de PDF só causa falha quando o usuário exporta. Se ninguém usa esse recurso, o defeito existe mas não gera falha visível." },
      { emoji: "📝", titulo: "Como reportar corretamente", explicacao: "No relatório de bug: descreva a falha (o que o usuário vê), aponte o defeito (onde está) e investigue o erro (o que causou).", exemplo: "Falha: 'Login recusa senha correta'. Defeito: 'Condição >= na linha 42 do AuthService'. Erro: 'Dev confundiu operador de comparação'." },
    ],
    dicaEstudo: "A cadeia Erro→Defeito→Falha é muito cobrada. Lembre: erro é humano, defeito é no produto, falha é no comportamento em execução.",
  },

  "atividades-e-papeis": {
    narrativa: {
      titulo: "Um dia na vida de um QA 👷",
      paragrafos: [
        "Muita gente ainda acha que QA é a pessoa que fica clicando no sistema. Se você já ouviu isso, este tópico vai te dar os argumentos para responder.",
        "O processo de teste tem atividades bem definidas, desde entender o que precisa ser testado até reportar os resultados para a liderança.",
        "E não é só você. Um processo de teste envolve analistas, testadores, líderes de teste, desenvolvedores e stakeholders — cada um com seu papel.",
        "Entender essas atividades e papéis é fundamental tanto para o exame quanto para você se posicionar melhor no seu time. Vamos lá! 💼",
      ],
    },
    cards: [
      { emoji: "📐", titulo: "Planejamento do teste", explicacao: "Define o escopo, objetivos, abordagem, recursos e cronograma. Resulta no Plano de Teste — o documento guia de toda a atividade.", exemplo: "O QA lead define: testar o módulo de checkout, usando testes funcionais e de performance, em 2 sprints, com 2 testadores." },
      { emoji: "🔍", titulo: "Análise do teste", explicacao: "Identifica o que testar a partir dos requisitos, histórias de usuário, riscos e critérios de aceite. Resulta nas condições de teste.", exemplo: "A partir da história 'usuário faz login', o analista identifica condições: login válido, senha errada, usuário inexistente, conta bloqueada." },
      { emoji: "✏️", titulo: "Modelagem do teste", explicacao: "Transforma as condições em casos de teste detalhados com passos, dados de entrada e resultados esperados.", exemplo: "Condição 'senha errada' vira caso de teste: Dado usuário válido / Quando digita senha incorreta / Então exibe mensagem de erro específica." },
      { emoji: "⚙️", titulo: "Implementação do teste", explicacao: "Prepara o ambiente, dados de teste e scripts para executar os casos de teste.", exemplo: "Configura o banco de dados de teste, cria usuários fictícios e prepara os scripts Playwright para rodar o cenário de login." },
      { emoji: "▶️", titulo: "Execução do teste", explicacao: "Roda os testes, registra os resultados e reporta os defeitos encontrados com evidências.", exemplo: "Executa os 50 casos de teste do sprint, encontra 3 defeitos, abre tickets no Jira com prints e passos para reproduzir." },
      { emoji: "📊", titulo: "Conclusão do teste", explicacao: "Avalia se os critérios de saída foram atingidos, gera relatório final e documenta lições aprendidas.", exemplo: "Ao final do sprint: 95% dos casos passaram, 2 bugs críticos corrigidos, 1 bug de baixa prioridade aceito pelo PO para próxima sprint." },
      { emoji: "👥", titulo: "Papéis: Analista vs. Testador", explicacao: "O Analista foca em análise e modelagem (o quê testar). O Testador foca em implementação e execução (como testar).", exemplo: "Em startups, o QA faz tudo. Em empresas maiores, há analistas que escrevem os casos e testadores que executam e automatizam." },
      { emoji: "🎓", titulo: "Habilidades essenciais do QA", explicacao: "Conhecimento do domínio, pensamento crítico, comunicação clara e capacidade de colaborar com o time são tão importantes quanto as habilidades técnicas.", exemplo: "Um QA que sabe explicar um bug de forma clara para o dev e para o PO resolve problemas muito mais rápido do que um que só encontra o bug." },
    ],
    dicaEstudo: "Memorize as 6 atividades do processo de teste em ordem: Planejamento → Análise → Modelagem → Implementação → Execução → Conclusão.",
  },

  // ====================================================
  // CAPÍTULO 2
  // ====================================================

  "modelos-desenvolvimento": {
    narrativa: {
      titulo: "Cascata, Ágil ou DevOps — qual time você está? 🏗️",
      paragrafos: [
        "Você acabou de entrar num novo projeto. Antes de escrever um único caso de teste, precisa entender como o time desenvolve software.",
        "Um time em cascata tem fases bem separadas: requisitos, design, código, teste. Um time ágil mistura tudo em sprints de 2 semanas.",
        "A forma como você testa muda completamente dependendo do modelo. No CTFL, você precisa saber adaptar sua abordagem a cada contexto.",
        "Vamos entender cada modelo e como o QA se encaixa em cada um? 🚀",
      ],
    },
    cards: [
      { emoji: "🌊", titulo: "Modelo Cascata", explicacao: "Desenvolvimento sequencial em fases: requisitos → design → implementação → teste → implantação. Cada fase termina antes da próxima começar.", exemplo: "Projetos governamentais com escopo fixo costumam usar cascata. O QA entra apenas na fase de teste, depois que tudo está codificado." },
      { emoji: "✅", titulo: "V-Model", explicacao: "Extensão do cascata onde cada fase de desenvolvimento tem uma fase de teste correspondente. Teste é planejado desde o início.", exemplo: "Para cada fase (requisitos, design, código), há um nível de teste correspondente (aceite, integração, unitário). O QA planeja junto com o dev." },
      { emoji: "🔄", titulo: "Modelo Iterativo e Incremental", explicacao: "O software é desenvolvido em ciclos curtos, com funcionalidades adicionadas gradualmente. Feedback constante orienta o desenvolvimento.", exemplo: "A equipe entrega o módulo de login na iteração 1, o perfil na iteração 2. O QA testa cada incremento antes do próximo começar." },
      { emoji: "⚡", titulo: "Desenvolvimento Ágil (Scrum)", explicacao: "Sprints curtas de 1-4 semanas com entrega de valor contínua. O QA está integrado ao time e testa durante a sprint, não depois.", exemplo: "No Scrum, o QA participa do planning, testa histórias durante a sprint e participa da retrospectiva para melhorar o processo." },
      { emoji: "🚀", titulo: "DevOps e integração contínua", explicacao: "Integração entre desenvolvimento e operações com pipeline de CI/CD. Testes automatizados rodam a cada commit.", exemplo: "A cada push no GitHub, o pipeline roda 500 testes automatizados em 3 minutos. Se algum falha, o deploy é bloqueado automaticamente." },
      { emoji: "⬅️", titulo: "Shift-left testing", explicacao: "Mover o teste para mais cedo no ciclo de desenvolvimento. Revisar requisitos, fazer TDD e testar durante o desenvolvimento, não apenas no final.", exemplo: "Em vez de testar o módulo de pagamento após 3 semanas de desenvolvimento, o QA revisa os requisitos no dia 1 e escreve testes junto com o código." },
    ],
    dicaEstudo: "Shift-left é conceito novo no CTFL v4.0 e certamente será cobrado. Lembre: quanto mais cedo você testa, mais barato fica corrigir.",
  },

  "niveis-teste": {
    narrativa: {
      titulo: "Do código ao usuário — os 4 níveis de teste 🏛️",
      paragrafos: [
        "Imagine um prédio sendo construído. Você não espera o prédio ficar pronto para testar se as fundações estão firmes.",
        "No software é igual. Testamos desde a menor unidade de código até o sistema completo funcionando com usuários reais.",
        "Cada nível tem um foco diferente, um responsável diferente e uma técnica diferente. Confundir os níveis é um erro clássico no exame.",
        "Vamos entender cada camada dessa pirâmide de testes? 🚀",
      ],
    },
    cards: [
      { emoji: "🔬", titulo: "Teste de Componente (Unitário)", explicacao: "Testa a menor unidade testável de código de forma isolada — uma função, método ou classe. Geralmente feito pelo próprio desenvolvedor.", exemplo: "O dev escreve um teste JUnit para a função calcularDesconto() verificando se retorna o valor correto para diferentes entradas." },
      { emoji: "🔗", titulo: "Teste de Integração", explicacao: "Verifica se os componentes funcionam corretamente quando integrados entre si. Foca nas interfaces e interações entre módulos.", exemplo: "Após testar o módulo de pedidos e o de estoque separadamente, o teste de integração verifica se ao fazer um pedido o estoque é corretamente atualizado." },
      { emoji: "🖥️", titulo: "Teste de Sistema", explicacao: "Testa o sistema completo e integrado como um todo, verificando se atende aos requisitos funcionais e não-funcionais.", exemplo: "O QA testa o fluxo completo: usuário faz login → adiciona ao carrinho → faz pagamento → recebe confirmação por e-mail." },
      { emoji: "👤", titulo: "Teste de Aceite", explicacao: "Verifica se o sistema atende às necessidades do negócio e do usuário. Pode ser feito pelo cliente, usuários finais ou QA representando o negócio.", exemplo: "O cliente final testa o sistema antes de assinar o aceite do contrato (UAT — User Acceptance Testing)." },
    ],
    dicaEstudo: "A pirâmide de testes (mais unitários, menos E2E) é conceito chave. Cada nível tem objetivo, responsável e técnica específicos.",
  },

  "tipos-teste": {
    narrativa: {
      titulo: "Além do funcional — o que mais você precisa testar? 🔭",
      paragrafos: [
        "Um sistema pode funcionar perfeitamente e ainda assim ser um desastre. Funciona, mas cai com 100 usuários simultâneos. Funciona, mas está em português numa empresa global.",
        "Existem diferentes dimensões da qualidade que precisam ser testadas. Cada tipo de teste foca em uma dessas dimensões.",
        "Conhecer os tipos de teste é essencial para montar uma estratégia completa e não deixar buracos na cobertura.",
        "Vamos conhecer os principais tipos? 🎯",
      ],
    },
    cards: [
      { emoji: "⚙️", titulo: "Teste Funcional", explicacao: "Verifica o que o sistema faz — se as funcionalidades implementadas atendem aos requisitos. Testa o comportamento visível do sistema.", exemplo: "Verificar se o botão de compra adiciona o item ao carrinho, se o cálculo de frete está correto, se o login aceita credenciais válidas." },
      { emoji: "📈", titulo: "Teste Não-Funcional", explicacao: "Verifica como o sistema se comporta — performance, segurança, usabilidade, compatibilidade. Testa características de qualidade.", exemplo: "Verificar se o sistema suporta 1000 usuários simultâneos, se os dados estão criptografados, se funciona no Safari e no Chrome." },
      { emoji: "🔍", titulo: "Teste Caixa-Branca", explicacao: "Testa a estrutura interna do software — o código, fluxos de execução, branches e condições. O testador tem acesso ao código-fonte.", exemplo: "Verificar se todos os caminhos do código da função de cálculo de imposto são executados pelos testes, garantindo cobertura total." },
      { emoji: "🔄", titulo: "Teste de Confirmação (Reteste)", explicacao: "Verifica se um defeito reportado foi corretamente corrigido. Executa os mesmos passos que originalmente revelaram o bug.", exemplo: "Após o dev corrigir o bug do login, o QA executa exatamente os mesmos passos que causavam a falha para confirmar que foi resolvido." },
      { emoji: "📦", titulo: "Teste de Regressão", explicacao: "Verifica se mudanças no código não introduziram novos defeitos em funcionalidades que já funcionavam. Protege o sistema contra regressões.", exemplo: "Após adicionar o módulo de cupom de desconto, o QA roda a suite completa de testes do carrinho para garantir que nada quebrou." },
    ],
    dicaEstudo: "Não confunda Reteste com Regressão: Reteste confirma que um bug foi corrigido. Regressão verifica que nada novo quebrou.",
  },

  "teste-manutencao": {
    narrativa: {
      titulo: "O sistema está em produção — e agora? 🔧",
      paragrafos: [
        "Depois do lançamento, o trabalho do QA não acabou. Sistemas em produção recebem correções, melhorias e adaptações constantemente.",
        "Cada mudança, por menor que seja, pode quebrar algo que funcionava. Uma linha de código alterada pode ter efeitos em cascata inesperados.",
        "O teste de manutenção existe para garantir que o sistema continue funcionando corretamente após cada mudança.",
        "Vamos entender como testar um sistema que já está no ar? 🎯",
      ],
    },
    cards: [
      { emoji: "💥", titulo: "Triggers de manutenção", explicacao: "Situações que disparam a necessidade de manutenção: correção de bugs, novas funcionalidades, mudanças de ambiente, aposentadoria de sistemas.", exemplo: "A atualização do banco de dados para uma nova versão é um trigger de manutenção que exige testes de regressão completos." },
      { emoji: "🗺️", titulo: "Análise de impacto", explicacao: "Antes de testar, identificar quais partes do sistema foram afetadas pela mudança e quais testes precisam ser executados ou atualizados.", exemplo: "A mudança na API de pagamento impacta: carrinho, pedidos, notificações e relatórios financeiros — todos precisam ser testados." },
      { emoji: "🔄", titulo: "Teste de regressão em manutenção", explicacao: "Executar testes nas áreas afetadas e ao redor delas para garantir que a mudança não quebrou nada que funcionava.", exemplo: "Após corrigir um bug no cálculo de frete, o QA testa não só o frete, mas todo o fluxo de checkout para garantir que nada regrediu." },
    ],
    dicaEstudo: "Análise de impacto é a chave do teste de manutenção. Sem saber o que foi afetado, você não sabe o que testar.",
  },

  // ====================================================
  // CAPÍTULO 3
  // ====================================================

  "fundamentos-estatico": {
    narrativa: {
      titulo: "Encontrar bugs sem executar o software 🕵️",
      paragrafos: [
        "E se eu te dissesse que é possível encontrar defeitos sem rodar nenhum teste? Parece impossível, mas é exatamente o que o teste estático faz.",
        "Revisando documentos, requisitos e código sem executar, encontramos ambiguidades, inconsistências e problemas muito antes que se tornem bugs caros.",
        "Estudos mostram que revisões encontram entre 60% e 90% dos defeitos antes dos testes dinâmicos. É uma das técnicas mais custo-efetivas da engenharia de software.",
        "Vamos entender como encontrar bugs antes mesmo de escrever uma linha de código? 🔍",
      ],
    },
    cards: [
      { emoji: "🔍", titulo: "Teste estático vs. dinâmico", explicacao: "Teste estático examina artefatos sem executar o software. Teste dinâmico executa o software e observa o comportamento. Ambos são complementares.", exemplo: "Revisar os requisitos (estático) encontra ambiguidades antes de codar. Executar o login (dinâmico) encontra bugs no comportamento." },
      { emoji: "📄", titulo: "Tipos de artefatos revisáveis", explicacao: "Qualquer artefato de software pode ser revisado estaticamente: requisitos, histórias de usuário, código, planos de teste, casos de teste, documentação.", exemplo: "Revisar os casos de teste antes de executá-los encontra casos duplicados, condições faltantes e dados de teste inadequados." },
      { emoji: "💡", titulo: "Benefícios do teste estático", explicacao: "Encontra defeitos cedo (quando são mais baratos), melhora a qualidade dos artefatos, promove entendimento compartilhado do sistema e reduz retrabalho.", exemplo: "Uma revisão de 2h nos requisitos evitou 3 semanas de retrabalho de desenvolvimento — o requisito tinha uma ambiguidade crítica não percebida." },
    ],
    dicaEstudo: "Lembre que teste estático não executa o software. A palavra-chave é 'revisão'. Qualquer artefato pode ser revisado estaticamente.",
  },

  "processo-revisao": {
    narrativa: {
      titulo: "Quatro olhos enxergam mais que dois 👁️",
      paragrafos: [
        "Você já passou horas num documento sem perceber um erro óbvio que outra pessoa encontrou em 5 minutos? Isso é normal — quem escreve tem pontos cegos.",
        "As revisões são processos estruturados para examinar artefatos com múltiplos pontos de vista, encontrando problemas que o autor não consegue ver.",
        "Existem diferentes tipos de revisão, de informal até a inspeção formal rigorosa. Cada um tem seu lugar e seu custo-benefício.",
        "Vamos conhecer cada tipo e quando usar cada um? 🎯",
      ],
    },
    cards: [
      { emoji: "💬", titulo: "Revisão Informal", explicacao: "A forma mais simples — sem processo definido. Pede-se a um colega que olhe o documento. Barata e rápida, mas menos sistemática.", exemplo: "O QA manda o caso de teste por chat para o dev revisar antes de executar. Sem reunião, sem processo — só um segundo olhar." },
      { emoji: "🚶", titulo: "Walkthrough", explicacao: "O autor guia os revisores pelo documento, explicando o conteúdo. Objetivo é coletar feedback e encontrar problemas. Informal mas estruturado.", exemplo: "O analista apresenta os requisitos para o time em reunião, explicando cada item. O time faz perguntas e aponta inconsistências." },
      { emoji: "🔧", titulo: "Revisão Técnica", explicacao: "Foco técnico. Revisores com expertise técnica examinam o artefato para encontrar defeitos técnicos e verificar conformidade com padrões.", exemplo: "Revisão de código por desenvolvedores sênior para verificar se segue os padrões de arquitetura e não tem vulnerabilidades de segurança." },
      { emoji: "🔬", titulo: "Inspeção Formal", explicacao: "O processo mais rigoroso. Tem papéis definidos (moderador, autor, revisores, escriba), checklist e métricas. Encontra mais defeitos mas é mais cara.", exemplo: "Inspeção formal dos requisitos de um sistema de saúde com checklist de 50 itens, moderador treinado e registro de todos os defeitos encontrados." },
      { emoji: "👔", titulo: "Papéis na revisão", explicacao: "Moderador: facilita a reunião. Autor: explica o artefato. Revisores: encontram defeitos. Escriba: documenta. Gerente: garante recursos.", exemplo: "Na inspeção do plano de teste: QA lead modera, QA júnior é o autor, desenvolvedores são revisores, PM é o escriba." },
      { emoji: "🏆", titulo: "Fatores de sucesso", explicacao: "Para revisões eficazes: objetivos claros, revisores preparados, ambiente seguro para dar feedback, tempo adequado e seguimento das melhorias.", exemplo: "Revisar sem que o autor se sinta atacado é fundamental. Comenta-se sobre o artefato, não sobre a pessoa que o escreveu." },
    ],
    dicaEstudo: "Memorize os 4 tipos de revisão em ordem crescente de formalidade: Informal → Walkthrough → Técnica → Inspeção. O exame adora questões sobre qual usar em cada situação.",
  },

  "analise-estatica": {
    narrativa: {
      titulo: "O robô que lê o seu código antes de você 🤖",
      paragrafos: [
        "Imagine ter um revisor que nunca cansa, nunca fica com preguiça e consegue ler milhares de linhas de código em segundos.",
        "Isso é análise estática automatizada — ferramentas que examinam o código-fonte sem executá-lo, encontrando padrões problemáticos.",
        "Do linter que aponta erros de sintaxe ao analisador que detecta vulnerabilidades de segurança, essas ferramentas são aliadas poderosas do QA moderno.",
        "Vamos entender como essas ferramentas funcionam e o que encontram? 🔍",
      ],
    },
    cards: [
      { emoji: "📏", titulo: "Linters e verificação de padrões", explicacao: "Ferramentas que verificam se o código segue os padrões e convenções definidos pelo time. Encontram problemas de estilo, formatação e erros comuns.", exemplo: "O ESLint aponta que uma variável foi declarada mas nunca usada, e que falta ponto-e-vírgula em 3 linhas antes do commit." },
      { emoji: "🌊", titulo: "Análise de fluxo de dados", explicacao: "Verifica como os dados fluem pelo código — variáveis não inicializadas, dados não utilizados, possíveis null pointers.", exemplo: "A ferramenta detecta que a variável 'usuarioAtual' pode ser null quando acessada na linha 247, potencial NullPointerException em produção." },
      { emoji: "📊", titulo: "Métricas de código", explicacao: "Mede características como complexidade ciclomática, tamanho de funções, acoplamento entre classes. Identifica código difícil de manter e testar.", exemplo: "A função processarPedido() tem complexidade ciclomática 45 — muito acima do limite de 10. Precisa ser refatorada antes de testar." },
    ],
    dicaEstudo: "No CTFL, o foco é entender o que é análise estática e seus benefícios, não como configurar as ferramentas. É estático porque não executa o código.",
  },

  // ====================================================
  // CAPÍTULO 4
  // ====================================================

  "particao-equivalencia": {
    narrativa: {
      titulo: "Testando tudo sem testar tudo 🧩",
      paragrafos: [
        "Se um campo aceita números de 1 a 100, você vai testar todos os 100 valores? E os negativos? E os decimais? E os textos?",
        "Isso seria impossível na prática. A partição de equivalência resolve esse problema dividindo os dados em grupos — se um valor do grupo funciona, todos funcionam.",
        "É uma das técnicas mais usadas no CTFL e no dia a dia de QA. Dominá-la te dá cobertura máxima com o mínimo de casos de teste.",
        "Vamos aprender a criar partições e escolher os dados certos? 🎯",
      ],
    },
    cards: [
      { emoji: "✅", titulo: "Partições válidas", explicacao: "Grupos de dados que o sistema deve aceitar e processar corretamente. Cada partição representa um comportamento esperado do sistema.", exemplo: "Para um campo de idade (18-65): a partição válida é qualquer valor entre 18 e 65. Basta testar um valor, como 30." },
      { emoji: "❌", titulo: "Partições inválidas", explicacao: "Grupos de dados que o sistema deve rejeitar. Testamos para garantir que o sistema trata adequadamente entradas inválidas.", exemplo: "Para idade (18-65): partições inválidas são valores menores que 18 (ex: 10) e maiores que 65 (ex: 70). Testamos um de cada." },
      { emoji: "1️⃣", titulo: "Princípio: um valor por partição", explicacao: "Basta testar um valor representativo de cada partição. Se um valor da partição passa, todos deveriam passar. Se um falha, todos falham.", exemplo: "Para a partição válida 18-65, testar apenas o valor 40 é suficiente. Não é necessário testar 18, 19, 20... 65." },
      { emoji: "📊", titulo: "Cobertura de EP", explicacao: "100% de cobertura de EP significa testar pelo menos um valor de cada partição (válida e inválida). É o critério mínimo aceitável.", exemplo: "Para o campo de idade com 3 partições (menor 18, 18-65, maior 65), 100% de cobertura exige 3 casos de teste — um por partição." },
    ],
    dicaEstudo: "EP divide dados em classes. Um representante por classe é suficiente. Lembre de sempre incluir partições inválidas — o exame sempre pergunta sobre elas.",
  },

  "analise-valor-limite": {
    narrativa: {
      titulo: "Onde os bugs moram: nas fronteiras 🏔️",
      paragrafos: [
        "A maioria dos bugs de validação não está no meio do intervalo válido — está nas bordas. O sistema aceita 18 mas rejeita 17? Ou aceita 17 também por erro?",
        "A análise de valor limite (BVA) foca exatamente nesses pontos de fronteira, onde erros de comparação (>= vs >) costumam se esconder.",
        "É uma das técnicas mais eficientes do CTFL — poucos casos de teste, alta probabilidade de encontrar bugs reais.",
        "Vamos aprender a identificar e testar os valores limites? 🎯",
      ],
    },
    cards: [
      { emoji: "2️⃣", titulo: "BVA de 2 valores", explicacao: "Para cada limite, testa o valor no limite e o valor logo fora do limite. Simples e eficiente para a maioria dos casos.", exemplo: "Limite mínimo 18: testa 18 (válido) e 17 (inválido). Limite máximo 65: testa 65 (válido) e 66 (inválido). Total: 4 testes." },
      { emoji: "3️⃣", titulo: "BVA de 3 valores", explicacao: "Para cada limite, testa o valor abaixo, no limite e acima. Mais rigoroso — recomendado quando o custo de bugs é alto.", exemplo: "Limite mínimo 18: testa 17 (inválido), 18 (válido) e 19 (válido). Limite máximo 65: testa 64, 65 e 66. Total: 6 testes." },
      { emoji: "⬇️", titulo: "Limite mínimo", explicacao: "O menor valor aceito pelo sistema. Erros comuns: usar > em vez de >= fazendo o limite mínimo ser rejeitado.", exemplo: "Sistema aceita idades >= 18. Se o dev codifica > 18, o valor 18 seria rejeitado incorretamente — exatamente o que o BVA detectaria." },
      { emoji: "⬆️", titulo: "Limite máximo", explicacao: "O maior valor aceito pelo sistema. Erros comuns: usar < em vez de <= fazendo o limite máximo ser rejeitado.", exemplo: "Sistema aceita idades <= 65. Se o dev codifica < 65, o valor 65 seria rejeitado — o BVA no limite superior encontraria esse bug." },
    ],
    dicaEstudo: "BVA complementa a EP. Use os dois juntos: EP escolhe partições, BVA escolhe os valores exatos nas fronteiras. BVA de 2 valores é o mais cobrado no exame.",
  },

  "tabela-decisao": {
    narrativa: {
      titulo: "Quando as regras de negócio ficam complicadas 📋",
      paragrafos: [
        "Desconto de 10% para clientes VIP com pedidos acima de R$500. Frete grátis para pedidos acima de R$200 ou para clientes premium. E se for os dois?",
        "Quando as regras têm múltiplas condições e combinações, fica difícil garantir que testamos todos os cenários importantes.",
        "A tabela de decisão organiza todas as combinações de condições e ações de forma sistemática, garantindo cobertura completa das regras de negócio.",
        "Vamos aprender a montar e usar uma tabela de decisão? 🎯",
      ],
    },
    cards: [
      { emoji: "📊", titulo: "Estrutura da tabela de decisão", explicacao: "Linhas superiores = condições (entradas). Linhas inferiores = ações (saídas). Colunas = regras (combinações). Cada coluna é um caso de teste.", exemplo: "Para desconto: condições são 'cliente VIP' e 'pedido > R$500'. Ações são 'aplicar 10%' e 'não aplicar'. 4 combinações possíveis." },
      { emoji: "🔀", titulo: "Condições e ações", explicacao: "Condições são as entradas que determinam o comportamento. Ações são os resultados esperados para cada combinação de condições.", exemplo: "Condições: [É VIP? S/N] [Pedido > 500? S/N]. Ações: [Desconto 10%] [Desconto 5%] [Sem desconto]." },
      { emoji: "📐", titulo: "Regras de decisão", explicacao: "Cada coluna da tabela é uma regra — uma combinação específica de condições com suas ações correspondentes.", exemplo: "Regra 1: VIP=S, >500=S → desconto 10%. Regra 2: VIP=S, >500=N → desconto 5%. Regra 3: VIP=N → sem desconto." },
      { emoji: "🎯", titulo: "Cobertura da tabela de decisão", explicacao: "100% de cobertura significa executar um caso de teste para cada regra (coluna) da tabela.", exemplo: "Uma tabela com 4 regras requer 4 casos de teste para 100% de cobertura. Cada caso testa uma combinação de condições." },
    ],
    dicaEstudo: "Tabela de decisão é ideal para regras de negócio complexas com múltiplas condições. No exame, você pode precisar construir uma tabela ou calcular quantos casos de teste são necessários.",
  },

  "transicao-estado": {
    narrativa: {
      titulo: "O sistema tem memória — e isso importa 🧠",
      paragrafos: [
        "Um carrinho de compras pode estar vazio, com itens, em checkout ou finalizado. O comportamento do sistema muda completamente dependendo do estado atual.",
        "Sistemas com estado são aqueles cujo comportamento depende do histórico de ações. Um botão pode funcionar diferente dependendo do que aconteceu antes.",
        "O teste de transição de estado garante que todos os estados e as transições entre eles funcionam corretamente.",
        "Vamos aprender a modelar e testar sistemas com estado? 🎯",
      ],
    },
    cards: [
      { emoji: "⭕", titulo: "Diagrama de estados", explicacao: "Representação visual dos estados possíveis de um sistema e as transições entre eles. Estados são círculos, transições são setas com condições.", exemplo: "Pedido: [Criado] → pagar → [Pago] → enviar → [Enviado] → entregar → [Entregue]. Cada seta é uma transição." },
      { emoji: "📊", titulo: "Tabela de transição de estado", explicacao: "Forma tabular do diagrama: linhas = estados atuais, colunas = eventos/condições, células = próximo estado ou ação.", exemplo: "Linha 'Pago', coluna 'Enviar' → célula = 'Enviado'. Linha 'Pago', coluna 'Cancelar' → célula = 'Cancelado'." },
      { emoji: "🔵", titulo: "Cobertura de estados", explicacao: "Garantir que todos os estados do sistema são visitados pelos testes. Cada estado deve ser testado pelo menos uma vez.", exemplo: "Para o pedido com 4 estados, a cobertura de estados exige passar por Criado, Pago, Enviado e Entregue — pelo menos uma vez cada." },
      { emoji: "➡️", titulo: "Cobertura de transições", explicacao: "Garantir que todas as transições entre estados são exercitadas. Mais rigoroso que cobertura de estados.", exemplo: "Se há 6 transições possíveis, a cobertura de transições exige que cada seta do diagrama seja percorrida pelo menos uma vez." },
    ],
    dicaEstudo: "Muito cobrado no exame! Saiba diferenciar cobertura de estados (todos os círculos) de cobertura de transições (todas as setas).",
  },

  "caixa-branca": {
    narrativa: {
      titulo: "Quando você pode ver o código 👁️",
      paragrafos: [
        "Nas técnicas de caixa-preta você testa o comportamento externo sem ver o código. Na caixa-branca você tem acesso ao código e usa isso a seu favor.",
        "Isso permite criar testes que garantem que cada linha, cada decisão e cada caminho do código seja executado.",
        "É especialmente útil para identificar código morto, caminhos não testados e condições que nunca são verdadeiras.",
        "Vamos entender as principais métricas de cobertura de código? 🔍",
      ],
    },
    cards: [
      { emoji: "📝", titulo: "Cobertura de instrução (Statement)", explicacao: "Percentual de linhas de código executadas pelos testes. 100% significa que todas as linhas foram executadas pelo menos uma vez.", exemplo: "Se o código tem 100 linhas e os testes executam 85, a cobertura de instrução é 85%. As 15 linhas não executadas podem esconder bugs." },
      { emoji: "🌿", titulo: "Cobertura de decisão (Branch)", explicacao: "Percentual de decisões (if/else, switch) onde ambos os caminhos (true/false) foram executados. Mais rigoroso que cobertura de instrução.", exemplo: "Um if/else tem 2 branches. Se os testes só testam o caminho 'true', a cobertura de decisão é 50% — o 'else' não foi testado." },
      { emoji: "📊", titulo: "Critérios de cobertura", explicacao: "100% de cobertura de decisão implica 100% de cobertura de instrução, mas não vice-versa. Decisão é mais forte.", exemplo: "Cobertura de instrução 100% não garante que o 'else' foi testado. Cobertura de decisão 100% garante que ambos os caminhos foram exercitados." },
    ],
    dicaEstudo: "Lembre: cobertura de decisão é mais forte que cobertura de instrução. 100% de decisão implica 100% de instrução, mas não o contrário.",
  },

  "baseado-experiencia": {
    narrativa: {
      titulo: "Quando o instinto do QA faz a diferença 🦊",
      paragrafos: [
        "Você tem 2 horas para testar um módulo que nunca viu antes. Não há requisitos detalhados, não há casos de teste escritos. O que você faz?",
        "É aí que entram as técnicas baseadas em experiência. Usando seu conhecimento, intuição e criatividade, você testa de forma inteligente e eficaz.",
        "Essas técnicas complementam as técnicas formais e são especialmente valiosas quando o tempo é curto ou a documentação é escassa.",
        "Vamos conhecer as principais técnicas baseadas em experiência? 🎯",
      ],
    },
    cards: [
      { emoji: "🎯", titulo: "Suposição de erro (Error Guessing)", explicacao: "Usar experiência e intuição para prever onde bugs provavelmente estão e criar testes específicos para essas áreas.", exemplo: "Baseado em experiência, o QA sempre testa: campos vazios, valores zero, strings muito longas, caracteres especiais e datas inválidas." },
      { emoji: "🧭", titulo: "Teste Exploratório", explicacao: "Aprendizado, design e execução de testes simultâneos, guiados pela curiosidade e pelo que é descoberto durante o teste.", exemplo: "O QA explora o módulo de relatórios sem script definido, seguindo sua curiosidade. Ao testar filtros, descobre que combinar 3 filtros causa crash." },
      { emoji: "📅", titulo: "Sessões e charters", explicacao: "Teste exploratório estruturado em sessões com tempo fixo e um charter — uma missão definida para guiar a exploração.", exemplo: "Charter: 'Explorar o módulo de pagamento por 90 minutos focando em cenários de falha de rede'. O QA registra o que encontrou ao final." },
      { emoji: "✅", titulo: "Teste baseado em checklist", explicacao: "Usar uma lista de verificação de itens a testar. Menos formal que casos de teste, mas garante que itens importantes não sejam esquecidos.", exemplo: "Checklist de segurança: injeção SQL ✓, XSS ✓, autenticação ✓, autorização ✓, dados sensíveis expostos ✓." },
    ],
    dicaEstudo: "Teste exploratório não é teste aleatório — é intencional e guiado. A diferença está na estrutura e nos objetivos, mesmo que não haja scripts rígidos.",
  },

  // ====================================================
  // CAPÍTULO 5
  // ====================================================

  "planejamento-teste": {
    narrativa: {
      titulo: "Antes de testar, planeje 📐",
      paragrafos: [
        "Um QA que começa a testar sem planejamento é como um navegador sem mapa. Pode até chegar em algum lugar, mas dificilmente será o lugar certo.",
        "O plano de teste é o documento que guia toda a atividade de teste — define o que, como, quando, quem e com que recursos.",
        "Um bom planejamento garante que os testes cobrem os riscos mais importantes e que recursos são usados de forma eficiente.",
        "Vamos aprender a criar um plano de teste sólido? 🎯",
      ],
    },
    cards: [
      { emoji: "📋", titulo: "Propósito do plano de teste", explicacao: "Documenta os objetivos, escopo, abordagem, recursos, cronograma e riscos do teste. É o contrato entre o time de teste e os stakeholders.", exemplo: "O plano de teste do projeto X define: testar funcionalidades críticas do checkout, usando testes manuais e automatizados, em 3 semanas, com 2 QAs." },
      { emoji: "🌍", titulo: "Contexto do teste", explicacao: "Entender o ambiente, as restrições, os riscos e os stakeholders antes de planejar. O contexto define a estratégia adequada.", exemplo: "Sistema de saúde (contexto): alta criticidade → testes mais rigorosos, mais documentação, mais critérios de aceite." },
      { emoji: "🗺️", titulo: "Abordagem de teste", explicacao: "Técnicas, tipos e níveis de teste que serão usados. Define como os objetivos de teste serão alcançados.", exemplo: "Abordagem: partição de equivalência para funcionais, teste de performance com JMeter, testes exploratórios para usabilidade." },
      { emoji: "🚦", titulo: "Critérios de entrada e saída", explicacao: "Entrada: condições para iniciar o teste (ambiente pronto, build estável). Saída: condições para encerrar (cobertura mínima, zero bugs críticos abertos).", exemplo: "Critério de saída: 95% dos casos de teste executados, zero bugs críticos abertos, cobertura de código acima de 80%." },
      { emoji: "⏱️", titulo: "Estimativas de teste", explicacao: "Estimar esforço, prazo e recursos necessários. Técnicas: baseado em métricas históricas, por analogia, ou por decomposição.", exemplo: "Baseado no projeto anterior similar: 200 casos de teste × 30min cada = 100h de execução. Com 2 QAs: 2,5 semanas." },
    ],
    dicaEstudo: "Critérios de entrada e saída são muito cobrados. Entrada = quando posso começar. Saída = quando posso parar. Ambos precisam ser definidos antes de testar.",
  },

  "monitoramento-controle": {
    narrativa: {
      titulo: "Como saber se estamos no caminho certo? 📊",
      paragrafos: [
        "O teste está rodando há 2 semanas. Mas quanto já foi testado? Quantos bugs foram encontrados? Vamos terminar no prazo?",
        "Sem monitoramento, é impossível responder essas perguntas. E sem essas respostas, é impossível tomar decisões corretas.",
        "O monitoramento e controle do teste fornece visibilidade contínua do progresso e permite agir quando algo sai do planejado.",
        "Vamos entender como medir e controlar a atividade de teste? 📈",
      ],
    },
    cards: [
      { emoji: "📏", titulo: "Métricas de teste", explicacao: "Medidas que fornecem informações objetivas sobre o progresso e a qualidade: casos executados, bugs encontrados, cobertura, tempo gasto.", exemplo: "Métricas do sprint: 180/200 casos executados (90%), 15 bugs encontrados, 12 corrigidos, cobertura de código 83%." },
      { emoji: "📈", titulo: "Relatórios de progresso", explicacao: "Comunicação regular do status do teste para stakeholders. Frequência e formato variam conforme o projeto.", exemplo: "Relatório diário para o time: casos executados ontem, bugs abertos, impedimentos. Relatório semanal para o gerente: status geral e riscos." },
      { emoji: "📄", titulo: "Relatório de conclusão", explicacao: "Documento final que resume toda a atividade de teste: o que foi testado, o que foi encontrado, o que ficou pendente e as lições aprendidas.", exemplo: "Ao final do projeto: 95% de cobertura, 47 bugs encontrados (45 corrigidos, 2 aceitos como risco), 3 lições aprendidas para o próximo projeto." },
      { emoji: "🎮", titulo: "Controle do teste", explicacao: "Ações tomadas quando o progresso se desvia do plano: realocar recursos, ajustar prioridades, negociar escopo, escalar riscos.", exemplo: "Testadores estão atrasados por ambiente instável → QA lead escalou para o time de infra e realocou QA para preparar mais casos de teste." },
    ],
    dicaEstudo: "Entenda a diferença entre relatório de progresso (durante) e relatório de conclusão (ao final). O exame pode questionar sobre o conteúdo de cada um.",
  },

  "gestao-risco": {
    narrativa: {
      titulo: "Testar tudo é impossível — então o que testar? 🎲",
      paragrafos: [
        "Você tem 100 funcionalidades para testar e tempo para testar 60. O que você prioriza? Se você chuta, pode deixar os bugs mais críticos escaparem.",
        "O teste baseado em risco resolve esse problema: você prioriza o que tem maior probabilidade de falhar e maior impacto se falhar.",
        "É a forma mais inteligente de usar recursos limitados de teste, focando energia onde ela realmente importa para o negócio.",
        "Vamos entender como identificar, analisar e mitigar riscos em projetos de software? 🎯",
      ],
    },
    cards: [
      { emoji: "📦", titulo: "Risco de produto", explicacao: "Probabilidade de o software falhar em alguma área e o impacto dessa falha no negócio ou no usuário. Guia o foco dos testes.", exemplo: "Módulo de pagamento: alta probabilidade de bugs + alto impacto (perda financeira) = risco alto → prioridade máxima de teste." },
      { emoji: "🏗️", titulo: "Risco de projeto", explicacao: "Fatores que podem impactar o sucesso do projeto de teste: prazo apertado, equipe inexperiente, ambiente instável, requisitos vagos.", exemplo: "Risco de projeto: QA júnior sem experiência no domínio financeiro → mitigação: mentoria e revisão dos casos de teste por QA sênior." },
      { emoji: "🔬", titulo: "Análise de risco", explicacao: "Identificar, avaliar e priorizar riscos. Cada risco tem probabilidade (P) e impacto (I). Risco = P × I.", exemplo: "Login: P=baixa (código simples) × I=alta (crítico) = risco médio. Exportação PDF: P=alta (código complexo) × I=baixa = risco médio." },
      { emoji: "🛡️", titulo: "Teste baseado em risco", explicacao: "Priorizar os testes de acordo com o nível de risco de cada área. Alto risco = mais testes, técnicas mais rigorosas, testado primeiro.", exemplo: "Com 60% do tempo de teste: 40% no módulo de pagamento (risco alto), 15% no login (risco médio), 5% nas páginas estáticas (risco baixo)." },
    ],
    dicaEstudo: "Risco de produto (o software pode falhar) vs risco de projeto (o projeto pode atrasar) — distinção clássica do CTFL. Saiba os exemplos de cada.",
  },

  "gestao-defeitos": {
    narrativa: {
      titulo: "Do bug encontrado ao bug corrigido 🐛",
      paragrafos: [
        "Encontrar um bug é só metade do trabalho. A outra metade é garantir que ele seja comunicado claramente, rastreado e corrigido.",
        "Um relatório de defeito mal escrito pode fazer o dev perder horas tentando reproduzir o problema, ou pior, corrigir a coisa errada.",
        "A gestão de defeitos é o processo que garante que cada bug encontrado seja tratado de forma sistemática e eficiente.",
        "Vamos aprender a gerenciar defeitos como um profissional? 📋",
      ],
    },
    cards: [
      { emoji: "📝", titulo: "Relatório de defeito", explicacao: "Documento que descreve um defeito encontrado. Deve ser claro, reproduzível e ter informações suficientes para o dev corrigir.", exemplo: "Bom relatório: título claro, passos para reproduzir, resultado atual, resultado esperado, ambiente, evidências (print, log, vídeo)." },
      { emoji: "🔄", titulo: "Ciclo de vida do defeito", explicacao: "Estados pelos quais um defeito passa: Novo → Atribuído → Em correção → Corrigido → Retestado → Fechado (ou Reaberto).", exemplo: "QA encontra bug → abre como 'Novo' → dev assume ('Atribuído') → corrige ('Corrigido') → QA retesta → fecha ou reabre se o bug persistir." },
      { emoji: "🏷️", titulo: "Classificação de defeitos", explicacao: "Categorizar bugs por severidade (impacto técnico) e prioridade (urgência de correção). São conceitos diferentes e independentes.", exemplo: "Bug cosmético (severidade baixa) em página de promoção que acaba amanhã: prioridade alta. Confundir severidade com prioridade é erro clássico." },
    ],
    dicaEstudo: "Severidade ≠ Prioridade! Severidade é técnica (quão grave é o bug). Prioridade é de negócio (quão urgente é corrigir). Essa distinção é muito cobrada.",
  },

  // ====================================================
  // CAPÍTULO 6
  // ====================================================

  "ferramentas-suporte": {
    narrativa: {
      titulo: "O arsenal do QA moderno 🛠️",
      paragrafos: [
        "Um QA sem ferramentas é como um mecânico sem chaves. As ferramentas amplificam sua capacidade e permitem fazer mais com menos tempo.",
        "Existem ferramentas para cada fase do processo de teste: gestão, design, execução, automação, performance e muito mais.",
        "Saber quando e como usar cada categoria de ferramenta é uma habilidade essencial do QA moderno.",
        "Vamos conhecer o arsenal completo? 🚀",
      ],
    },
    cards: [
      { emoji: "📋", titulo: "Ferramentas de gestão de teste", explicacao: "Gerenciam casos de teste, execuções, resultados e defeitos. Centralizam o trabalho do time de QA.", exemplo: "TestRail, Zephyr, Xray: armazenam casos de teste, registram execuções, geram relatórios de cobertura e integram com Jira." },
      { emoji: "🔍", titulo: "Ferramentas de teste estático", explicacao: "Analisam código e artefatos sem executar o software. Incluem linters, analisadores de código e verificadores de padrões.", exemplo: "SonarQube analisa o código em busca de bugs, vulnerabilidades e code smells. Integra ao pipeline de CI para bloquear código ruim." },
      { emoji: "▶️", titulo: "Ferramentas de execução de teste", explicacao: "Automatizam a execução de testes e comparam resultados esperados com obtidos. Reduzem esforço manual de regressão.", exemplo: "Selenium, Playwright, Cypress: automatizam testes de interface web. JUnit, pytest: automatizam testes unitários e de integração." },
      { emoji: "📊", titulo: "Ferramentas de performance", explicacao: "Simulam carga e medem o comportamento do sistema sob diferentes condições de uso.", exemplo: "JMeter simula 1000 usuários simultâneos acessando o checkout. Grafana exibe em tempo real os tempos de resposta e erros." },
    ],
    dicaEstudo: "No CTFL, o foco é nas categorias de ferramentas e seus benefícios, não em ferramentas específicas. Saiba qual categoria resolve cada problema.",
  },

  "automacao-teste": {
    narrativa: {
      titulo: "Robôs testando para você — mas com cuidado ⚙️",
      paragrafos: [
        "Automação de teste é o sonho de todo QA: testes rodando sozinhos enquanto você dorme. Mas a realidade é mais complexa.",
        "Automação não é bala de prata. Exige investimento inicial, manutenção constante e a escolha certa do que automatizar.",
        "Quando bem feita, a automação libera o QA para atividades mais criativas e de maior valor. Quando mal feita, vira um fardo.",
        "Vamos entender quando e como automatizar de forma inteligente? 🎯",
      ],
    },
    cards: [
      { emoji: "✅", titulo: "Benefícios da automação", explicacao: "Execução mais rápida, consistente e repetível. Feedback imediato no pipeline de CI. Libera QA para testes exploratórios e de maior valor.", exemplo: "Suite de 500 testes de regressão que levaria 2 dias manual roda em 20 minutos automatizada — a cada commit." },
      { emoji: "⚠️", titulo: "Riscos da automação", explicacao: "Alto custo inicial de implementação, manutenção constante, falsa sensação de segurança, não substitui o pensamento humano.", exemplo: "Automatizar uma tela instável que muda todo sprint gera mais trabalho de manutenção do que economia. Saber o que NÃO automatizar é tão importante." },
      { emoji: "💰", titulo: "ROI de automação", explicacao: "Retorno sobre investimento. A automação se paga quando o custo de criação + manutenção é menor que o custo de execução manual ao longo do tempo.", exemplo: "Criar um teste automatizado: 4h. Executar manualmente: 30min por vez. ROI positivo após 8 execuções manuais economizadas." },
      { emoji: "🎯", titulo: "Quando automatizar", explicacao: "Automatizar testes que rodam frequentemente, são repetitivos, com dados variados, de alta criticidade ou difíceis de executar manualmente.", exemplo: "Automatizar: smoke tests, regressão de funcionalidades estáveis, testes com muitos dados. NÃO automatizar: testes exploratórios, UX, funcionalidades em mudança." },
    ],
    dicaEstudo: "A automação não substitui o teste manual — ela complementa. O CTFL enfatiza que automação tem custos e riscos que precisam ser considerados.",
  },

  "selecao-ferramenta": {
    narrativa: {
      titulo: "A ferramenta certa para o trabalho certo 🔧",
      paragrafos: [
        "Toda semana surge uma ferramenta nova prometendo revolucionar o QA. Como escolher a certa sem desperdiçar tempo e dinheiro?",
        "A seleção de ferramentas precisa ser sistemática — considerar o contexto, as necessidades do time e os custos totais de adoção.",
        "E escolher é só o começo. A introdução bem feita é o que determina se a ferramenta vai ser usada ou virar mais uma conta esquecida.",
        "Vamos aprender a selecionar e introduzir ferramentas de forma profissional? 🎯",
      ],
    },
    cards: [
      { emoji: "📋", titulo: "Critérios de seleção", explicacao: "Avaliar ferramentas por: funcionalidades necessárias, compatibilidade com tecnologias do projeto, custo, suporte, curva de aprendizado e adoção pelo time.", exemplo: "Para escolher uma ferramenta de automação: suporta a tecnologia do sistema? O time tem skills ou tem tempo para aprender? Cabe no orçamento?" },
      { emoji: "🧪", titulo: "Prova de conceito (PoC)", explicacao: "Testar a ferramenta num cenário real e limitado antes de comprometer o time inteiro. Reduz o risco de uma adoção mal-sucedida.", exemplo: "Antes de adotar Playwright para o time inteiro, um QA faz uma PoC automatizando o fluxo de login em 2 dias para avaliar viabilidade." },
      { emoji: "🚀", titulo: "Piloto de ferramenta", explicacao: "Introduzir a ferramenta gradualmente num projeto menor ou parte do time antes do rollout completo. Aprende-se antes de escalar.", exemplo: "Introduz JMeter num projeto de médio porte com 2 QAs por 1 sprint. Aprende as limitações antes de usar em projetos críticos." },
    ],
    dicaEstudo: "PoC e Piloto são etapas distintas: PoC prova que a ferramenta funciona tecnicamente. Piloto testa a adoção pelo time em contexto real.",
  },
};

export default conteudo;