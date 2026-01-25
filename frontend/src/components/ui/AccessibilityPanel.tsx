import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Contrast,
  Ear,
  Hand,
  Headphones,
  Keyboard,
  MousePointer2,
  PersonStanding,
  ScanText,
  Sparkles,
  Type,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useAcessibilidadeStore,
  type PerfilAcessibilidade,
} from "@/stores/useAcessibilidadeStore";
import { obterTextoSelecionado, obterTextoPrincipal } from "@/lib/acessibilidade/textoSelecionado";
import {
  continuarLeitura,
  iniciarLeitura,
  listarVozes,
  pararLeitura,
  pausarLeitura,
  setConfiguracaoFala,
} from "@/lib/acessibilidade/fala";
import { buscarDefinicao, urlWiktionary } from "@/lib/acessibilidade/dicionario";
import { criarReconhecedorVoz, suportaComandoVoz, type EventoComandoVoz } from "@/lib/acessibilidade/voz";

type Aba = "NAVEGACAO" | "CONTEUDO" | "SOM";

function Tile({
  titulo,
  icone,
  ativo,
  subtitulo,
  onClick,
}: {
  titulo: string;
  subtitulo?: string;
  icone: React.ReactNode;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border bg-card text-card-foreground shadow-sm",
        "p-3 text-left transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ativo ? "border-primary bg-primary/10" : "hover:bg-muted",
      )}
      aria-pressed={ativo}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            ativo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
          aria-hidden="true"
        >
          {icone}
        </div>
        <div className="min-w-0">
          <div className="font-medium leading-snug">{titulo}</div>
          {subtitulo ? <div className="text-xs text-muted-foreground">{subtitulo}</div> : null}
        </div>
      </div>
    </button>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function AccessibilityPanel() {
  const preferencias = useAcessibilidadeStore((s) => s.preferencias);
  const setPreferencias = useAcessibilidadeStore((s) => s.setPreferencias);
  const aplicarPerfil = useAcessibilidadeStore((s) => s.aplicarPerfil);
  const restaurarPadrao = useAcessibilidadeStore((s) => s.restaurarPadrao);

  const [isOpen, setIsOpen] = useState(false);
  const [aba, setAba] = useState<Aba>("NAVEGACAO");

  // Modais auxiliares
  const [dicionarioAberto, setDicionarioAberto] = useState(false);
  const [consultaDicionario, setConsultaDicionario] = useState<string>("");
  const [resultadoDicionario, setResultadoDicionario] = useState<string | null>(null);
  const [dicionarioCarregando, setDicionarioCarregando] = useState(false);

  const [transcricaoAberta, setTranscricaoAberta] = useState(false);
  const [transcricaoTexto, setTranscricaoTexto] = useState<string>("");
  const recTranscricaoRef = useRef<any>(null);

  const suporteVoz = useMemo(() => suportaComandoVoz(), []);
  const recComandoVozRef = useRef<any>(null);

  // Atalho: Alt+A abre/fecha painel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Comando de voz (controle do painel + ações rápidas)
  useEffect(() => {
    if (!preferencias.comandoVozAtivo) {
      try {
        recComandoVozRef.current?.stop?.();
      } catch {
        // ignora
      }
      recComandoVozRef.current = null;
      return;
    }
    if (!suporteVoz) return;

    const rec = criarReconhecedorVoz(
      (ev: EventoComandoVoz) => {
        const atual = useAcessibilidadeStore.getState().preferencias;
        if (ev.comando === "ABRIR_ACESSIBILIDADE") setIsOpen(true);
        if (ev.comando === "FECHAR_ACESSIBILIDADE") setIsOpen(false);

        if (ev.comando === "AUMENTAR_FONTE") {
          setPreferencias({ tamanhoFontePercent: clamp(atual.tamanhoFontePercent + 5, 90, 150) });
        }
        if (ev.comando === "DIMINUIR_FONTE") {
          setPreferencias({ tamanhoFontePercent: clamp(atual.tamanhoFontePercent - 5, 90, 150) });
        }
        if (ev.comando === "ALTO_CONTRASTE") setPreferencias({ altoContraste: !atual.altoContraste });
        if (ev.comando === "MODO_LEITURA") setPreferencias({ modoLeitura: !atual.modoLeitura });
      },
      () => {
        // erros comuns: not-allowed, no-speech, network
      },
    );

    if (!rec) return;
    recComandoVozRef.current = rec;
    try {
      rec.start();
    } catch {
      // ignora
    }

    return () => {
      try {
        rec.stop();
      } catch {
        // ignora
      }
      recComandoVozRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencias.comandoVozAtivo, suporteVoz]);

  // Vozes para TTS
  const [vozes, setVozes] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const atualizar = () => setVozes(listarVozes());
    atualizar();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = atualizar;
    }
    return () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      } catch {
        // ignora
      }
    };
  }, []);

  // Dicionário: pré-preenche com seleção
  useEffect(() => {
    if (!dicionarioAberto) return;
    const sel = obterTextoSelecionado();
    if (sel) setConsultaDicionario(sel.split(/\s+/g).slice(0, 3).join(" "));
  }, [dicionarioAberto]);

  async function pesquisarDicionario() {
    const termo = consultaDicionario.trim();
    if (!termo) return;
    setDicionarioCarregando(true);
    setResultadoDicionario(null);
    try {
      const r = await buscarDefinicao(termo);
      if (r?.definicoes?.length) {
        setResultadoDicionario(r.definicoes.join("\n"));
      } else {
        setResultadoDicionario("Não foi possível obter uma definição automática. Use 'Abrir no Wiktionary'.");
      }
    } finally {
      setDicionarioCarregando(false);
    }
  }

  // Transcrição (speech to text) simples
  useEffect(() => {
    if (!transcricaoAberta) {
      try {
        recTranscricaoRef.current?.stop?.();
      } catch {
        // ignora
      }
      recTranscricaoRef.current = null;
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let texto = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        const t = String(res?.[0]?.transcript ?? "");
        texto += t;
      }
      if (texto.trim()) setTranscricaoTexto((prev) => (prev ? `${prev}\n${texto.trim()}` : texto.trim()));
    };

    recTranscricaoRef.current = rec;
    try {
      rec.start();
    } catch {
      // ignora
    }
    return () => {
      try {
        rec.stop();
      } catch {
        // ignora
      }
      recTranscricaoRef.current = null;
    };
  }, [transcricaoAberta]);

  const aplicarPerfilUi = (perfil: PerfilAcessibilidade) => {
    aplicarPerfil(perfil);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 z-50 rounded-full shadow-lg",
          "bg-background/95 backdrop-blur-sm border-2 border-primary",
          "hover:bg-primary hover:text-primary-foreground",
          "focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2",
          "w-12 h-12",
          "[&_svg]:w-7 [&_svg]:h-7",
        )}
        aria-label="Abrir painel de acessibilidade (Alt+A)"
        aria-haspopup="dialog"
        title="Acessibilidade (Alt+A)"
      >
        <PersonStanding className="h-5 w-5" aria-hidden="true" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl" aria-describedby="a11y-panel-description">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <PersonStanding className="h-5 w-5" aria-hidden="true" />
                  Acessibilidade
                </DialogTitle>
                <DialogDescription id="a11y-panel-description">
                  Ajuste as configurações conforme sua necessidade. Atalho: Alt + A.
                </DialogDescription>
              </div>
              <Button variant="outline" size="sm" onClick={restaurarPadrao}>
                Restaurar
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <Accordion type="single" collapsible defaultValue="perfis">
              <AccordionItem value="perfis">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <PersonStanding className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-medium">Perfis de acessibilidade</div>
                      <div className="text-xs text-muted-foreground">Baixa visão, daltonismo, epilepsia, TDAH, dislexia</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => aplicarPerfilUi("PADRAO")}>Padrão</Button>
                    <Button variant="outline" onClick={() => aplicarPerfilUi("BAIXA_VISAO")}>Baixa visão</Button>
                    <Button variant="outline" onClick={() => aplicarPerfilUi("DALTONISMO")}>Daltonismo</Button>
                    <Button variant="outline" onClick={() => aplicarPerfilUi("EPILEPSIA")}>Epilepsia</Button>
                    <Button variant="outline" onClick={() => aplicarPerfilUi("TDAH")}>TDAH</Button>
                    <Button variant="outline" onClick={() => aplicarPerfilUi("DISLEXIA")}>Dislexia</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="texto">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Type className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-medium">Ajustes de texto</div>
                      <div className="text-xs text-muted-foreground">Tamanho, espaçamento e formatação</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="font-medium">Tamanho da fonte</Label>
                        <span className="text-xs text-muted-foreground">{preferencias.tamanhoFontePercent}%</span>
                      </div>
                      <Slider
                        value={[preferencias.tamanhoFontePercent]}
                        min={90}
                        max={150}
                        step={5}
                        onValueChange={(v) => setPreferencias({ tamanhoFontePercent: v[0] })}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="font-medium">Espaçamento de linhas</Label>
                        <span className="text-xs text-muted-foreground">{preferencias.espacamentoLinha.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[preferencias.espacamentoLinha]}
                        min={1.2}
                        max={2.2}
                        step={0.1}
                        onValueChange={(v) => setPreferencias({ espacamentoLinha: Number(v[0].toFixed(1)) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="font-medium">Espaçamento entre letras</Label>
                        <span className="text-xs text-muted-foreground">{preferencias.espacamentoLetrasEm.toFixed(2)}em</span>
                      </div>
                      <Slider
                        value={[preferencias.espacamentoLetrasEm]}
                        min={0}
                        max={0.12}
                        step={0.01}
                        onValueChange={(v) => setPreferencias({ espacamentoLetrasEm: Number(v[0].toFixed(2)) })}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Label className="font-medium">Fonte de leitura</Label>
                        <div className="text-xs text-muted-foreground">Atkinson Hyperlegible (fonte aberta)</div>
                      </div>
                      <Switch
                        checked={preferencias.fonteLeitura === "atkinson"}
                        onCheckedChange={(v) => setPreferencias({ fonteLeitura: v ? "atkinson" : "padrao" })}
                        aria-label="Alternar fonte de leitura"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cores">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Contrast className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-medium">Ajustes de cores</div>
                      <div className="text-xs text-muted-foreground">Contraste, inversão, escala de cinza, saturação</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="font-medium">Alto contraste</Label>
                      <Switch checked={preferencias.altoContraste} onCheckedChange={(v) => setPreferencias({ altoContraste: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="font-medium">Inverter cores</Label>
                      <Switch checked={preferencias.inverterCores} onCheckedChange={(v) => setPreferencias({ inverterCores: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="font-medium">Escala de cinza</Label>
                      <Switch checked={preferencias.escalaCinza} onCheckedChange={(v) => setPreferencias({ escalaCinza: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="font-medium">Reduzir saturação</Label>
                      <Switch checked={preferencias.reduzirSaturacao} onCheckedChange={(v) => setPreferencias({ reduzirSaturacao: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="font-medium">Sublinhar links</Label>
                      <Switch checked={preferencias.sublinharLinks} onCheckedChange={(v) => setPreferencias({ sublinharLinks: v })} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Tabs
              value={aba}
              onValueChange={(v) => setAba(v as Aba)}
              defaultValue="NAVEGACAO"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="NAVEGACAO">Navegação</TabsTrigger>
                <TabsTrigger value="CONTEUDO">Conteúdo</TabsTrigger>
                <TabsTrigger value="SOM">Som</TabsTrigger>
              </TabsList>

              <TabsContent value="NAVEGACAO">
                <div className="grid grid-cols-3 gap-3">
                  <Tile
                    titulo="Cursor Preto"
                    icone={<MousePointer2 className="h-5 w-5" />}
                    ativo={preferencias.cursorDestaque === "preto"}
                    onClick={() =>
                      setPreferencias({ cursorDestaque: preferencias.cursorDestaque === "preto" ? "nenhum" : "preto" })
                    }
                  />
                  <Tile
                    titulo="Cursor Branco"
                    icone={<MousePointer2 className="h-5 w-5" />}
                    ativo={preferencias.cursorDestaque === "branco"}
                    onClick={() =>
                      setPreferencias({ cursorDestaque: preferencias.cursorDestaque === "branco" ? "nenhum" : "branco" })
                    }
                  />
                  <Tile
                    titulo="Teclado Virtual"
                    icone={<Keyboard className="h-5 w-5" />}
                    ativo={preferencias.tecladoVirtual}
                    onClick={() => setPreferencias({ tecladoVirtual: !preferencias.tecladoVirtual })}
                  />

                  <Tile
                    titulo="Destacar foco"
                    icone={<Sparkles className="h-5 w-5" />}
                    ativo={preferencias.destacarFoco}
                    onClick={() => setPreferencias({ destacarFoco: !preferencias.destacarFoco })}
                  />
                  <Tile
                    titulo="Guia de leitura"
                    icone={<ScanText className="h-5 w-5" />}
                    ativo={preferencias.guiaLeitura}
                    onClick={() => setPreferencias({ guiaLeitura: !preferencias.guiaLeitura })}
                  />
                  <Tile
                    titulo="Máscara de leitura"
                    icone={<ScanText className="h-5 w-5" />}
                    ativo={preferencias.mascaraLeitura}
                    onClick={() => setPreferencias({ mascaraLeitura: !preferencias.mascaraLeitura })}
                  />

                  <div className="col-span-3">
                    <Card className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium">Tamanho do destaque do cursor</div>
                        <div className="text-xs text-muted-foreground">{preferencias.cursorTamanhoPx}px</div>
                      </div>
                      <div className="pt-2">
                        <Slider
                          value={[preferencias.cursorTamanhoPx]}
                          min={24}
                          max={120}
                          step={4}
                          onValueChange={(v) => setPreferencias({ cursorTamanhoPx: v[0] })}
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="CONTEUDO">
                <div className="grid grid-cols-3 gap-3">
                  <Tile
                    titulo="Modo de leitura"
                    icone={<BookOpen className="h-5 w-5" />}
                    ativo={preferencias.modoLeitura}
                    onClick={() => setPreferencias({ modoLeitura: !preferencias.modoLeitura })}
                  />
                  <Tile
                    titulo="Texto alternativo"
                    subtitulo="Mostra alt/aria"
                    icone={<Hand className="h-5 w-5" />}
                    ativo={preferencias.textoAlternativo}
                    onClick={() => setPreferencias({ textoAlternativo: !preferencias.textoAlternativo })}
                  />
                  <Tile
                    titulo="Bloquear animações"
                    icone={<Sparkles className="h-5 w-5" />}
                    ativo={preferencias.bloquearAnimacoes}
                    onClick={() => setPreferencias({ bloquearAnimacoes: !preferencias.bloquearAnimacoes })}
                  />

                  <Tile
                    titulo="Esconder imagens"
                    icone={<ScanText className="h-5 w-5" />}
                    ativo={preferencias.ocultarImagens}
                    onClick={() => setPreferencias({ ocultarImagens: !preferencias.ocultarImagens })}
                  />
                  <Tile
                    titulo="Libras"
                    icone={<Hand className="h-5 w-5" />}
                    ativo={preferencias.librasAtivo}
                    onClick={() => setPreferencias({ librasAtivo: !preferencias.librasAtivo })}
                  />
                  <Tile
                    titulo="Dicionário"
                    icone={<BookOpen className="h-5 w-5" />}
                    ativo={dicionarioAberto}
                    onClick={() => setDicionarioAberto(true)}
                  />

                  <Tile
                    titulo="Ampliador de texto"
                    icone={<Type className="h-5 w-5" />}
                    ativo={preferencias.tamanhoFontePercent >= 125}
                    onClick={() => setPreferencias({ tamanhoFontePercent: preferencias.tamanhoFontePercent >= 125 ? 100 : 125 })}
                  />
                  <Tile
                    titulo="Sublinhar links"
                    icone={<ScanText className="h-5 w-5" />}
                    ativo={preferencias.sublinharLinks}
                    onClick={() => setPreferencias({ sublinharLinks: !preferencias.sublinharLinks })}
                  />
                  <Tile
                    titulo="Transcrição"
                    icone={<ScanText className="h-5 w-5" />}
                    ativo={transcricaoAberta}
                    onClick={() => setTranscricaoAberta(true)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="SOM">
                <div className="grid grid-cols-3 gap-3">
                  <Tile
                    titulo="Comando de voz"
                    subtitulo={suporteVoz ? "pt-BR" : "Indisponível"}
                    icone={<Headphones className="h-5 w-5" />}
                    ativo={preferencias.comandoVozAtivo}
                    onClick={() => {
                      if (!suporteVoz) return;
                      setPreferencias({ comandoVozAtivo: !preferencias.comandoVozAtivo });
                    }}
                  />
                  <Tile
                    titulo="Desativar sons"
                    icone={<VolumeX className="h-5 w-5" />}
                    ativo={preferencias.desativarSons}
                    onClick={() => setPreferencias({ desativarSons: !preferencias.desativarSons })}
                  />
                  <Tile
                    titulo="Leitor de texto"
                    icone={<Ear className="h-5 w-5" />}
                    ativo={preferencias.leitorTextoAtivo}
                    onClick={() => setPreferencias({ leitorTextoAtivo: !preferencias.leitorTextoAtivo })}
                  />

                  {preferencias.leitorTextoAtivo ? (
                    <div className="col-span-3">
                      <Card className="p-3 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium">Velocidade</div>
                          <div className="text-xs text-muted-foreground">{preferencias.leitorTextoAtivo ? "" : ""}</div>
                        </div>
                        <Slider
                          defaultValue={[1]}
                          min={0.6}
                          max={1.6}
                          step={0.1}
                          onValueChange={(v) => setConfiguracaoFala({ velocidade: Number(v[0].toFixed(1)) })}
                        />

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="default"
                            onClick={() => {
                              const texto = obterTextoSelecionado() || obterTextoPrincipal();
                              iniciarLeitura(texto);
                            }}
                          >
                            Ler seleção ou página
                          </Button>
                          <Button variant="outline" onClick={pausarLeitura}>Pausar</Button>
                          <Button variant="outline" onClick={continuarLeitura}>Continuar</Button>
                          <Button variant="outline" onClick={pararLeitura}>Parar</Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Dica: selecione um trecho antes de clicar em "Ler".
                        </div>

                        {vozes.length ? (
                          <div className="space-y-2">
                            <Label className="font-medium">Voz</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {vozes.slice(0, 6).map((v) => (
                                <Button
                                  key={v.voiceURI}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setConfiguracaoFala({ vozUri: v.voiceURI })}
                                  title={v.name}
                                >
                                  {v.name.slice(0, 18)}
                                </Button>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">Mostrando algumas vozes disponíveis.</div>
                          </div>
                        ) : null}
                      </Card>
                    </div>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-2 border-t space-y-1">
            <p className="text-xs text-muted-foreground text-center">Preferências salvas automaticamente.</p>
            <p className="text-xs text-muted-foreground text-center">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Alt</kbd>
              {" + "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">A</kbd>
              {" para abrir ou fechar"}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dicionário */}
      <Dialog open={dicionarioAberto} onOpenChange={setDicionarioAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              Dicionário
            </DialogTitle>
            <DialogDescription>Pesquise uma palavra ou use a seleção atual.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Termo
              <input
                value={consultaDicionario}
                onChange={(e) => setConsultaDicionario(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </label>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={pesquisarDicionario} disabled={dicionarioCarregando}>
                {dicionarioCarregando ? "Buscando..." : "Buscar"}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(urlWiktionary(consultaDicionario), "_blank", "noopener,noreferrer")}
              >
                Abrir no Wiktionary
              </Button>
            </div>
            {resultadoDicionario ? (
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{resultadoDicionario}</pre>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transcrição */}
      <Dialog open={transcricaoAberta} onOpenChange={setTranscricaoAberta}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" aria-hidden="true" />
              Transcrição
            </DialogTitle>
            <DialogDescription>
              Converta fala em texto. Requer suporte do navegador.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <textarea
              value={transcricaoTexto}
              onChange={(e) => setTranscricaoTexto(e.target.value)}
              className="min-h-40 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="A transcrição aparecerá aqui..."
            />
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setTranscricaoTexto("")}>Limpar</Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(transcricaoTexto);
                  } catch {
                    // ignora
                  }
                }}
              >
                Copiar
              </Button>
              <Button variant="outline" onClick={() => setTranscricaoAberta(false)}>Fechar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
