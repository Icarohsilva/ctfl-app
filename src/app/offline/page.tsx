"use client";

export default function Offline() {
  return (
    <main style={{
      background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8",
      fontFamily: "sans-serif", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📡</div>
      <h1 style={{ fontSize: "1.6rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.75rem" }}>
        Você está offline
      </h1>
      <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6, maxWidth: "360px", marginBottom: "2rem" }}>
        Verifique sua conexão com a internet e tente novamente. Suas respostas e progresso ficam salvos quando você voltar online.
      </p>
      <button onClick={() => window.location.reload()}
        style={{ background: "#c9a84c", border: "none", borderRadius: "10px", padding: "12px 28px", color: "#0a0a0f", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }}>
        Tentar novamente
      </button>
    </main>
  );
}