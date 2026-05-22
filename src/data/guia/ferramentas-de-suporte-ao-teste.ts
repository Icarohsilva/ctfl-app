import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "ferramentas-de-suporte-ao-teste",
  titulo: "Ferramentas de Suporte ao Teste (Cap. 6 CTFL)",
  descricao: "Categorias de ferramentas de teste, automação, como selecionar e implementar ferramentas em projetos.",
  secao: "ctfl",
  tempoLeitura: 9,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Categorias de ferramentas de teste",
      conteudo: `<p>O CTFL classifica as ferramentas de suporte ao teste por função:</p>
<ul>
<li><strong>Ferramentas de gerenciamento de teste:</strong> organizam casos de teste, execução, defeitos e rastreabilidade de requisitos. Exemplos: Jira (com plugins), TestRail, Zephyr.</li>
<li><strong>Ferramentas de teste estático:</strong> análise de código, linters, verificadores de estilo. Exemplos: SonarQube, ESLint, Checkstyle.</li>
<li><strong>Ferramentas de design de teste:</strong> geram casos de teste a partir de modelos, dados ou especificações.</li>
<li><strong>Ferramentas de execução de teste:</strong> automatizam a execução de casos de teste. Exemplos: Selenium, Playwright, Cypress, JUnit, pytest.</li>
<li><strong>Ferramentas de performance:</strong> testam carga, stress e resistência. Exemplos: JMeter, k6, Gatling.</li>
<li><strong>Ferramentas de DevOps/CI:</strong> integram o teste ao pipeline. Exemplos: GitHub Actions, Jenkins, GitLab CI.</li>
</ul>`,
      videoId: "ferramentas-suporte",
    },
    {
      titulo: "Benefícios e riscos da automação de teste",
      conteudo: `<p>A automação de teste oferece benefícios reais, mas traz riscos que precisam ser gerenciados:</p>
<p><strong>Benefícios:</strong></p>
<ul>
<li>Redução de esforço em tarefas repetitivas (regressão)</li>
<li>Execução mais rápida e consistente</li>
<li>Feedback imediato em pipelines CI/CD</li>
<li>Possibilidade de testes em múltiplos ambientes e configurações</li>
</ul>
<p><strong>Riscos e limitações:</strong></p>
<ul>
<li>Custo inicial de setup e curva de aprendizado</li>
<li>Manutenção contínua dos testes automatizados (testes frágeis que quebram com mudanças de UI)</li>
<li>Falsa sensação de segurança — automação não substitui testes exploratórios</li>
<li>ROI negativo em sistemas que mudam muito ou têm vida útil curta</li>
</ul>`,
      videoId: "automacao-teste",
    },
    {
      titulo: "Como selecionar e implementar ferramentas",
      conteudo: `<p>A seleção de uma ferramenta de teste deve considerar:</p>
<ul>
<li><strong>Compatibilidade técnica:</strong> linguagem do projeto, SO, browsers suportados</li>
<li><strong>Nível de habilidade do time:</strong> curva de aprendizado vs. skill disponível</li>
<li><strong>Custo total:</strong> licença + treinamento + manutenção</li>
<li><strong>Suporte e comunidade:</strong> ferramentas open-source com comunidade ativa são mais sustentáveis</li>
<li><strong>Integração:</strong> compatibilidade com o restante da toolchain (CI, gerenciamento de defeitos)</li>
</ul>
<p>A implementação deve ser <strong>gradual</strong> — começar com uma área específica, demonstrar valor, e expandir. Projetos piloto reduzem o risco de adopção de ferramentas que não funcionam para o contexto da equipe.</p>`,
      videoId: "selecao-ferramenta",
    },
  ],
  quiz: [
    {
      pergunta: "Um time usa JMeter para simular 5.000 usuários simultâneos acessando o sistema. Qual categoria de ferramenta é o JMeter?",
      opcoes: ["Ferramenta de gerenciamento de teste", "Ferramenta de execução de teste funcional", "Ferramenta de teste de performance", "Ferramenta de análise estática"],
      correta: 2,
      explicacao: "JMeter é uma ferramenta de teste de performance (carga/stress), usada para simular múltiplos usuários e verificar o comportamento do sistema sob carga. Não testa funcionalidades, testa comportamento sob pressão.",
    },
    {
      pergunta: "Qual é o maior risco da automação de testes de interface (UI automation)?",
      opcoes: [
        "Custo de licenciamento das ferramentas",
        "Testes frágeis que quebram com qualquer mudança de interface",
        "Velocidade de execução menor que testes manuais",
        "Impossibilidade de integração com CI/CD",
      ],
      correta: 1,
      explicacao: "Testes de UI são os mais frágeis: qualquer mudança no layout, id, class ou estrutura HTML pode quebrar dezenas de testes. É por isso que boas práticas como Page Object Model e uso de locators semânticos (roles, labels) são fundamentais.",
    },
    {
      pergunta: "Qual afirmação sobre automação de teste está CORRETA segundo o CTFL?",
      opcoes: [
        "Automação substitui completamente o teste exploratório",
        "Automação tem ROI positivo em todos os projetos",
        "Automação reduz esforço em tarefas repetitivas mas exige manutenção contínua",
        "Automação elimina a necessidade de testadores humanos",
      ],
      correta: 2,
      explicacao: "Automação é eficiente para tarefas repetitivas (regressão), mas exige investimento inicial e manutenção contínua. Não substitui testes exploratórios nem elimina a necessidade de julgamento humano.",
    },
    {
      pergunta: "Qual ferramenta é classificada como de 'gerenciamento de teste'?",
      opcoes: ["Selenium", "SonarQube", "TestRail", "JMeter"],
      correta: 2,
      explicacao: "TestRail é uma ferramenta de gerenciamento de teste — organiza casos de teste, execuções, planos de teste e rastreabilidade. Selenium executa testes, SonarQube faz análise estática, JMeter testa performance.",
    },
    {
      pergunta: "Por que a implementação de ferramentas de teste deve ser gradual?",
      opcoes: [
        "Ferramentas de teste são caras e devem ser adquiridas aos poucos",
        "Para reduzir o risco de adotar uma ferramenta que não funciona para o contexto da equipe",
        "Ferramentas novas não suportam todos os tipos de teste de imediato",
        "Para evitar conflitos com ferramentas já utilizadas pelo time de desenvolvimento",
      ],
      correta: 1,
      explicacao: "Projetos piloto em uma área específica permitem validar se a ferramenta funciona bem para o contexto antes de expandir. Isso reduz o risco de investimento significativo em treinamento e setup de uma ferramenta que não atende as necessidades reais.",
    },
  ],
};
