"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificacaoPermissao() {
  const [mostrar, setMostrar] = useState(false);
  const [estado, setEstado] = useState<"idle" | "solicitando" | "ativo" | "negado">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    verificar();
  }, []);

  const verificar = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted") { setEstado("ativo"); return; }
    if (Notification.permission === "denied") { setEstado("negado"); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Só mostra depois de 30 segundos na primeira visita
    const jaViu = localStorage.getItem("notif_prompt_visto");
    if (!jaViu) {
      // Mostra após 3 segundos no primeiro acesso
      setTimeout(() => {
        setMostrar(true);
        localStorage.setItem("notif_prompt_visto", "1");
      }, 3000);
    }
  };

  const solicitarPermissao = async () => {
    setEstado("solicitando");
    const permissao = await Notification.requestPermission();

    if (permissao === "granted") {
      await registrarSubscription();
      setEstado("ativo");
      setMostrar(false);
    } else {
      setEstado("negado");
      setMostrar(false);
    }
  };

  const registrarSubscription = async () => {
    if (!userId) return;
    const sw = await navigator.serviceWorker.ready;
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!) as unknown as BufferSource,
    });

    await fetch("/api/push/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, userId }),
    });
  };

  if (!mostrar) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
      background: "#0f0f18", border: "1px solid #c9a84c44",
      borderRadius: "16px", padding: "1.5rem",
      boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
      zIndex: 998, maxWidth: "420px", width: "calc(100% - 2rem)",
      animation: "slideUp 0.4s ease",
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(120px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>

      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#1a1a0e", border: "1px solid #c9a84c33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
          🔔
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "4px" }}>
            Ativar lembretes de estudo
          </div>
          <div style={{ fontSize: "13px", color: "#7a7a8a", lineHeight: 1.5 }}>
            Receba um lembrete quando não estudar — direto no celular e por e-mail. Você pode desativar quando quiser.
          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div style={{ background: "#0a0a0f", borderRadius: "10px", padding: "10px 14px", marginBottom: "1.25rem" }}>
        {[
          { icon: "🔥", texto: "Não deixa o streak quebrar" },
          { icon: "🎯", texto: "Chega na prova preparado" },
          { icon: "📧", texto: "E-mail + notificação no app" },
        ].map((b, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: i < 2 ? "6px" : 0 }}>
            <span style={{ fontSize: "13px" }}>{b.icon}</span>
            <span style={{ fontSize: "12px", color: "#7a7a8a" }}>{b.texto}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setMostrar(false)}
          style={{ flex: 1, background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "10px", color: "#5a5a6a", fontSize: "13px", cursor: "pointer" }}>
          Agora não
        </button>
        <button onClick={solicitarPermissao} disabled={estado === "solicitando"}
          style={{ flex: 2, background: "#c9a84c", border: "none", borderRadius: "8px", padding: "10px", color: "#0a0a0f", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>
          {estado === "solicitando" ? "Ativando..." : "Ativar lembretes 🔔"}
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "10px", fontSize: "11px", color: "#3a3a4a" }}>
        Sem spam. Só quando você não estudar no dia.
      </p>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}