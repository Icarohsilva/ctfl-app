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
};
