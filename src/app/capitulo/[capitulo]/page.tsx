import { use } from "react";
import { notFound } from "next/navigation";
import CapituloPage from "@/components/CapituloPage";
import mapaCaptulos from "@/data/mapa-capitulos";

export default function Cap({ params }: { params: Promise<{ capitulo: string }> }) {
  const { capitulo } = use(params);
  const numero = Number(capitulo);
  if (!Number.isInteger(numero) || !mapaCaptulos[numero]) notFound();
  return <CapituloPage numeroCapitulo={numero} />;
}
