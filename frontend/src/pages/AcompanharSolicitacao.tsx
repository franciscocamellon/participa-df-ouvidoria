import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, AlertCircle, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { occurrenceCategories, occurrenceStatuses } from "@/config/app.config";
import { fetchOccurrenceByProtocol, ApiError } from "@/services/apiService";
import { OccurrenceCard } from "@/components/occurrence/OccurrenceCard";
import type { ApiOmbudsman } from "@/types/occurrence";

const AcompanharSolicitacao = () => {
  const navigate = useNavigate();
  const [protocolo, setProtocolo] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [result, setResult] = useState<ApiOmbudsman | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocolo.trim()) return;

    setSearching(true);
    setNotFound(false);
    setResult(null);

    try {
      const data = await fetchOccurrenceByProtocol(protocolo.trim());
      if (data) {
        // Navegar para a página de timeline
        navigate(`/acompanhar/${encodeURIComponent(protocolo.trim())}`);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setSearching(false);
    }
  };

  // Filter result based on category and status
  const shouldShowResult = () => {
    if (!result) return false;
    if (categoryFilter !== "all" && result.category !== categoryFilter) return false;
    if (statusFilter !== "all" && result.currentStatus !== statusFilter) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Acompanhar solicitação</h1>
            <p className="text-muted-foreground">Consulte o status da sua solicitação através do número de protocolo.</p>
          </div>

          {/* Search bar */}
          <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite o número do protocolo (Ex: 2024-ABC123)"
                  value={protocolo}
                  onChange={(e) => {
                    setProtocolo(e.target.value);
                    setNotFound(false);
                  }}
                  className="pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={!protocolo.trim() || searching}
              >
                {searching ? "Buscando..." : "Consultar"}
              </Button>
            </form>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtrar:</span>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {occurrenceCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {occurrenceStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result / Empty state / Not found */}
          {result && shouldShowResult() ? (
            <div className="space-y-4">
              <OccurrenceCard
                occurrence={result}
                expanded={expandedId === result.id}
                onToggleExpand={() => setExpandedId(expandedId === result.id ? null : result.id)}
              />
            </div>
          ) : result && !shouldShowResult() ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Filtro não corresponde</h3>
              <p className="text-muted-foreground text-sm mb-4">
                A solicitação encontrada não corresponde aos filtros selecionados.
              </p>
              <Button variant="outline" onClick={() => { setCategoryFilter("all"); setStatusFilter("all"); }}>
                Limpar filtros
              </Button>
            </div>
          ) : notFound ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Protocolo não encontrado</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Verifique se o número está correto ou tente novamente mais tarde.
              </p>
              <Button variant="outline" onClick={() => { setProtocolo(""); setNotFound(false); }}>
                Nova busca
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Busque sua solicitação</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Digite o número do protocolo acima para consultar o status da sua solicitação.
              </p>
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              Não possui um protocolo?{" "}
              <a href="/login" className="text-primary hover:underline">
                Faça login
              </a>{" "}
              para ver todas as suas solicitações.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcompanharSolicitacao;
