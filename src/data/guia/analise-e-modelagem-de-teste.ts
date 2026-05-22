import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "analise-e-modelagem-de-teste",
  titulo: "Análise e Modelagem de Teste (Cap. 4 CTFL)",
  descricao: "Técnicas caixa-preta (partição de equivalência, valor-limite, tabela de decisão, transição de estado) e caixa-branca.",
  secao: "ctfl",
  tempoLeitura: 14,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Partição de Equivalência",
      conteudo: `<p>A <strong>Partição de Equivalência (PE)</strong> divide os dados de entrada em grupos (partições) onde todos os valores do grupo devem se comportar da mesma forma. A ideia é que se um valor dentro da partição revela um defeito, todos os outros valores também revelariam — e vice-versa.</p>
<p>Isso permite reduzir drasticamente o número de casos de teste sem perder cobertura. Em vez de testar 100 valores numéricos válidos, você testa um representante de cada partição.</p>
<p>Exemplo: campo "Idade" que aceita valores entre 18 e 65 anos. Partições:</p>
<ul>
<li>Partição inválida: valores abaixo de 18 (ex: 17)</li>
<li>Partição válida: valores entre 18 e 65 (ex: 30)</li>
<li>Partição inválida: valores acima de 65 (ex: 66)</li>
</ul>`,
      videoId: "particao-equivalencia",
    },
    {
      titulo: "Análise de Valor Limite",
      conteudo: `<p>A <strong>Análise de Valor Limite (AVL)</strong> complementa a PE focando nos <em>limites</em> das partições, onde defeitos se concentram com mais frequência. Desenvolvedores frequentemente erram nas condições de fronteira (usar &lt; em vez de &lt;=, por exemplo).</p>
<p>Para o CTFL v4.0, testamos os valores <strong>no limite</strong> e <strong>imediatamente além do limite</strong> (2 pontos por limite). Versões anteriores usavam 3 pontos (abaixo, no limite, acima).</p>
<p>Usando o mesmo exemplo de "Idade" (18-65):</p>
<ul>
<li>Limite inferior: testar 17 (inválido) e 18 (válido)</li>
<li>Limite superior: testar 65 (válido) e 66 (inválido)</li>
</ul>
<p>Resultado: 4 casos de teste cobrem os 4 pontos críticos da fronteira.</p>`,
      videoId: "analise-valor-limite",
    },
    {
      titulo: "Tabela de Decisão",
      conteudo: `<p>A <strong>Tabela de Decisão</strong> é ideal para requisitos com múltiplas condições combinadas que geram diferentes ações. Ela mapeia sistematicamente todas as combinações possíveis de condições e seus resultados esperados.</p>
<p>Estrutura de uma tabela de decisão:</p>
<ul>
<li><strong>Condições:</strong> as entradas ou estados do sistema (linhas superiores)</li>
<li><strong>Ações:</strong> os resultados esperados para cada combinação (linhas inferiores)</li>
<li><strong>Regras:</strong> cada coluna representa uma combinação de condições</li>
</ul>
<p>Exemplo: sistema de desconto onde "Cliente Premium" E "Compra acima de R$500" dão 20% de desconto; apenas um dos dois dá 10%; nenhum dos dois dá 0%.</p>`,
      videoId: "tabela-decisao",
    },
    {
      titulo: "Teste de Transição de Estado",
      conteudo: `<p>O <strong>Teste de Transição de Estado</strong> é usado quando o comportamento do sistema depende do seu estado atual. Sistemas com estados são representados por um diagrama de estados: círculos são estados, setas são transições disparadas por eventos.</p>
<p>Exemplo clássico: uma conta bancária tem estados (Ativa, Bloqueada, Encerrada). Cada transição (bloquear, desbloquear, encerrar) tem condições e ações associadas.</p>
<p>Cobertura em testes de transição de estado:</p>
<ul>
<li><strong>Cobertura de todos os estados:</strong> visitar cada estado ao menos uma vez</li>
<li><strong>Cobertura de todas as transições válidas:</strong> exercitar cada transição permitida</li>
<li><strong>Cobertura de transições inválidas:</strong> verificar que transições proibidas são rejeitadas</li>
</ul>`,
      videoId: "transicao-estado",
    },
    {
      titulo: "Teste Caixa-Branca e Baseado em Experiência",
      conteudo: `<p>O <strong>Teste Caixa-Branca</strong> (estrutural) usa o conhecimento da estrutura interna do código para criar casos de teste. A principal métrica é a <strong>cobertura de código</strong>:</p>
<ul>
<li><strong>Cobertura de instruções:</strong> percentual de linhas de código executadas</li>
<li><strong>Cobertura de ramificações:</strong> percentual de branches (if/else, switch) exercitados — mais rigorosa</li>
</ul>
<p>O <strong>Teste Baseado em Experiência</strong> usa o conhecimento e intuição do testador. As técnicas incluem:</p>
<ul>
<li><strong>Suposição de Erros (Error Guessing):</strong> o testador usa sua experiência para supor onde defeitos provavelmente estão.</li>
<li><strong>Teste Exploratório:</strong> design e execução simultâneos, guiados pela aprendizagem contínua durante o teste.</li>
<li><strong>Teste Baseado em Checklist:</strong> uso de listas de verificação derivadas de experiências anteriores.</li>
</ul>`,
      videoId: "caixa-branca",
    },
  ],
  quiz: [
    {
      pergunta: "Um campo aceita idades entre 18 e 65 anos. Usando Análise de Valor Limite (2 pontos), quais valores devem ser testados no limite inferior?",
      opcoes: ["17 e 18", "18 e 19", "17, 18 e 19", "16, 17 e 18"],
      correta: 0,
      explicacao: "Na AVL com 2 pontos, testamos o valor imediatamente abaixo do limite (17 — inválido) e o valor no limite (18 — válido). O limite inferior é 18, então testamos 17 e 18.",
    },
    {
      pergunta: "Qual técnica de caixa-preta é mais adequada quando o comportamento do sistema depende de múltiplas condições combinadas?",
      opcoes: ["Partição de Equivalência", "Análise de Valor Limite", "Tabela de Decisão", "Teste de Transição de Estado"],
      correta: 2,
      explicacao: "A Tabela de Decisão é ideal para requisitos com múltiplas condições que se combinam para produzir diferentes ações, mapeando sistematicamente todas as combinações possíveis.",
    },
    {
      pergunta: "No teste de transição de estado, o que representa uma 'transição inválida'?",
      opcoes: [
        "Uma transição que nunca ocorre na prática",
        "Uma transição de um estado para outro que o sistema não deveria permitir",
        "Uma transição com dados de entrada incorretos",
        "Uma transição que leva ao estado inicial",
      ],
      correta: 1,
      explicacao: "Transições inválidas são aquelas que o sistema não deveria permitir — por exemplo, tentar encerrar uma conta já encerrada ou desbloquear uma conta ativa. Testar essas situações verifica que o sistema rejeita corretamente estados proibidos.",
    },
    {
      pergunta: "Qual é a diferença entre cobertura de instruções e cobertura de ramificações no teste caixa-branca?",
      opcoes: [
        "Cobertura de instruções é mais rigorosa pois exige 100% do código executado",
        "Cobertura de ramificações é mais rigorosa pois exige que todos os branches (if/else) sejam exercitados",
        "São equivalentes — atingir uma implica atingir a outra",
        "Cobertura de instruções cobre código; cobertura de ramificações cobre dados",
      ],
      correta: 1,
      explicacao: "Cobertura de ramificações é mais rigorosa: você pode executar todas as linhas (100% de instruções) sem testar todos os branches. Ex: um if sem else — a instrução é executada, mas o branch 'false' pode nunca ser exercitado.",
    },
    {
      pergunta: "O que é teste exploratório?",
      opcoes: [
        "Teste sem planejamento prévio, executado de forma aleatória",
        "Teste em que o design e execução ocorrem simultaneamente, guiados por aprendizagem contínua",
        "Teste de novas funcionalidades antes de qualquer documentação",
        "Teste realizado por usuários finais sem conhecimento técnico",
      ],
      correta: 1,
      explicacao: "O teste exploratório é uma técnica baseada em experiência onde o testador projeta e executa os testes simultaneamente, usando o que aprende durante o processo para guiar os próximos passos. Não é aleatório — é intencional e orientado por heurísticas.",
    },
  ],
};
