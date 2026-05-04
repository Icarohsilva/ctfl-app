# Geração Automática de Vídeos por Tópico — TestPath

**Data:** 2026-05-03
**Escopo:** Pipeline GitHub Actions que gera vídeos narrados para os 24 tópicos CTFL e publica no YouTube automaticamente, preenchendo `video.url` em `conteudo-topicos.ts`.

---

## 1. Visão geral

O conteúdo de cada tópico (narrativa + cards + dica) já existe em `src/data/conteudo-topicos.ts`. O pipeline lê esses dados, gera slides PNG com visual dark theme do TestPath, sintetiza narração via Edge TTS (voz Francisca, pt-BR), combina tudo em `.mp4` via FFmpeg e faz upload no YouTube via YouTube Data API v3. Ao final, as URLs são injetadas de volta em `conteudo-topicos.ts` via commit automático.

---

## 2. Estrutura de cada vídeo

| Slide | Conteúdo extraído de | Duração estimada |
|-------|---------------------|------------------|
| 1 — Intro | `titulo` do tópico + `titulo` do capítulo | ~5s |
| 2 — Contexto | Primeiro parágrafo de `narrativa` | ~20s |
| 3…N — Cards | Um slide por item em `cards[]`: `emoji + titulo + explicacao + exemplo` | ~30–40s cada |
| Final — Dica | `dicaEstudo` + texto fixo "Teste seus conhecimentos em TestPath" | ~10s |

**Duração total esperada:** 4–6 minutos por tópico.

**Narração:** texto de cada slide lido pela voz `pt-BR-FranciscaNeural` (Edge TTS, gratuito, sem API key). Pausa de 0.5s entre slides.

**Música de fundo (opcional):** arquivo `scripts/assets/bg-music.mp3` commitado no repo, mixado com FFmpeg a 15% do volume. Se o arquivo não existir, o vídeo é gerado sem música.

---

## 3. Visual dos slides

```
Resolução:   1280 × 720 px
Fundo:       #0b0f1a
Título:      #d4af37  (dourado — acento TestPath)
Subtítulo:   #9ca3af
Corpo:       #e5e7eb
Destaque:    #3b82f6  (azul)
Fonte:       Inter (fallback: DejaVu Sans — disponível no runner Ubuntu)
Padding:     60px
```

**Layout por tipo de slide:**
- **Intro:** logo "TestPath" no topo, capítulo em dourado, título do tópico centralizado em branco grande.
- **Card:** emoji centralizado grande (80px), título em dourado, explicação em branco, exemplo em cinza claro com borda esquerda azul.
- **Dica:** ícone 💡, texto da dica em branco, rodapé "testpath.online" em cinza escuro.

---

## 4. Pipeline GitHub Actions

**Arquivo:** `.github/workflows/gerar-videos.yml`

**Trigger:**
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/data/conteudo-topicos.ts'
  workflow_dispatch:  # disparo manual
