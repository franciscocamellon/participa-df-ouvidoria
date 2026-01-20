import { Plus, Minus, Locate, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onGeolocate: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export function MapControls({ onZoomIn, onZoomOut, onGeolocate, onRefresh, isRefreshing }: MapControlsProps) {
  return (
    <TooltipProvider>
      <div className="absolute top-10 right-4 z-10 flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="glass shadow-civic h-10 w-10"
              aria-label="Atualizar ocorrências"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Atualizar dados e renovar cache</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onGeolocate}
              className="glass shadow-civic h-10 w-10"
              aria-label="Ir para minha localização"
            >
              <Locate className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ir para minha localização</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex flex-col glass rounded-lg shadow-civic overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                className="h-10 w-10 rounded-none border-b border-border/50"
                aria-label="Aumentar zoom"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Aumentar zoom</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                className="h-10 w-10 rounded-none"
                aria-label="Diminuir zoom"
              >
                <Minus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Diminuir zoom</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
