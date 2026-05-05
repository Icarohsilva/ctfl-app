# Thumbnails Personalizadas YouTube — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gerar e fazer upload de thumbnails 1280×720px com identidade visual TestPath para cada vídeo CTFL no YouTube, usando a cor do capítulo como acento, integrado ao pipeline `gerar-videos.py` existente.

**Architecture:** Pillow gera a thumbnail com layout split-vertical (60% esquerda com título + branding, 40% direita com número do tópico na cor do capítulo). O upload usa `yt.thumbnails().set()` da YouTube Data API. Um arquivo `scripts/thumbnails-enviadas.json` rastreia quais vídeos já receberam thumbnail (incluindo os 6 já publicados).

**Tech Stack:** Python 3.12, Pillow, google-api-python-client, GitHub Actions

---

## Estrutura de arquivos

| Arquivo | Mudança |
|---------|---------|
| `scripts/exportar-conteudo.ts` | Adiciona campo `topicoNumero` ao objeto `capitulos` |
| `scripts/gerar-videos.py` | Adiciona `hex_to_rgb()`, `gerar_thumbnail()`, `upload_thumbnail()`, `atualizar_thumbnails_existentes()`; atualiza `processar_topico()` e `main()` |
| `scripts/thumbnails-enviadas.json` | Novo — lista de `video_id`s que já têm thumbnail; commitado no repo |
| `.github/workflows/gerar-videos.yml` | Adiciona `scripts/thumbnails-enviadas.json` ao `git add` do step de commit |

---

## Task 1: Exportar `topicoNumero` em `exportar-conteudo.ts`

**Files:**
- Modify: `scripts/exportar-conteudo.ts`

O campo `topico.numero` já existe em `mapa-capitulos.ts` mas não é exportado para `conteudo.json`. O pipeline de thumbnail precisa dele para desenhar o número no painel direito.

- [ ] **Step 1: Adicionar `topicoNumero` ao tipo e ao objeto exportado**

Abrir `scripts/exportar-conteudo.ts`. Substituir:

```typescript
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
```

Por:

```typescript
const capitulos: Record<string, {
  topicoTitulo: string;
  topicoNumero: number;
  capituloNumero: number;
  capituloTitulo: string;
  cor: string;
}> = {};

for (const [numStr, cap] of Object.entries(mapaCaptulos)) {
  for (const topico of cap.topicos) {
    capitulos[topico.id] = {
      topicoTitulo: topico.titulo,
      topicoNumero: topico.numero,
      capituloNumero: Number(numStr),
      capituloTitulo: cap.titulo,
      cor: cap.cor,
    };
  }
}
```

- [ ] **Step 2: Verificar o export**

```bash
npx tsx scripts/exportar-conteudo.ts
node -e "const d=require('./scripts/conteudo.json'); console.log(d.capitulos['7-principios'])"
```

Resultado esperado:
```json
{ "topicoTitulo": "Os 7 Princípios do Teste", "topicoNumero": 2, "capituloNumero": 1, "capituloTitulo": "Fundamentos de Teste", "cor": "#d4af37" }
```

- [ ] **Step 3: Commit**

```bash
git add scripts/exportar-conteudo.ts
git commit -m "feat: exporta topicoNumero no conteudo.json para pipeline de thumbnails"
```

---

## Task 2: `gerar_thumbnail()` + `upload_thumbnail()` + integração no pipeline

**Files:**
- Modify: `scripts/gerar-videos.py`

### 2a — Adicionar helpers e `gerar_thumbnail()`

- [ ] **Step 1: Adicionar `hex_to_rgb()` e `gerar_thumbnail()` logo após a seção de slides (`slide_dica`)**

Inserir após a função `slide_dica()` e antes da seção `# ── Áudio`:

