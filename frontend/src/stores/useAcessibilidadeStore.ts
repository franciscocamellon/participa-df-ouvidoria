import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  aplicarPreferenciasNoDom,
  obterPreferenciasPersistidasOuPadrao,
  type AcessibilidadePreferencias,
} from "@/lib/acessibilidade/aplicarPreferenciasNoDom";

export type PerfilAcessibilidade =
  | "PADRAO"
  | "BAIXA_VISAO"
  | "DALTONISMO"
  | "EPILEPSIA"
  | "TDAH"
  | "DISLEXIA";

interface AcessibilidadeState {
  preferencias: AcessibilidadePreferencias;

  // Ações
  setPreferencias: (parcial: Partial<AcessibilidadePreferencias>) => void;
  aplicarPerfil: (perfil: PerfilAcessibilidade) => void;
  restaurarPadrao: () => void;
}

export const PREFERENCIAS_A11Y_STORAGE_KEY = "a11y-preferences";

const preferenciasPadrao = (): AcessibilidadePreferencias => ({
  altoContraste: false,
  sublinharLinks: false,
  inverterCores: false,
  escalaCinza: false,
  reduzirSaturacao: false,
  ocultarImagens: false,
  bloquearAnimacoes: false,

  tamanhoFontePercent: 100,
  espacamentoLinha: 1.5,
  espacamentoLetrasEm: 0,
  fonteLeitura: "padrao",

  cursorDestaque: "nenhum",
  cursorTamanhoPx: 56,
  tecladoVirtual: false,
  modoLeitura: false,
  guiaLeitura: false,
  mascaraLeitura: false,
  destacarFoco: false,

  textoAlternativo: false,

  leitorTextoAtivo: false,
  comandoVozAtivo: false,
  desativarSons: false,
  librasAtivo: false,
});

const aplicarPerfilEmPreferencias = (perfil: PerfilAcessibilidade): AcessibilidadePreferencias => {
  const base = preferenciasPadrao();

  if (perfil === "BAIXA_VISAO") {
    return {
      ...base,
      tamanhoFontePercent: 125,
      espacamentoLinha: 1.7,
      sublinharLinks: true,
      cursorDestaque: "branco",
      cursorTamanhoPx: 64,
      destacarFoco: true,
    };
  }

  if (perfil === "DALTONISMO") {
    return {
      ...base,
      altoContraste: true,
      sublinharLinks: true,
    };
  }

  if (perfil === "EPILEPSIA") {
    return {
      ...base,
      bloquearAnimacoes: true,
      reduzirSaturacao: true,
      modoLeitura: true,
    };
  }

  if (perfil === "TDAH") {
    return {
      ...base,
      bloquearAnimacoes: true,
      modoLeitura: true,
      destacarFoco: true,
      guiaLeitura: true,
    };
  }

  if (perfil === "DISLEXIA") {
    return {
      ...base,
      tamanhoFontePercent: 112,
      espacamentoLinha: 1.8,
      espacamentoLetrasEm: 0.03,
      fonteLeitura: "atkinson",
      guiaLeitura: true,
      mascaraLeitura: true,
      modoLeitura: true,
    };
  }

  return base;
};

// Estado inicial: tenta ler o persistido (inclui migração do formato antigo).
const estadoInicial = (): AcessibilidadePreferencias => {
  return obterPreferenciasPersistidasOuPadrao(preferenciasPadrao());
};

export const useAcessibilidadeStore = create<AcessibilidadeState>()(
  persist(
    (set, get) => ({
      preferencias: estadoInicial(),

      setPreferencias: (parcial) => {
        set((state) => ({
          preferencias: { ...state.preferencias, ...parcial },
        }));
      },

      aplicarPerfil: (perfil) => {
        const proximo = aplicarPerfilEmPreferencias(perfil);
        set({ preferencias: proximo });
      },

      restaurarPadrao: () => {
        set({ preferencias: preferenciasPadrao() });
      },
    }),
    {
      name: PREFERENCIAS_A11Y_STORAGE_KEY,
      version: 2,
      partialize: (state) => ({ preferencias: state.preferencias }),
      migrate: (persisted, version) => {
        // v0/v1: compat com formato antigo { highContrast, largeText }
        if (!persisted || typeof persisted !== "object") {
          return { preferencias: preferenciasPadrao() } as unknown as AcessibilidadeState;
        }

        const qualquer = persisted as any;
        if (version < 2) {
          const antigo = qualquer as { highContrast?: boolean; largeText?: boolean };
          return {
            preferencias: {
              ...preferenciasPadrao(),
              altoContraste: !!antigo.highContrast,
              tamanhoFontePercent: antigo.largeText ? 118 : 100,
            },
          } as unknown as AcessibilidadeState;
        }

        // v2: já no formato esperado
        if (qualquer.preferencias) {
          return {
            preferencias: { ...preferenciasPadrao(), ...qualquer.preferencias },
          } as unknown as AcessibilidadeState;
        }

        return { preferencias: preferenciasPadrao() } as unknown as AcessibilidadeState;
      },
    },
  ),
);

// Aplica no DOM sempre que o estado mudar.
// Observação: subscribe não re-renderiza UI e evita duplicação de useEffect.
if (typeof window !== "undefined") {
  // Primeira aplicação já com o estado inicial.
  aplicarPreferenciasNoDom(useAcessibilidadeStore.getState().preferencias);

  useAcessibilidadeStore.subscribe((state) => {
    aplicarPreferenciasNoDom(state.preferencias);
  });
}
