import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { WasteMapView } from '@/components/waste/WasteMapView';
import { Trash2, Recycle, Package, TrendingUp, Filter, Layers, Info } from 'lucide-react';
import { useWasteStore } from '@/stores/wasteStore';
import { wasteTypes, wasteStatuses } from '@/config/waste.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const LixoPage = () => {
  const { wasteReports, recyclableOffers } = useWasteStore();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(false);
  
  const stats = {
    total: wasteReports.length,
    pending: wasteReports.filter(r => ['novo', 'triado'].includes(r.status)).length,
    inProgress: wasteReports.filter(r => ['agendado', 'em_rota'].includes(r.status)).length,
    collected: wasteReports.filter(r => ['coletado', 'reciclado_tratado', 'fechado'].includes(r.status)).length,
    offers: recyclableOffers.filter(o => o.isActive).length,
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
        {/* Stats Bar - Fixed below header */}
        <div className="bg-card border-b border-border z-20 shrink-0">
          <div className="max-w-screen-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Stats */}
              <div className="flex items-center gap-3 md:gap-5 overflow-x-auto">
                {/* Total */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Registros</p>
                    <p className="text-lg font-bold text-foreground leading-tight">{stats.total}</p>
                  </div>
                </div>
                
                <div className="hidden sm:block h-8 w-px bg-border shrink-0" />
                
                {/* Status indicators */}
                <div className="flex items-center gap-4 text-sm shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-warning" />
                        <span className="font-semibold text-foreground">{stats.pending}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">pendentes</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Aguardando triagem</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-info" />
                        <span className="font-semibold text-foreground">{stats.inProgress}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">em andamento</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Em rota de coleta</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-help">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        <span className="font-semibold text-foreground">{stats.collected}</span>
                        <span className="text-muted-foreground text-xs hidden md:inline">coletados</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Finalizados</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Right: Offers */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-success/10 border border-success/20 shrink-0">
                <Recycle className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">{stats.offers}</span>
                <span className="text-xs text-success/80 hidden sm:inline">ofertas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <WasteMapView />
          
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
                {wasteTypes.slice(0, 6).map(type => (
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
                {wasteStatuses.slice(0, 4).map(status => (
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
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {wasteTypes.slice(0, 8).map(type => (
                  <div key={type.id} className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-[11px] text-muted-foreground truncate">{type.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Status
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {wasteStatuses.slice(0, 6).map(status => (
                    <div key={status.id} className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-[11px] text-muted-foreground truncate">{status.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom: Action CTAs */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border p-1.5 flex gap-1.5">
              <Button 
                size="lg"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl gap-2 px-5 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span className="font-medium">Registrar lixo</span>
              </Button>
              <Button 
                size="lg"
                className="bg-success hover:bg-success/90 text-white rounded-xl gap-2 px-5 shadow-sm"
              >
                <Recycle className="h-4 w-4" />
                <span className="font-medium">Oferta de recicláveis</span>
              </Button>
            </div>
            
            {/* Helper text */}
            <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Info className="h-3 w-3" />
              Clique no mapa para selecionar o local
            </p>
          </div>

        </div>

        {/* Footer disclaimer */}
        <div className="bg-warning/5 border-t border-warning/20 px-4 py-2">
          <p className="text-[11px] text-center text-warning/80 max-w-2xl mx-auto">
            Este canal não substitui o serviço de emergência. Em caso de risco à saúde ou segurança, acione os órgãos competentes (SAMU 192, Bombeiros 193, Defesa Civil 199).
          </p>
        </div>
      </main>
    </div>
  );
};

export default LixoPage;
