"use client";
import { useState, useEffect } from "react";

const certs = [
  { id: "ctfl", nome: "CTFL v4.0", org: "ISTQB", nivel: "Foundation", cor: "#c9a84c", status: "disponível", desc: "Base de toda carreira em QA. 24 tópicos, 6 capítulos.", emoji: "🎓" },
  { id: "ctfl-at", nome: "CTFL-AT", org: "ISTQB", nivel: "Foundation", cor: "#7c9e6e", status: "em breve", desc: "Agile Tester — teste em ambientes ágeis.", emoji: "⚡" },
  { id: "ctal-ta", nome: "CTAL-TA", org: "ISTQB", nivel: "Advanced", cor: "#6e8fa8", status: "em breve", desc: "Test Analyst — análise e modelagem avançada.", emoji: "🔬" },
  { id: "ctal-tm", nome: "CTAL-TM", org: "ISTQB", nivel: "Advanced", cor: "#9e7c6e", status: "em breve", desc: "Test Manager — gestão avançada de testes.", emoji: "📋" },
  { id: "playwright", nome: "Playwright", org: "Técnico", nivel: "Automação", cor: "#6e6e9e", status: "em breve", desc: "Automação de testes web com Playwright.", emoji: "🤖" },
];

export default function CertsSelector() {
  const [certAtiva, setCertAtiva] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCertAtiva(c => (c + 1) % certs.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const cert = certs[certAtiva];

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
        {certs.map((c, i) => (
          <button key={c.id} onClick={() => setCertAtiva(i)}
            style={{ background: certAtiva === i ? "#1a1a0e" : "#0f0f18", border: `1px solid ${certAtiva === i ? c.cor : "#2e2e3e"}`, borderRadius: "99px", padding: "6px 14px", color: certAtiva === i ? c.cor : "#5a5a6a", fontSize: "12px", cursor: "pointer", fontWeight: certAtiva === i ? "bold" : "normal", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span>{c.emoji}</span>
            <span>{c.nome}</span>
            {c.status === "em breve" && <span style={{ fontSize: "9px", background: "#1e1e2e", color: "#5a5a6a", padding: "1px 5px", borderRadius: "99px" }}>em breve</span>}
          </button>
        ))}
      </div>
      <div style={{ background: "#0f0f18", border: `1px solid ${cert.cor}44`, borderRadius: "16px", padding: "1.5rem", maxWidth: "480px", margin: "0 auto 2.5rem", transition: "all 0.3s", textAlign: "left", display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#1a1a0e", border: `1px solid ${cert.cor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>
          {cert.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "15px", fontWeight: "bold", color: "#e8d5a3" }}>{cert.nome}</span>
            <span style={{ fontSize: "10px", background: "#1a1a0e", color: cert.cor, border: `1px solid ${cert.cor}44`, padding: "2px 7px", borderRadius: "99px" }}>{cert.nivel}</span>
            <span style={{ fontSize: "10px", background: cert.status === "disponível" ? "#1e3e1e" : "#1e1e2e", color: cert.status === "disponível" ? "#4e9e4e" : "#5a5a6a", padding: "2px 7px", borderRadius: "99px" }}>
              {cert.status === "disponível" ? "✓ Disponível" : "Em breve"}
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "#7a7a8a" }}>{cert.org} · {cert.desc}</div>
        </div>
      </div>
    </div>
  );
}