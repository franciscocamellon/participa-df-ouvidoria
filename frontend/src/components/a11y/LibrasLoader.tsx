import { useEffect } from "react";
import { useAcessibilidadeStore } from "@/stores/useAcessibilidadeStore";

declare global {
  interface Window {
    VLibras?: any;
  }
}

const ID_SCRIPT = "vlibras-plugin-script";
const ID_CONTAINER = "vlibras-plugin-container";

export function LibrasLoader() {
  const ativo = useAcessibilidadeStore((s) => s.preferencias.librasAtivo);

  useEffect(() => {
    if (!ativo) {
      // Não remove script para evitar reload, apenas esconde o widget se existir.
      const cont = document.getElementById(ID_CONTAINER);
      if (cont) cont.style.display = "none";
      return;
    }

    let cont = document.getElementById(ID_CONTAINER);
    if (!cont) {
      cont = document.createElement("div");
      cont.id = ID_CONTAINER;
      cont.innerHTML =
        '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>';
      document.body.appendChild(cont);
    }
    cont.style.display = "block";

    const jaExiste = document.getElementById(ID_SCRIPT);
    if (jaExiste) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
      } catch {
        // ignora
      }
      return;
    }

    const script = document.createElement("script");
    script.id = ID_SCRIPT;
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
      } catch {
        // ignora
      }
    };
    document.body.appendChild(script);
  }, [ativo]);

  return null;
}
