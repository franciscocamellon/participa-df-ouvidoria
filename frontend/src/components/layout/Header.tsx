import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Trash2, 
  FileText, 
  Lightbulb, 
  Info, 
  User,
  Menu,
  X,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { appInfo } from '@/config/app.config';

const navItems = [
  { path: '/', label: 'Ocorrências', icon: MapPin },
  { path: '/residuos', label: 'Resíduos', icon: Trash2 },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/meus-registros', label: 'Meus registros', icon: FileText },
  { path: '/sugestoes', label: 'Sugestões', icon: Lightbulb },
  { path: '/sobre', label: 'Sobre nós', icon: Info },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Emergency disclaimer */}
      <div className="emergency-disclaimer">
        <span className="inline-flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          {appInfo.emergencyDisclaimer}
        </span>
      </div>

      {/* Main header */}
      <div className="glass border-b border-border/50">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary font-heading font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">Mediação Territorial</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link to="/perfil">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "gap-2",
                  isActive('/perfil') && "bg-accent/10 text-accent"
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-border/50 py-2 px-4 animate-fade-in">
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
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
