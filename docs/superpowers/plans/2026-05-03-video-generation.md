# Geração Automática de Vídeos por Tópico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pipeline GitHub Actions que gera vídeos narrados (Edge TTS + Pillow + FFmpeg) para os 24 tópicos CTFL e os publica no YouTube, injetando as URLs de volta em `src/data/video-urls.ts` automaticamente.

**Architecture:** `videosTopicos` é extraído de `TopicoGenerico.tsx` para `src/data/video-urls.ts` (alvo do pipeline). Um script TypeScript exporta o conteúdo dos tópicos como JSON para um script Python que gera slides PNG + áudios MP3 + vídeo MP4 e faz upload no YouTube. Um script Node injeta as URLs resultantes de volta no TypeScript. O GitHub Actions orquestra tudo no push.

**Tech Stack:** Python 3.12, edge-tts, Pillow, FFmpeg, google-api-python-client, Node.js 20, tsx, GitHub Actions ubuntu-latest.

---

## Estrutura de Arquivos

| Arquivo | Ação |
|---------|------|
| `src/data/video-urls.ts` | Novo — Record com URLs dos vídeos por topicoId |
| `src/components/TopicoGenerico.tsx` | Modificado — importa video-urls.ts em vez de inline |
| `scripts/exportar-conteudo.ts` | Novo — exporta conteudo-topicos + mapa-capitulos como JSON |
| `scripts/gerar-token-youtube.py` | Novo — helper one-time para gerar refresh token OAuth |
| `scripts/gerar-videos.py` | Novo — gera slides + áudio + vídeo + upload YouTube |
| `scripts/injetar-urls.mjs` | Novo — injeta URLs geradas em video-urls.ts |
| `scripts/video-urls-new.json` | Novo — saída intermediária do gerar-videos.py |
| `.github/workflows/gerar-videos.yml` | Novo — workflow de orquestração |

---

## Pré-requisito: Configurar YouTube API (uma vez)

Antes de executar o workflow, o dono do projeto precisa:

1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar **YouTube Data API v3**
3. Criar credenciais OAuth 2.0 (tipo "Aplicativo para computador")
4. Rodar `python scripts/gerar-token-youtube.py` localmente para gerar o refresh token
5. Adicionar 3 secrets no repositório GitHub:
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`
   - `YOUTUBE_REFRESH_TOKEN`

---

## Task 1: Extrair `videosTopicos` para `src/data/video-urls.ts`

**Files:**
- Create: `src/data/video-urls.ts`
- Modify: `src/components/TopicoGenerico.tsx`

- [ ] **Criar `src/data/video-urls.ts`**

```ts
const videoUrls: Record<string, string | null> = {
  "por-que-testar":          "https://www.youtube.com/embed/GWs-BjMtcVc",
  "7-principios":            null,
  "erro-defeito-falha":      null,
  "atividades-e-papeis":     null,
  "modelos-desenvolvimento": null,
  "niveis-teste":            null,
  "tipos-teste":             null,
  "teste-manutencao":        null,
  "fundamentos-estatico":    null,
  "processo-revisao":        null,
  "analise-estatica":        null,
  "particao-equivalencia":   null,
  "analise-valor-limite":    null,
  "tabela-decisao":          null,
  "transicao-estado":        null,
  "caixa-branca":            null,
  "baseado-experiencia":     null,
  "planejamento-teste":      null,
  "monitoramento-controle":  null,
  "gestao-risco":            null,
  "gestao-defeitos":         null,
  "ferramentas-suporte":     null,
  "automacao-teste":         null,
  "selecao-ferramenta":      null,
};

