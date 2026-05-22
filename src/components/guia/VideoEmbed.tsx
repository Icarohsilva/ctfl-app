"use client";

type Props = {
  videoId: string;
  titulo?: string;
};

export default function VideoEmbed({ videoId, titulo }: Props) {
  const videoUrls: Record<string, string> = {
    "por-que-testar": "https://www.youtube.com/embed/GWs-BjMtcVc",
    "7-principios": "https://www.youtube.com/embed/kBh2rMH59Lg",
    "erro-defeito-falha": "https://www.youtube.com/embed/ZB9RqaBbFN0",
    "atividades-e-papeis": "https://www.youtube.com/embed/uAt3mfEl8Rk",
    "modelos-desenvolvimento": "https://www.youtube.com/embed/rYri_0c71pg",
    "niveis-teste": "https://www.youtube.com/embed/SpXcEsMIaPQ",
    "tipos-teste": "https://www.youtube.com/embed/q-_YLvAM_zE",
    "teste-manutencao": "https://www.youtube.com/embed/J1G6RZ6MNAQ",
    "fundamentos-estatico": "https://www.youtube.com/embed/tBs0-_-s_Es",
    "processo-revisao": "https://www.youtube.com/embed/D_qqizvvPJA",
    "analise-estatica": "https://www.youtube.com/embed/M_G8k7UHyGY",
    "particao-equivalencia": "https://www.youtube.com/embed/3ZQQ6IOfNUU",
    "analise-valor-limite": "https://www.youtube.com/embed/sHS6DI5DSZM",
    "tabela-decisao": "https://www.youtube.com/embed/1M6zmV5LdZc",
    "transicao-estado": "https://www.youtube.com/embed/raJYY1YJolM",
    "caixa-branca": "https://www.youtube.com/embed/PIi9LOtwLPc",
    "baseado-experiencia": "https://www.youtube.com/embed/n1j7kqSrulI",
    "planejamento-teste": "https://www.youtube.com/embed/7SJ5NYkUMOE",
    "monitoramento-controle": "https://www.youtube.com/embed/1sphwbuzI7c",
    "gestao-risco": "https://www.youtube.com/embed/v_ZULMqqbp4",
    "gestao-defeitos": "https://www.youtube.com/embed/cN2_RL0MqOA",
    "ferramentas-suporte": "https://www.youtube.com/embed/Re82WN3vi4w",
    "automacao-teste": "https://www.youtube.com/embed/FzbbO4mytxA",
    "selecao-ferramenta": "https://www.youtube.com/embed/1WbPYUYIky0",
  };

  const src = videoUrls[videoId];
  if (!src) return null;

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden", border: "1px solid #1f2937" }}>
        <iframe
          src={src}
          title={titulo || videoId}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
      {titulo && (
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", textAlign: "center" }}>
          🎬 {titulo}
        </p>
      )}
    </div>
  );
}
