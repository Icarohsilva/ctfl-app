import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "teste-estatico",
  titulo: "Teste Estático (Cap. 3 CTFL)",
  descricao: "Revisões de código, análise estática, benefícios do teste estático e como aplicar em projetos reais.",
  secao: "ctfl",
  tempoLeitura: 9,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "O que é teste estático?",
      conteudo: `<p>O <strong>teste estático</strong> examina artefatos de software <em>sem executá-los</em>. Isso inclui código-fonte, documentos de requisitos, casos de uso, planos de teste, modelos de arquitetura e qualquer outro artefato produzido durante o desenvolvimento.</p>
<p>Ao contrário do <strong>teste dinâmico</strong> (que executa o software com entradas e verifica saídas), o teste estático analisa o artefato em si — sua estrutura, consistência, completude e conformidade com padrões.</p>
<p>O benefício central é o <strong>custo</strong>: defeitos encontrados em documentos ou código antes da execução custam uma fração do que custaria encontrá-los em produção. Uma ambiguidade num requisito, identificada numa revisão, pode evitar semanas de retrabalho.</p>`,
      videoId: "fundamentos-estatico",
    },
    {
      titulo: "Tipos de revisão",
      conteudo: `<p>O CTFL v4.0 define quatro tipos de revisão em ordem crescente de formalidade:</p>
<ul>
<li><strong>Revisão Informal:</strong> sem processo definido. Um colega lê o documento ou código e dá feedback. Rápida e barata, mas sem registro formal.</li>
<li><strong>Walkthrough:</strong> o autor conduz a revisão, guiando os revisores pelo artefato. Foco em aprendizado e descoberta de problemas. Sem papéis formais obrigatórios.</li>
<li><strong>Revisão Técnica:</strong> conduzida por colegas técnicos (não o autor). Mais estruturada, com registro de defeitos encontrados. Foco em consenso técnico.</li>
<li><strong>Inspeção:</strong> o processo mais formal. Tem papéis definidos (moderador, autor, revisor, relator), processo documentado, métricas coletadas e critérios de entrada/saída. Alta taxa de detecção de defeitos, mas custo maior.</li>
</ul>`,
      videoId: "processo-revisao",
    },
    {
      titulo: "Análise estática com ferramentas",
      conteudo: `<p>A <strong>análise estática automatizada</strong> usa ferramentas para examinar o código sem executá-lo. Exemplos populares: ESLint (JavaScript), SonarQube (multi-linguagem), PMD (Java).</p>
<p>Essas ferramentas identificam:</p>
<ul>
<li>Violações de padrões de codificação</li>
<li>Vulnerabilidades de segurança conhecidas</li>
<li>Código duplicado (duplicação)</li>
<li>Complexidade ciclomática elevada (código difícil de testar)</li>
<li>Variáveis não inicializadas ou fluxos de controle problemáticos</li>
</ul>
<p>A análise estática não substitui a revisão humana — ela complementa, automatizando a verificação de padrões mecânicos para que os revisores humanos foquem em questões de lógica e design.</p>`,
      videoId: "analise-estatica",
    },
  ],
  quiz: [
    {
      pergunta: "Qual é a principal diferença entre teste estático e teste dinâmico?",
      opcoes: [
        "Teste estático usa ferramentas; teste dinâmico é manual",
        "Teste estático examina artefatos sem executá-los; teste dinâmico executa o software",
        "Teste estático é feito antes do desenvolvimento; teste dinâmico é feito depois",
        "Teste estático verifica performance; teste dinâmico verifica funcionalidade",
      ],
      correta: 1,
      explicacao: "A distinção fundamental é a execução: teste estático examina artefatos (código, documentos) sem executar o software. Teste dinâmico executa o software com entradas e verifica as saídas.",
    },
    {
      pergunta: "Qual tipo de revisão é o mais formal, com papéis definidos, processo documentado e métricas coletadas?",
      opcoes: ["Revisão informal", "Walkthrough", "Revisão técnica", "Inspeção"],
      correta: 3,
      explicacao: "A Inspeção é o tipo de revisão mais formal do CTFL: tem papéis definidos (moderador, autor, revisor, relator), segue um processo documentado e coleta métricas para melhoria contínua.",
    },
    {
      pergunta: "Durante um walkthrough, quem conduz a sessão de revisão?",
      opcoes: ["O moderador externo", "O autor do artefato", "O líder do projeto", "O testador líder"],
      correta: 1,
      explicacao: "No Walkthrough, o próprio autor guia os revisores pelo artefato, explicando decisões e buscando feedback. Isso o diferencia da Inspeção, onde um moderador neutro conduz o processo.",
    },
    {
      pergunta: "Uma ferramenta como SonarQube que analisa código-fonte sem executá-lo é um exemplo de:",
      opcoes: ["Teste de regressão automatizado", "Análise estática", "Teste de caixa-branca dinâmico", "Ferramenta de gerenciamento de defeitos"],
      correta: 1,
      explicacao: "Ferramentas como SonarQube, ESLint e PMD realizam análise estática automatizada — examinam o código-fonte sem executá-lo, identificando padrões problemáticos, vulnerabilidades e violações de boas práticas.",
    },
    {
      pergunta: "Por que o teste estático é considerado mais barato que o teste dinâmico para encontrar certos tipos de defeito?",
      opcoes: [
        "Porque usa menos ferramentas",
        "Porque defeitos em artefatos encontrados cedo (antes da execução) custam muito menos para corrigir",
        "Porque não exige testadores especializados",
        "Porque pode ser feito sem acesso ao código-fonte",
      ],
      correta: 1,
      explicacao: "O custo de correção de defeitos cresce exponencialmente com o tempo. Uma ambiguidade num requisito identificada em revisão custa horas; o mesmo problema identificado em produção pode custar semanas de retrabalho.",
    },
  ],
};