export default videoUrls;
```

- [ ] **Atualizar `src/components/TopicoGenerico.tsx`**

Adicionar import após os imports existentes (linha ~6):
```tsx
import videoUrls from "@/data/video-urls";
```

Remover o bloco `const videosTopicos` (linhas 33–42):
```tsx
// REMOVER este bloco inteiro:
const videosTopicos: Record<string, string | null> = {
  "por-que-testar": "https://www.youtube.com/embed/GWs-BjMtcVc", "7-principios": null, "erro-defeito-falha": null,
  "atividades-e-papeis": null, "modelos-desenvolvimento": null, "niveis-teste": null,
  "tipos-teste": null, "teste-manutencao": null, "fundamentos-estatico": null,
  "processo-revisao": null, "analise-estatica": null, "particao-equivalencia": null,
  "analise-valor-limite": null, "tabela-decisao": null, "transicao-estado": null,
  "caixa-branca": null, "baseado-experiencia": null, "planejamento-teste": null,
  "monitoramento-controle": null, "gestao-risco": null, "gestao-defeitos": null,
  "ferramentas-suporte": null, "automacao-teste": null, "selecao-ferramenta": null,
};
```

Substituir `videosTopicos[id]` por `videoUrls[id]` (ocorre na linha ~397 e ~405):
```tsx
// Antes:
const videoUrl = videosTopicos[id];
// Depois:
const videoUrl = videoUrls[id];
```

- [ ] **Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript. A página de tópico deve continuar funcionando normalmente.

- [ ] **Commit**

```bash
git add src/data/video-urls.ts src/components/TopicoGenerico.tsx
git commit -m "refactor: extrai videosTopicos para src/data/video-urls.ts"
```

---

## Task 2: Criar `scripts/exportar-conteudo.ts`

**Files:**
- Create: `scripts/exportar-conteudo.ts`

Este script é rodado pelo GitHub Actions (e pode rodar localmente) para converter os dados TypeScript em JSON que o script Python consegue ler.

- [ ] **Criar o arquivo**

```ts
// scripts/exportar-conteudo.ts
// Uso: npx tsx scripts/exportar-conteudo.ts
import conteudo from "../src/data/conteudo-topicos";
import mapaCaptulos from "../src/data/mapa-capitulos";
import { writeFileSync } from "node:fs";

const capitulos: Record<string, {
  topicoTitulo: string;
  capituloNumero: number;
  capituloTitulo: string;
  cor: string;
}> = {};

for (const [numStr, cap] of Object.entries(mapaCaptulos)) {
  for (const topico of cap.topicos) {
    capitulos[topico.id] = {
      topicoTitulo: topico.titulo,
      capituloNumero: Number(numStr),
      capituloTitulo: cap.titulo,
      cor: cap.cor,
    };
  }
}

writeFileSync(
  "scripts/conteudo.json",
  JSON.stringify({ topicos: conteudo, capitulos }, null, 2),
  "utf8"
);

console.log(`Exportados ${Object.keys(conteudo).length} tópicos → scripts/conteudo.json`);
```

- [ ] **Adicionar `scripts/conteudo.json` ao `.gitignore`**

Abrir `.gitignore` e adicionar ao final:
```
scripts/conteudo.json
scripts/video-urls-new.json
```

- [ ] **Testar localmente**

```bash
npx tsx scripts/exportar-conteudo.ts
```

Esperado:
```
Exportados 24 tópicos → scripts/conteudo.json
```

Verificar que `scripts/conteudo.json` foi criado e contém os campos `topicos` e `capitulos`.

- [ ] **Commit**

```bash
git add scripts/exportar-conteudo.ts .gitignore
git commit -m "feat: script exportar-conteudo — TS para JSON para pipeline Python"
```

---

## Task 3: Criar `scripts/gerar-token-youtube.py`

**Files:**
- Create: `scripts/gerar-token-youtube.py`

Roda uma única vez na máquina do desenvolvedor para gerar o refresh token OAuth que vai para o secret do GitHub.

- [ ] **Criar o arquivo**

```python
#!/usr/bin/env python3
"""
Roda UMA VEZ localmente para gerar o YouTube OAuth refresh token.
O token gerado vai como secret YOUTUBE_REFRESH_TOKEN no GitHub.

Requisitos:
    pip install google-auth-oauthlib

Uso:
    python scripts/gerar-token-youtube.py
"""
from google_auth_oauthlib.flow import InstalledAppFlow

CLIENT_ID = input("YOUTUBE_CLIENT_ID: ").strip()
CLIENT_SECRET = input("YOUTUBE_CLIENT_SECRET: ").strip()

client_config = {
    "installed": {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
    }
}

flow = InstalledAppFlow.from_client_config(
    client_config,
    scopes=["https://www.googleapis.com/auth/youtube.upload"],
)
credentials = flow.run_local_server(port=0)

