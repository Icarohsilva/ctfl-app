"use client";
import { useEffect, useState } from "react";

export default function PWAInstaller() {
  const [podeInstalar, setPodeInstalar] = useState(false);
  const [instalado, setInstalado] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promptEvento, setPromptEvento] = useState<any>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registrado:", reg.scope))
        .catch((err) => console.log("SW erro:", err));
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalado(true);
      return;
    }

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

  if (instalado || !podeInstalar) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
      background: "#111827", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "14px",
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
      <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#e5e7eb", marginBottom: "2px" }}>
          Instalar TestPath
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>
          Adicione à tela inicial para acesso rápido
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button onClick={() => setPodeInstalar(false)}
          style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 12px", color: "#6b7280", fontSize: "12px", cursor: "pointer" }}>
          Agora não
        </button>
        <button onClick={instalar}
          style={{ background: "#3b82f6", border: "none", borderRadius: "8px", padding: "6px 14px", color: "#ffffff", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
          Instalar
        </button>
      </div>
    </div>
  );
}
