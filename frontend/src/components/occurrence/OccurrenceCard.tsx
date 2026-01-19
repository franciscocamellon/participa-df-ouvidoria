import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { occurrenceCategories, occurrenceStatuses } from "@/config/app.config";
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle,
  ChevronRight,
  Clock,
  Construction,
  FileText,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Send,
  Sparkles,
  Trash,
  TreeDeciduous,
  Wrench,
} from "lucide-react";
import type { ApiOmbudsman, Occurrence, OccurrenceStatusId } from "@/types/occurrence";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
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

interface OccurrenceCardProps {
  occurrence: Occurrence | ApiOmbudsman;
  expanded?: boolean;
  onToggleExpand?: () => void;
  /** Se true, exibe combobox para agentes atualizarem o status */
  isAgent?: boolean;
  onStatusChange?: (occurrenceId: string, newStatus: OccurrenceStatusId) => Promise<void>;
}

const getStatusInfo = (statusId: string) => {
  return occurrenceStatuses.find((s) => s.id === statusId);
};

const getCategoryInfo = (categoryId: string) => {
  return occurrenceCategories.find((c) => c.id === categoryId);
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatLocation = (occurrence: Occurrence | ApiOmbudsman) => {
  // Handle both Occurrence and ApiOmbudsman formats
  if ("coordinates" in occurrence && occurrence.coordinates) {
    const addr = occurrence.coordinates.approxAddress?.trim();
    if (addr) return addr;
    return `Lat ${occurrence.coordinates.latitude.toFixed(5)}, Lng ${occurrence.coordinates.longitude.toFixed(5)}`;
  }
  if ("location" in occurrence && occurrence.location) {
    const addr = occurrence.location.approxAddress?.trim();
    if (addr) return addr;
    return `Lat ${occurrence.location.latitude.toFixed(5)}, Lng ${occurrence.location.longitude.toFixed(5)}`;
  }
  return "Localização não disponível";
};

export function OccurrenceCard({ 
  occurrence, 
  expanded = false, 
  onToggleExpand,
  isAgent = false,
  onStatusChange 
}: OccurrenceCardProps) {
  const categoryId = occurrence.category ?? "";
  const [currentStatusId, setCurrentStatusId] = useState(occurrence.currentStatus ?? "");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const category = getCategoryInfo(categoryId);
  const status = getStatusInfo(currentStatusId);
  const IconComponent = categoryIcons[categoryId] || FileText;
  const StatusIcon = statusIcons[currentStatusId] || Clock;

  // Get status history - handle both formats
  const statusHistory = "statusHistory" in occurrence ? occurrence.statusHistory : [];

  // Get creation date
  const createdAt = occurrence.createdAt;

  const handleStatusChange = async (newStatus: string) => {
    if (!onStatusChange || newStatus === currentStatusId) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(occurrence.id, newStatus as OccurrenceStatusId);
      setCurrentStatusId(newStatus);
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border transition-all duration-200",
        expanded ? "shadow-lg" : "hover:shadow-civic"
      )}
    >
      {/* Card Header - Clickable */}
      <button
        onClick={onToggleExpand}
        className="w-full p-4 text-left"
        type="button"
      >
        <div className="flex items-start gap-4">
          {/* Category icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${category?.color}15` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: category?.color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-foreground text-sm">{category?.label ?? "Categoria"}</h3>
                  {"protocolNumber" in occurrence && occurrence.protocolNumber && (
                    <span className="text-xs font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      #{occurrence.protocolNumber}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{formatLocation(occurrence)}</span>
                </div>
              </div>
              {isAgent && onStatusChange ? (
                <Select
                  value={currentStatusId}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger 
                    className="w-[160px] h-8"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: `${status?.color}15`,
                      color: status?.color,
                      borderColor: `${status?.color}30`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="h-3 w-3" />
                      <SelectValue>{status?.label ?? "Status"}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {occurrenceStatuses.map((s) => {
                      const SIcon = statusIcons[s.id] || Clock;
                      return (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <SIcon className="h-3 w-3" style={{ color: s.color }} />
                            <span>{s.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-2.5 py-1"
                  style={{
                    backgroundColor: `${status?.color}15`,
                    color: status?.color,
                    borderColor: `${status?.color}30`,
                  }}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status?.label ?? "Status"}
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {occurrence.description ?? "Sem descrição"}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {createdAt ? `Registrado em ${formatDate(createdAt)}` : "Data não disponível"}
              </span>
              {onToggleExpand && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    expanded && "rotate-90"
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4">
            {/* Status Explanation */}
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: `${status?.color}08` }}>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">O que significa:</strong> {status?.description}
              </p>
            </div>

            {/* Timeline */}
            {statusHistory.length > 0 && (
              <div className="space-y-0">
                <h4 className="text-sm font-medium text-foreground mb-3">Histórico de atualizações</h4>
                <div className="relative pl-4 border-l-2 border-border space-y-4">
                  {statusHistory.map((entry, index) => {
                    const entryStatus = getStatusInfo(entry.status);
                    const EntryIcon = statusIcons[entry.status] || Clock;
                    const isLatest = index === statusHistory.length - 1;

                    return (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            "absolute -left-[21px] w-4 h-4 rounded-full flex items-center justify-center",
                            isLatest ? "ring-2 ring-offset-2 ring-offset-background" : ""
                          )}
                          style={
                            {
                              backgroundColor: entryStatus?.color,
                              "--tw-ring-color": entryStatus?.color,
                            } as React.CSSProperties
                          }
                        >
                          <EntryIcon className="h-2 w-2 text-white" />
                        </div>

                        {/* Content */}
                        <div className="ml-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium" style={{ color: entryStatus?.color }}>
                              {entryStatus?.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(entry.changedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
