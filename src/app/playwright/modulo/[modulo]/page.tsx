import { use } from "react";
import { notFound } from "next/navigation";
import ModuloPage from "./ModuloPage";
import { mapaModulos } from "@/data/playwright-modulos";

export default function Modulo({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = use(params);
  const num = Number(modulo);
  if (!Number.isInteger(num) || !mapaModulos[num]) notFound();
  return <ModuloPage numeroModulo={num} />;
}
