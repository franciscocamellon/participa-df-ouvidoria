import { X, MapPin, Clock, Package, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { residueTypes, residueStatuses, residueOrigins, residueVolumes, residueConditions } from '@/config/residue.config';
import type { ResidueReport } from '@/types/residue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResidueDetailPanelProps {
  report: ResidueReport;
  onClose: () => void;
}

export function ResidueDetailPanel({ report, onClose }: ResidueDetailPanelProps) {
  const type = residueTypes.find(t => t.id === report.type);
  const status = residueStatuses.find(s => s.id === report.status);
  const origin = residueOrigins.find(o => o.id === report.origin);
  const volume = residueVolumes.find(v => v.id === report.volume);
  const condition = residueConditions.find(c => c.id === report.condition);

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 sm:w-96 z-20 bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${type?.color}15` }}
          >
            <Package className="h-5 w-5" style={{ color: type?.color }} />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{type?.label}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: `${status?.color}40`,
                  backgroundColor: `${status?.color}10`,
                  color: status?.color 
                }}
              >
                {status?.label}
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Photo */}
        {report.photoUrl && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={report.photoUrl} 
              alt="Foto do resíduo" 
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        {/* Description */}
        {report.description && (
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-sm text-foreground">{report.description}</p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Localização aproximada</p>
              <p className="text-sm text-foreground">{report.approximateAddress || 'Não informado'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Origem</p>
              <p className="text-sm font-medium">{origin?.label}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Volume</p>
              <p className="text-sm font-medium">{volume?.label}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 col-span-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Condição</p>
              <p className="text-sm font-medium">{condition?.label}</p>
            </div>
          </div>
        </div>

        {/* Status timeline */}
        <div className="pt-3 border-t border-border">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Histórico do registro
          </h4>
          <div className="space-y-3">
            {report.statusHistory.map((entry, index) => {
              const entryStatus = residueStatuses.find(s => s.id === entry.status);
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entryStatus?.color }}
                    />
                    {index < report.statusHistory.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-medium text-foreground">{entryStatus?.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    {entry.note && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{entry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <Info className="h-3 w-3" />
          Registro #{report.id.slice(-6).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
