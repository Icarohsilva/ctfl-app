// src/app/playwright/projeto-final/page.tsx
"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProjetoFinal() {
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "sans-serif", color: "#e5e7eb" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔨</div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal",
        fontSize: "1.8rem", marginBottom: "1rem", color: "#e5e7eb", textAlign: "center" }}>
        Projeto Final
      </h1>
      <p style={{ color: "#9ca3af", maxWidth: "480px", textAlign: "center",
        lineHeight: 1.7, marginBottom: "2rem" }}>
        Complete os 7 módulos do curso para desbloquear o projeto final.
        Aqui você vai automatizar a aplicação <strong style={{ color: "#06b6d4" }}>
        demo.playwright.dev</strong> e ter seus testes avaliados por IA.
      </p>
      <a href="/playwright" style={{ color: "#06b6d4", textDecoration: "none", fontSize: "14px" }}>
        ← Voltar ao dashboard
      </a>
    </main>
  );
}
