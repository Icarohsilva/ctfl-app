import { use } from "react";
import { notFound } from "next/navigation";
import TopicoGenerico from "@/components/TopicoGenerico";
import mapaCaptulos from "@/data/mapa-capitulos";

export default function Topico({
  params,
}: {
  params: Promise<{ capitulo: string; id: string }>;
}) {
  const { capitulo, id } = use(params);
  const numero = Number(capitulo);
  if (!Number.isInteger(numero) || !mapaCaptulos[numero]) notFound();
  return (
    <TopicoGenerico
      params={Promise.resolve({ id })}
      numeroCapitulo={numero}
    />
  );
}
