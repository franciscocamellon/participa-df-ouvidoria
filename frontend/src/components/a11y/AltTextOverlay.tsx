import { useEffect, useRef, useState } from "react";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

type Estado = { texto: string; x: number; y: number };

function extrairTexto(el: Element | null): string {
  if (!el) return "";
  const h = el as HTMLElement;
  const alt = (h as HTMLImageElement).alt;
  const aria = h.getAttribute("aria-label") ?? "";
  const title = h.getAttribute("title") ?? "";
  return (alt || aria || title || "").trim();
}

export function AltTextOverlay() {
  const ativo = useAcessibilidadeStore((s) => s.preferencias.textoAlternativo);
  const [estado, setEstado] = useState<Estado | null>(null);
  const raf = useRef<number | null>(null);
  const ultimo = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!ativo) {
      setEstado(null);
      return;
    }

    const onMove = (e: MouseEvent) => {
      ultimo.current = { x: e.clientX, y: e.clientY };
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        setEstado((prev) => (prev ? { ...prev, x: ultimo.current.x, y: ultimo.current.y } : prev));
      });
    };

    const onPick = (el: Element | null) => {
      const texto = extrairTexto(el);
      if (!texto) {
        setEstado(null);
        return;
      }
      setEstado({ texto, x: ultimo.current.x, y: ultimo.current.y });
    };

    const onOver = (e: Event) => onPick(e.target as Element);
    const onFocus = (e: Event) => onPick(e.target as Element);
    const onOut = () => setEstado(null);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("mouseout", onOut, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("focusin", onFocus, true);
      document.removeEventListener("mouseout", onOut, true);
      if (raf.current) window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [ativo]);

  if (!ativo || !estado) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${Math.min(window.innerWidth - 320, estado.x + 14)}px, ${Math.min(
          window.innerHeight - 100,
          estado.y + 14,
        )}px)`,
        maxWidth: 300,
        padding: "8px 10px",
        background: "rgba(0,0,0,0.85)",
        color: "white",
        borderRadius: 10,
        fontSize: 12,
        lineHeight: 1.35,
        pointerEvents: "none",
        zIndex: 999999,
      }}
    >
      {estado.texto}
    </div>
  );
}
