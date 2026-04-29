"use client";
import { useEffect } from "react";

export default function ConfirmarEmail() {
  useEffect(() => {
    // Redireciona para o perfil após 3 segundos
    setTimeout(() => { window.location.href = "/perfil"; }, 3000);
  }, []);

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
          E-mail confirmado!
        </h2>
        <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6 }}>
          Seu e-mail foi atualizado com sucesso. Redirecionando para o perfil...
        </p>
      </div>
    </main>
  );
}