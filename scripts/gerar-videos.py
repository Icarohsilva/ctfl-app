#!/usr/bin/env python3
"""Gera vídeos CTFL e faz upload no YouTube.

Lê:    scripts/conteudo.json, src/data/video-urls.ts
Escreve: scripts/video-urls-new.json

Requisitos:
    pip install Pillow google-api-python-client google-auth-oauthlib google-auth-httplib2
    Piper TTS binary em scripts/piper/piper (baixado pelo workflow)

Variáveis de ambiente:
    YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
"""

import json
import os
import re
import subprocess
import tempfile
import unicodedata
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# ── Dimensões e cores ────────────────────────────────────────────────────────
W, H = 1280, 720
BG_TOP   = (11, 15, 26)
BG_BOT   = (4,  6, 14)
GOLD     = (212, 175, 55)
WHITE    = (229, 231, 235)
GRAY     = (107, 114, 128)
BLUE     = (59,  130, 246)
BLUE_DIM = (10,  20,  45)
GREEN    = (52,  211, 153)

FONT  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

PIPER_BIN  = Path("scripts/piper/piper")
MODEL_ONNX = Path("scripts/piper-models/pt_BR-faber-medium.onnx")
MAX_UPLOADS = 5


# ── Helpers de texto e fonte ─────────────────────────────────────────────────

def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def strip_emoji(text: str) -> str:
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


# ── Primitivas visuais ───────────────────────────────────────────────────────

def make_bg() -> Image.Image:
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = round(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t)
        g = round(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t)
        b = round(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t)
        d.line([(0, y), (W - 1, y)], fill=(r, g, b))
    return img

def draw_progress(d: ImageDraw.ImageDraw, current: int, total: int) -> None:
    bx, by, bw = 60, H - 28, W - 120
    d.rectangle([(bx, by), (bx + bw, by + 4)], fill=(22, 32, 52))
    filled = int(bw * current / max(total, 1))
    if filled > 0:
        d.rectangle([(bx, by), (bx + filled, by + 4)], fill=BLUE)
    d.text((bx + bw + 10, by - 6), f"{current}/{total}", font=load_font(FONT, 14), fill=GRAY)


# ── Geração de slides ─────────────────────────────────────────────────────────

