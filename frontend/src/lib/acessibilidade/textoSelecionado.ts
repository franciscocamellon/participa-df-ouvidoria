export function obterTextoSelecionado(): string {
  try {
    const sel = window.getSelection();
    const texto = sel?.toString() ?? "";
    return texto.trim();
  } catch {
    return "";
  }
}

export function obterTextoPrincipal(limiteCaracteres = 6000): string {
  try {
    const main = document.querySelector("main");
    const texto = (main?.textContent ?? document.body.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!texto) return "";
    return texto.length > limiteCaracteres ? `${texto.slice(0, limiteCaracteres)}...` : texto;
  } catch {
    return "";
  }
}
