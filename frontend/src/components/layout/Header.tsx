import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, FileText, Info, User, Menu, X, Shield, LayoutDashboard, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appInfo } from "@/config/app.config";
import { PendingSyncBadge } from "@/components/ui/PendingSyncBadge";
import logoIcon from "/assets/logo-icon.png";

const DISCLAIMER_STORAGE_KEY = "emergency-disclaimer-dismissed";

type StoredUser = {
  role?: string;
};

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function getNavItems(isLoggedIn: boolean, userRole?: string) {
  const isAgent = userRole === "AGENT" || userRole === "ADMIN";

  if (!isLoggedIn) {
    return [
      { path: "/sobre", label: "Sobre nós", icon: Info },
      { path: "/", label: "Mapa", icon: MapPin },
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/acompanhar", label: "Acompanhar solicitação", icon: Search },
    ];
  }

  return [
    { path: "/sobre", label: "Sobre nós", icon: Info },
    { path: "/", label: "Mapa", icon: MapPin },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/meus-registros", label: isAgent ? "Registros" : "Minhas solicitações", icon: FileText },
  ];
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDisclaimerDismissed, setIsDisclaimerDismissed] = useState(() => {
    return sessionStorage.getItem(DISCLAIMER_STORAGE_KEY) === "true";
  });
  const location = useLocation();

  const storedUser = getStoredUser();
  const isLoggedIn = !!storedUser;
  const navItems = useMemo(() => getNavItems(isLoggedIn, storedUser?.role), [isLoggedIn, storedUser?.role]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleDismissDisclaimer = () => {
    setIsDisclaimerDismissed(true);
    sessionStorage.setItem(DISCLAIMER_STORAGE_KEY, "true");
  };

  return (
    <header className="relative z-50" role="banner">
      <div className="glass shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-heading font-semibold text-lg hover:opacity-80 transition-opacity"
            aria-label="Participa DF - Ir para página inicial"
          >
            <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center" aria-hidden="true">
              <img src={logoIcon} alt="" className="w-8 h-8" aria-hidden="true" />
            </div>
            <span className="hidden sm:inline">Participa DF - Ouvidoria</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Pending Sync Badge, Profile/Login & Mobile Menu */}
          <div className="flex items-center gap-2">
            <PendingSyncBadge />
            <Link to={isLoggedIn ? "/perfil" : "/login"}>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2", (isActive("/perfil") || isActive("/login")) && "bg-accent/10 text-accent")}
                aria-label={isLoggedIn ? "Acessar perfil" : "Fazer login"}
              >
                {isLoggedIn ? (
                  <>
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{storedUser["fullName"]}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Login</span>
                  </>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className="lg:hidden border-t border-border/50 py-2 px-4 animate-fade-in"
            aria-label="Navegação mobile"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Emergency disclaimer */}
      {!isDisclaimerDismissed && (
        <div className="emergency-disclaimer" role="alert" aria-live="polite">
          <span className="inline-flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            {appInfo.emergencyDisclaimer}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-2 hover:bg-destructive/20 rounded-full"
            onClick={handleDismissDisclaimer}
            aria-label="Fechar aviso de emergência"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}
    </header>
  );
}
