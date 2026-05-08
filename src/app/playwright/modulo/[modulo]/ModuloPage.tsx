"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { mapaModulos } from "@/data/playwright-modulos";

export default function ModuloPage({
  numeroModulo,
}: {
  numeroModulo: number;
}) {
  const [labsConcluidos, setLabsConcluidos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const mod = mapaModulos[numeroModulo];

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase
        .from("progresso_topicos")
        .select("topico_id")
        .eq("user_id", user.id)
        .eq("certificacao_id", "playwright")
        .eq("capitulo", numeroModulo)
        .eq("concluido", true);
      if (data) setLabsConcluidos(data.map((d) => d.topico_id));
      setLoading(false);
    })();
  }, [numeroModulo]);

  if (loading)
    return (
      <main
        style={{
          background: "#0b0f1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#06b6d4", fontFamily: "Georgia, serif" }}>
          Carregando...
        </div>
      </main>
    );

  const pct = Math.round((labsConcluidos.length / mod.labs.length) * 100);

  return (
    <main
      style={{
        background: "#0b0f1a",
        minHeight: "100vh",
        color: "#e5e7eb",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <a
          href="/playwright"
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "1.5rem",
          }}
        >
          ← Dashboard Playwright
        </a>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: `${mod.cor}18`,
              border: `1px solid ${mod.cor}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
            }}
          >
            {mod.emoji}
          </div>
          <div>
            <div
              style={{
                fontSize: "11px",
                color: mod.cor,
                fontWeight: "bold",
                letterSpacing: "0.06em",
                marginBottom: "2px",
              }}
            >
              MÓDULO {mod.numero}
            </div>
            <h1
              style={{
                fontSize: "1.4rem",
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                color: "#e5e7eb",
                margin: 0,
              }}
            >
              {mod.titulo}
            </h1>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              {mod.descricao}
            </div>
          </div>
        </div>

        {/* Barra de progresso do módulo */}
        <div
          style={{
            background: "#111827",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            <span>
              {labsConcluidos.length}/{mod.labs.length} labs concluídos
            </span>
            <span style={{ color: mod.cor }}>{pct}%</span>
          </div>
          <div
            style={{
              background: "#1f2937",
              borderRadius: "99px",
              height: "5px",
            }}
          >
            <div
              style={{
                background: mod.cor,
                width: `${pct}%`,
                height: "5px",
                borderRadius: "99px",
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>

        {/* Lista de labs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {mod.labs.map((lab, i) => {
            const concluido = labsConcluidos.includes(lab.id);
            const bloqueado =
              i > 0 && !labsConcluidos.includes(mod.labs[i - 1].id);
            return (
              <div
                key={lab.id}
                onClick={() =>
                  !bloqueado &&
                  (window.location.href = `/playwright/modulo/${numeroModulo}/lab/${lab.id}`)
                }
                style={{
                  background: "#111827",
                  border: `1px solid ${concluido ? mod.cor + "44" : "#1f2937"}`,
                  borderRadius: "12px",
                  padding: "14px 16px",
                  cursor: bloqueado ? "default" : "pointer",
                  opacity: bloqueado ? 0.5 : 1,
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: concluido ? `${mod.cor}18` : "#1f2937",
                    border: `1px solid ${concluido ? mod.cor : "#374151"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    flexShrink: 0,
                    color: concluido ? mod.cor : "#6b7280",
                  }}
                >
                  {concluido ? "✓" : bloqueado ? "🔒" : `${lab.numero}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: concluido ? mod.cor : "#e5e7eb",
                    }}
                  >
                    {lab.titulo}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginTop: "1px",
                    }}
                  >
                    {lab.subtitulo}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#d4af37" }}>
                  +{lab.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