print("\n✅ Token gerado!")
print(f"\nRefresh Token:\n{credentials.refresh_token}")
print("\nAdicione como secret YOUTUBE_REFRESH_TOKEN em:")
print("GitHub → repo → Settings → Secrets and variables → Actions → New repository secret")
```

- [ ] **Commit**

```bash
git add scripts/gerar-token-youtube.py
git commit -m "feat: script helper para gerar YouTube OAuth refresh token"
```

---

## Task 4: Criar `scripts/gerar-videos.py`

**Files:**
- Create: `scripts/gerar-videos.py`

O script principal: lê `scripts/conteudo.json`, verifica quais tópicos não têm URL em `src/data/video-urls.ts`, gera os vídeos e faz upload no YouTube.

- [ ] **Criar o arquivo**

```python
#!/usr/bin/env python3
"""
Gera vídeos CTFL e faz upload no YouTube.

Lê:    scripts/conteudo.json, src/data/video-urls.ts
Escreve: scripts/video-urls-new.json

Requisitos:
    pip install edge-tts Pillow google-api-python-client google-auth-oauthlib

Variáveis de ambiente:
    YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
"""

import asyncio
import json
import os
import re
import subprocess
import tempfile
import unicodedata
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import edge_tts
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# ── Dimensões e cores ────────────────────────────────────────────────────────
W, H = 1280, 720
BG    = (11, 15, 26)
GOLD  = (212, 175, 55)
WHITE = (229, 237, 251)
GRAY  = (107, 114, 128)
BLUE  = (59, 130, 246)
DARK  = (31, 41, 55)

FONT  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
VOICE = "pt-BR-FranciscaNeural"
MAX_UPLOADS = 5  # Quota de segurança (YouTube: ~6/dia)


# ── Helpers ──────────────────────────────────────────────────────────────────

def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def strip_emoji(text: str) -> str:
    """Remove emojis e símbolos especiais — Edge TTS lida melhor com texto limpo."""
    return "".join(
        c for c in text
        if unicodedata.category(c) not in ("So", "Sm", "Sk", "Cs")
    ).strip()

def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textbbox((0, 0), test, font=font)[2] > max_w and cur:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines

def draw_wrapped(draw, text, font, x, y, max_w, fill, spacing=8) -> int:
    for line in wrap_text(draw, text, font, max_w):
        draw.text((x, y), line, font=font, fill=fill)
        y += draw.textbbox((0, 0), line, font=font)[3] + spacing
    return y


# ── Geração de slides ─────────────────────────────────────────────────────────

def slide_intro(topico_titulo: str, cap_numero: int, cap_titulo: str) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((60, 50),  "TestPath", font=load_font(FONTB, 36), fill=GOLD)
    d.text((60, 110), f"Capítulo {cap_numero} — {cap_titulo}", font=load_font(FONT, 22), fill=GRAY)
    draw_wrapped(d, topico_titulo, load_font(FONTB, 54), 60, 200, W - 120, WHITE)
    d.text((W - 240, H - 46), "testpath.online", font=load_font(FONT, 18), fill=DARK)
    return img

def slide_contexto(paragrafo: str, topico_titulo: str) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((60, 40), topico_titulo, font=load_font(FONT, 18), fill=GRAY)
    draw_wrapped(d, paragrafo, load_font(FONT, 26), 60, 100, W - 120, WHITE, spacing=12)
    return img

def slide_card(numero: int, titulo: str, explicacao: str, exemplo: str) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # Número do card
    d.text((60, 30), f"{numero:02d}", font=load_font(FONTB, 72), fill=GOLD)
    d.text((60, 140), titulo, font=load_font(FONTB, 32), fill=GOLD)
    d.rectangle([(60, 188), (180, 191)], fill=BLUE)
    y = draw_wrapped(d, explicacao, load_font(FONT, 22), 60, 206, W - 120, WHITE, spacing=10)
    y += 18
    # Caixa de exemplo com borda esquerda azul
    d.rectangle([(60, y), (64, min(y + 130, H - 50))], fill=BLUE)
    draw_wrapped(d, f"Ex: {exemplo}", load_font(FONT, 19), 82, y, W - 160, (156, 163, 175), spacing=8)
    return img

def slide_dica(dica: str) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((60, 50), "DICA DE ESTUDO", font=load_font(FONTB, 22), fill=BLUE)
    d.rectangle([(60, 88), (180, 91)], fill=BLUE)
    draw_wrapped(d, dica, load_font(FONT, 26), 60, 112, W - 120, WHITE, spacing=12)
    d.text((60, H - 56), "Acesse testpath.online para praticar com simulados!", font=load_font(FONT, 19), fill=GRAY)
    return img