```

**O workflow só dispara quando `conteudo-topicos.ts` muda** (novos tópicos ou edição de conteúdo) ou via disparo manual.

**Passos:**
1. `actions/checkout@v4` com `token: ${{ secrets.GITHUB_TOKEN }}`
2. `actions/setup-python@v5` (Python 3.12)
3. `pip install edge-tts Pillow google-api-python-client google-auth-oauthlib`
4. Instala FFmpeg: `sudo apt-get install -y ffmpeg`
5. Roda `python scripts/gerar-videos.py`
6. Roda `node scripts/injetar-urls.mjs`
7. Commit e push das alterações em `conteudo-topicos.ts` e `scripts/video-urls.json` com mensagem `chore: atualiza urls de vídeo [skip ci]` para não re-disparar o workflow

**Quota YouTube Data API v3:** ~6 uploads por dia (limite 10k unidades/dia, upload custa 1600 unidades). Os 24 tópicos são processados em lotes — o script para sozinho ao atingir o limite diário e retoma no próximo disparo.

---

## 5. Scripts

### `scripts/gerar-videos.py`

**Responsabilidades:**
1. Parse de `conteudo-topicos.ts` via regex para extrair o objeto JS como dict Python
2. Para cada tópico sem `video.url`:
   a. Gera slides PNG com Pillow
   b. Sintetiza áudios por slide com `edge-tts` (async, `asyncio.run`)
   c. Monta lista de pares `(slide.png, audio.mp3)` com duração calculada via `ffprobe`
   d. Combina com FFmpeg: `concat demuxer` → `.mp4` com H.264/AAC
   e. Faz upload no YouTube (status: `unlisted`, categoria: `Education`, idioma: `pt-BR`)
   f. Appenda `{ "topicoId": "youtube_url" }` em `scripts/video-urls.json`
3. Respeita quota: conta uploads realizados na sessão, para ao atingir 5 (margem de segurança)

**Autenticação YouTube:** usa `google-auth-oauthlib` com refresh token armazenado no secret `YOUTUBE_REFRESH_TOKEN`. Não abre browser — fluxo offline com token pré-gerado.

### `scripts/injetar-urls.mjs`

**Responsabilidades:**
1. Lê `scripts/video-urls.json`
2. Para cada entrada `{ topicoId, url, duracao }`:
   - Localiza o bloco do tópico em `conteudo-topicos.ts` pela chave única do tópico (ex: `"por-que-testar"`, `"7-principios"`) — regex âncora no `topicoId` antes de substituir para evitar colisão entre tópicos com nomes similares
   - Dentro desse bloco, substitui `url: ""` por `url: "https://www.youtube.com/embed/{VIDEO_ID}"`
   - Substitui `duracao: ""` pelo valor calculado (ex: `"5 min"`)
3. Escreve `conteudo-topicos.ts` atualizado

---

## 6. Estrutura de dados — `conteudo-topicos.ts`

A estrutura de `video` já existe em alguns tópicos. Os demais precisam ter o campo adicionado com valores vazios antes da execução do pipeline:

```ts
video: {
  titulo: "Resumão em vídeo — {titulo do tópico}",
  descricao: "Assiste esse vídeo antes do simulado. Vai fixar tudo que você acabou de ler.",
  url: "",          // preenchido pelo pipeline
  duracao: "",      // preenchido pelo pipeline
},
```

---

## 7. Secrets necessários no GitHub

| Secret | Como obter |
|--------|-----------|
| `YOUTUBE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 Client ID |
| `YOUTUBE_CLIENT_SECRET` | Google Cloud Console → OAuth 2.0 Client Secret |
| `YOUTUBE_REFRESH_TOKEN` | Script local `scripts/gerar-token-youtube.py` (roda uma vez) |

O script `scripts/gerar-token-youtube.py` abre browser local para autorização OAuth e imprime o refresh token — roda apenas uma vez na máquina do desenvolvedor.

---

## 8. Arquivos novos/modificados

| Arquivo | Ação |
|---------|------|
| `.github/workflows/gerar-videos.yml` | Novo — workflow de geração e upload |
| `scripts/gerar-videos.py` | Novo — geração de slides + áudio + vídeo + upload YouTube |
| `scripts/injetar-urls.mjs` | Novo — injeta URLs geradas em conteudo-topicos.ts |
| `scripts/gerar-token-youtube.py` | Novo — helper one-time para gerar refresh token OAuth |
| `scripts/video-urls.json` | Novo — mapa persistente `{ topicoId → youtubeUrl }`, commitado no repo |
| `scripts/assets/bg-music.mp3` | Novo (opcional) — música de fundo |
| `src/data/conteudo-topicos.ts` | Modificado — campo `video` adicionado em todos os tópicos |

---

## 9. Fora do escopo

- Vídeos por capítulo (próximo ciclo)
- Legendas/subtítulos automáticos
- Thumbnails personalizadas (YouTube usa frame automático)
- Vídeos em outros idiomas
- Regeneração automática quando o conteúdo de um tópico muda (apenas tópicos com `url` vazia são processados)
