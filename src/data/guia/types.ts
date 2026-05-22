export type SecaoArtigo = {
  titulo: string;
  conteudo: string; // HTML estático renderizado via dangerouslySetInnerHTML
  videoId?: string; // chave de src/data/video-urls.ts
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
  descricao: string;
  secao: "ctfl" | "playwright" | "ingles";
  tempoLeitura: number;
  nivel: "iniciante" | "intermediário" | "avançado";
  secoes: SecaoArtigo[];
  quiz: QuizPergunta[];
};

export type ArtigoMeta = Pick<
  ArtigoGuia,
  "slug" | "titulo" | "descricao" | "secao" | "tempoLeitura" | "nivel"
>;