# ── Geração de áudio ─────────────────────────────────────────────────────────

async def gerar_audio(texto: str, path: str) -> None:
    await edge_tts.Communicate(strip_emoji(texto), VOICE).save(path)

def duracao_audio(path: str) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip() or "0")


# ── Montagem de vídeo ─────────────────────────────────────────────────────────

def criar_segmento(slide_path: str, audio_path: str, out: str) -> None:
    dur = duracao_audio(audio_path) + 0.5
    subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", slide_path,
        "-i", audio_path,
        "-vf", f"scale={W}:{H}",
        "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k",
        "-t", str(dur), out,
    ], check=True, capture_output=True)

def concat_segmentos(segmentos: list[str], output: str, bg_music: str | None = None) -> None:
    list_file = output + ".txt"
    with open(list_file, "w") as f:
        for s in segmentos:
            f.write(f"file '{Path(s).resolve()}'\n")

    tmp = output + ".tmp.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file,
        "-c", "copy", tmp,
    ], check=True, capture_output=True)

    if bg_music and Path(bg_music).exists():
        subprocess.run([
            "ffmpeg", "-y",
            "-i", tmp,
            "-stream_loop", "-1", "-i", bg_music,
            "-filter_complex", "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=first[out]",
            "-map", "0:v", "-map", "[out]",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "128k",
            output,
        ], check=True, capture_output=True)
        Path(tmp).unlink()
    else:
        Path(tmp).rename(output)

    Path(list_file).unlink(missing_ok=True)


# ── YouTube ───────────────────────────────────────────────────────────────────

def youtube_client():
    creds = Credentials(
        token=None,
        refresh_token=os.environ["YOUTUBE_REFRESH_TOKEN"],
        client_id=os.environ["YOUTUBE_CLIENT_ID"],
        client_secret=os.environ["YOUTUBE_CLIENT_SECRET"],
        token_uri="https://oauth2.googleapis.com/token",
    )
    return build("youtube", "v3", credentials=creds, cache_discovery=False)

def upload_youtube(yt, video_path: str, titulo: str, descricao: str) -> str:
    body = {
        "snippet": {
            "title": titulo,
            "description": descricao,
            "tags": ["CTFL", "ISTQB", "QA", "teste de software", "certificação"],
            "categoryId": "27",
            "defaultLanguage": "pt",
            "defaultAudioLanguage": "pt",
        },
        "status": {"privacyStatus": "unlisted"},
    }
    media = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True)
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        _, resp = req.next_chunk()
    return resp["id"]


# ── Processamento de um tópico ────────────────────────────────────────────────

async def processar_topico(
    topico_id: str,
    dados: dict,
    cap_info: dict,
    yt,
    tmpdir: str,
) -> dict:
    narrativa   = dados["narrativa"]
    cards       = dados["cards"]
    dica        = dados["dicaEstudo"]
    topico_titulo = cap_info["topicoTitulo"]
    cap_numero    = cap_info["capituloNumero"]
    cap_titulo    = cap_info["capituloTitulo"]

    slides_audios: list[tuple[str, str]] = []

    async def add_slide(img: Image.Image, nome: str, texto_narr: str) -> None:
        sp = f"{tmpdir}/{nome}.png"
        ap = f"{tmpdir}/{nome}.mp3"
        img.save(sp)
        await gerar_audio(texto_narr, ap)
        slides_audios.append((sp, ap))

    # Slide intro
    await add_slide(
        slide_intro(topico_titulo, cap_numero, cap_titulo),
        "intro",
        f"Olá! Neste vídeo vamos estudar {topico_titulo}, "
        f"do Capítulo {cap_numero}, {cap_titulo}.",
    )

    # Slide contexto (1º parágrafo da narrativa)
    await add_slide(
        slide_contexto(narrativa["paragrafos"][0], narrativa["titulo"]),
        "contexto",
        narrativa["paragrafos"][0],
    )

    # Slides de cards
    for i, card in enumerate(cards):
        narr = f"{card['titulo']}. {card['explicacao']} Exemplo: {card['exemplo']}"
        await add_slide(
            slide_card(i + 1, card["titulo"], card["explicacao"], card["exemplo"]),
            f"card_{i}",
            narr,
        )

    # Slide dica
    await add_slide(
        slide_dica(dica),
        "dica",
        f"Dica de estudo: {dica} Acesse TestPath para praticar com simulados!",
    )

    # Montar segmentos e concatenar
    segmentos = []
    for j, (sp, ap) in enumerate(slides_audios):
        seg = f"{tmpdir}/seg_{j}.mp4"
        criar_segmento(sp, ap, seg)
        segmentos.append(seg)

    output_path = f"{tmpdir}/{topico_id}.mp4"
    bg = "scripts/assets/bg-music.mp3"
    concat_segmentos(segmentos, output_path, bg if Path(bg).exists() else None)

    # Calcular duração
    dur_seg = duracao_audio(output_path)
    dur_label = f"{round(dur_seg / 60)} min"

    # Upload
    titulo_yt = f"CTFL — {topico_titulo} | TestPath"
    desc_yt = (
        f"Videoaula: {topico_titulo}\n"
        f"Capítulo {cap_numero}: {cap_titulo}\n\n"
        f"Estude para a certificação CTFL v4.0 em testpath.online"
    )
    video_id = upload_youtube(yt, output_path, titulo_yt, desc_yt)
    url = f"https://www.youtube.com/embed/{video_id}"
    print(f"  ✅ {topico_id} → {url} ({dur_label})")
    return {"topicoId": topico_id, "url": url, "duracao": dur_label}


