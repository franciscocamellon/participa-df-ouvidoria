import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { User, CheckCircle, Clock, TrendingUp, Settings, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useOccurrenceStore } from "@/stores/occurrenceStore";

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

type ApiOccurrenceLike = {
  id: string;
  reporterIdentityId: string | null;
  currentStatus: string;
};

const Perfil = () => {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const userId = storedUser?.id ?? null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ⚠️ aqui eu assumo que o store já está com as ocorrências do GET (API)
  const allOccurrences = useOccurrenceStore((state) => state.occurrences) as unknown as ApiOccurrenceLike[];

  // Somente ocorrências do usuário logado (reporterIdentityId)
  const myOccurrences = useMemo(() => {
    if (!userId) return [];
    return allOccurrences.filter((o) => o.reporterIdentityId === userId);
  }, [allOccurrences, userId]);

  const stats = useMemo(() => {
    const total = myOccurrences.length;

    const concluidos = myOccurrences.filter((o) => o.currentStatus === "COMPLETED").length;

    const emAndamento = myOccurrences.filter((o) =>
        ["TRIAGE", "FORWARDED", "IN_EXECUTION"].includes(o.currentStatus)
    ).length;

    return { total, concluidos, emAndamento };
  }, [myOccurrences, allOccurrences]);

  const trustLevel =
      stats.concluidos >= 5 ? "Cidadão ativo" : stats.total >= 1 ? "Colaborador" : "Novo usuário";

  const displayName = storedUser?.fullName || storedUser?.name || "Perfil";

  return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-[100px] pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Profile header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>

              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">{displayName}</h1>
              <p className="text-muted-foreground">{storedUser?.email ?? "Usuário"}</p>

              {!userId && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                    Você não está logado. Faça login para ver seus registros.
                  </div>
              )}
            </div>

            {/* Trust badge */}
            <div className="mb-8 p-5 rounded-2xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">{trustLevel}</p>
                  <p className="text-sm text-muted-foreground">{stats.concluidos} contribuições verificadas</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-accent/20">
                <p className="text-xs text-muted-foreground">
                  Contribuições verificadas são registros que passaram pelo processo completo de triagem e encaminhamento.
                  Cada contribuição ajuda a melhorar a cidade.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="p-4 rounded-xl bg-card border border-border text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total de registros</div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border text-center">
                <div className="text-2xl font-bold text-success">{stats.concluidos}</div>
                <div className="text-xs text-muted-foreground">Concluídos</div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border text-center">
                <div className="text-2xl font-bold text-warning">{stats.emAndamento}</div>
                <div className="text-xs text-muted-foreground">Em andamento</div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent" />
                Preferências
              </h2>

              <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor="notifications" className="text-sm font-medium">
                        Notificações de status
                      </Label>
                      <p className="text-xs text-muted-foreground">Receba atualizações sobre seus registros</p>
                    </div>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor="telemetry" className="text-sm font-medium">
                        Métricas anônimas
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Ajude a melhorar a plataforma com dados anonimizados
                      </p>
                    </div>
                  </div>
                  <Switch id="telemetry" defaultChecked />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Clock className="h-4 w-4" />
                Ver histórico completo
              </Button>
              
              {userId && (
                <Button 
                  variant="destructive" 
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
  );
};

export default Perfil;