def slide_intro(topico_titulo: str, cap_numero: int, cap_titulo: str) -> Image.Image:
    img = make_bg()
    d = ImageDraw.Draw(img)

    # Watermark do número do capítulo
    d.text((W - 280, H // 2 - 160), str(cap_numero),
           font=load_font(FONTB, 280), fill=(16, 22, 40))

    # Barra esquerda dourada
    d.rectangle([(0, 0), (5, H)], fill=GOLD)

    # Branding "TEST PATH"
    d.text((28, 36), "TEST", font=load_font(FONTB, 40), fill=GOLD)
    d.text((114, 36), "PATH", font=load_font(FONTB, 40), fill=WHITE)

    # Badge do capítulo
    badge = f"CAPÍTULO {cap_numero}"
    d.rectangle([(28, 106), (28 + len(badge) * 10 + 16, 130)], fill=BLUE_DIM)
    d.text((36, 111), badge, font=load_font(FONTB, 15), fill=BLUE)

    d.text((28, 138), cap_titulo, font=load_font(FONT, 20), fill=GRAY)

    # Linha divisória
    d.rectangle([(28, 176), (200, 179)], fill=GOLD)

    # Título do tópico
    draw_wrapped(d, topico_titulo, load_font(FONTB, 50), 28, 194, W - 210, WHITE, spacing=12)

    # Rodapé
    d.rectangle([(0, H - 50), (W, H)], fill=(5, 8, 16))
    d.text((28, H - 34), "testpath.online", font=load_font(FONT, 16), fill=(50, 60, 78))

    return img


def slide_contexto(paragrafo: str, topico_titulo: str) -> Image.Image:
    img = make_bg()
    d = ImageDraw.Draw(img)

    # Barra esquerda dourada
    d.rectangle([(0, 0), (5, H)], fill=GOLD)

    # Badge
    d.rectangle([(28, 28), (196, 56)], fill=(20, 28, 50))
    d.text((40, 34), "CONTEXTO", font=load_font(FONTB, 17), fill=BLUE)

    d.text((28, 68), topico_titulo, font=load_font(FONT, 18), fill=GRAY)
    d.rectangle([(28, 98), (90, 101)], fill=BLUE)

    # Parágrafo
    draw_wrapped(d, paragrafo, load_font(FONT, 24), 28, 116, W - 56, WHITE, spacing=14)

    return img


def slide_card(numero: int, titulo: str, explicacao: str, exemplo: str, total: int) -> Image.Image:
    img = make_bg()
    d = ImageDraw.Draw(img)

    # Watermark do número
    d.text((W - 240, H // 2 - 110), f"{numero:02d}",
           font=load_font(FONTB, 200), fill=(13, 19, 34))

    # Barra esquerda azul
    d.rectangle([(0, 0), (5, H)], fill=BLUE)

    # Badge numerado
    d.rectangle([(28, 26), (82, 70)], fill=BLUE)
    d.text((38, 33), f"{numero:02d}", font=load_font(FONTB, 26), fill=WHITE)

    # Título do card
    y_title = draw_wrapped(d, titulo, load_font(FONTB, 28), 28, 86, W - 260, GOLD, spacing=8)
    d.rectangle([(28, y_title + 4), (160, y_title + 7)], fill=GOLD)

    # Explicação
    y = draw_wrapped(d, explicacao, load_font(FONT, 21), 28, y_title + 22, W - 80, WHITE, spacing=10)

    # Caixa de exemplo
    y = max(y + 14, 370)
    box_bottom = min(y + 118, H - 46)
    d.rectangle([(28, y), (W - 28, box_bottom)], fill=(9, 14, 28))
    d.rectangle([(28, y), (33, box_bottom)], fill=BLUE)
    draw_wrapped(d, f"Ex.: {exemplo}", load_font(FONT, 18), 48, y + 10,
                 W - 96, (156, 163, 175), spacing=7)

    # Barra de progresso
    draw_progress(d, numero, total)

    return img


def slide_dica(dica: str) -> Image.Image:
    img = make_bg()
    d = ImageDraw.Draw(img)

    # Barra esquerda verde
    d.rectangle([(0, 0), (5, H)], fill=GREEN)

    # Badge
    d.rectangle([(28, 28), (218, 58)], fill=(10, 35, 24))
    d.text((40, 35), "DICA DE ESTUDO", font=load_font(FONTB, 17), fill=GREEN)

    d.rectangle([(28, 72), (110, 75)], fill=GREEN)

    # Texto da dica
    draw_wrapped(d, dica, load_font(FONT, 24), 28, 94, W - 56, WHITE, spacing=14)

    # Rodapé CTA
    d.rectangle([(0, H - 58), (W, H)], fill=(5, 8, 16))
    d.text((28, H - 42), "Pratique com simulados em  testpath.online — certificação CTFL v4.0",
           font=load_font(FONTB, 17), fill=GRAY)

    return img


# ── Áudio (Piper TTS) ────────────────────────────────────────────────────────

def gerar_audio(texto: str, path: str) -> None:
    subprocess.run(
        [str(PIPER_BIN), "--model", str(MODEL_ONNX), "--output_file", path],
        input=strip_emoji(texto).encode("utf-8"),
        check=True,
        capture_output=True,
    )

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

def processar_topico(topico_id: str, dados: dict, cap_info: dict, yt, tmpdir: str) -> dict:
    narrativa     = dados["narrativa"]
    cards         = dados["cards"]
    dica          = dados["dicaEstudo"]
    topico_titulo = cap_info["topicoTitulo"]
    cap_numero    = cap_info["capituloNumero"]
    cap_titulo    = cap_info["capituloTitulo"]
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
    url = f"https://www.youtube.com/embed/{video_id}"
    print(f"  ✅ {topico_id} → {url} ({dur_label})")
    return {"topicoId": topico_id, "url": url, "duracao": dur_label}


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    data      = json.loads(Path("scripts/conteudo.json").read_text("utf-8"))
    topicos   = data["topicos"]
    capitulos = data["capitulos"]

    vurls_text = Path("src/data/video-urls.ts").read_text("utf-8")
    ja_tem     = set(re.findall(r'"([^"]+)":\s+"https://', vurls_text))
    pendentes  = [tid for tid in topicos if tid not in ja_tem]

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
            resultado = processar_topico(
                topico_id, topicos[topico_id], capitulos[topico_id], yt, tmpdir
            )
            novos.append(resultado)
            output_json.write_text(json.dumps(novos, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n{len(novos)} URLs salvas em scripts/video-urls-new.json")


if __name__ == "__main__":
    main()