```python
# ── Thumbnails ────────────────────────────────────────────────────────────────

def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

def gerar_thumbnail(
    topico_titulo: str,
    cap_numero: int,
    cap_titulo: str,
    topico_numero: int,
    cor_hex: str,
    path: str,
) -> None:
    cor     = hex_to_rgb(cor_hex)
    cor_dim = tuple(int(c * 0.45) for c in cor)

    img = make_bg()
    d   = ImageDraw.Draw(img)

    left_w  = int(W * 0.60)   # 768 px
    right_x = left_w + 3      # 771 px (3px divider)

    # Painel direito com tint da cor do capítulo
    right_bg = tuple(int(BG_TOP[i] * 0.90 + cor[i] * 0.10) for i in range(3))
    d.rectangle([(left_w, 0), (W, H)], fill=right_bg)

    # Barra esquerda e divisor
    d.rectangle([(0, 0), (5, H)], fill=cor)
    d.rectangle([(left_w, 0), (left_w + 2, H)], fill=cor)

    # ── Painel esquerdo ──────────────────────────────────────
    pad = 28

    # Logo "TESTPATH"
    d.text((pad, 38), "TEST", font=load_font(FONTB, 34), fill=cor)
    tw = d.textbbox((0, 0), "TEST", font=load_font(FONTB, 34))[2]
    d.text((pad + tw + 3, 38), "PATH", font=load_font(FONTB, 34), fill=WHITE)

    # Capítulo
    d.text((pad, 88), f"Capítulo {cap_numero}  ·  {cap_titulo}",
           font=load_font(FONT, 15), fill=GRAY)
    d.rectangle([(pad, 116), (pad + 60, 118)], fill=cor)

    # Título do tópico
    draw_wrapped(d, topico_titulo, load_font(FONTB, 46), pad, 132,
                 left_w - pad * 2, WHITE, spacing=12)

    # Badge CTFL
    d.text((pad, H - 56), "CTFL v4.0", font=load_font(FONTB, 14), fill=cor)

    # ── Painel direito ────────────────────────────────────────
    rc = right_x + (W - right_x) // 2   # centro horizontal do painel direito

    num_str  = f"{topico_numero:02d}"
    num_font = load_font(FONTB, 150)
    num_bbox = d.textbbox((0, 0), num_str, font=num_font)
    d.text((rc - (num_bbox[2] - num_bbox[0]) // 2, H // 2 - 95),
           num_str, font=num_font, fill=cor)

    lbl_font = load_font(FONT, 13)
    lbl_bbox = d.textbbox((0, 0), "TÓPICO", font=lbl_font)
    d.text((rc - (lbl_bbox[2] - lbl_bbox[0]) // 2, H // 2 + 68),
           "TÓPICO", font=lbl_font, fill=cor_dim)

    img.save(path)
```

- [ ] **Step 2: Verificar visualmente gerando uma thumbnail de teste**

No terminal local (requer Pillow instalado):

```bash
cd c:/ctfl-app
python - <<'EOF'
import sys; sys.path.insert(0, "scripts")
# Copie temporariamente as funções necessárias ou execute:
exec(open("scripts/gerar-videos.py").read().split("# ── Áudio")[0])
gerar_thumbnail(
    "Os 7 Princípios do Teste", 1, "Fundamentos de Teste",
    2, "#d4af37", "/tmp/thumb_test.png"
)
print("Thumbnail salva em /tmp/thumb_test.png")
EOF
```

Inspecionar `/tmp/thumb_test.png`: deve mostrar layout split-vertical, "TEST" em dourado + "PATH" em branco, número "02" em dourado no painel direito.

*(No ambiente Windows: adaptar o path para `C:\\Temp\\thumb_test.png` e abrir com o visualizador de imagens.)*

### 2b — Adicionar `upload_thumbnail()`

- [ ] **Step 3: Adicionar `upload_thumbnail()` logo após `upload_youtube()`**

```python
def upload_thumbnail(yt, video_id: str, thumb_path: str) -> None:
    yt.thumbnails().set(
        videoId=video_id,
        media_body=MediaFileUpload(thumb_path, mimetype="image/png"),
    ).execute()
```

### 2c — Atualizar `processar_topico()` para gerar + enviar thumbnail

- [ ] **Step 4: Adicionar `cor` e `topico_numero` ao início de `processar_topico()` e chamar `gerar_thumbnail` + `upload_thumbnail` após o upload do vídeo**

Localizar `def processar_topico(...)` (linha ~316). Substituir o bloco inteiro:

