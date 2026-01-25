import { useEffect, useState } from "react";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

type Retangulo = { left: number; top: number; width: number; height: number };

function obterRetangulo(el: Element): Retangulo {
  const r = (el as HTMLElement).getBoundingClientRect();
  return { left: Math.max(0, r.left), top: Math.max(0, r.top), width: Math.max(0, r.width), height: Math.max(0, r.height) };
}

export function FocusSpotlightOverlay() {
  const ativo = useAcessibilidadeStore((s) => s.preferencias.destacarFoco);
  const [rect, setRect] = useState<Retangulo | null>(null);

  useEffect(() => {
    if (!ativo) {
      setRect(null);
      return;
    }

    const onFocusIn = (e: FocusEvent) => {
      const alvo = e.target as Element | null;
      if (!alvo) return;
      setRect(obterRetangulo(alvo));
    };

    const onResize = () => {
      const el = document.activeElement;
      if (!el || el === document.body) return;
      setRect(obterRetangulo(el));
    };

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [ativo]);

  if (!ativo || !rect) return null;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          pointerEvents: "none",
          zIndex: 999996,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: rect.left - 6,
          top: rect.top - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          borderRadius: 10,
          border: "3px solid rgba(255,255,255,0.95)",
          boxShadow: "0 0 0 3px rgba(0,0,0,0.55)",
          pointerEvents: "none",
          zIndex: 999997,
        }}
      />
    </>
  );
}
