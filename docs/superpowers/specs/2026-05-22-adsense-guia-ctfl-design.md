# Spec: Seção /guia + Correção AdSense

**Data:** 2026-05-22
**Status:** Aprovado
**Contexto:** Site rejeitado pelo Google AdSense por dois motivos: (1) anúncios em telas sem conteúdo do editor (páginas autenticadas aparecem vazias para o Googlebot), e (2) conteúdo de baixo valor (todo conteúdo educacional fica atrás de login).

---

## Objetivo

Resolver ambos os problemas de forma definitiva:
1. Criar seção pública `/guia` com 17 artigos longos (1500-2000 palavras) cobrindo CTFL, Playwright e English for QA — conteúdo indexável, com vídeos embutidos e mini-quiz por artigo.
2. Corrigir `AdBanner` nas páginas autenticadas para não exibir anúncios quando o Googlebot (usuário não autenticado) acessa.

---

## Rotas Novas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/guia` | Server Component, SSG | Índice com 3 seções de cards |
| `/guia/[slug]` | Server Component, SSG | Artigo individual |

---

## Artigos por Seção (17 total)

### CTFL v4.0 (9 artigos)

| Slug | Título | Vídeos |
|------|--------|--------|
| `o-que-e-ctfl` | O que é o CTFL v4.0: guia completo | — |
| `como-se-preparar-ctfl` | Como se preparar para o CTFL: passo a passo | — |
| `fundamentos-de-teste` | Fundamentos de Teste de Software (Cap. 1) | por-que-testar, 7-principios, erro-defeito-falha, atividades-e-papeis |
| `teste-no-ciclo-de-vida` | Teste no Ciclo de Vida de Software (Cap. 2) | modelos-desenvolvimento, niveis-teste, tipos-teste, teste-manutencao |
| `teste-estatico` | Teste Estático (Cap. 3) | fundamentos-estatico, processo-revisao, analise-estatica |
| `analise-e-modelagem-de-teste` | Análise e Modelagem de Teste (Cap. 4) | particao-equivalencia, analise-valor-limite, tabela-decisao, transicao-estado, caixa-branca, baseado-experiencia |
| `gerenciamento-de-atividades-de-teste` | Gerenciamento de Atividades de Teste (Cap. 5) | planejamento-teste, monitoramento-controle, gestao-risco, gestao-defeitos |
| `ferramentas-de-suporte-ao-teste` | Ferramentas de Suporte ao Teste (Cap. 6) | ferramentas-suporte, automacao-teste, selecao-ferramenta |
| `glossario-ctfl` | Glossário CTFL: 50+ termos do syllabus v4.0 | — |

### Playwright (4 artigos)

| Slug | Título | Vídeos |
|------|--------|--------|
| `o-que-e-playwright` | O que é Playwright: automação moderna de testes web | — |
| `playwright-para-iniciantes` | Playwright para iniciantes: primeiros passos | — |
| `locators-e-page-object-model` | Locators, assertivas e Page Object Model no Playwright | — |
| `playwright-em-ci-cd` | Playwright em CI/CD: boas práticas e relatórios | — |

### English for QA (4 artigos)

| Slug | Título | Vídeos |
|------|--------|--------|
| `ingles-para-qa` | Inglês para QA: por que é essencial e como começar | — |
| `vocabulario-tecnico-qa-ingles` | Vocabulário técnico de QA em inglês: bug reports e terminologia | — |
| `comunicacao-qa-ingles` | Comunicação em inglês para QA: dailies, reviews, retrospectivas | — |
| `entrevista-tecnica-qa-ingles` | Preparação para entrevistas técnicas de QA em inglês | — |

---

## Estrutura de Dados

### Arquivo por artigo: `src/data/guia/[slug].ts`

```ts
export type SecaoArtigo = {
  titulo: string;
  conteudo: string;      // HTML estático (parágrafos, listas, <strong>) — renderizado via dangerouslySetInnerHTML, conteúdo 100% autoral (sem input de usuário)
  videoId?: string;      // chave de videoUrls.ts — undefined se não houver
};

export type QuizPergunta = {
  pergunta: string;
  opcoes: [string, string, string, string];
  correta: 0 | 1 | 2 | 3;
  explicacao: string;
};

export type ArtigoGuia = {
  slug: string;
  titulo: string;
  descricao: string;      // usado no metadata description e no card do índice
  secao: "ctfl" | "playwright" | "ingles";
  tempoLeitura: number;   // minutos
  nivel: "iniciante" | "intermediário" | "avançado";
  secoes: SecaoArtigo[];
  quiz: QuizPergunta[];   // exatamente 5 perguntas
};

export const artigo: ArtigoGuia = { ... };
```

