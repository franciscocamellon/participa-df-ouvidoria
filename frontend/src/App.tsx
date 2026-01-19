import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OccurrencesHydrator } from "@/components/providers/OccurrencesHydrator";
import { ConnectionBanner } from "@/components/ui/ConnectionBanner";
import { SkipLink } from "@/components/ui/SkipLink";
import { AccessibilityPanel } from "@/components/ui/AccessibilityPanel";
import { AriaLiveProvider } from "@/components/ui/AriaLiveRegion";
import { PwaInstallPromptManager } from "@/components/pwa/PwaInstallPromptManager";
import Index from "./pages/Index";
import MeusRegistros from "./pages/MeusRegistros";
import Dashboard from "./pages/Dashboard";
import Sobre from "./pages/Sobre";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import AgentLoginPage from "./pages/auth/AgentLoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NewPasswordPage from "./pages/auth/NewPasswordPage";
import AcompanharSolicitacao from "./pages/AcompanharSolicitacao";
import TimelineSolicitacao from "./pages/TimelineSolicitacao";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Consider data fresh for 1 minute
      staleTime: 60 * 1000,
      // Retry 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AriaLiveProvider>
      <OccurrencesHydrator />
      <TooltipProvider>
        <SkipLink />
        <Toaster />
        <Sonner />
        <ConnectionBanner />
        <AccessibilityPanel />
        <PwaInstallPromptManager />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/ses/login" element={<AgentLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<NewPasswordPage />} />
            <Route path="/meus-registros" element={<MeusRegistros />} />
            <Route path="/acompanhar" element={<AcompanharSolicitacao />} />
            <Route path="/acompanhar/:protocolNumber" element={<TimelineSolicitacao />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
            <Route path="/perfil" element={<Perfil />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AriaLiveProvider>
  </QueryClientProvider>
);

export default App;
