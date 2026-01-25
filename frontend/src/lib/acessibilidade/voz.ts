export type ComandoVoz =
  | "ABRIR_ACESSIBILIDADE"
  | "FECHAR_ACESSIBILIDADE"
  | "AUMENTAR_FONTE"
  | "DIMINUIR_FONTE"
  | "ALTO_CONTRASTE"
  | "MODO_LEITURA";

export interface EventoComandoVoz {
  comando: ComandoVoz;
  transcricao: string;
}

type Reconhecimento = any;

function obterSpeechRecognition(): any {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export function suportaComandoVoz(): boolean {
  if (typeof window === "undefined") return false;
  return !!obterSpeechRecognition();
}

export function criarReconhecedorVoz(onComando: (ev: EventoComandoVoz) => void, onErro?: (msg: string) => void) {
  const SpeechRecognition = obterSpeechRecognition();
  if (!SpeechRecognition) return null;

  const rec: Reconhecimento = new SpeechRecognition();
  rec.lang = "pt-BR";
  rec.continuous = true;
  rec.interimResults = false;

  rec.onresult = (event: any) => {
    try {
      const last = event.results?.[event.results.length - 1];
      const transcricao = (last?.[0]?.transcript ?? "").toString().trim();
      if (!transcricao) return;
      const comando = interpretarComando(transcricao);
      if (comando) onComando({ comando, transcricao });
    } catch {
      // ignora
    }
  };

  rec.onerror = (e: any) => {
    const msg = e?.error ? String(e.error) : "erro_desconhecido";
    onErro?.(msg);
  };

  return rec;
}

export function interpretarComando(frase: string): ComandoVoz | null {
  const f = frase.toLowerCase();

  if (f.includes("abrir") && (f.includes("acessibilidade") || f.includes("acessível"))) {
    return "ABRIR_ACESSIBILIDADE";
  }
  if (f.includes("fechar") && (f.includes("acessibilidade") || f.includes("painel"))) {
    return "FECHAR_ACESSIBILIDADE";
  }
  if (f.includes("aumentar") && (f.includes("fonte") || f.includes("texto"))) {
    return "AUMENTAR_FONTE";
  }
  if ((f.includes("diminuir") || f.includes("reduzir")) && (f.includes("fonte") || f.includes("texto"))) {
    return "DIMINUIR_FONTE";
  }
  if (f.includes("alto") && f.includes("contraste")) {
    return "ALTO_CONTRASTE";
  }
  if (f.includes("modo") && f.includes("leitura")) {
    return "MODO_LEITURA";
  }
  return null;
}