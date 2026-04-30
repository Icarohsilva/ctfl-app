"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type Props = {
  slotId: string;
  format?: "auto" | "horizontal" | "rectangle";
  style?: React.CSSProperties;
};

export default function AdBanner({ slotId, format = "auto", style }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
      suppressHydrationWarning
    />
  );
}
