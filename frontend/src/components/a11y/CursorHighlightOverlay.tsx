import { useEffect, useMemo, useRef, useState } from "react";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

type Posicao = { x: number; y: number };

export function CursorHighlightOverlay() {
  const { cursorDestaque } = useAcessibilidadeStore((s) => s.preferencias);
  const tamanhoPx = useAcessibilidadeStore((s) => s.preferencias.cursorTamanhoPx);

  const [posicao, setPosicao] = useState<Posicao>({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);
  const ultimo = useRef<Posicao>({ x: -9999, y: -9999 });

  const corBorda = useMemo(() => {
    if (cursorDestaque === "preto") return "rgba(0,0,0,0.9)";
    if (cursorDestaque === "branco") return "rgba(255,255,255,0.95)";
    return "rgba(0,0,0,0)";
  }, [cursorDestaque]);

  useEffect(() => {
    if (cursorDestaque === "nenhum") return;

    const onMove = (e: MouseEvent) => {
      ultimo.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        setPosicao(ultimo.current);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [cursorDestaque]);

  if (cursorDestaque === "nenhum") return null;

  const tamanho = Math.max(24, Math.min(120, tamanhoPx));
  const raio = Math.round(tamanho / 2);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: tamanho,
        height: tamanho,
        transform: `translate(${posicao.x - raio}px, ${posicao.y - raio}px)`,
        borderRadius: 9999,
        border: `3px solid ${corBorda}`,
        boxShadow:
          cursorDestaque === "preto"
            ? "0 0 0 6px rgba(255,255,255,0.25)"
            : "0 0 0 6px rgba(0,0,0,0.25)",
        pointerEvents: "none",
        zIndex: 999999,
      }}
    />
  );
}