```python
def processar_topico(topico_id: str, dados: dict, cap_info: dict, yt, tmpdir: str) -> dict:
    narrativa     = dados["narrativa"]
    cards         = dados["cards"]
    dica          = dados["dicaEstudo"]
    topico_titulo = cap_info["topicoTitulo"]
    topico_numero = cap_info["topicoNumero"]
    cap_numero    = cap_info["capituloNumero"]
    cap_titulo    = cap_info["capituloTitulo"]
    cor_hex       = cap_info["cor"]
    total_cards   = len(cards)

    slides_audios: list[tuple[str, str]] = []

    def add_slide(img: Image.Image, nome: str, texto_narr: str) -> None:
        sp = f"{tmpdir}/{nome}.png"
        ap = f"{tmpdir}/{nome}.wav"
        img.save(sp)
        gerar_audio(texto_narr, ap)
        slides_audios.append((sp, ap))

    add_slide(
        slide_intro(topico_titulo, cap_numero, cap_titulo),
        "intro",
        f"Olá! Neste vídeo vamos estudar {topico_titulo}, "
        f"do Capítulo {cap_numero}: {cap_titulo}.",
    )
    add_slide(
        slide_contexto(narrativa["paragrafos"][0], narrativa["titulo"]),
        "contexto",
        narrativa["paragrafos"][0],
    )
    for i, card in enumerate(cards):
        narr = f"{card['titulo']}. {card['explicacao']} Exemplo: {card['exemplo']}"
        add_slide(
            slide_card(i + 1, card["titulo"], card["explicacao"], card["exemplo"], total_cards),
            f"card_{i}",
            narr,
        )
    add_slide(
        slide_dica(dica),
        "dica",
        f"Dica de estudo: {dica}. Acesse TestPath para praticar com simulados!",
    )

    segmentos = []
    for j, (sp, ap) in enumerate(slides_audios):
        seg = f"{tmpdir}/seg_{j}.mp4"
        criar_segmento(sp, ap, seg)
        segmentos.append(seg)

    output_path = f"{tmpdir}/{topico_id}.mp4"
    bg = "scripts/assets/bg-music.mp3"
    concat_segmentos(segmentos, output_path, bg if Path(bg).exists() else None)

    dur_seg   = duracao_audio(output_path)
    dur_label = f"{round(dur_seg / 60)} min"

    titulo_yt = f"CTFL — {topico_titulo} | TestPath"
    desc_yt = (
        f"Videoaula: {topico_titulo}\n"
        f"Capítulo {cap_numero}: {cap_titulo}\n\n"
        f"Estude para a certificação CTFL v4.0 em testpath.online"
    )
    video_id = upload_youtube(yt, output_path, titulo_yt, desc_yt)

    # Thumbnail
    thumb_path = f"{tmpdir}/{topico_id}_thumb.png"
    gerar_thumbnail(topico_titulo, cap_numero, cap_titulo, topico_numero, cor_hex, thumb_path)
    upload_thumbnail(yt, video_id, thumb_path)

    url = f"https://www.youtube.com/embed/{video_id}"
    print(f"  ✅ {topico_id} → {url} ({dur_label})")
    return {"topicoId": topico_id, "url": url, "duracao": dur_label}
```

### 2d — `atualizar_thumbnails_existentes()` + atualizar `main()`

- [ ] **Step 5: Adicionar constante `THUMBS_JSON` e função `atualizar_thumbnails_existentes()` antes de `main()`**

Inserir logo antes de `# ── Main ──`:

```python
THUMBS_JSON = Path("scripts/thumbnails-enviadas.json")


def atualizar_thumbnails_existentes(
    yt, topicos: dict, capitulos: dict, vurls_text: str, tmpdir: str
) -> None:
    existentes = re.findall(
        r'"([^"]+)":\s+"https://www\.youtube\.com/embed/([^"]+)"', vurls_text
    )
    if not existentes:
        return

    enviadas: list[str] = (
        json.loads(THUMBS_JSON.read_text("utf-8")) if THUMBS_JSON.exists() else []
    )
    enviadas_set = set(enviadas)
    pendentes = [(tid, vid) for tid, vid in existentes if vid not in enviadas_set]

    if not pendentes:
        print("Thumbnails retroativas: todas já enviadas.")
        return

    print(f"Thumbnails retroativas: {len(pendentes)} pendentes")
    for topico_id, video_id in pendentes:
        if topico_id not in topicos or topico_id not in capitulos:
            continue
        cap_info = capitulos[topico_id]
        thumb_path = f"{tmpdir}/{topico_id}_retro_thumb.png"
        gerar_thumbnail(
            cap_info["topicoTitulo"],
            cap_info["capituloNumero"],
            cap_info["capituloTitulo"],
            cap_info["topicoNumero"],
            cap_info["cor"],
            thumb_path,
        )
        upload_thumbnail(yt, video_id, thumb_path)
        enviadas.append(video_id)
        THUMBS_JSON.write_text(
            json.dumps(enviadas, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        print(f"  🖼 thumbnail retroativa: {topico_id}")
```

- [ ] **Step 6: Atualizar `main()` para chamar `atualizar_thumbnails_existentes()` antes do loop de novos vídeos**

Substituir a função `main()` inteira:

