export type FonteLeitura = "padrao" | "atkinson";

export interface AcessibilidadePreferencias {
  altoContraste: boolean;
  sublinharLinks: boolean;
  inverterCores: boolean;
  escalaCinza: boolean;
  reduzirSaturacao: boolean;
  ocultarImagens: boolean;
  bloquearAnimacoes: boolean;

  tamanhoFontePercent: number;
  espacamentoLinha: number;
  espacamentoLetrasEm: number;
  fonteLeitura: FonteLeitura;

  cursorDestaque: "nenhum" | "preto" | "branco";
  cursorTamanhoPx: number;
  tecladoVirtual: boolean;
  modoLeitura: boolean;
  guiaLeitura: boolean;
  mascaraLeitura: boolean;
  destacarFoco: boolean;

  textoAlternativo: boolean;

  leitorTextoAtivo: boolean;
  comandoVozAtivo: boolean;
  desativarSons: boolean;
  librasAtivo: boolean;
}

type PersistV2 = { state?: { preferencias?: Partial<AcessibilidadePreferencias> }; preferencias?: Partial<AcessibilidadePreferencias> };

export function obterPreferenciasPersistidasOuPadrao(padrao: AcessibilidadePreferencias): AcessibilidadePreferencias {
  try {
    const raw = localStorage.getItem("a11y-preferences");
    if (!raw) return padrao;

    const parsed = JSON.parse(raw) as any;

    // Compat: formato antigo usado pelo painel anterior
    if (typeof parsed?.highContrast === "boolean" || typeof parsed?.largeText === "boolean") {
      return {
        ...padrao,
        altoContraste: !!parsed.highContrast,
        tamanhoFontePercent: parsed.largeText ? 118 : padrao.tamanhoFontePercent,
      };
    }

    // Persist do zustand: { state: { preferencias }, version }
    const v2 = parsed as PersistV2;
    const preferencias = v2?.state?.preferencias ?? v2?.preferencias;
    if (preferencias && typeof preferencias === "object") {
      return { ...padrao, ...preferencias };
    }
  } catch {
    // Ignora parse/Storage errors
  }
  return padrao;
}

export function aplicarPreferenciasNoDom(preferencias: AcessibilidadePreferencias) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;

  // Classes (mantém compat com classes existentes)
  alternarClasse(html, "a11y-high-contrast", preferencias.altoContraste);
  alternarClasse(html, "a11y-large-text", preferencias.tamanhoFontePercent >= 118);

  alternarClasse(html, "a11y-underline-links", preferencias.sublinharLinks);
  alternarClasse(html, "a11y-invert", preferencias.inverterCores);
  alternarClasse(html, "a11y-grayscale", preferencias.escalaCinza);
  alternarClasse(html, "a11y-low-saturation", preferencias.reduzirSaturacao);
  alternarClasse(html, "a11y-hide-images", preferencias.ocultarImagens);
  alternarClasse(html, "a11y-reduce-motion-force", preferencias.bloquearAnimacoes);
  alternarClasse(html, "a11y-reading-mode", preferencias.modoLeitura);
  alternarClasse(html, "a11y-font-atkinson", preferencias.fonteLeitura === "atkinson");

  // Variáveis
  html.style.fontSize = `${normalizarNumero(preferencias.tamanhoFontePercent, 90, 150, 100)}%`;
  html.style.setProperty("--a11y-line-height", `${normalizarNumero(preferencias.espacamentoLinha, 1.2, 2.2, 1.5)}`);
  html.style.setProperty(
    "--a11y-letter-spacing",
    `${normalizarNumero(preferencias.espacamentoLetrasEm, 0, 0.12, 0)}em`,
  );
  html.style.setProperty("--a11y-cursor-size", `${normalizarNumero(preferencias.cursorTamanhoPx, 24, 120, 56)}px`);

  // Som: silencia mídias existentes (progressivo)
  if (preferencias.desativarSons) {
    for (const el of Array.from(document.querySelectorAll<HTMLMediaElement>("audio,video"))) {
      try {
        el.muted = true;
        el.volume = 0;
      } catch {
        // ignora
      }
    }
  }

  // Para não afetar portais, aplica estilo base no body (line-height/letter-spacing)
  if (body) {
    body.style.lineHeight = `var(--a11y-line-height)`;
    body.style.letterSpacing = `var(--a11y-letter-spacing)`;
  }
}

export function aplicarPreferenciasPersistidasNoDom(padrao: AcessibilidadePreferencias) {
  const preferencias = obterPreferenciasPersistidasOuPadrao(padrao);
  aplicarPreferenciasNoDom(preferencias);
}

function alternarClasse(el: HTMLElement, classe: string, ativo: boolean) {
  if (ativo) el.classList.add(classe);
  else el.classList.remove(classe);
}

function normalizarNumero(valor: number, min: number, max: number, fallback: number) {
  const n = typeof valor === "number" && Number.isFinite(valor) ? valor : fallback;
  return Math.min(max, Math.max(min, n));
}
