"use client";
import { useEffect, useState } from "react";

export default function PWAInstaller() {
  const [podeInstalar, setPodeInstalar] = useState(false);
  const [instalado, setInstalado] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promptEvento, setPromptEvento] = useState<any>(null);

  useEffect(() => {
    // Registra o service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registrado:", reg.scope))
        .catch((err) => console.log("SW erro:", err));
    }

    // Verifica se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalado(true);
      return;
    }

    // Captura o evento de instalação
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvento(e);
      setPodeInstalar(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalado(true);
      setPodeInstalar(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const instalar = async () => {
    if (!promptEvento) return;
    promptEvento.prompt();
    const resultado = await promptEvento.userChoice;
    if (resultado.outcome === "accepted") {
      setInstalado(true);
      setPodeInstalar(false);
    }
  };

  // Não mostra nada se já instalado ou não pode instalar
  if (instalado || !podeInstalar) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
      background: "#0f0f18", border: "1px solid #c9a84c44", borderRadius: "14px",
      padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 999, maxWidth: "400px", width: "calc(100% - 2rem)",
      animation: "slideUp 0.4s ease",
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
      <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>🧪</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "2px" }}>
          Instalar TestPath
        </div>
        <div style={{ fontSize: "12px", color: "#5a5a6a" }}>
          Adicione à tela inicial para acesso rápido
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button onClick={() => setPodeInstalar(false)}
          style={{ background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "6px 12px", color: "#5a5a6a", fontSize: "12px", cursor: "pointer" }}>
          Agora não
        </button>
        <button onClick={instalar}
          style={{ background: "#c9a84c", border: "none", borderRadius: "8px", padding: "6px 14px", color: "#0a0a0f", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
          Instalar
        </button>
      </div>
    </div>
  );
}