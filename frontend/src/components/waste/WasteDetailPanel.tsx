import { X, Trash2, MapPin, Clock, User, ChevronRight, FileImage, Calendar, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wasteTypes, wasteStatuses, wasteSeverityLevels, wasteVolumeLevels, wasteRecurrenceLevels, wasteRiskLevels } from '@/config/waste.config';
import { useWasteStore } from '@/stores/wasteStore';
import type { WasteReport } from '@/types/waste';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface WasteDetailPanelProps {
  report: WasteReport;
  onClose: () => void;
}

export function WasteDetailPanel({ report, onClose }: WasteDetailPanelProps) {
  const { updateWasteStatus } = useWasteStore();
  
  const type = wasteTypes.find(t => t.id === report.type);
  const status = wasteStatuses.find(s => s.id === report.status);
  const severity = wasteSeverityLevels.find(s => s.id === report.severity);
  const volume = wasteVolumeLevels.find(v => v.id === report.volume);
  const recurrence = wasteRecurrenceLevels.find(r => r.id === report.recurrence);
  const risk = wasteRiskLevels.find(r => r.id === report.risk);

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Define available actions based on status
  const getNextStatus = () => {
    const statusOrder = ['novo', 'triado', 'agendado', 'em_rota', 'coletado', 'encaminhado', 'reciclado', 'fechado'];
    const currentIndex = statusOrder.indexOf(report.status);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();
  const nextStatusInfo = nextStatus ? wasteStatuses.find(s => s.id === nextStatus) : null;

  return (
    <div className="absolute right-4 top-4 w-[400px] max-w-[calc(100%-2rem)] z-20 animate-slide-in-right">
      <div className="bg-card rounded-2xl shadow-civic-xl border border-border overflow-hidden max-h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${type?.color}15` }}
              >
                <Trash2 className="h-6 w-6" style={{ color: type?.color }} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{type?.label}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: status?.color }}
                  >
                    {status?.label}
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${severity?.color}20`, color: severity?.color }}
                  >
                    {severity?.label}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Photo */}
          {report.photoUrl && (
            <div className="relative">
              <img 
                src={report.photoUrl} 
                alt="Registro" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 right-2">
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                  <FileImage className="h-3 w-3" />
                  Ver foto
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4">
            {/* Location */}
            {report.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{report.address}</p>
                  {report.region && (
                    <p className="text-xs text-muted-foreground">{report.region}</p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {report.description && (
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-sm text-foreground">{report.description}</p>
              </div>
            )}

            {/* Status explanation */}
            <div className="p-3 rounded-xl border border-border bg-background">
              <p className="text-xs text-muted-foreground mb-1">Status atual</p>
              <p className="text-sm font-medium" style={{ color: status?.color }}>{status?.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{status?.description}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground">Volume</p>
                <p className="text-sm font-medium">{volume?.label}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground">Recorrência</p>
                <p className="text-sm font-medium">{recurrence?.label}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground">Risco</p>
                <p className="text-sm font-medium" style={{ color: risk?.color }}>{risk?.label}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground">Criado em</p>
                <p className="text-sm font-medium">{format(new Date(report.createdAt), 'dd/MM/yy')}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Histórico
              </h4>
              <div className="space-y-0">
                {report.statusHistory.map((entry, index) => {
                  const entryStatus = wasteStatuses.find(s => s.id === entry.status);
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-3 h-3 rounded-full border-2"
                          style={{ 
                            borderColor: entryStatus?.color,
                            backgroundColor: index === report.statusHistory.length - 1 ? entryStatus?.color : 'transparent'
                          }}
                        />
                        {index < report.statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-border flex-1 min-h-[24px]" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium" style={{ color: entryStatus?.color }}>
                          {entryStatus?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
                        {entry.note && (
                          <p className="text-xs text-foreground mt-1">{entry.note}</p>
                        )}
                        {entry.responsibleId && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            Responsável: {entry.responsibleId}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Mock action for demo - simulating different user roles */}
          {nextStatusInfo && (
            <Button 
              className="w-full gap-2"
              onClick={() => updateWasteStatus(report.id, nextStatus as any, `Avançado para ${nextStatusInfo.label}`)}
            >
              {nextStatus === 'em_rota' && <Truck className="h-4 w-4" />}
              {nextStatus === 'coletado' && <CheckCircle2 className="h-4 w-4" />}
              {!['em_rota', 'coletado'].includes(nextStatus!) && <ChevronRight className="h-4 w-4" />}
              Avançar para: {nextStatusInfo.label}
            </Button>
          )}
          
          {report.status === 'fechado' && (
            <div className="text-center py-2">
              <p className="text-sm text-success font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Registro concluído
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
