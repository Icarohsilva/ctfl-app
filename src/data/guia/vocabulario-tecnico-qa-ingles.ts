import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "vocabulario-tecnico-qa-ingles",
  titulo: "Vocabulário técnico de QA em inglês: bug reports e terminologia",
  descricao: "Os termos técnicos de teste mais usados em inglês: como escrever bug reports, user stories e documentação.",
  secao: "ingles",
  tempoLeitura: 10,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Como escrever um bug report em inglês",
      conteudo: `<p>Um bug report em inglês segue a mesma estrutura que em português, mas com terminologia específica:</p>
<pre><code>Title: [Short, descriptive summary of the bug]
Example: "Login button unresponsive after failed attempt"

Environment:
- Browser: Chrome 120 / macOS Sonoma
- Version: 2.4.1
- URL: https://app.example.com/login

Steps to Reproduce:
1. Navigate to /login
2. Enter invalid credentials
3. Click "Sign In"
4. Observe error message
5. Click "Sign In" again with valid credentials

Expected Result:
User should be redirected to the dashboard.

Actual Result:
The "Sign In" button becomes disabled and page does not respond.

Severity: High
Priority: Critical
Attachments: screenshot.png, console-log.txt</code></pre>`,
    },
    {
      titulo: "Termos de severidade e prioridade",
      conteudo: `<p>Entender as palavras para descrever severidade e prioridade é fundamental em ambientes internacionais:</p>
<p><strong>Severity levels:</strong></p>
<ul>
<li><strong>Critical / Blocker:</strong> impede o uso do sistema. Nenhum workaround disponível.</li>
<li><strong>High / Major:</strong> funcionalidade principal quebrada, mas há alternativa temporária.</li>
<li><strong>Medium / Minor:</strong> funcionalidade secundária afetada.</li>
<li><strong>Low / Trivial:</strong> problema cosmético ou de baixo impacto.</li>
</ul>
<p><strong>Priority levels:</strong></p>
<ul>
<li><strong>Urgent / P0:</strong> precisa ser corrigido imediatamente.</li>
<li><strong>High / P1:</strong> próximo sprint ou hotfix.</li>
<li><strong>Medium / P2:</strong> planejado para sprint futuro.</li>
<li><strong>Low / P3:</strong> backlog, sem data definida.</li>
</ul>`,
    },
    {
      titulo: "Vocabulário de Agile e JIRA",
      conteudo: `<p>Termos essenciais para trabalhar em ambiente Agile com JIRA em inglês:</p>
<ul>
<li><strong>Epic:</strong> grande funcionalidade que abrange várias histórias</li>
<li><strong>Story / User Story:</strong> funcionalidade descrita da perspectiva do usuário</li>
<li><strong>Task:</strong> unidade de trabalho técnico</li>
<li><strong>Subtask:</strong> parte de uma task maior</li>
<li><strong>In Progress:</strong> em andamento</li>
<li><strong>In Review / In QA:</strong> em revisão ou teste</li>
<li><strong>Done / Closed:</strong> concluído</li>
<li><strong>Blocked:</strong> impedido por outro item</li>
<li><strong>Assignee:</strong> responsável pelo item</li>
<li><strong>Reporter:</strong> quem reportou o bug</li>
<li><strong>Fix version:</strong> versão em que o bug será corrigido</li>
<li><strong>Reopened:</strong> bug que voltou após ser marcado como corrigido</li>
</ul>`,
    },
    {
      titulo: "Frases úteis para comentários e code review",
      conteudo: `<p>Comentários profissionais e construtivos em inglês:</p>
<p><strong>Reportando um bug:</strong></p>
<ul>
<li>"I was able to reproduce this on Chrome 120."</li>
<li>"This issue seems to be intermittent — happens ~3 out of 5 times."</li>
<li>"Attached screenshot and console log for reference."</li>
</ul>
<p><strong>Pedindo esclarecimentos:</strong></p>
<ul>
<li>"Could you clarify the expected behavior when the field is empty?"</li>
<li>"What should happen if the user submits the form without filling all required fields?"</li>
</ul>
<p><strong>Confirmando correção:</strong></p>
<ul>
<li>"Verified and closed. Fix is working as expected."</li>
<li>"Tested on all supported browsers. Marking as resolved."</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Em um bug report em inglês, o que deve conter o campo 'Steps to Reproduce'?",
      opcoes: [
        "O código que causa o bug",
        "A sequência exata de ações para chegar ao comportamento incorreto",
        "O histórico de versões onde o bug apareceu",
        "A análise da causa raiz do defeito",
      ],
      correta: 1,
      explicacao: "'Steps to Reproduce' são as instruções passo a passo que permitem ao desenvolvedor reproduzir o bug exatamente. Sem eles, o bug frequentemente é marcado como 'cannot reproduce' e fechado sem correção.",
    },
    {
      pergunta: "Um bug que impede completamente o uso do sistema, sem workaround disponível, tem qual severidade?",
      opcoes: ["Low / Trivial", "Medium / Minor", "High / Major", "Critical / Blocker"],
      correta: 3,
      explicacao: "Critical ou Blocker é reservado para bugs que impedem completamente o uso do sistema ou de uma funcionalidade crítica, sem nenhuma alternativa temporária (workaround) disponível.",
    },
    {
      pergunta: "No JIRA, o que significa um item com status 'Blocked'?",
      opcoes: [
        "O item foi bloqueado pelo gerente e não pode ser alterado",
        "O item está impedido de avançar por uma dependência ou problema externo",
        "O item foi cancelado e não será mais desenvolvido",
        "O item tem bugs críticos que impedem seu fechamento",
      ],
      correta: 1,
      explicacao: "'Blocked' significa que o item não pode avançar devido a uma impedância externa — outra task não concluída, ambiente indisponível, decisão pendente. Blocked items devem ser discutidos na daily para remover o impedimento.",
    },
    {
      pergunta: "Como você diria em inglês que verificou a correção de um bug e ele está funcionando?",
      opcoes: [
        "'Bug is fixed, I think.'",
        "'Verified and closed. Fix is working as expected.'",
        "'The bug was corrected by the developer.'",
        "'I tested it and it seems OK now.'",
      ],
      correta: 1,
      explicacao: "'Verified and closed. Fix is working as expected.' é a forma profissional padrão. Inclui a ação (verified), o resultado (closed) e a confirmação do comportamento (working as expected).",
    },
    {
      pergunta: "O que é um 'workaround' em inglês técnico?",
      opcoes: [
        "Uma solução definitiva para um bug",
        "Uma solução temporária que permite continuar trabalhando apesar do bug",
        "Um teste que verifica se o bug foi corrigido",
        "Uma versão alternativa do software sem o bug",
      ],
      correta: 1,
      explicacao: "Workaround é uma solução temporária ou alternativa que permite ao usuário contornar o problema enquanto a correção definitiva não é entregue. Ex: 'Use o menu lateral em vez do botão com bug até a próxima release.'",
    },
  ],
};