# ── Main ──────────────────────────────────────────────────────────────────────

async def main() -> None:
    data = json.loads(Path("scripts/conteudo.json").read_text("utf-8"))
    topicos  = data["topicos"]
    capitulos = data["capitulos"]

    # Quais tópicos já têm URL?
    vurls_text = Path("src/data/video-urls.ts").read_text("utf-8")
    ja_tem = set(re.findall(r'"([^"]+)":\s+"https://', vurls_text))
    pendentes = [tid for tid in topicos if tid not in ja_tem]

    print(f"Pendentes: {len(pendentes)}/{len(topicos)}")
    if not pendentes:
        print("Todos os tópicos já têm vídeo.")
        return

    yt = youtube_client()
    output_json = Path("scripts/video-urls-new.json")
    novos: list[dict] = json.loads(output_json.read_text("utf-8")) if output_json.exists() else []

    with tempfile.TemporaryDirectory() as tmpdir:
        for topico_id in pendentes[:MAX_UPLOADS]:
            print(f"\nProcessando: {topico_id}")
            resultado = await processar_topico(
                topico_id, topicos[topico_id], capitulos[topico_id], yt, tmpdir
            )
            novos.append(resultado)
            output_json.write_text(json.dumps(novos, indent=2, ensure_ascii=False), "utf-8")

    print(f"\n{len(novos)} URLs salvas em scripts/video-urls-new.json")


if __name__ == "__main__":
    asyncio.run(main())
```

- [ ] **Commit**

```bash
git add scripts/gerar-videos.py
git commit -m "feat: script gerar-videos — slides + Edge TTS + FFmpeg + YouTube upload"
```

---

## Task 5: Criar `scripts/injetar-urls.mjs`

**Files:**
- Create: `scripts/injetar-urls.mjs`

Lê `scripts/video-urls-new.json` e atualiza `src/data/video-urls.ts` com as URLs geradas.

- [ ] **Criar o arquivo**

```mjs
// scripts/injetar-urls.mjs
// Uso: node scripts/injetar-urls.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const newUrlsPath = "scripts/video-urls-new.json";
const targetPath  = "src/data/video-urls.ts";

if (!existsSync(newUrlsPath)) {
  console.log("Nenhuma URL nova para injetar.");
  process.exit(0);
}

const novos = JSON.parse(readFileSync(newUrlsPath, "utf8"));
if (novos.length === 0) {
  console.log("video-urls-new.json está vazio.");
  process.exit(0);
}

let content = readFileSync(targetPath, "utf8");

for (const { topicoId, url, duracao } of novos) {
  // Substitui:  "topicoId":            null,
  // Por:        "topicoId":            "https://...",
  const regex = new RegExp(`("${topicoId}":\\s*)null`);
  if (!regex.test(content)) {
    console.warn(`⚠️  Tópico não encontrado em video-urls.ts: ${topicoId}`);
    continue;
  }
  content = content.replace(regex, `$1"${url}"`);
  console.log(`✅ ${topicoId} → ${url} (${duracao})`);
}

