import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AriaLiveContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AriaLiveContext = createContext<AriaLiveContextType | null>(null);

interface AriaLiveProviderProps {
  children: ReactNode;
}

export function AriaLiveProvider({ children }: AriaLiveProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveMessage("");
      // Small delay to ensure screen readers pick up the change
      setTimeout(() => setAssertiveMessage(message), 50);
      // Clear after announcement
      setTimeout(() => setAssertiveMessage(""), 3000);
    } else {
      setPoliteMessage("");
      setTimeout(() => setPoliteMessage(message), 50);
      setTimeout(() => setPoliteMessage(""), 3000);
    }
  }, []);

  return (
    <AriaLiveContext.Provider value={{ announce }}>
      {children}
      {/* Polite announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      {/* Assertive announcements */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AriaLiveContext.Provider>
  );
}

export function useAriaAnnounce() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    // Fallback if used outside provider
    return { announce: () => {} };
  }
  return context;
}
