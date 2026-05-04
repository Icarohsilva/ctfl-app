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
