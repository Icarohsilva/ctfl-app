import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "fundamentos-de-teste",
  titulo: "Fundamentos de Teste de Software (Cap. 1 CTFL)",
  descricao: "Os 7 princípios do teste, conceitos de erro, defeito e falha, atividades e papéis no processo de teste.",
  secao: "ctfl",
  tempoLeitura: 12,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Por que o teste de software é necessário?",
      conteudo: `<p>Sistemas de software estão presentes em praticamente todas as áreas da vida moderna — saúde, aviação, finanças, comunicação. Quando esses sistemas falham, as consequências podem ir de mero inconveniente a perdas financeiras enormes ou até riscos à vida humana.</p>
<p>O teste de software existe para <strong>reduzir o risco de falhas em produção</strong>. Ele não garante que o software é perfeito — isso seria impossível na prática — mas aumenta a confiança de que o sistema funciona conforme o esperado para os casos mais importantes.</p>
<p>Além de encontrar defeitos, o teste contribui para a qualidade de outras formas: fornece informações para decisões de liberação, verifica que requisitos foram atendidos e ajuda a cumprir requisitos contratuais e regulatórios.</p>`,
      videoId: "por-que-testar",
    },
    {
      titulo: "Os 7 Princípios do Teste",
      conteudo: `<p>O CTFL v4.0 define 7 princípios fundamentais que guiam como o teste deve ser abordado:</p>
<ol>
<li><strong>O teste demonstra a presença de defeitos, não a ausência.</strong> Testes encontram problemas, mas não provam que não existem outros.</li>
<li><strong>Testes exaustivos são impossíveis.</strong> Testar todas as combinações possíveis de entradas seria impraticável — priorizamos com base em risco.</li>
<li><strong>O teste inicial economiza tempo e dinheiro.</strong> Defeitos encontrados cedo custam muito menos para corrigir.</li>
<li><strong>Os defeitos se agrupam.</strong> A maioria dos problemas costuma estar concentrada em poucos módulos do sistema (Princípio de Pareto).</li>
<li><strong>Os testes se desgastam.</strong> Rodar os mesmos testes indefinidamente reduz sua eficácia — é necessário variar as abordagens.</li>
<li><strong>O teste depende do contexto.</strong> O que é adequado para um app bancário pode ser excessivo para um site institucional.</li>
<li><strong>A ausência de defeitos é uma falácia.</strong> Um sistema sem bugs ainda pode ser inútil se não atender às necessidades reais do usuário.</li>
</ol>`,
      videoId: "7-principios",
    },
    {
      titulo: "Erro, Defeito e Falha: terminologia essencial",
      conteudo: `<p>Uma das principais fontes de questões no exame CTFL é a distinção precisa entre esses três termos:</p>
<ul>
<li><strong>Erro (Error):</strong> uma ação humana que produz um resultado incorreto. É o que acontece na cabeça do desenvolvedor — um equívoco de raciocínio, um descuido, uma interpretação errada do requisito.</li>
<li><strong>Defeito (Defect / Bug):</strong> a manifestação do erro no artefato — no código, no documento, na configuração. É o que existe no sistema antes de ser executado.</li>
<li><strong>Falha (Failure):</strong> o comportamento incorreto observado quando o software é executado. É o sintoma visível ao usuário ou ao testador.</li>
</ul>
<p>A cadeia é: <strong>erro → defeito → falha</strong>. Um desenvolvedor comete um erro que introduz um defeito no código. Quando o código é executado, o defeito pode causar uma falha. Importante: nem todo defeito sempre causa falha — pode depender de condições específicas de execução.</p>`,
      videoId: "erro-defeito-falha",
    },
    {
      titulo: "Atividades e papéis no processo de teste",
      conteudo: `<p>O processo de teste do CTFL é composto por atividades principais:</p>
<ul>
<li><strong>Planejamento de teste:</strong> definir objetivos, estratégia, recursos e cronograma.</li>
<li><strong>Monitoramento e controle:</strong> acompanhar o progresso e tomar ações corretivas.</li>
<li><strong>Análise de teste:</strong> identificar o que testar com base em bases de teste (requisitos, código, etc.).</li>
<li><strong>Modelagem de teste:</strong> definir como testar — criar casos de teste, dados e ambiente.</li>
<li><strong>Implementação de teste:</strong> preparar o ambiente e automatizar quando aplicável.</li>
<li><strong>Execução de teste:</strong> rodar os testes e registrar os resultados.</li>
<li><strong>Conclusão de teste:</strong> arquivar artefatos, gerar relatório final, compartilhar lições aprendidas.</li>
</ul>
<p>Os papéis centrais são o <strong>Testador</strong> (executa testes, relata defeitos, cria casos de teste) e o <strong>Líder/Gerente de Teste</strong> (planeja, coordena, reporta). Em times ágeis, esses papéis são frequentemente compartilhados entre o time.</p>`,
      videoId: "atividades-e-papeis",
    },
  ],
  quiz: [
    {
      pergunta: "Segundo o CTFL, qual é o objetivo principal do teste de software?",
      opcoes: ["Provar que o software não tem defeitos", "Reduzir o risco de falhas em produção e aumentar a confiança na qualidade", "Garantir que todos os requisitos foram implementados", "Substituir a revisão de código pelos desenvolvedores"],
      correta: 1,
      explicacao: "O teste reduz o risco de falhas e aumenta a confiança, mas não prova ausência de defeitos — esse é justamente o 1º princípio do CTFL: o teste demonstra a presença, não a ausência de defeitos.",
    },
    {
      pergunta: "Um desenvolvedor interpreta errado um requisito e escreve código incorreto. Esse código, quando executado, exibe um valor errado para o usuário. Classifique corretamente cada elemento:",
      opcoes: [
        "A interpretação errada é defeito; o código incorreto é erro; o valor errado é falha",
        "A interpretação errada é erro; o código incorreto é defeito; o valor errado é falha",
        "A interpretação errada é falha; o código incorreto é erro; o valor errado é defeito",
        "Todos os três são chamados de defeito no CTFL",
      ],
      correta: 1,
      explicacao: "Erro é a ação humana (interpretação incorreta), defeito é o resultado no artefato (código incorreto) e falha é o comportamento incorreto observado na execução (valor errado exibido).",
    },
    {
      pergunta: "Qual princípio do teste afirma que a maioria dos defeitos tende a estar concentrada em poucos módulos do sistema?",
      opcoes: ["Testes exaustivos são impossíveis", "O teste inicial economiza tempo", "Os defeitos se agrupam", "Os testes se desgastam"],
      correta: 2,
      explicacao: "O princípio 'Os defeitos se agrupam' (também chamado de clustering) indica que a maioria dos problemas está concentrada em poucas partes do sistema, guiando a priorização dos esforços de teste.",
    },
    {
      pergunta: "O que significa dizer que 'os testes se desgastam'?",
      opcoes: [
        "Os testes ficam mais lentos com o tempo",
        "Rodar os mesmos testes repetidamente reduz sua capacidade de encontrar novos defeitos",
        "Os testadores perdem motivação ao repetir os mesmos testes",
        "Os dados de teste se tornam inválidos ao longo do tempo",
      ],
      correta: 1,
      explicacao: "Este princípio (paradoxo do pesticida) indica que executar sempre os mesmos testes eventualmente não encontra mais defeitos novos, pois o software se 'adapta'. É necessário revisar e atualizar os testes periodicamente.",
    },
    {
      pergunta: "Qual atividade do processo de teste envolve definir COMO testar — criando casos de teste e dados de teste?",
      opcoes: ["Análise de teste", "Modelagem de teste", "Implementação de teste", "Planejamento de teste"],
      correta: 1,
      explicacao: "A Modelagem de Teste (Test Design) define como testar: cria casos de teste de alto nível, identifica dados de teste e define o ambiente necessário. A Análise define o QUE testar; a Implementação prepara o ambiente e automatiza.",
    },
  ],
};
