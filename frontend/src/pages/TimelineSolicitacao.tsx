import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { fetchOccurrenceByProtocol, ApiError } from "@/services/apiService";
import { occurrenceCategories, occurrenceStatuses } from "@/config/app.config";
import type { ApiOmbudsman } from "@/types/occurrence";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle,
  Clock,
  Construction,
  Copy,
  FileText,
  HeartHandshake,
  Lightbulb,
  Loader2,
  MapPin,
  Send,
  Share2,
  Sparkles,
  Trash,
  TreeDeciduous,
  Wrench,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";

const categoryIcons: Record<string, React.ElementType> = {
  URBAN_MAINTENANCE: Sparkles,
  LIGHTING: Lightbulb,
  WASTE_DISPOSAL: Trash,
  URBAN_FURNITURE: Construction,
  INCIDENT: AlertTriangle,
  ACCESSIBILITY: Accessibility,
  VULNERABILITY: HeartHandshake,
  ENVIRONMENTAL: TreeDeciduous,
};

const statusIcons: Record<string, React.ElementType> = {
  RECEIVED: Send,
  TRIAGE: Clock,
  FORWARDED: ArrowRight,
  IN_EXECUTION: Wrench,
  COMPLETED: CheckCircle,
  SCHEDULED: CalendarClock,
};

const getStatusInfo = (statusId: string) => {
  return occurrenceStatuses.find((s) => s.id === statusId);
};