```python
def main() -> None:
    data      = json.loads(Path("scripts/conteudo.json").read_text("utf-8"))
    topicos   = data["topicos"]
    capitulos = data["capitulos"]

    vurls_text = Path("src/data/video-urls.ts").read_text("utf-8")
    ja_tem     = set(re.findall(r'"([^"]+)":\s+"https://', vurls_text))
    pendentes  = [tid for tid in topicos if tid not in ja_tem]

    print(f"Pendentes: {len(pendentes)}/{len(topicos)}")

    yt = youtube_client()

    with tempfile.TemporaryDirectory() as tmpdir:
        # Thumbnails retroativas (vídeos já publicados sem thumbnail)
        atualizar_thumbnails_existentes(yt, topicos, capitulos, vurls_text, tmpdir)

        if not pendentes:
            print("Todos os tópicos já têm vídeo.")
            return

        output_json = Path("scripts/video-urls-new.json")
        novos: list[dict] = (
            json.loads(output_json.read_text("utf-8")) if output_json.exists() else []
        )

        for topico_id in pendentes[:MAX_UPLOADS]:
            print(f"\nProcessando: {topico_id}")
            resultado = processar_topico(
                topico_id, topicos[topico_id], capitulos[topico_id], yt, tmpdir
            )
            novos.append(resultado)
            output_json.write_text(
                json.dumps(novos, indent=2, ensure_ascii=False), encoding="utf-8"
            )

    print(f"\n{len(novos)} URLs salvas em scripts/video-urls-new.json")
```

- [ ] **Step 7: Commit**

```bash
git add scripts/gerar-videos.py
git commit -m "feat: gerar_thumbnail + upload_thumbnail — thumbnails com cor por capítulo"
```

---

## Task 3: Arquivo de rastreamento + workflow

**Files:**
- Create: `scripts/thumbnails-enviadas.json`
- Modify: `.github/workflows/gerar-videos.yml`

- [ ] **Step 1: Criar `scripts/thumbnails-enviadas.json`**

Criar o arquivo com conteúdo inicial vazio:

```json
[]
```

Caminho: `scripts/thumbnails-enviadas.json`

- [ ] **Step 2: Atualizar o step "Commit and push" no workflow para incluir o arquivo de rastreamento**

Em `.github/workflows/gerar-videos.yml`, localizar:

```yaml
          git add src/data/video-urls.ts
```

Substituir por:

```yaml
          git add src/data/video-urls.ts scripts/thumbnails-enviadas.json
```

- [ ] **Step 3: Verificar que `thumbnails-enviadas.json` NÃO está no `.gitignore`**

```bash
grep "thumbnails" .gitignore
```

Resultado esperado: nenhuma saída (o arquivo não deve estar ignorado).

- [ ] **Step 4: Commit e push**

```bash
git add scripts/thumbnails-enviadas.json .github/workflows/gerar-videos.yml
git commit -m "feat: rastreia thumbnails enviadas + workflow commita thumbnails-enviadas.json"
git push
```

- [ ] **Step 5: Acionar o workflow manualmente**

GitHub → Actions → "Gerar e publicar vídeos" → **Run workflow**

Verificar nos logs:
- Step "Generate videos": deve imprimir `Thumbnails retroativas: 6 pendentes` (os 6 vídeos já publicados) e `🖼 thumbnail retroativa: por-que-testar` etc.
- Após os vídeos novos, deve imprimir `✅ <id> → ... thumbnail enviada`
- Step "Commit and push": deve commitar `thumbnails-enviadas.json` atualizado

---

## Self-Review

**Cobertura do spec:**
- ✅ Layout split-vertical B com cor por capítulo → `gerar_thumbnail()`
- ✅ Painel esquerdo: barra, logo, capítulo, título, badge CTFL → Task 2 Step 1
- ✅ Painel direito: número do tópico centrado, label "TÓPICO" → Task 2 Step 1
- ✅ Upload via `thumbnails.set()` → `upload_thumbnail()` Task 2 Step 3
- ✅ Integração em `processar_topico()` → Task 2 Step 4
- ✅ Retroativas: `atualizar_thumbnails_existentes()` + `thumbnails-enviadas.json` → Tasks 2d e 3
- ✅ Workflow commita o arquivo de rastreamento → Task 3 Step 2
- ✅ `topicoNumero` exportado → Task 1
- ⚠️ Spec menciona requisito de canal verificado → sem código necessário, apenas observação operacional

**Consistência de tipos:**
- `cap_info["topicoNumero"]` adicionado em Task 1 e consumido em Tasks 2c e 2d ✅
- `gerar_thumbnail()` assinatura idêntica em todas as chamadas ✅
- `upload_thumbnail(yt, video_id, thumb_path)` consistente entre Task 2b e Task 2c ✅
