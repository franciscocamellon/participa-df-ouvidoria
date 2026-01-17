import { Header } from '@/components/layout/Header';
import { ResidueMapView } from '@/components/residue/ResidueMapView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { institutionalMessages, residueStatuses, residueTypes } from '@/config/residue.config';
import { cn } from '@/lib/utils';
import { useResidueStore } from '@/stores/residueStore';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Filter,
    Info,
    Layers,
    Package,
    Recycle
} from 'lucide-react';
import { useState } from 'react';

const ResíduosPage = () => {
  const { residueReports, reuseOffers } = useResidueStore();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(false);
  
  const stats = {
    total: residueReports.length,
    registered: residueReports.filter(r => r.status === 'registrado').length,
    inAnalysis: residueReports.filter(r => r.status === 'em_analise').length,
    scheduled: residueReports.filter(r => r.status === 'programado').length,
    collected: residueReports.filter(r => r.status === 'coletado').length,
    offers: reuseOffers.filter(o => o.isActive).length,
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
          <main className="flex-1 mt-[72px] flex flex-col relative">
              {/* Page header */}
                <div className="bg-background border-b border-border">
                <div className="max-w-screen-2xl mx-auto px-4 py-6 text-center">
                    <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
                    Gestão de Resíduos
                    </h1>
                    <p className="text-muted-foreground">
                    Registro, acompanhamento e reaproveitamento de resíduos urbanos na plataforma
                    </p>
                </div>
                </div>

        {/* Stats Bar - Institutional design */}
        <div className="bg-card border-b border-border z-20 shrink-0">
          <div className="max-w-screen-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Stats */}
              <div className="flex items-center gap-3 md:gap-5 overflow-x-auto">
                {/* Total */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Registros</p>
                    <p className="text-lg font-bold text-foreground leading-tight">{stats.total}</p>
                  </div>
                </div>
                
                <div className="hidden sm:block h-8 w-px bg-border shrink-0" />
                
                {/* Status indicators - Using institutional colors */}
                <div className="flex items-center gap-4 text-sm shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-info" />
                        <span className="font-semibold text-foreground">{stats.registered}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">registrados</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Aguardando análise</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-warning" />
                        <span className="font-semibold text-foreground">{stats.inAnalysis}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">em análise</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Sendo avaliados pela equipe</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                        <span className="font-semibold text-foreground">{stats.scheduled}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">programados</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Ação programada</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        <span className="font-semibold text-foreground">{stats.collected}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">coletados</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Situação resolvida</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Right: Reuse Offers */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-success/10 border border-success/20 shrink-0">
                <Recycle className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">{stats.offers}</span>
                <span className="text-xs text-success/80 hidden sm:inline">ofertas de reaproveitamento</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <ResidueMapView activeFilters={activeFilters} />
          
          {/* Top Left: Filters */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-card/95 backdrop-blur-sm shadow-lg border-border hover:bg-card gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border-border">
                <DropdownMenuLabel>Tipo de resíduo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {residueTypes.filter(t => !t.infoOnly).map(type => (
                  <DropdownMenuCheckboxItem
                    key={type.id}
                    checked={activeFilters.includes(type.id)}
                    onCheckedChange={() => toggleFilter(type.id)}
                    className="gap-2"
                  >
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: type.color }}
                    />
                    {type.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {residueStatuses.map(status => (
                  <DropdownMenuCheckboxItem
                    key={status.id}
                    checked={activeFilters.includes(status.id)}
                    onCheckedChange={() => toggleFilter(status.id)}
                    className="gap-2"
                  >
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: status.color }}
                    />
                    {status.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Legend Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLegend(!showLegend)}
              className={cn(
                "bg-card/95 backdrop-blur-sm shadow-lg border-border hover:bg-card gap-2",
                showLegend && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Legenda</span>
            </Button>
          </div>

          {/* Legend Panel */}
          {showLegend && (
            <div className="absolute top-4 left-28 sm:left-36 z-10 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-3 animate-fade-in max-w-xs">
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Tipos de Resíduo
              </h4>
              <div className="grid grid-cols-1 gap-y-1.5">
                {residueTypes.filter(t => !t.infoOnly).map(type => (
                  <div key={type.id} className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-[11px] text-muted-foreground">{type.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Status
                </h4>
                <div className="grid grid-cols-1 gap-y-1.5">
                  {residueStatuses.map(status => (
                    <div key={status.id} className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-[11px] text-muted-foreground">{status.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-success flex-shrink-0" />
                  <span className="text-[11px] text-muted-foreground">Oferta de reaproveitamento</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom: Action CTAs */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border p-1.5 flex gap-1.5">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 px-5 shadow-sm"
              >
                <Package className="h-4 w-4" />
                <span className="font-medium">Registrar resíduo</span>
              </Button>
              <Button 
                size="lg"
                className="bg-success hover:bg-success/90 text-white rounded-xl gap-2 px-5 shadow-sm"
              >
                <Recycle className="h-4 w-4" />
                <span className="font-medium">Ofertar reaproveitamento</span>
              </Button>
            </div>
            
            {/* Helper text */}
            <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Info className="h-3 w-3" />
              Clique no mapa para selecionar o local
            </p>
          </div>

        </div>

        {/* Institutional footer */}
        <div className="bg-muted/50 border-t border-border px-4 py-3">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground/80">{institutionalMessages.notEmergency}</p>
                  <p>{institutionalMessages.noGuarantee} {institutionalMessages.dataUse}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-muted">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span>{institutionalMessages.privacyNote}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResíduosPage;
