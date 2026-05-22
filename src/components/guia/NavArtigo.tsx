import type { ArtigoMeta } from "@/data/guia/types";

type Props = {
  anterior: ArtigoMeta | null;
  proximo: ArtigoMeta | null;
};

export default function NavArtigo({ anterior, proximo }: Props) {
  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
      {anterior ? (
        <a href={`/guia/${anterior.slug}`} style={{ flex: 1, minWidth: "200px", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1rem 1.25rem", textDecoration: "none", transition: "border-color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#374151")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f2937")}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>← ANTERIOR</div>
          <div style={{ fontSize: "14px", color: "#e5e7eb", fontWeight: 500, lineHeight: 1.4 }}>{anterior.titulo}</div>
        </a>
      ) : <div style={{ flex: 1 }} />}
      {proximo ? (
        <a href={`/guia/${proximo.slug}`} style={{ flex: 1, minWidth: "200px", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1rem 1.25rem", textDecoration: "none", textAlign: "right", transition: "border-color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#374151")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f2937")}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>PRÓXIMO →</div>
          <div style={{ fontSize: "14px", color: "#e5e7eb", fontWeight: 500, lineHeight: 1.4 }}>{proximo.titulo}</div>
        </a>
      ) : <div style={{ flex: 1 }} />}
    </div>
  );
}
