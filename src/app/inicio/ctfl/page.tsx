"use client";
import { useEffect } from "react";
import { useCertificacao } from "@/hooks/use-certificacao";
import OnboardingCertificacao from "@/components/OnboardingCertificacao";

export default function CTFLInicio() {
  const { loading, precisaOnboarding } = useCertificacao("ctfl");

  useEffect(() => {
    if (!loading && !precisaOnboarding) {
      window.location.href = "/dashboard";
    }
  }, [loading, precisaOnboarding]);

  if (loading) return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#c9a84c", fontFamily: "Georgia, serif" }}>Carregando...</div>
    </main>
  );

  if (precisaOnboarding) return <OnboardingCertificacao certId="ctfl" />;

  return null;
}