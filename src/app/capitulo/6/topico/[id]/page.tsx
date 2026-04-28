import TopicoGenerico from "@/components/TopicoGenerico";
export default function T({ params }: { params: Promise<{ id: string }> }) {
  return <TopicoGenerico params={params} numeroCapitulo={6} />;
}