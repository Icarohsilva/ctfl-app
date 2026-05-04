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