const getCategoryInfo = (categoryId: string) => {
  return occurrenceCategories.find((c) => c.id === categoryId);
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatLocation = (occurrence: ApiOmbudsman) => {
  if (occurrence.location) {
    const addr = occurrence.location.approxAddress?.trim();
    if (addr) return addr;
    return `Lat ${occurrence.location.latitude.toFixed(5)}, Lng ${occurrence.location.longitude.toFixed(5)}`;
  }
  return "Localização não disponível";
};

// Simulated status history for demo (since API may not return it)
const getStatusHistory = (occurrence: ApiOmbudsman) => {
  // If API returns statusHistoryEntryIds, we'd fetch them
  // For now, create a simple history based on current status
  const currentStatus = occurrence.currentStatus ?? "RECEIVED";
  const createdAt = occurrence.createdAt ?? new Date().toISOString();
  
  const statusOrder = ["RECEIVED", "TRIAGE", "FORWARDED", "IN_EXECUTION", "COMPLETED"];
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  const history = [];
  for (let i = 0; i <= currentIndex && i < statusOrder.length; i++) {
    const date = new Date(createdAt);
    date.setHours(date.getHours() + i * 24); // Add 24h for each status
    history.push({
      status: statusOrder[i],
      changedAt: date.toISOString(),
      note: getStatusNote(statusOrder[i]),
    });
  }
  
  return history;
};

const getStatusNote = (status: string) => {
  const notes: Record<string, string> = {
    RECEIVED: "Solicitação recebida e registrada no sistema.",
    TRIAGE: "Solicitação em análise pela equipe responsável.",
    FORWARDED: "Encaminhada ao órgão competente para atendimento.",
    IN_EXECUTION: "Equipe técnica iniciou os trabalhos no local.",
    COMPLETED: "Serviço concluído com sucesso.",
    SCHEDULED: "Atendimento agendado para data futura.",
  };
  return notes[status] ?? "";
};

const TimelineSolicitacao = () => {
  const { protocolNumber } = useParams<{ protocolNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [occurrence, setOccurrence] = useState<ApiOmbudsman | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!protocolNumber) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await fetchOccurrenceByProtocol(protocolNumber);
        if (data) {
          setOccurrence(data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Erro ao buscar solicitação");
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [protocolNumber]);

  const handleCopyProtocol = () => {
    if (protocolNumber) {
      navigator.clipboard.writeText(protocolNumber);
      toast.success("Protocolo copiado!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Solicitação ${protocolNumber}`,
          text: `Acompanhe a solicitação ${protocolNumber} no Participa DF`,
          url: window.location.href,
        });
      } catch {
        handleCopyProtocol();
      }
    } else {
      handleCopyProtocol();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[100px] pb-8 px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground">Carregando solicitação...</p>
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !occurrence) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[100px] pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <Link to="/acompanhar">
              <Button variant="ghost" size="sm" className="mb-6 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">Protocolo não encontrado</h1>
              <p className="text-muted-foreground mb-6">
                Não foi possível encontrar uma solicitação com o protocolo <strong>{protocolNumber}</strong>.
              </p>
              <Button asChild>
                <Link to="/acompanhar">Buscar outro protocolo</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const category = getCategoryInfo(occurrence.category ?? "");
  const status = getStatusInfo(occurrence.currentStatus ?? "");
  const CategoryIcon = categoryIcons[occurrence.category ?? ""] || FileText;
  const StatusIcon = statusIcons[occurrence.currentStatus ?? ""] || Clock;
  const statusHistory = getStatusHistory(occurrence);
  const isCompleted = occurrence.currentStatus === "COMPLETED";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Link to="/acompanhar">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>

          {/* Protocol Header Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 mb-6 animate-fade-in">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-primary-foreground/70 text-sm font-medium mb-1">Protocolo</p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-wide">{occurrence.protocolNumber}</h1>
                    <button
                      onClick={handleCopyProtocol}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title="Copiar protocolo"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category?.color}30` }}
                >
                  <CategoryIcon className="h-5 w-5" style={{ color: category?.color }} />
                </div>
                <div>
                  <p className="font-medium">{category?.label ?? "Categoria"}</p>
                  <p className="text-sm text-primary-foreground/70">
                    Registrado em {occurrence.createdAt ? formatDate(occurrence.createdAt) : "Data não disponível"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          <div
            className="rounded-2xl p-6 mb-6 border-2 animate-fade-in"
            style={{
              backgroundColor: `${status?.color}08`,
              borderColor: `${status?.color}40`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status Atual</h2>
              {isCompleted && (
                <Badge className="bg-success/10 text-success border-success/20">
                  <ClipboardCheck className="h-3 w-3 mr-1" />
                  Concluído
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${status?.color}20` }}
              >
                <StatusIcon className="h-7 w-7" style={{ color: status?.color }} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold" style={{ color: status?.color }}>
                  {status?.label ?? "Status"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{status?.description}</p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="rounded-2xl bg-card border border-border p-5 mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-medium text-foreground">{formatLocation(occurrence)}</p>
              </div>
            </div>
          </div>

          {/* Description Card */}
          {occurrence.description && (
            <div className="rounded-2xl bg-card border border-border p-5 mb-6 animate-fade-in">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Descrição
              </h3>
              <p className="text-foreground leading-relaxed">{occurrence.description}</p>
            </div>
          )}

          {/* Timeline Section */}
          <div className="rounded-2xl bg-card border border-border p-6 animate-fade-in">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              Histórico de Atualizações
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-border" />

              <div className="space-y-6">
                {statusHistory.map((entry, index) => {
                  const entryStatus = getStatusInfo(entry.status);
                  const EntryIcon = statusIcons[entry.status] || Clock;
                  const isLatest = index === statusHistory.length - 1;
                  const isFirst = index === 0;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative flex gap-4 transition-all",
                        isLatest && "animate-scale-in"
                      )}
                    >
                      {/* Timeline node */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                            isLatest
                              ? "ring-4 ring-offset-2 ring-offset-background shadow-lg"
                              : "opacity-80"
                          )}
                          style={{
                            backgroundColor: entryStatus?.color,
                            "--tw-ring-color": `${entryStatus?.color}40`,
                          } as React.CSSProperties}
                        >
                          <EntryIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          "flex-1 pb-6",
                          isLatest && "pb-0"
                        )}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4
                            className={cn(
                              "font-semibold",
                              isLatest ? "text-lg" : "text-base"
                            )}
                            style={{ color: entryStatus?.color }}
                          >
                            {entryStatus?.label}
                          </h4>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {formatDateTime(entry.changedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {entry.note}
                        </p>
                        
                        {isLatest && !isCompleted && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span>Aguardando próxima atualização</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer disclaimer */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              Os prazos de atendimento variam conforme a natureza e complexidade de cada solicitação.
              Esta plataforma não substitui os canais oficiais de emergência.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimelineSolicitacao;
