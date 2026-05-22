import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "o-que-e-ctfl",
  titulo: "O que é o CTFL v4.0: guia completo",
  descricao: "Entenda o que é o exame CTFL v4.0 do ISTQB, como funciona, quem deve fazer e o que esperar no dia da prova.",
  secao: "ctfl",
  tempoLeitura: 8,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "O que é o CTFL?",
      conteudo: `<p>O <strong>CTFL (Certified Tester Foundation Level)</strong> é a certificação de entrada do <strong>ISTQB® (International Software Testing Qualifications Board)</strong>, o maior programa de certificação em teste de software do mundo. Com mais de 1,3 milhão de certificados emitidos em mais de 120 países, o CTFL é o ponto de partida padrão para qualquer profissional que queira construir uma carreira sólida em Quality Assurance.</p>
<p>A versão atual é o <strong>CTFL v4.0</strong>, lançada em 2023, com foco em práticas modernas de desenvolvimento ágil, DevOps e entrega contínua. O syllabus foi atualizado para refletir como as equipes de software trabalham hoje, sem abandonar os fundamentos clássicos do teste.</p>
<p>No Brasil, a certificação é aplicada pelo <strong>BSTQB (Brazilian Software Testing Qualifications Board)</strong>, e a prova pode ser feita em português ou inglês.</p>`,
    },
    {
      titulo: "Por que fazer o CTFL?",
      conteudo: `<p>A certificação CTFL abre portas de formas concretas:</p>
<ul>
<li><strong>Reconhecimento internacional:</strong> o certificado é aceito em empresas de tecnologia no mundo inteiro, incluindo multinacionais que contratam QAs no Brasil.</li>
<li><strong>Linguagem comum:</strong> o CTFL padroniza terminologia — quando você diz "defeito", "falha" ou "caso de teste", todos na equipe entendem o mesmo conceito.</li>
<li><strong>Progressão na carreira:</strong> é pré-requisito para certificações avançadas do ISTQB, como CTAL-TA (Test Analyst) e CTAL-TM (Test Manager).</li>
<li><strong>Diferencial salarial:</strong> profissionais certificados tendem a ser mais valorizados em processos seletivos, especialmente em empresas com práticas maduras de QA.</li>
</ul>
<p>Mesmo para quem já trabalha com testes há anos, o CTFL é valioso por organizar e formalizar o conhecimento adquirido na prática.</p>`,
    },
    {
      titulo: "Estrutura do exame",
      conteudo: `<p>O exame CTFL v4.0 tem o seguinte formato:</p>
<ul>
<li><strong>40 questões</strong> de múltipla escolha (4 alternativas, apenas uma correta)</li>
<li><strong>60 minutos</strong> de duração (75 minutos para candidatos em língua não nativa)</li>
<li><strong>Nota mínima para aprovação: 65%</strong> — ou seja, 26 questões corretas de 40</li>
<li>Prova <strong>fechada</strong> — sem consulta a materiais</li>
</ul>
<p>As questões seguem uma distribuição por capítulo do syllabus. O Capítulo 4 (Análise e Modelagem de Teste) tem o maior peso, com 11 questões. Conhecer essa distribuição ajuda a priorizar os estudos.</p>
<p>A distribuição oficial por capítulo é: Cap. 1 — 8 questões, Cap. 2 — 6 questões, Cap. 3 — 4 questões, Cap. 4 — 11 questões, Cap. 5 — 9 questões, Cap. 6 — 2 questões.</p>`,
    },
    {
      titulo: "Quem pode fazer o CTFL?",
      conteudo: `<p>Não há pré-requisito formal para fazer o CTFL v4.0. Qualquer pessoa pode se inscrever, independentemente de formação acadêmica ou tempo de experiência em TI.</p>
<p>Na prática, o exame é mais aproveitado por:</p>
<ul>
<li>Analistas e testadores de software que querem formalizar o conhecimento</li>
<li>Desenvolvedores que querem entender melhor o processo de qualidade</li>
<li>Gerentes de projeto e Scrum Masters que trabalham com equipes de QA</li>
<li>Estudantes de TI que querem se diferenciar no mercado</li>
<li>Profissionais em transição de carreira para a área de QA</li>
</ul>
<p>O nível Foundation é projetado para ser acessível a iniciantes, mas exige estudo sério — especialmente para quem não tem experiência prática com teste de software.</p>`,
    },
    {
      titulo: "Como se inscrever e onde fazer a prova",
      conteudo: `<p>No Brasil, a inscrição é feita diretamente no site do <strong>BSTQB (bstqb.org.br)</strong>. A prova pode ser feita de duas formas:</p>
<ul>
<li><strong>Presencial:</strong> em centros de teste autorizados (como Pearson VUE) em várias cidades brasileiras</li>
<li><strong>Online com supervisão (proctored):</strong> direto do seu computador, com câmera e monitoramento em tempo real</li>
</ul>
<p>O valor do exame varia, mas gira em torno de R$ 600 a R$ 800. Após a aprovação, o certificado é emitido digitalmente pelo ISTQB e fica disponível para verificação no site oficial.</p>
<p>O certificado não tem validade — uma vez aprovado, você é certificado para sempre. Porém, o ISTQB lança novas versões do syllabus periodicamente, e manter-se atualizado é uma boa prática profissional.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Quantas questões compõem o exame CTFL v4.0?",
      opcoes: ["30 questões", "40 questões", "50 questões", "60 questões"],
      correta: 1,
      explicacao: "O exame CTFL v4.0 tem exatamente 40 questões de múltipla escolha, com nota mínima de aprovação de 65% (26 questões corretas).",
    },
    {
      pergunta: "Qual é a nota mínima para aprovação no exame CTFL v4.0?",
      opcoes: ["50%", "60%", "65%", "70%"],
      correta: 2,
      explicacao: "A nota mínima para aprovação é 65%, o que equivale a 26 questões corretas de 40.",
    },
    {
      pergunta: "Qual capítulo do CTFL v4.0 possui o maior número de questões no exame?",
      opcoes: ["Capítulo 1 — Fundamentos", "Capítulo 2 — Ciclo de Vida", "Capítulo 4 — Análise e Modelagem", "Capítulo 5 — Gerenciamento"],
      correta: 2,
      explicacao: "O Capítulo 4 (Análise e Modelagem de Teste) tem 11 questões, o maior peso de todos os capítulos no exame.",
    },
    {
      pergunta: "Qual organização é responsável pela certificação CTFL no Brasil?",
      opcoes: ["ISTQB", "BSTQB", "ABNT", "PMI"],
      correta: 1,
      explicacao: "O BSTQB (Brazilian Software Testing Qualifications Board) é o representante oficial do ISTQB no Brasil e aplica as certificações da linha ISTQB no país.",
    },
    {
      pergunta: "O certificado CTFL possui validade por quantos anos?",
      opcoes: ["2 anos", "5 anos", "10 anos", "Não tem validade"],
      correta: 3,
      explicacao: "O certificado CTFL não tem prazo de validade. Uma vez aprovado, o profissional é certificado permanentemente.",
    },
  ],
};
