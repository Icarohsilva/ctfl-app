# Thumbnails Personalizadas no YouTube — TestPath

**Data:** 2026-05-04
**Escopo:** Geração e upload de thumbnails 1280×720px para cada vídeo CTFL no YouTube, usando a cor do capítulo como identidade visual, integrado ao pipeline `gerar-videos.py` existente.

---

## 1. Visão geral

Cada vídeo publicado no YouTube receberá uma thumbnail personalizada gerada com Pillow, no mesmo momento em que o vídeo é uploadado. Vídeos já publicados receberão thumbnails retroativamente na primeira execução do pipeline atualizado.

---

## 2. Visual da thumbnail

**Dimensões:** 1280 × 720px, PNG

**Layout — split vertical:**

```
┌──────────────────────────────────┬───┬─────────────────┐
│  ▌ TESTPATH                      │ │ │                 │
│  ▌ Capítulo 2 · Ciclo de Vida    │ │ │      02         │
│  ▌                               │ │ │    TÓPICO       │
│  ▌ Níveis de Teste               │ │ │                 │
│  ▌ CTFL v4.0                     │ │ │                 │
└──────────────────────────────────┴───┴─────────────────┘
   ←————————— 60% ————————→ 3px  ←——— 40% ———→
```

**Painel esquerdo (60%):**
- Fundo: `#0b0f1a`
- Barra vertical esquerda: 5px na cor do capítulo
- Logo "TESTPATH": "TEST" na cor do capítulo, "PATH" em branco, fonte Bold 32px
- Linha "Capítulo N · Nome": cinza `#6b7280`, fonte Regular 14px
- Título do tópico: branco `#ffffff`, fonte Bold 36px, quebra de linha automática, max 2 linhas
- Badge "CTFL v4.0": na cor do capítulo, fonte Bold 11px, letra espaçada

**Divisor:** 3px, gradiente vertical da cor do capítulo (opaco → transparente)

**Painel direito (40%):**
- Fundo: cor do capítulo com 8% opacidade sobre `#0b0f1a`
- Número do tópico (ex: `02`): cor do capítulo, fonte Bold 120px, centralizado
- Label "TÓPICO": cor do capítulo com 50% opacidade, fonte Regular 12px, letra espaçada

**Cores por capítulo** (lidas de `mapa-capitulos.ts`):
| Capítulo | Cor |
|----------|-----|
| 1 — Fundamentos | `#d4af37` |
| 2 — Ciclo de Vida | `#10b981` |
| 3 — Teste Estático | `#3b82f6` |
| 4 — Análise e Modelagem | `#d4af37` |
| 5 — Gerenciamento | `#8b5cf6` |
| 6 — Ferramentas | `#06b6d4` |

---

## 3. Integração no pipeline

### `scripts/gerar-videos.py`

**Nova função `gerar_thumbnail()`:**
```python
def gerar_thumbnail(
    topico_titulo: str,
    cap_numero: int,
    cap_titulo: str,
    topico_numero: int,
    cor_hex: str,
    path: str,
) -> None:
```

Chamada em `processar_topico()` após a geração dos slides, antes do upload do vídeo.

**Nova função `upload_thumbnail()`:**
```python
def upload_thumbnail(yt, video_id: str, thumb_path: str) -> None:
    yt.thumbnails().set(
        videoId=video_id,
        media_body=MediaFileUpload(thumb_path, mimetype="image/png"),
    ).execute()
```

Chamada logo após `upload_youtube()` retornar o `video_id`.

### `scripts/conteudo.json`

O exportador já inclui `capituloNumero` e `cor` do capítulo no JSON exportado. A função `gerar_thumbnail()` lê `cor` de `cap_info["cor"]`.

### `scripts/exportar-conteudo.ts`

Adicionar `cor` ao objeto `capitulos` exportado (campo `cor` já existe em `CapituloMeta`).

---

## 4. Thumbnails retroativas

Na primeira execução com o pipeline atualizado, `processar_topico()` só é chamado para tópicos **sem URL** (`pendentes`). Para os 6 vídeos já publicados, adicionar um passo separado em `main()`:

```python
def atualizar_thumbnails_existentes(yt, topicos, capitulos, vurls_text, tmpdir):
    ja_tem = re.findall(r'"([^"]+)":\s+"https://www\.youtube\.com/embed/([^"]+)"', vurls_text)
    for topico_id, video_id in ja_tem:
        if topico_id not in topicos or topico_id not in capitulos:
            continue
        thumb_path = f"{tmpdir}/{topico_id}_thumb.png"
        gerar_thumbnail(..., path=thumb_path)
        upload_thumbnail(yt, video_id, thumb_path)
        print(f"  🖼 thumbnail atualizada: {topico_id}")
```

Este passo roda sempre em `main()`, mas verifica antes de fazer upload: só processa `video_id`s que ainda não estão em `scripts/thumbnails-enviadas.json` (arquivo simples `["video_id1", ...]` commitado no repo). Após o upload, acrescenta o ID ao arquivo. Na prática, roda com trabalho real apenas uma vez; nas execuções seguintes é no-op.

---

## 5. Quota YouTube Data API

| Operação | Custo (unidades) |
|----------|-----------------|
| `videos.insert` (upload vídeo) | 1.600 |
| `thumbnails.set` | 50 |
| **Total por tópico** | **1.650** |

Com limite de 10.000 unidades/dia → **6 tópicos completos por dia** (sem mudança prática no limite atual de 5).

---

## 6. Requisito YouTube

O canal precisa estar **verificado por telefone** para usar thumbnails customizadas. Sem verificação, `thumbnails.set` retorna erro 403. Verificação feita em: youtube.com → Configurações → Verificação do canal.

---

## 7. Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `scripts/gerar-videos.py` | `gerar_thumbnail()`, `upload_thumbnail()`, `atualizar_thumbnails_existentes()`, chamadas em `processar_topico()` e `main()` |
| `scripts/exportar-conteudo.ts` | Inclui campo `cor` no objeto `capitulos` exportado |

---

## 8. Fora do escopo

- Thumbnails para vídeos de capítulo (próximo ciclo)
- Upload retroativo automático via workflow (feito manualmente uma vez)
- Fallback para canal não verificado
