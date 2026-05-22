import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "como-se-preparar-ctfl",
  titulo: "Como se preparar para o CTFL: passo a passo",
  descricao: "Plano de estudo detalhado para o CTFL v4.0: cronograma, recursos recomendados, dicas de simulado e estratégias para a prova.",
  secao: "ctfl",
  tempoLeitura: 10,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Quanto tempo você precisa para se preparar?",
      conteudo: `<p>O tempo de preparação varia muito com o seu nível de experiência em teste de software:</p>
<ul>
<li><strong>Iniciante (sem experiência em QA):</strong> 8 a 12 semanas estudando 1 hora por dia</li>
<li><strong>Com experiência prática em testes:</strong> 4 a 6 semanas estudando 45 minutos por dia</li>
<li><strong>QA sênior ou líder de qualidade:</strong> 2 a 3 semanas de revisão focada</li>
</ul>
<p>A honestidade sobre o próprio nível é crucial. Subestimar o exame é um erro comum — o CTFL cobra conceitos específicos com terminologia precisa, e saber testar na prática não substitui conhecer o vocabulário formal do ISTQB.</p>`,
    },
    {
      titulo: "O material de estudo oficial",
      conteudo: `<p>O ponto de partida é o <strong>syllabus oficial do CTFL v4.0</strong>, disponível gratuitamente no site do ISTQB (istqb.org). Esse documento define exatamente o que cai no exame. Não há justificativa para não lê-lo — é o gabarito do que você precisa saber.</p>
<p>Além do syllabus, os recursos mais recomendados pela comunidade de QA são:</p>
<ul>
<li><strong>Livro "Foundations of Software Testing"</strong> (Black, Veenendaal, Graham) — baseado no syllabus, bom para aprofundar conceitos</li>
<li><strong>Simulados do BSTQB e ISTQB</strong> — disponíveis nos sites oficiais gratuitamente</li>
<li><strong>Plataformas de simulado com IA</strong> — como o TestPath, que gera questões únicas por sessão e explica cada resposta</li>
<li><strong>Vídeos explicativos no YouTube</strong> — busque pelo nome de cada tópico do syllabus</li>
</ul>`,
    },
    {
      titulo: "Plano de estudo semana a semana",
      conteudo: `<p>Abaixo, um plano de 8 semanas para iniciantes:</p>
<ul>
<li><strong>Semana 1:</strong> Capítulo 1 — Fundamentos de Teste (por que testar, princípios, processo)</li>
<li><strong>Semana 2:</strong> Capítulo 2 — Teste no Ciclo de Vida (modelos de desenvolvimento, níveis, tipos)</li>
<li><strong>Semana 3:</strong> Capítulo 3 — Teste Estático (revisões, análise estática)</li>
<li><strong>Semana 4 e 5:</strong> Capítulo 4 — Análise e Modelagem (técnicas de caixa-preta e caixa-branca) — vale duas semanas pela complexidade</li>
<li><strong>Semana 6:</strong> Capítulo 5 — Gerenciamento de Atividades de Teste</li>
<li><strong>Semana 7:</strong> Capítulo 6 — Ferramentas de Suporte ao Teste</li>
<li><strong>Semana 8:</strong> Revisão geral + simulados completos</li>
</ul>
<p>A semana 8 é onde muitos candidatos passam ou falham: fazer pelo menos 3 simulados completos de 40 questões em 60 minutos é indispensável.</p>`,
    },
    {
      titulo: "Como usar simulados de forma eficiente",
      conteudo: `<p>Fazer simulados errado é pior do que não fazê-los. Veja a estratégia correta:</p>
<ul>
<li><strong>Não faça simulados antes de estudar o conteúdo.</strong> Simulados são para fixação, não para aprendizado inicial.</li>
<li><strong>Leia a explicação de cada questão errada.</strong> Entender por que você errou é mais valioso do que o número de acertos.</li>
<li><strong>Simule as condições reais:</strong> timer ligado, sem interrupções, sem consulta ao material.</li>
<li><strong>Foque nas questões de Capítulo 4 e 5</strong> — elas respondem por 50% do exame.</li>
<li><strong>Use a fila de revisão:</strong> questões que você errou devem voltar até você acertar consistentemente.</li>
</ul>
<p>Uma pontuação de 75-80% nos simulados antes da prova é um bom sinal de preparo.</p>`,
    },
    {
      titulo: "No dia da prova",
      conteudo: `<p>Algumas dicas práticas para o dia do exame:</p>
<ul>
<li><strong>Leia o enunciado com atenção total.</strong> Muitas questões do CTFL têm pegadinhas sutis de terminologia — "sempre", "nunca", "principalmente" são palavras que mudam a resposta.</li>
<li><strong>Não confunda a resposta "certa na prática" com a resposta "certa segundo o ISTQB."</strong> O exame cobra a visão do syllabus, não a realidade da sua empresa.</li>
<li><strong>Responda todas as questões</strong> — não há penalização por respostas erradas. Se não sabe, chute.</li>
<li><strong>Reserve os últimos 10 minutos para revisar</strong> as questões em que você ficou em dúvida.</li>
<li><strong>Durma bem na noite anterior.</strong> Cansaço é inimigo da concentração em questões de interpretação.</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual é o recurso de estudo mais importante e obrigatório para quem vai fazer o CTFL?",
      opcoes: ["Livro 'Foundations of Software Testing'", "Syllabus oficial do CTFL v4.0 no site do ISTQB", "Vídeos no YouTube sobre teste de software", "Experiência prática em projetos de QA"],
      correta: 1,
      explicacao: "O syllabus oficial do CTFL v4.0, disponível gratuitamente no site do ISTQB, define exatamente o que é cobrado no exame. É o ponto de partida obrigatório para qualquer candidato.",
    },
    {
      pergunta: "Qual capítulo do CTFL deve receber mais tempo de estudo por sua complexidade E peso no exame?",
      opcoes: ["Capítulo 1 — Fundamentos", "Capítulo 3 — Teste Estático", "Capítulo 4 — Análise e Modelagem", "Capítulo 6 — Ferramentas"],
      correta: 2,
      explicacao: "O Capítulo 4 tem 11 questões no exame (o maior peso) e cobre técnicas de caixa-preta e caixa-branca, que exigem prática e memorização. Merece duas semanas de estudo no plano de 8 semanas.",
    },
    {
      pergunta: "Qual pontuação nos simulados é considerada um bom indicador de preparo para a prova real?",
      opcoes: ["Acima de 50%", "Acima de 60%", "Acima de 65%", "Acima de 75%"],
      correta: 3,
      explicacao: "Uma pontuação de 75-80% nos simulados oferece uma margem de segurança adequada sobre a nota mínima de aprovação (65%), considerando que a pressão do exame real pode afetar o desempenho.",
    },
    {
      pergunta: "Ao errar uma questão no simulado, qual é a atitude mais produtiva?",
      opcoes: ["Marcar como errada e seguir para a próxima", "Ler a explicação da questão para entender o erro", "Refazer o simulado imediatamente", "Buscar a resposta no syllabus"],
      correta: 1,
      explicacao: "Ler a explicação de cada questão errada é mais valioso do que o número de acertos. Entender por que você errou fixa o conceito correto e evita repetir o mesmo erro no exame.",
    },
    {
      pergunta: "No CTFL, quando uma questão cobre uma prática que difere do que você faz na sua empresa, você deve:",
      opcoes: ["Responder com base na sua experiência prática", "Responder com base no que o syllabus do ISTQB define", "Deixar a questão em branco", "Escolher a alternativa mais conservadora"],
      correta: 1,
      explicacao: "O CTFL avalia o conhecimento do syllabus do ISTQB, não a realidade de cada empresa. A resposta correta é sempre a que o syllabus define como correta, mesmo que sua experiência prática seja diferente.",
    },
  ],
};
