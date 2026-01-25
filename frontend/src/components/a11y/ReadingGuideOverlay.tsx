import { useEffect, useRef, useState } from "react";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

export function ReadingGuideOverlay() {
  const ativo = useAcessibilidadeStore((s) => s.preferencias.guiaLeitura);
  const [y, setY] = useState<number>(-9999);
  const raf = useRef<number | null>(null);
  const ultimoY = useRef<number>(-9999);

  useEffect(() => {
    if (!ativo) return;

    const onMove = (e: MouseEvent) => {
      ultimoY.current = e.clientY;
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        setY(ultimoY.current);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: 0,
        transform: `translateY(${y}px)`,
        borderTop: "4px solid rgba(0,0,0,0.65)",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.4)",
        pointerEvents: "none",
        zIndex: 999998,
      }}
    />
  );
}
