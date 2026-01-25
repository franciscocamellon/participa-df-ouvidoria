export interface Definicao {
  palavra: string;
  definicoes: string[];
  origem?: "DICIONARIO_ABERTO" | "WIKTIONARY";
}

const TIMEOUT_MS = 4500;

export async function buscarDefinicao(palavra: string): Promise<Definicao | null> {
  const p = (palavra ?? "").trim();
  if (!p) return null;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    // Dicionário Aberto (PT)
    const url = `https://api.dicionario-aberto.net/word/${encodeURIComponent(p)}`;
    const resp = await fetch(url, { signal: ctrl.signal });
    if (!resp.ok) return null;
    const json = await resp.json();

    // A API retorna array com entradas e um campo "xml".
    // Para manter simples (sem parser XML), retornamos um resumo orientando fallback.
    if (Array.isArray(json) && json.length > 0) {
      return {
        palavra: p,
        definicoes: [
          "Definição disponível no Dicionário Aberto. Se o navegador bloquear a leitura automática, use 'Abrir no Wiktionary'.",
        ],
        origem: "DICIONARIO_ABERTO",
      };
    }
  } catch {
    // ignora
  } finally {
    clearTimeout(t);
  }

  return null;
}

export function urlWiktionary(palavra: string): string {
  const p = (palavra ?? "").trim();
  return `https://pt.wiktionary.org/wiki/${encodeURIComponent(p)}`;
}
