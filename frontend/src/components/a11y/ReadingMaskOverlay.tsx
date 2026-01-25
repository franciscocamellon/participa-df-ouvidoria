import { useEffect, useRef, useState } from "react";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

export function ReadingMaskOverlay() {
  const ativo = useAcessibilidadeStore((s) => s.preferencias.mascaraLeitura);
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

  const alturaJanela = 140;
  const topo = Math.max(0, y - alturaJanela / 2);
  const base = Math.min(window.innerHeight, y + alturaJanela / 2);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        background: `linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) ${topo}px, rgba(0,0,0,0) ${topo}px, rgba(0,0,0,0) ${base}px, rgba(0,0,0,0.55) ${base}px, rgba(0,0,0,0.55) 100%)`,
        pointerEvents: "none",
        zIndex: 999997,
      }}
    />
  );
}
