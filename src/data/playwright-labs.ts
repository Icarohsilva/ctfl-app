// src/data/playwright-labs.ts

export type Reflexao = {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};

export type LabConteudo = {
  moduloId: number;
  labId: string;
  conceito: string;
  codigo: string;
  instrucaoExecucao: string;
  reflexao: Reflexao;
};

export const conteudoLabs: Record<string, LabConteudo> = {

  "o-que-e-node": {
    moduloId: 0,
    labId: "o-que-e-node",
    conceito: `Node.js é um ambiente de execução JavaScript que roda no seu computador — não no navegador. Pensa assim: o Chrome executa JavaScript para animar sites. O Node executa JavaScript para rodar ferramentas no seu PC.

Por que você precisa dele? O Playwright é escrito em JavaScript/TypeScript e precisa do Node para funcionar. É ele que baixa os navegadores de teste, roda seus scripts e gera os relatórios.

A boa notícia: você não vai programar em Node diretamente. Vai usá-lo como uma ferramenta de suporte — como um testador manual usa o navegador sem programar o Chrome.

Junto com o Node vem o npm (Node Package Manager), o gerenciador de pacotes. É com ele que você instala o Playwright com um único comando.

Antes de continuar: verifique se o Node 18 ou superior está instalado no seu computador. Se não tiver, acesse nodejs.org e baixe a versão LTS.`,
    codigo: `// Não há código para escrever neste lab.
// Execute os comandos abaixo no terminal para verificar a instalação:

// Verificar versão do Node:
// node --version

// Verificar versão do npm:
// npm --version

// Se precisar instalar:
// 1. Acesse https://nodejs.org
// 2. Baixe a versão LTS (Long Term Support)
// 3. Execute o instalador
// 4. Feche e abra o terminal novamente`,
    instrucaoExecucao: `Abra o terminal (PowerShell no Windows, Terminal no Mac/Linux) e execute:

  node --version
  npm --version

Saída esperada:
  v20.11.0     ← qualquer versão 18 ou superior
  10.2.4       ← versão do npm (qualquer versão recente)

ERRO COMUM: "'node' não é reconhecido como comando"
→ Causa: Node não está instalado ou não está no PATH do sistema.
→ Solução: baixe em nodejs.org → instale → feche e abra o terminal novamente.`,
    reflexao: {
      pergunta: "Para que serve o Node.js no contexto do Playwright?",
      opcoes: [
        "É o navegador que o Playwright controla durante os testes",
        "É o ambiente de execução que roda o código do Playwright no seu computador",
        "É um banco de dados onde os resultados dos testes são salvos",
      ],
      correta: 1,
      explicacao: "Correto! O Node.js é o ambiente de execução — ele roda o código JavaScript do Playwright no seu computador. O Playwright usa o Node para instalar e controlar os navegadores (Chrome, Firefox, Safari), mas o Node em si não é o navegador.",
    },
  },

  "terminal-sem-medo": {
    moduloId: 0,
    labId: "terminal-sem-medo",
    conceito: `O terminal é uma janela onde você digita comandos de texto para o computador. Parece intimidador no começo, mas você vai usar apenas 5-6 comandos no dia a dia do Playwright.

No Windows, use o PowerShell (já vem instalado) ou o Terminal do Windows. No Mac/Linux, use o Terminal.

Os comandos essenciais que você precisa saber:

• cd pasta — entra em uma pasta (Change Directory)
• cd .. — volta uma pasta
• ls (Mac/Linux) ou dir (Windows) — lista arquivos na pasta atual
• mkdir nome — cria uma pasta
• npm install — instala dependências
• npx playwright test — roda os testes

Uma dica: o terminal sempre está "dentro" de uma pasta. Quando você abre o terminal, geralmente está na pasta do seu usuário. Para trabalhar com um projeto, primeiro navegue até a pasta dele com cd.`,
    codigo: `// Exemplos de comandos — execute um por vez no terminal:

// Navegar para a pasta Documents:
// cd Documents

// Criar uma pasta para seus projetos:
// mkdir meus-testes-playwright

// Entrar na pasta criada:
// cd meus-testes-playwright

// Ver o que há nessa pasta (vazia por enquanto):
// ls          ← Mac/Linux
// dir         ← Windows

// Voltar uma pasta:
// cd ..

// Ver em qual pasta você está agora:
// pwd         ← Mac/Linux
// cd          ← Windows (sem argumentos mostra o diretório atual)`,
    instrucaoExecucao: `Execute os comandos abaixo em sequência no terminal:

  mkdir meus-testes-playwright
  cd meus-testes-playwright
  ls     (Mac/Linux) ou dir (Windows)

Saída esperada do ls/dir: pasta vazia (sem arquivos listados).

DICA: Use a tecla Tab para autocompletar nomes de pastas.
Por exemplo: cd Doc[Tab] → completa para cd Documents

ERRO COMUM: "A pasta não existe" ao usar cd
→ Verifique se digitou o nome corretamente (maiúsculas importam no Mac/Linux).`,
    reflexao: {
      pergunta: "O que o comando `cd meus-testes` faz no terminal?",
      opcoes: [
        "Cria uma pasta chamada meus-testes",
        "Entra na pasta meus-testes (muda o diretório atual)",
        "Deleta a pasta meus-testes",
      ],
      correta: 1,
      explicacao: "Correto! cd significa Change Directory — muda o diretório (pasta) atual. Para criar uma pasta, usamos mkdir. Para deletar, usamos rm -rf (Mac/Linux) ou rmdir (Windows).",
    },
  },

  "js-minimo": {
    moduloId: 0,
    labId: "js-minimo",
    conceito: `Você não precisa virar desenvolvedor para usar o Playwright. Mas entender 4 conceitos de JavaScript vai tornar tudo muito mais claro:

1. Variáveis: guardam valores. const nome = "João" guarda o texto João.

2. Funções: blocos de código que fazem algo. O Playwright usa muitas funções.

3. async/await: o Playwright controla um navegador — isso leva tempo. O await faz o código esperar a ação terminar antes de continuar. Sem ele, o teste tentaria clicar num botão que ainda não carregou.

4. Arrow functions: uma forma curta de escrever funções. test("meu teste", async () => { ... }) é um exemplo completo de um teste Playwright — "meu teste" é o nome, e tudo dentro de { } é o que ele faz.

Não precisa memorizar a sintaxe. Com o tempo você vai reconhecer esses padrões automaticamente.`,
    codigo: `// 1. Variáveis — guardam valores
const url = "https://demo.playwright.dev";
const titulo = "Playwright Demo";
let contador = 0;

// 2. Função simples
function somar(a, b) {
  return a + b;
}

// 3. async/await — espera ações que levam tempo
// SEM await (ERRADO no Playwright):
// page.click("button");      ← não espera o clique terminar
// page.screenshot();         ← pode capturar antes do clique

// COM await (CORRETO):
// await page.click("button");      ← espera o clique
// await page.screenshot();         ← captura depois

// 4. Arrow function — como você vai ver em todo teste Playwright:
// test("descrição do teste", async ({ page }) => {
//   await page.goto("https://exemplo.com");
//   await page.click("button");
// });
//
// Leitura: "teste chamado X, que é uma função assíncrona
// que recebe {page} e executa os comandos dentro das chaves"`,
    instrucaoExecucao: `Crie um arquivo chamado teste.js em qualquer pasta e cole:

  const resultado = 2 + 2;
  console.log("Resultado:", resultado);
  console.log("URL seria:", "https://demo.playwright.dev");

Execute no terminal:
  node teste.js

Saída esperada:
  Resultado: 4
  URL seria: https://demo.playwright.dev

Isso confirma que o Node está funcionando e executando JavaScript.

DICA: Delete o teste.js depois — era só para experimentar.`,
    reflexao: {
      pergunta: "Por que usamos `await` antes de comandos do Playwright como `await page.click()`?",
      opcoes: [
        "Para deixar o código mais legível — não tem efeito técnico",
        "Para esperar a ação terminar antes de executar o próximo comando",
        "Para evitar erros de sintaxe no TypeScript",
      ],
      correta: 1,
      explicacao: "Correto! O await faz o código pausar até a ação terminar. Como o Playwright controla um navegador (que é lento), sem await o próximo comando rodaria antes da ação anterior terminar — causando falhas intermitentes e difíceis de debugar.",
    },
  },

  "vscode-setup": {
    moduloId: 0,
    labId: "vscode-setup",
    conceito: `O VS Code (Visual Studio Code) é o editor de código mais usado por quem trabalha com Playwright. Ele é gratuito, leve e tem extensões que tornam o trabalho muito mais fácil.

Se ainda não tiver instalado, baixe em code.visualstudio.com.

As extensões essenciais para Playwright são:

1. Playwright Test for VSCode (publicador: Microsoft) — a extensão oficial. Mostra os testes numa aba lateral, permite rodar e debugar testes com um clique, e destaca erros diretamente no código.

2. ESLint — aponta erros de JavaScript/TypeScript enquanto você digita, sem precisar rodar nada.

3. Prettier — formata o código automaticamente ao salvar, mantendo consistência.

Com a extensão do Playwright instalada, você verá um ícone de beaker (🧪) na barra lateral do VS Code. Clique nele para gerenciar e rodar seus testes visualmente.`,
    codigo: `// Não há código para escrever. Siga as instruções de instalação.

// Após instalar a extensão Playwright Test for VSCode:
// 1. Abra a pasta do seu projeto Playwright no VS Code
//    (File → Open Folder → selecione a pasta)
//
// 2. Clique no ícone 🧪 na barra lateral esquerda
//
// 3. Seus testes aparecerão em uma lista
//
// 4. Clique no botão ▶ ao lado de um teste para rodá-lo
//    sem precisar abrir o terminal
//
// Atalhos úteis:
// Ctrl+\` (crase)  — abre o terminal integrado
// Ctrl+Shift+P    — abre o painel de comandos
// Ctrl+P          — busca de arquivos`,
    instrucaoExecucao: `1. Abra o VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Busque por "Playwright Test for VSCode" (publicador: Microsoft)
4. Clique em Install
5. Busque "ESLint" e instale
6. Busque "Prettier" e instale

Verificação: após instalar a extensão do Playwright, você verá o
ícone 🧪 (Testing) na barra lateral esquerda do VS Code.

DICA: Configure o Prettier para formatar ao salvar:
→ Ctrl+Shift+P → "Open User Settings (JSON)"
→ Adicione: "editor.formatOnSave": true`,
    reflexao: {
      pergunta: "O que a extensão 'Playwright Test for VSCode' permite fazer que o terminal não permite?",
      opcoes: [
        "Rodar testes mais rápido, pois usa menos memória que o terminal",
        "Ver, rodar e debugar testes com interface visual sem digitar comandos",
        "Criar novos testes automaticamente sem escrever código",
      ],
      correta: 1,
      explicacao: "Correto! A extensão oferece uma interface visual: lista todos os testes, mostra quais passaram ou falharam com ícones coloridos, permite rodar um teste específico com um clique, e tem modo debug que para na linha exata do erro.",
    },
  },

  "instalacao": {
    moduloId: 1,
    labId: "instalacao",
    conceito: `Agora que você tem o Node.js instalado, vamos criar seu primeiro projeto Playwright com um único comando.

O comando npm init playwright@latest faz tudo automaticamente:
• Cria o arquivo playwright.config.ts (configurações do Playwright)
• Cria a pasta tests/ com um exemplo de teste
• Baixa os navegadores Chrome, Firefox e Safari para rodar os testes localmente
• Adiciona o Playwright como dependência no package.json

Durante a instalação, ele faz algumas perguntas. Para este lab, responda:
• Linguagem: TypeScript (pressione Enter — já é o padrão)
• Pasta de testes: tests (pressione Enter)
• GitHub Actions: N (não precisamos agora)
• Instalar navegadores: y (sim — necessário)

A instalação leva alguns minutos porque baixa os navegadores (~250MB).`,
    codigo: `// Abra o terminal e navegue até uma pasta vazia para o projeto:
// mkdir meu-projeto-playwright
// cd meu-projeto-playwright

// Execute o comando de instalação:
// npm init playwright@latest

// Estrutura criada após a instalação:
// meu-projeto-playwright/
// ├── playwright.config.ts    ← configurações (browsers, timeouts, etc.)
// ├── package.json            ← dependências do projeto
// ├── package-lock.json       ← versões exatas instaladas
// └── tests/
//     └── example.spec.ts    ← exemplo de teste pronto para rodar

// Para verificar que tudo foi instalado corretamente:
// npx playwright --version`,
    instrucaoExecucao: `1. Abra o terminal e crie uma pasta nova:
   mkdir meu-projeto-playwright
   cd meu-projeto-playwright

2. Execute a instalação:
   npm init playwright@latest

3. Responda as perguntas:
   ✓ TypeScript (Enter)
   ✓ tests (Enter)
   ✓ N para GitHub Actions
   ✓ y para instalar navegadores

4. Aguarde (~2-5 minutos para baixar os navegadores)

5. Verifique a instalação:
   npx playwright --version

Saída esperada: Version 1.x.x

ERRO COMUM: timeout durante o download dos navegadores
→ Sua rede pode estar lenta. Aguarde mais tempo ou tente novamente.`,
    reflexao: {
      pergunta: "O que o arquivo `playwright.config.ts` armazena?",
      opcoes: [
        "Os casos de teste que serão executados",
        "As configurações do projeto: quais browsers usar, timeouts, URL base, etc.",
        "Os resultados dos testes anteriores",
      ],
      correta: 1,
      explicacao: "Correto! O playwright.config.ts é o arquivo de configuração do projeto. Nele você define: quais navegadores rodar (Chrome, Firefox, Safari), o timeout padrão, a URL base da aplicação, onde salvar relatórios, quantos testes rodar em paralelo (workers), e muito mais.",
    },
  },

  "primeiro-teste": {
    moduloId: 1,
    labId: "primeiro-teste",
    conceito: `Um teste Playwright tem sempre a mesma estrutura: um nome, e uma função que usa o objeto page para controlar o navegador.

O objeto page é a sua "mão" dentro do navegador. Com ele você pode:
• page.goto(url) — navegar para um endereço
• page.locator("seletor") — encontrar um elemento
• expect(elemento).toBeVisible() — verificar se algo está visível

O test("nome", async ({ page }) => { ... }) é a função que o Playwright chama quando roda seus testes. O async/await garante que cada ação espera a anterior terminar.

Veja o arquivo tests/example.spec.ts que foi criado na instalação. Ele já tem dois testes funcionais apontando para playwright.dev. Vamos rodá-los e depois entender o que cada linha faz.`,
    codigo: `// tests/meu-primeiro-teste.spec.ts
// Crie este arquivo na pasta tests/ do seu projeto

import { test, expect } from "@playwright/test";

test("página do Playwright abre corretamente", async ({ page }) => {
  // Navega para a URL
  await page.goto("https://demo.playwright.dev/todomvc");

  // Verifica se o título da página contém "TodoMVC"
  await expect(page).toHaveTitle(/TodoMVC/);

  // Verifica se o campo de input está visível
  const input = page.getByPlaceholder("What needs to be done?");
  await expect(input).toBeVisible();
});

test("consigo adicionar uma tarefa", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");

  // Digita uma nova tarefa e pressiona Enter
  await page.getByPlaceholder("What needs to be done?").fill("Aprender Playwright");
  await page.keyboard.press("Enter");

  // Verifica se a tarefa apareceu na lista
  await expect(page.getByText("Aprender Playwright")).toBeVisible();
});`,
    instrucaoExecucao: `1. Crie o arquivo tests/meu-primeiro-teste.spec.ts com o código acima

2. Rode os testes (navegador visível):
   npx playwright test meu-primeiro-teste.spec.ts --headed

3. Observe o Chrome abrindo, navegando e testando automaticamente

4. Saída esperada no terminal:
   Running 2 tests using 1 worker
   ✓  1 página do Playwright abre corretamente (1.2s)
   ✓  2 consigo adicionar uma tarefa (0.9s)
   2 passed (3s)

ERRO COMUM: "Timeout 30000ms exceeded"
→ A conexão com demo.playwright.dev foi lenta.
→ Tente novamente ou verifique sua conexão com a internet.`,
    reflexao: {
      pergunta: "O que o `{ page }` representa na assinatura `async ({ page }) => { ... }`?",
      opcoes: [
        "O nome do arquivo de teste que será executado",
        "O objeto que representa o navegador — usado para navegar, clicar e verificar elementos",
        "O resultado do teste anterior (pass ou fail)",
      ],
      correta: 1,
      explicacao: "Correto! O page é a abstração do Playwright para o navegador. É por meio dele que você faz tudo: navegar (page.goto), encontrar elementos (page.locator), clicar, preencher formulários, tirar screenshots e muito mais. Cada teste recebe seu próprio page isolado.",
    },
  },

  "html-report": {
    moduloId: 1,
    labId: "html-report",
    conceito: `Depois de rodar os testes, o Playwright gera um relatório HTML completo. Ele mostra quais testes passaram, quais falharam, quanto tempo cada um levou, e — o mais importante — um vídeo e screenshots do que aconteceu nos testes que falharam.

O relatório é gerado automaticamente na pasta playwright-report/. Para abrir:
npx playwright show-report

Isso abre o relatório no seu navegador. Na tela principal você vê:
• ✅ Verde: teste passou
• ❌ Vermelho: teste falhou
• ⏭ Laranja: teste foi pulado

Clicando em um teste que falhou, você vê:
• A linha exata do erro
• O HTML da página no momento do erro (Trace Viewer)
• Vídeo do que aconteceu (se configurado)

Entender bem o relatório é uma habilidade fundamental — é aqui que você vai passar muito do seu tempo como QA de automação.`,
    codigo: `// playwright.config.ts — para ativar vídeo nos relatórios de falha
// (modifique o arquivo existente na raiz do projeto)

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: "html",   // gera o relatório HTML automaticamente
  use: {
    // Grava vídeo apenas quando o teste falhar:
    video: "retain-on-failure",
    // Salva screenshot quando o teste falhar:
    screenshot: "only-on-failure",
    // Ativa o Trace Viewer para testes que falharam:
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});`,
    instrucaoExecucao: `1. Abra o playwright.config.ts e adicione as configurações de video,
   screenshot e trace conforme o código acima

2. Faça um teste falhar de propósito — edite meu-primeiro-teste.spec.ts:
   Troque "Aprender Playwright" por "TEXTO QUE NAO EXISTE"

3. Rode os testes:
   npx playwright test meu-primeiro-teste.spec.ts

4. Abra o relatório:
   npx playwright show-report

5. Clique no teste vermelho e explore:
   • Aba "Error": mensagem de erro
   • Aba "Trace": gravação do que aconteceu passo a passo

6. Corrija o texto de volta para "Aprender Playwright"

Saída esperada no relatório: 1 teste vermelho com trace disponível.`,
    reflexao: {
      pergunta: "Qual configuração faz o Playwright gravar um vídeo somente quando o teste falhar?",
      opcoes: [
        `video: "on"`,
        `video: "retain-on-failure"`,
        `video: "off-on-success"`,
      ],
      correta: 1,
      explicacao: `Correto! A opção "retain-on-failure" grava vídeo de todos os testes mas descarta os de testes bem-sucedidos — economizando espaço. Use "on" para gravar sempre (útil durante desenvolvimento) ou "off" para não gravar (mais rápido em CI/CD).`,
    },
  },

  "locators-modernos": {
    moduloId: 2,
    labId: "locators-modernos",
    conceito: `Locators são a forma como o Playwright encontra elementos na página. A escolha do locator certo é a diferença entre um teste que quebra toda semana e um teste que funciona por anos.

O Playwright prioriza três locators modernos que imitam como usuários reais interagem com a página:

**getByRole** — busca pelo papel semântico do elemento (button, link, heading, textbox…). É o mais robusto porque reflete a acessibilidade real da página.
  page.getByRole("button", { name: "Enviar" })

**getByText** — busca pelo texto visível. Ideal para parágrafos, labels e textos estáticos.
  page.getByText("Bem-vindo ao sistema")

**getByTestId** — busca por um atributo data-testid que o dev coloca no HTML especificamente para testes. O mais estável de todos — não quebra com mudanças visuais ou de texto.
  page.getByTestId("botao-salvar")

**Por que evitar CSS e XPath?** Seletores como .btn-primary ou //div[@class="card"] quebram toda vez que o time de front-end refatora o HTML. Os locators modernos se baseiam no comportamento e no significado — não na estrutura visual.

Regra prática: prefira getByRole > getByTestId > getByText > CSS/XPath.`,
    codigo: `import { test, expect } from "@playwright/test";

test("locators modernos em ação", async ({ page }) => {
  // Usando o site de demonstração oficial do Playwright
  await page.goto("https://demo.playwright.dev/todomvc");

  // getByRole: encontra o input pelo papel "textbox" e placeholder
  const input = page.getByRole("textbox", { name: "What needs to be done?" });
  await input.fill("Estudar Playwright");
  await input.press("Enter");

  // getByText: encontra o item recém-criado pelo texto
  const item = page.getByText("Estudar Playwright");
  await expect(item).toBeVisible();

  // getByRole: encontra o botão de completar (checkbox) pelo role
  const checkbox = page.getByRole("checkbox", { name: "Estudar Playwright" });
  await checkbox.check();

  // Verifica que o item está marcado como concluído
  await expect(item).toHaveClass(/completed/);
});`,
    instrucaoExecucao: `1. Dentro da pasta do seu projeto Playwright, crie o arquivo:
   tests/locators-modernos.spec.ts

2. Cole o código do painel à esquerda

3. Rode apenas esse teste:
   npx playwright test locators-modernos

4. Abra o relatório para ver os passos:
   npx playwright show-report

Saída esperada no terminal:
  1 passed (3s)

DICA: No relatório, clique no teste e expanda cada passo para ver
qual locator encontrou qual elemento — ótimo para aprender.

ERRO COMUM: "Strict mode violation — locator resolved to X elements"
→ O locator encontrou mais de um elemento. Adicione um filtro:
   page.getByRole("button", { name: "Enviar" }).first()
   ou torne o seletor mais específico com within():
   page.getByRole("listitem").filter({ hasText: "Estudar" })`,
    reflexao: {
      pergunta: "Qual é a principal vantagem de usar getByRole em vez de seletores CSS como .btn-primary?",
      opcoes: [
        "getByRole é mais rápido porque não precisa percorrer o DOM",
        "getByRole reflete o comportamento semântico da página e não quebra com mudanças visuais ou de CSS",
        "getByRole funciona somente no Chrome, que é o navegador mais usado",
      ],
      correta: 1,
      explicacao: "Correto! Seletores CSS quebram quando o time de front-end renomeia classes ou refatora o layout. getByRole se baseia no papel semântico do elemento (button, link, textbox) — que raramente muda — tornando os testes muito mais estáveis a longo prazo.",
    },
  },
};