writeFileSync(targetPath, content, "utf8");
console.log(`\nvideo-urls.ts atualizado com ${novos.length} URL(s).`);
```

- [ ] **Testar localmente (dry-run)**

Criar um `scripts/video-urls-new.json` de teste:
```json
[{"topicoId": "7-principios", "url": "https://www.youtube.com/embed/TEST123", "duracao": "5 min"}]
```

Rodar:
```bash
node scripts/injetar-urls.mjs
```

Esperado:
```
✅ 7-principios → https://www.youtube.com/embed/TEST123 (5 min)
video-urls.ts atualizado com 1 URL(s).
```

Verificar que `src/data/video-urls.ts` agora tem `"7-principios": "https://www.youtube.com/embed/TEST123"`.

Desfazer o teste (restaurar `null`):
```bash
git checkout src/data/video-urls.ts
```

Remover o JSON de teste:
```bash
rm scripts/video-urls-new.json
```

- [ ] **Verificar build**

```bash
npm run build
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add scripts/injetar-urls.mjs
git commit -m "feat: script injetar-urls — atualiza video-urls.ts com URLs do YouTube"
```

---

## Task 6: Criar `.github/workflows/gerar-videos.yml`

**Files:**
- Create: `.github/workflows/gerar-videos.yml`

- [ ] **Criar a pasta e o arquivo**

```bash
mkdir -p .github/workflows
```

```yaml
# .github/workflows/gerar-videos.yml
name: Gerar Vídeos CTFL

on:
  push:
    branches: [main]
    paths:
      - "src/data/conteudo-topicos.ts"
  workflow_dispatch:

jobs:
  gerar:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Instalar dependências do sistema
        run: |
          sudo apt-get update -qq
          sudo apt-get install -y ffmpeg fonts-dejavu-core

      - name: Instalar dependências Python
        run: |
          pip install edge-tts Pillow \
            google-api-python-client google-auth-oauthlib \
            google-auth-httplib2

      - name: Instalar tsx
        run: npm install -g tsx

      - name: Exportar conteúdo para JSON
        run: npx tsx scripts/exportar-conteudo.ts

      - name: Gerar vídeos e fazer upload no YouTube
        env:
          YOUTUBE_CLIENT_ID:     ${{ secrets.YOUTUBE_CLIENT_ID }}
          YOUTUBE_CLIENT_SECRET: ${{ secrets.YOUTUBE_CLIENT_SECRET }}
          YOUTUBE_REFRESH_TOKEN: ${{ secrets.YOUTUBE_REFRESH_TOKEN }}
        run: python scripts/gerar-videos.py

      - name: Injetar URLs em video-urls.ts
        run: node scripts/injetar-urls.mjs

      - name: Commit e push das URLs atualizadas
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/data/video-urls.ts scripts/video-urls-new.json
          if ! git diff --staged --quiet; then
            git commit -m "chore: atualiza URLs de vídeo [skip ci]"
            git push
          else
            echo "Nada para commitar."
          fi
```

- [ ] **Verificar sintaxe do YAML**

```bash
# Instalar yamllint se não tiver:
pip install yamllint
yamllint .github/workflows/gerar-videos.yml
```

Esperado: sem erros de sintaxe.

- [ ] **Commit**

```bash
git add .github/workflows/gerar-videos.yml
git commit -m "feat: GitHub Actions workflow para geração automática de vídeos CTFL"
```

- [ ] **Verificar no GitHub**

Após o push, abrir a aba **Actions** no repositório GitHub. O workflow `Gerar Vídeos CTFL` deve aparecer na lista (mas só roda automaticamente quando `conteudo-topicos.ts` muda, ou ao disparar manualmente).

Para testar: **Actions → Gerar Vídeos CTFL → Run workflow**.

---

## Checklist de validação final

Após todas as tasks:

- [ ] `src/data/video-urls.ts` exportado como default, importado em `TopicoGenerico.tsx`
- [ ] `npm run build` sem erros
- [ ] Página `/capitulo/1/topico/por-que-testar` ainda exibe o vídeo corretamente
- [ ] `npx tsx scripts/exportar-conteudo.ts` gera `scripts/conteudo.json` com 24 tópicos
- [ ] `node scripts/injetar-urls.mjs` funciona com JSON de teste (e reverte sem alterar build)
- [ ] Workflow YAML válido e visível na aba Actions do GitHub
- [ ] Secrets `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` configurados no GitHub
