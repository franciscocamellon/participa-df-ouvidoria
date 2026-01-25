export interface ConfiguracaoFala {
  vozUri?: string;
  velocidade: number; // 0.5 - 2.0
}

let falaAtual: SpeechSynthesisUtterance | null = null;
let configuracao: ConfiguracaoFala = { velocidade: 1 };

export function listarVozes(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  try {
    return window.speechSynthesis?.getVoices?.() ?? [];
  } catch {
    return [];
  }
}

export function setConfiguracaoFala(parcial: Partial<ConfiguracaoFala>) {
  configuracao = { ...configuracao, ...parcial };
}

export function getConfiguracaoFala(): ConfiguracaoFala {
  return configuracao;
}

export function iniciarLeitura(texto: string) {
  if (typeof window === "undefined") return;
  const limpo = (texto ?? "").trim();
  if (!limpo) return;
  if (!window.speechSynthesis) return;

  pararLeitura();

  const utter = new SpeechSynthesisUtterance(limpo);
  utter.rate = normalizarNumero(configuracao.velocidade, 0.5, 2.0, 1);

  const vozes = listarVozes();
  if (configuracao.vozUri) {
    const escolhida = vozes.find((v) => v.voiceURI === configuracao.vozUri);
    if (escolhida) utter.voice = escolhida;
  }

  falaAtual = utter;
  try {
    window.speechSynthesis.speak(utter);
  } catch {
    // ignora
  }
}

export function pausarLeitura() {
  try {
    window.speechSynthesis?.pause?.();
  } catch {
    // ignora
  }
}

export function continuarLeitura() {
  try {
    window.speechSynthesis?.resume?.();
  } catch {
    // ignora
  }
}

export function pararLeitura() {
  falaAtual = null;
  try {
    window.speechSynthesis?.cancel?.();
  } catch {
    // ignora
  }
}

export function estaFalando(): boolean {
  try {
    return !!window.speechSynthesis?.speaking;
  } catch {
    return false;
  }
}

function normalizarNumero(valor: number, min: number, max: number, fallback: number) {
  const n = typeof valor === "number" && Number.isFinite(valor) ? valor : fallback;
  return Math.min(max, Math.max(min, n));
}