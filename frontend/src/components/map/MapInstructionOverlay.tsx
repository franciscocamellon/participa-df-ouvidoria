import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const OVERLAY_STORAGE_KEY = "map-instruction-dismissed";
const OVERLAY_EXPIRY_HOURS = 24;

interface MapInstructionOverlayProps {
  onDismiss?: () => void;
}

export function MapInstructionOverlay({ onDismiss }: MapInstructionOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed recently
    const dismissedAt = localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const hoursSince = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSince < OVERLAY_EXPIRY_HOURS) {
        return; // Don't show if dismissed within expiry period
      }
    }
    
    // Show with slight delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      handleDismiss();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(OVERLAY_STORAGE_KEY, Date.now().toString());
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="absolute inset-0 z-20 flex items-center justify-center animate-fade-in"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Instruções do mapa"
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      
      {/* Content card */}
      <div 
        className="relative z-10 max-w-sm mx-4 p-6 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          aria-label="Fechar instruções"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Registrar ocorrência
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Toque em qualquer lugar do mapa para registrar uma nova ocorrência nessa localização.
          </p>
        </div>

        {/* Dismiss button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          className="w-full mt-4"
        >
          Entendi
        </Button>
      </div>
    </div>
  );
}
