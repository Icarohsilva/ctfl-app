"use client";

export default function Offline() {
  return (
    <main style={{
      background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb",
      fontFamily: "sans-serif", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📡</div>
      <h1 style={{ fontSize: "1.6rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.75rem" }}>
        Você está offline
      </h1>
      <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, maxWidth: "360px", marginBottom: "2rem" }}>
        Verifique sua conexão com a internet e tente novamente. Suas respostas e progresso ficam salvos quando você voltar online.
      </p>
      <button onClick={() => window.location.reload()}
        style={{ background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "10px", padding: "12px 28px", color: "#ffffff", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
        Tentar novamente
      </button>
    </main>
  );
}