### Índice: `src/data/guia/index.ts`

Exporta array de metadados de todos os artigos (sem o campo `secoes` e `quiz` completos) para gerar o índice sem carregar o conteúdo completo de todos os arquivos.

```ts
export type ArtigoMeta = Pick<ArtigoGuia, "slug" | "titulo" | "descricao" | "secao" | "tempoLeitura" | "nivel">;
export const artigos: ArtigoMeta[] = [...];
```

---

## Layout das Páginas

### `/guia` (índice)

```
Nav (logo + links: Guia, Entrar, Começar grátis)
H1: "Guia de Estudos TestPath"
Subtítulo descritivo (2 linhas)

Seção: CTFL v4.0 (grid de cards)
Seção: Playwright (grid de cards)
Seção: English for QA (grid de cards)

AdBanner (horizontal)

CTA: "Pronto para praticar? Crie sua conta grátis →"
```

Cada card do índice: título, tempo de leitura, nível, link para o artigo.

### `/guia/[slug]` (artigo)

```
Nav
Breadcrumb: Guia → [Seção] → [Título do artigo]
H1 + meta (tempo de leitura, nível)

[Para cada SecaoArtigo:]
  H2 — titulo
  Texto (conteudo)
  [se videoId presente:]
    iframe YouTube responsivo (16:9, lazy loading)
    Legenda do vídeo

AdBanner (horizontal) — após o conteúdo

Mini-quiz (Client Component):
  5 perguntas de múltipla escolha
  Feedback imediato por pergunta (certo/errado + explicação)
  Score final ao terminar

CTA pós-quiz:
  "Quer mais questões sobre esse tópico?
   Crie sua conta grátis no TestPath →"

AdBanner (rectangle)

Navegação: ← Artigo anterior | Próximo artigo →
```

---

## Componentes Novos

| Componente | Tipo | Responsabilidade |
|-----------|------|-----------------|
| `src/app/guia/page.tsx` | Server | Página de índice |
| `src/app/guia/[slug]/page.tsx` | Server | Página de artigo com `generateStaticParams` |
| `src/components/guia/QuizArtigo.tsx` | Client | Mini-quiz interativo (5 questões) |
| `src/components/guia/VideoEmbed.tsx` | Client | iframe YouTube responsivo com lazy loading |
| `src/components/guia/NavArtigo.tsx` | Client | Navegação anterior/próximo entre artigos |

---

## SEO e Metadata

Cada artigo exporta `generateMetadata`:
```ts
export async function generateMetadata({ params }) {
  return {
    title: `${artigo.titulo} — TestPath Guia`,
    description: artigo.descricao,
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricao,
      url: `https://www.testpath.online/guia/${artigo.slug}`,
      type: "article",
    },
  };
}
```

Página de índice `/guia` também tem `metadata` estático.

---

## Correções de AdBanner (páginas existentes)

### `/dashboard` — `src/app/dashboard/page.tsx`

O componente já é Client Component e carrega `userId` via `supabase.auth.getUser()`. A linha:
```tsx
<AdBanner slotId={...} />
```
passa a ser:
```tsx
{userId && <AdBanner slotId={...} />}
```

### `/perfil` — `src/app/perfil/page.tsx`

Mesma lógica: o componente carrega o perfil do usuário. O `AdBanner` só renderiza após `perfil` estar carregado (estado não-null).

---

## Navegação — Landing Page

Adicionar link "Guia" na nav de `src/app/page.tsx` (desktop e mobile), apontando para `/guia`.

---

## Fora do Escopo

- Autenticação ou progresso no quiz (sem salvar respostas no Supabase)
- Vídeos para artigos de Playwright e English for QA (não existem ainda)
- Geração de questões do quiz via Groq (questões são estáticas nos arquivos de dados)
- Comentários ou interação social nos artigos
- Paginação ou busca no índice do guia

---

## Critério de Aprovação no AdSense

Após a implementação, o site terá:
- 17+ páginas públicas com conteúdo educacional original (1500-2000 palavras cada)
- Vídeos embutidos nos artigos de capítulos CTFL (25 vídeos distribuídos)
- Mini-quiz interativo em cada artigo
- `AdBanner` apenas em páginas com conteúdo substancial e visível sem autenticação
- Nenhum anúncio em páginas funcionais (offline, cancelar-notificações) ou em páginas autenticadas quando o usuário não está logado
