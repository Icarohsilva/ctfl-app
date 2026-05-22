import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "o-que-e-playwright",
  titulo: "O que é Playwright: automação moderna de testes web",
  descricao: "Introdução ao Playwright, comparação com Selenium e Cypress, casos de uso e por que aprender em 2025.",
  secao: "playwright",
  tempoLeitura: 8,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "O que é o Playwright?",
      conteudo: `<p>O <strong>Playwright</strong> é um framework de automação de testes web de código aberto desenvolvido pela <strong>Microsoft</strong>. Lançado em 2020, tornou-se rapidamente uma das ferramentas mais adotadas por equipes de QA em todo o mundo.</p>
<p>O Playwright permite escrever testes que simulam ações reais do usuário em um navegador — clicar, preencher formulários, navegar entre páginas, fazer upload de arquivos, interceptar requisições de rede. E faz isso de forma <strong>confiável e rápida</strong>, com suporte nativo a Chromium, Firefox e WebKit (Safari).</p>
<p>Ao contrário de soluções mais antigas, o Playwright foi projetado desde o início para web moderna: aplicações SPA, autenticação OAuth, múltiplas abas, iframes, downloads e muito mais.</p>`,
    },
    {
      titulo: "Playwright vs Selenium vs Cypress",
      conteudo: `<p>As três ferramentas mais populares de automação web têm características distintas:</p>
<ul>
<li><strong>Selenium:</strong> a mais antiga e amplamente adotada. Suporta quase todas as linguagens e navegadores. Porém, é verboso, mais lento e requer configuração complexa (WebDriver). Ainda domina ambientes enterprise legacy.</li>
<li><strong>Cypress:</strong> surgiu como alternativa mais simples ao Selenium. Fácil de configurar, com ótima DX (developer experience). Limitação: só roda no Chrome/Edge e opera dentro do navegador, o que cria restrições para cenários multi-origem (cross-origin) e múltiplas abas.</li>
<li><strong>Playwright:</strong> combina o melhor dos dois. Suporta múltiplos browsers (incluindo Firefox e Safari), múltiplas abas e origens, é mais rápido que Selenium, e tem API moderna. Desvantagem: curva de aprendizado um pouco maior que Cypress para iniciantes.</li>
</ul>
<p>Em 2025, o Playwright é a escolha padrão para novos projetos que precisam de cobertura multi-browser.</p>`,
    },
    {
      titulo: "Casos de uso do Playwright",
      conteudo: `<p>O Playwright é adequado para:</p>
<ul>
<li><strong>Testes de ponta a ponta (E2E):</strong> simular fluxos completos de usuário — cadastro, login, checkout, etc.</li>
<li><strong>Testes de regressão visual:</strong> comparar screenshots para detectar mudanças visuais não intencionais.</li>
<li><strong>Testes de API:</strong> o Playwright tem cliente HTTP integrado, permitindo combinar testes de UI e API no mesmo framework.</li>
<li><strong>Scraping e monitoramento:</strong> extrair dados de páginas web ou verificar disponibilidade de serviços.</li>
<li><strong>Geração de PDFs e screenshots:</strong> automação de relatórios ou capturas programáticas de páginas.</li>
</ul>`,
    },
    {
      titulo: "Por que aprender Playwright em 2025?",
      conteudo: `<p>Alguns indicadores concretos do crescimento do Playwright:</p>
<ul>
<li>Mais de <strong>65.000 estrelas no GitHub</strong> e adoção crescente em pesquisas da comunidade de QA</li>
<li>Suporte oficial de Microsoft, Google e outras grandes empresas</li>
<li>Integrado nativamente em frameworks como Next.js, NestJS e ferramentas como VS Code</li>
<li>Vagas de emprego que mencionam Playwright cresceram mais de 200% entre 2022 e 2024 no LinkedIn</li>
</ul>
<p>Para QAs que querem evoluir para automação, o Playwright é atualmente o investimento com melhor retorno: community ativa, documentação excelente e demanda crescente no mercado.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual empresa desenvolveu o Playwright?",
      opcoes: ["Google", "Meta", "Microsoft", "Amazon"],
      correta: 2,
      explicacao: "O Playwright foi desenvolvido pela Microsoft e lançado como open source em 2020. A equipe é formada por ex-desenvolvedores do Google que trabalharam no Puppeteer.",
    },
    {
      pergunta: "Qual é a principal limitação do Cypress em relação ao Playwright?",
      opcoes: [
        "Cypress não tem suporte a TypeScript",
        "Cypress só suporta Chrome/Edge e tem restrições para múltiplas abas e cross-origin",
        "Cypress não tem integração com CI/CD",
        "Cypress é pago para projetos comerciais",
      ],
      correta: 1,
      explicacao: "O Cypress opera dentro do contexto do navegador, o que cria limitações para cenários multi-origem (cross-origin) e múltiplas abas. O Playwright não tem essas limitações pois usa o protocolo CDP/WebSocket fora do navegador.",
    },
    {
      pergunta: "Para qual cenário o Playwright NÃO é adequado?",
      opcoes: [
        "Testes E2E multi-browser",
        "Testes de regressão visual",
        "Testes de performance/carga com milhares de usuários simultâneos",
        "Testes de API combinados com UI",
      ],
      correta: 2,
      explicacao: "O Playwright não é uma ferramenta de teste de carga/performance. Para simular milhares de usuários simultâneos, usam-se ferramentas como k6, JMeter ou Gatling. O Playwright opera uma instância de browser por vez.",
    },
    {
      pergunta: "Quais navegadores o Playwright suporta nativamente?",
      opcoes: [
        "Apenas Chromium",
        "Chromium e Firefox",
        "Chromium, Firefox e WebKit (Safari)",
        "Qualquer navegador via WebDriver",
      ],
      correta: 2,
      explicacao: "O Playwright tem engines nativas para Chromium, Firefox e WebKit (o motor do Safari). Isso permite testar em ambientes que representam Chrome, Firefox e Safari sem precisar de WebDriver ou configuração extra.",
    },
    {
      pergunta: "O que diferencia o Playwright do Selenium em termos de velocidade?",
      opcoes: [
        "Playwright usa múltiplas threads; Selenium é single-threaded",
        "Playwright usa protocolo nativo de cada browser (CDP/WebSocket); Selenium usa WebDriver com HTTP",
        "Playwright só testa em modo headless; Selenium abre o browser",
        "Playwright não suporta testes síncronos; Selenium sim",
      ],
      correta: 1,
      explicacao: "O Playwright se comunica com o browser via protocolo nativo (CDP para Chromium, protocolo próprio para Firefox/WebKit), sem a camada extra do WebDriver HTTP. Isso reduz latência e torna os testes mais rápidos e confiáveis.",
    },
  ],
};
