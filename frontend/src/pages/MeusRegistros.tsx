import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, FileText, Filter, Inbox, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { occurrenceCategories, occurrenceStatuses } from "@/config/app.config.ts";
import { Header } from "@/components/layout/Header.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OccurrenceCard } from "@/components/occurrence/OccurrenceCard";
import { useOccurrencesQuery, updateOccurrenceStatus, occurrencesQueryKey } from "@/services/apiService";
import type { OccurrenceStatusId } from "@/types/occurrence";
import { Skeleton } from "@/components/ui/skeleton";

type StoredUser = {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
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

const MeusRegistros = () => {
  const storedUser = getStoredUser();
  const userId = storedUser?.id ?? null;
  const isAgent = storedUser?.role === "AGENT" || storedUser?.role === "ADMIN";
  const queryClient = useQueryClient();
  const page = 0;
  const size = 100;

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch occurrences from API
  const { data: apiResponse, isLoading } = useOccurrencesQuery({ page: 0, size: 100 });
  const occurrences = apiResponse?.content ?? [];

  // Para agentes: todos os registros. Para usuários: apenas os próprios
  const registros = useMemo(() => {
    if (isAgent) {
      return occurrences;
    }
    return occurrences.filter((occ) => occ.reporterIdentityId === userId);
  }, [occurrences, isAgent, userId]);

  // Contagem de solicitações "RECEIVED" para agentes
  const receivedCount = useMemo(() => {
    return occurrences.filter((occ) => occ.currentStatus === "RECEIVED").length;
  }, [occurrences]);

  const filteredRegistros = registros.filter((reg) => {
    if (categoryFilter !== "all" && reg.category !== categoryFilter) return false;
    if (statusFilter !== "all" && reg.currentStatus !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (occurrenceId: string, newStatus: OccurrenceStatusId) => {
    await updateOccurrenceStatus(occurrenceId, newStatus);
    await queryClient.invalidateQueries({ queryKey: occurrencesQueryKey(page, size) });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              {isAgent ? "Registros" : "Meus registros"}
            </h1>
            <p className="text-muted-foreground">
              {isAgent
                ? "Gerencie todas as ocorrências registradas no sistema."
                : "Acompanhe o status das ocorrências que você registrou."}
            </p>
          </div>

          {/* Trust indicator / Received count */}
          <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                {isAgent ? <Inbox className="h-5 w-5 text-accent" /> : <CheckCircle className="h-5 w-5 text-accent" />}
              </div>
              <div>
                {isAgent ? (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {receivedCount} solicitações aguardando triagem
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Solicitações com status "Recebido" que precisam de análise.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">{registros.length} contribuições verificadas</p>
                    <p className="text-xs text-muted-foreground">
                      Suas contribuições ajudam a melhorar a cidade para todos.
                    </p>
                  </>
                )}
              </div>
            </div>
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

          {/* Loading state */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRegistros.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum registro encontrado</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nenhum registro corresponde aos filtros selecionados.
              </p>
              <Button asChild variant="outline">
                <a href="/">Ir para o mapa</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistros.map((registro) => (
                <OccurrenceCard
                  key={registro.id}
                  occurrence={registro}
                  expanded={expandedId === registro.id}
                  onToggleExpand={() => setExpandedId(expandedId === registro.id ? null : registro.id)}
                  isAgent={isAgent}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              Os prazos de atendimento variam conforme a natureza e complexidade de cada solicitação. A plataforma não
              substitui os canais oficiais de emergência.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeusRegistros;
