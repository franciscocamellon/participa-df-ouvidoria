import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

function inserirTextoNoFoco(texto: string) {
  const el = document.activeElement as any;
  if (!el) return;

  const suportaSelecao = typeof el.selectionStart === "number" && typeof el.selectionEnd === "number";
  if ("value" in el && suportaSelecao) {
    const start = el.selectionStart as number;
    const end = el.selectionEnd as number;
    const original = String(el.value ?? "");
    const proximo = original.slice(0, start) + texto + original.slice(end);
    el.value = proximo;
    const cursor = start + texto.length;
    el.setSelectionRange(cursor, cursor);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }
}

function acionarTeclaEspecial(tipo: "backspace" | "enter" | "space") {
  const el = document.activeElement as any;
  if (!el) return;

  if (tipo === "space") return inserirTextoNoFoco(" ");
  if (tipo === "enter") return inserirTextoNoFoco("\n");

  const suportaSelecao = typeof el.selectionStart === "number" && typeof el.selectionEnd === "number";
  if ("value" in el && suportaSelecao) {
    const start = el.selectionStart as number;
    const end = el.selectionEnd as number;
    const original = String(el.value ?? "");
    if (start !== end) {
      el.value = original.slice(0, start) + original.slice(end);
      el.setSelectionRange(start, start);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (start <= 0) return;
    el.value = original.slice(0, start - 1) + original.slice(start);
    el.setSelectionRange(start - 1, start - 1);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

export function VirtualKeyboardOverlay() {
  const ativo = useAcessibilidadeStore((s) => s.preferencias.tecladoVirtual);
  const setPreferencias = useAcessibilidadeStore((s) => s.setPreferencias);

  const layout = useMemo(
    () => [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"],
    ],
    [],
  );

  if (!ativo) return null;

  return (
    <div
      role="dialog"
      aria-label="Teclado virtual"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: "hsl(var(--background))",
        borderTop: "1px solid hsl(var(--border))",
        padding: 10,
      }}
    >
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="text-sm font-medium">Teclado virtual</div>
        <Button variant="outline" size="sm" onClick={() => setPreferencias({ tecladoVirtual: false })}>
          Fechar
        </Button>
      </div>

      <div className="space-y-2">
        {layout.map((linha, idx) => (
          <div key={idx} className="flex flex-wrap gap-2 justify-center">
            {linha.map((k) => (
              <Button
                key={k}
                variant="outline"
                size="sm"
                onClick={() => inserirTextoNoFoco(k)}
                className="min-w-9"
              >
                {k}
              </Button>
            ))}
          </div>
        ))}
        <div className="flex gap-2 justify-center pt-1">
          <Button variant="outline" size="sm" onClick={() => acionarTeclaEspecial("space")}>Espaço</Button>
          <Button variant="outline" size="sm" onClick={() => acionarTeclaEspecial("enter")}>Enter</Button>
          <Button variant="outline" size="sm" onClick={() => acionarTeclaEspecial("backspace")}>Apagar</Button>
        </div>
      </div>
    </div>
  );
}
