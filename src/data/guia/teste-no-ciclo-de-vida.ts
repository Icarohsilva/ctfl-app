import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "teste-no-ciclo-de-vida",
  titulo: "Teste no Ciclo de Vida de Software (Cap. 2 CTFL)",
  descricao: "Modelos de desenvolvimento, níveis de teste (unitário, integração, sistema, aceite) e tipos de teste.",
  secao: "ctfl",
  tempoLeitura: 12,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Modelos de desenvolvimento e o teste",
      conteudo: `<p>O modelo de desenvolvimento de software adotado pela equipe determina diretamente como o teste é integrado ao processo. O CTFL v4.0 cobre três grandes abordagens:</p>
<ul>
<li><strong>Modelos sequenciais (Cascata/V):</strong> o teste é realizado em fases após o desenvolvimento. O Modelo V é a evolução do cascata: cada fase de desenvolvimento tem uma fase de teste correspondente (requisitos ↔ teste de aceite, design ↔ teste de sistema, codificação ↔ teste unitário).</li>
<li><strong>Modelos iterativos e incrementais (Agile, Scrum):</strong> o software é desenvolvido em ciclos curtos (sprints). Testes acontecem dentro de cada iteração, e o princípio de "teste contínuo" é fundamental.</li>
<li><strong>DevOps e entrega contínua:</strong> testes automatizados são integrados ao pipeline CI/CD. O feedback é imediato e a qualidade é responsabilidade de todo o time.</li>
</ul>
<p>O CTFL v4.0 enfatiza que, independentemente do modelo, o princípio de <strong>teste inicial</strong> deve ser respeitado: quanto mais cedo os testes são realizados, mais baratos são os defeitos encontrados.</p>`,
      videoId: "modelos-desenvolvimento",
    },
    {
      titulo: "Níveis de teste",
      conteudo: `<p>Os <strong>níveis de teste</strong> definem em qual parte do sistema o teste se concentra:</p>
<ul>
<li><strong>Teste de Componente (Unitário):</strong> testa unidades individuais de código (funções, classes) de forma isolada. Geralmente feito pelo desenvolvedor. Rápido e barato.</li>
<li><strong>Teste de Integração de Componentes:</strong> verifica a comunicação entre componentes já testados individualmente. Encontra problemas nas interfaces entre módulos.</li>
<li><strong>Teste de Sistema:</strong> testa o sistema completo integrado, do ponto de vista do usuário final. Verifica comportamento funcional e não-funcional.</li>
<li><strong>Teste de Integração de Sistemas:</strong> verifica a integração com sistemas externos (APIs, bancos de dados, serviços de terceiros).</li>
<li><strong>Teste de Aceite:</strong> valida se o sistema atende às necessidades do negócio. Inclui UAT (User Acceptance Testing) e testes regulatórios.</li>
</ul>`,
      videoId: "niveis-teste",
    },
    {
      titulo: "Tipos de teste",
      conteudo: `<p>Os <strong>tipos de teste</strong> definem o que está sendo avaliado, independentemente do nível:</p>
<ul>
<li><strong>Teste Funcional:</strong> verifica o que o sistema faz — suas funcionalidades. Baseado em requisitos funcionais.</li>
<li><strong>Teste Não-Funcional:</strong> verifica como o sistema se comporta — performance, segurança, usabilidade, compatibilidade.</li>
<li><strong>Teste Caixa-Preta:</strong> testa sem conhecer o código interno, apenas com entradas e saídas esperadas.</li>
<li><strong>Teste Caixa-Branca:</strong> testa conhecendo a estrutura interna do código, verificando caminhos de execução.</li>
<li><strong>Teste de Regressão:</strong> verifica que mudanças recentes não quebraram funcionalidades que funcionavam antes.</li>
<li><strong>Teste de Confirmação (Re-teste):</strong> verifica que um defeito específico foi corrigido.</li>
</ul>`,
      videoId: "tipos-teste",
    },
    {
      titulo: "Teste de manutenção",
      conteudo: `<p>Sistemas em produção precisam de manutenção contínua — correções de bugs, novas funcionalidades, migração de infraestrutura. O <strong>teste de manutenção</strong> aborda o teste de sistemas já em produção.</p>
<p>Os gatilhos para teste de manutenção incluem: modificações planejadas (novas features), correções de emergência e migrações (novo servidor, novo banco de dados, nova versão de SO).</p>
<p>Um conceito chave é a <strong>análise de impacto</strong>: antes de testar, identifica-se quais partes do sistema foram afetadas pela mudança. Isso permite focar o esforço de regressão nas áreas de maior risco, em vez de retestar tudo do zero.</p>`,
      videoId: "teste-manutencao",
    },
  ],
  quiz: [
    {
      pergunta: "No Modelo V de desenvolvimento, o teste de aceite corresponde a qual fase de desenvolvimento?",
      opcoes: ["Codificação", "Design de componentes", "Design de sistema", "Análise de requisitos"],
      correta: 3,
      explicacao: "No Modelo V, cada fase de desenvolvimento tem uma fase de teste correspondente. O Teste de Aceite valida se os requisitos de negócio foram atendidos, correspondendo à fase de Análise de Requisitos.",
    },
    {
      pergunta: "Qual nível de teste verifica a comunicação e as interfaces entre módulos que já foram testados individualmente?",
      opcoes: ["Teste de componente (unitário)", "Teste de integração de componentes", "Teste de sistema", "Teste de aceite"],
      correta: 1,
      explicacao: "O Teste de Integração de Componentes verifica como módulos já testados individualmente se comunicam entre si, encontrando problemas nas interfaces e contratos entre eles.",
    },
    {
      pergunta: "Um testador verifica se o sistema mantém seu desempenho adequado com 10.000 usuários simultâneos. Que tipo de teste é esse?",
      opcoes: ["Teste funcional", "Teste de regressão", "Teste não-funcional", "Teste de confirmação"],
      correta: 2,
      explicacao: "Performance com múltiplos usuários simultâneos é uma característica de qualidade não-funcional (carga/stress). Testes não-funcionais avaliam COMO o sistema se comporta, não o QUE ele faz.",
    },
    {
      pergunta: "Após corrigir um bug reportado pelo testador, o desenvolvedor entrega a correção. Qual tipo de teste o testador deve executar primeiro?",
      opcoes: ["Teste de regressão", "Teste de confirmação (re-teste)", "Teste de aceite", "Teste de integração"],
      correta: 1,
      explicacao: "O Teste de Confirmação (re-teste) verifica especificamente se o defeito reportado foi corrigido. O Teste de Regressão verifica se a correção não quebrou nada mais — ambos são importantes, mas o re-teste vem primeiro.",
    },
    {
      pergunta: "O que é análise de impacto no contexto do teste de manutenção?",
      opcoes: [
        "Avaliar o impacto dos defeitos no negócio",
        "Identificar quais partes do sistema foram afetadas por uma mudança para focar o esforço de regressão",
        "Medir o tempo necessário para executar todos os testes de regressão",
        "Documentar os riscos identificados durante o planejamento de teste",
      ],
      correta: 1,
      explicacao: "A análise de impacto identifica quais partes do sistema foram afetadas por uma mudança (nova feature, correção, migração), permitindo focar o teste de regressão nas áreas de maior risco em vez de retestar tudo.",
    },
  ],
};
