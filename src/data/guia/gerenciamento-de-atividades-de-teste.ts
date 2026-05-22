import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "gerenciamento-de-atividades-de-teste",
  titulo: "Gerenciamento de Atividades de Teste (Cap. 5 CTFL)",
  descricao: "Planejamento, estimativa, monitoramento, controle de teste, gestão de riscos e defeitos.",
  secao: "ctfl",
  tempoLeitura: 11,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Planejamento de teste",
      conteudo: `<p>O <strong>plano de teste</strong> é o documento central do gerenciamento de testes. Ele define: objetivo do teste, escopo, abordagem, recursos necessários, cronograma, critérios de entrada e saída, e riscos identificados.</p>
<p>Componentes essenciais de um plano de teste segundo o CTFL:</p>
<ul>
<li><strong>Contexto do teste:</strong> o que está sendo testado, quais riscos existem, quais restrições se aplicam.</li>
<li><strong>Abordagem de teste:</strong> quais níveis, tipos e técnicas serão usados.</li>
<li><strong>Critérios de entrada:</strong> o que precisa estar pronto para o teste começar (ex: build estável, ambiente configurado).</li>
<li><strong>Critérios de saída:</strong> o que determina que o teste foi suficiente (ex: 95% dos casos executados, zero defeitos críticos abertos).</li>
<li><strong>Estimativas:</strong> esforço, duração e recursos necessários.</li>
</ul>`,
      videoId: "planejamento-teste",
    },
    {
      titulo: "Monitoramento e controle",
      conteudo: `<p>Planejar não é suficiente — o gerente de testes precisa <strong>monitorar o progresso</strong> continuamente e <strong>tomar ações de controle</strong> quando o plano desvia da realidade.</p>
<p>Métricas comuns de monitoramento:</p>
<ul>
<li>Percentual de casos de teste planejados vs. executados</li>
<li>Número de defeitos encontrados vs. corrigidos vs. fechados</li>
<li>Cobertura de requisitos pelos casos de teste</li>
<li>Burn-down de defeitos ao longo do tempo</li>
</ul>
<p>Quando o progresso desvia do plano, o gerente aplica <strong>controle de teste</strong>: repriorizar casos de teste, alocar mais recursos, reduzir escopo, ou recomendar adiamento da liberação.</p>`,
      videoId: "monitoramento-controle",
    },
    {
      titulo: "Gestão de riscos em teste",
      conteudo: `<p>O <strong>risco</strong> no contexto de teste é a probabilidade de um evento negativo ocorrer, combinada com seu impacto. O CTFL distingue dois tipos:</p>
<ul>
<li><strong>Risco de produto:</strong> a possibilidade de que o software não funcione como esperado (risco de qualidade). Guia a priorização dos testes.</li>
<li><strong>Risco de projeto:</strong> fatores que podem impedir o projeto de entregar no prazo/escopo/custo (falta de pessoal, ambiente instável, requisitos incompletos).</li>
</ul>
<p>A análise de risco de produto envolve dois fatores: <strong>probabilidade</strong> (quão provável é que o defeito exista?) e <strong>impacto</strong> (quão grave seria se ocorresse?). Áreas com alto produto de probabilidade × impacto recebem mais atenção nos testes.</p>`,
      videoId: "gestao-risco",
    },
    {
      titulo: "Gestão de defeitos",
      conteudo: `<p>O processo de gestão de defeitos define como defeitos são reportados, rastreados e resolvidos. Um bom relatório de defeito contém:</p>
<ul>
<li><strong>Identificador único</strong> e data de registro</li>
<li><strong>Título descritivo</strong> — o que está errado</li>
<li><strong>Passos para reproduzir</strong> — exatamente como chegar ao defeito</li>
<li><strong>Resultado esperado vs. resultado atual</strong></li>
<li><strong>Severidade</strong> (impacto técnico) e <strong>prioridade</strong> (urgência de correção)</li>
<li><strong>Ambiente</strong> (versão, SO, browser, dados de teste)</li>
<li><strong>Evidências</strong> (screenshots, logs)</li>
</ul>
<p>O ciclo de vida de um defeito passa por estados: Novo → Atribuído → Em Correção → Aguardando Re-teste → Fechado (ou Reaberto).</p>`,
      videoId: "gestao-defeitos",
    },
  ],
  quiz: [
    {
      pergunta: "O que são 'critérios de saída' em um plano de teste?",
      opcoes: [
        "As condições que precisam ser atendidas para o teste começar",
        "As condições que determinam que o teste foi suficiente para liberar o software",
        "Os critérios para demitir um testador do projeto",
        "As métricas coletadas ao final do projeto para lições aprendidas",
      ],
      correta: 1,
      explicacao: "Critérios de saída (exit criteria / done criteria) definem quando o teste pode ser considerado completo o suficiente — ex: 95% dos casos executados, zero defeitos críticos abertos. Critérios de entrada definem quando o teste pode começar.",
    },
    {
      pergunta: "Qual é a diferença entre severidade e prioridade de um defeito?",
      opcoes: [
        "Severidade é definida pelo testador; prioridade é definida pelo desenvolvedor",
        "Severidade é o impacto técnico do defeito; prioridade é a urgência de correção do ponto de vista do negócio",
        "São sinônimos — ambos medem o quão grave é o defeito",
        "Severidade mede o tempo para corrigir; prioridade mede o impacto no usuário",
      ],
      correta: 1,
      explicacao: "Um defeito pode ter alta severidade (quebra funcionalidade crítica) mas baixa prioridade (ocorre apenas em cenário raramente usado). Ou baixa severidade (erro de digitação) mas alta prioridade (está na tela de login). São dimensões independentes.",
    },
    {
      pergunta: "Qual é a diferença entre risco de produto e risco de projeto?",
      opcoes: [
        "Risco de produto afeta o software; risco de projeto afeta o usuário final",
        "Risco de produto é a possibilidade de o software não funcionar; risco de projeto é o que pode impedir a entrega",
        "São equivalentes — ambos são gerenciados pelo mesmo processo",
        "Risco de produto é técnico; risco de projeto é comercial",
      ],
      correta: 1,
      explicacao: "Risco de produto: o software pode ter defeitos (qualidade). Guia a priorização dos testes. Risco de projeto: fatores que podem impedir a entrega (prazo, recursos, ambiente). Ambos são gerenciados no planejamento de teste.",
    },
    {
      pergunta: "Um testador encontra que apenas 60% dos casos de teste planejados foram executados, mas o prazo se aproxima. Que atividade de gerenciamento de testes deve ser aplicada?",
      opcoes: [
        "Monitoramento — registrar a situação no relatório",
        "Controle — tomar ações como repriorizar casos ou alocar mais recursos",
        "Planejamento — criar um novo plano de teste",
        "Conclusão — encerrar o ciclo de teste atual",
      ],
      correta: 1,
      explicacao: "O controle de teste é a resposta quando o monitoramento indica desvio do plano. O gerente deve tomar ações corretivas: repriorizar casos de teste para cobrir os mais críticos, alocar mais testadores, ou renegociar o escopo.",
    },
    {
      pergunta: "Qual informação é ESSENCIAL em um relatório de defeito para que o desenvolvedor possa reproduzi-lo?",
      opcoes: [
        "O nome do testador que encontrou o defeito",
        "Os passos exatos para reproduzir o defeito",
        "O número de versões anteriores onde o defeito também existia",
        "A estimativa de tempo para correção",
      ],
      correta: 1,
      explicacao: "Sem os passos de reprodução, o desenvolvedor não consegue verificar nem corrigir o defeito. É a informação mais crítica do relatório. Sem ela, o bug tende a ser marcado como 'não reproduzível' e fechado sem correção.",
    },
  ],
};
