import { useState, useEffect } from "react";
import { Accessibility, Type, Contrast, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const A11Y_STORAGE_KEY = "a11y-preferences";

interface A11yPreferences {
  highContrast: boolean;
  largeText: boolean;
}

function getStoredPreferences(): A11yPreferences {
  try {
    const stored = localStorage.getItem(A11Y_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { highContrast: false, largeText: false };
}

function savePreferences(prefs: A11yPreferences) {
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}

function applyPreferences(prefs: A11yPreferences) {
  const html = document.documentElement;

  if (prefs.largeText) {
    html.classList.add("a11y-large-text");
  } else {
    html.classList.remove("a11y-large-text");
  }

  if (prefs.highContrast) {
    html.classList.add("a11y-high-contrast");
  } else {
    html.classList.remove("a11y-high-contrast");
  }
}

// Apply preferences on module load (before React renders)
applyPreferences(getStoredPreferences());

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<A11yPreferences>(getStoredPreferences);

  // Apply preferences whenever they change
  useEffect(() => {
    applyPreferences(preferences);
    savePreferences(preferences);
  }, [preferences]);

  // Keyboard shortcut: Alt+A to toggle panel
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

  const toggleHighContrast = () => {
    setPreferences((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleLargeText = () => {
    setPreferences((prev) => ({ ...prev, largeText: !prev.largeText }));
  };

  return (
    <>
      {/* Floating accessibility button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 z-50 rounded-full shadow-lg",
          "bg-background/95 backdrop-blur-sm border-2 border-primary",
          "hover:bg-primary hover:text-primary-foreground",
          "focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2",
          "w-12 h-12"
        )}
        aria-label="Abrir painel de acessibilidade (Alt+A)"
        aria-haspopup="dialog"
        title="Acessibilidade (Alt+A)"
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-sm"
          aria-describedby="a11y-panel-description"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" aria-hidden="true" />
              Acessibilidade
            </DialogTitle>
            <DialogDescription id="a11y-panel-description">
              Ajuste as configurações de acessibilidade conforme sua necessidade.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Large Text Toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Type className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-0.5">
                  <Label
                    htmlFor="large-text-toggle"
                    className="text-base font-medium cursor-pointer"
                  >
                    Aumentar fonte
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Texto maior para melhor leitura
                  </p>
                </div>
              </div>
              <Switch
                id="large-text-toggle"
                checked={preferences.largeText}
                onCheckedChange={toggleLargeText}
                aria-describedby="large-text-desc"
              />
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Contrast className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-0.5">
                  <Label
                    htmlFor="high-contrast-toggle"
                    className="text-base font-medium cursor-pointer"
                  >
                    Alto contraste
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cores mais fortes e definidas
                  </p>
                </div>
              </div>
              <Switch
                id="high-contrast-toggle"
                checked={preferences.highContrast}
                onCheckedChange={toggleHighContrast}
                aria-describedby="high-contrast-desc"
              />
            </div>
          </div>

          <div className="pt-2 border-t space-y-1">
            <p className="text-xs text-muted-foreground text-center">
              Suas preferências são salvas automaticamente.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Alt</kbd>
              {" + "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">A</kbd>
              {" para abrir/fechar"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
