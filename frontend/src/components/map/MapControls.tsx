import { Plus, Minus, Locate, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onGeolocate: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export function MapControls({ onZoomIn, onZoomOut, onGeolocate, onRefresh, isRefreshing }: MapControlsProps) {
  return (
    <div className="absolute top-10 right-4 z-10 flex flex-col gap-2">
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

      <Button
        variant="secondary"
        size="icon"
        onClick={onGeolocate}
        className="glass shadow-civic h-10 w-10"
        aria-label="Ir para minha localização"
      >
        <Locate className="h-5 w-5" />
      </Button>

      <div className="flex flex-col glass rounded-lg shadow-civic overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="h-10 w-10 rounded-none border-b border-border/50"
          aria-label="Aumentar zoom"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="h-10 w-10 rounded-none"
          aria-label="Diminuir zoom"
        >
          <Minus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
