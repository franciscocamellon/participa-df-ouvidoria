import { Header } from "@/components/layout/Header";
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { occurrenceCategories, occurrenceStatuses, urgencyLevels } from "@/config/app.config";
import { useOccurrenceStore } from "@/stores/occurrenceStore";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const occurrences = useOccurrenceStore((state) => state.occurrences);
  const [periodFilter, setPeriodFilter] = useState<string>("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const total = occurrences.length;
    const byStatus = occurrenceStatuses.reduce(
      (acc, status) => {
        acc[status.id] = occurrences.filter((o) => o.currentStatus === status.id).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byCategory = occurrenceCategories.reduce(
      (acc, cat) => {
        acc[cat.id] = occurrences.filter((o) => o.category === cat.id).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byUrgency = urgencyLevels.reduce(
      (acc, level) => {
        acc[level.id] = occurrences.filter((o) => o.urgency === level.id).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const resolved = byStatus["COMPLETED"] || 0;
    const inProgress = (byStatus["TRIAGE"] || 0) + (byStatus["FORWARDED"] || 0) + (byStatus["IN_EXECUTION"] || 0);
    const pending = byStatus["RECEIVED"] || 0;
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0";
    console.log('resolutionRate:', resolutionRate)
    // Calculate average resolution time (mock data)
    const avgResolutionDays = 2.3;

    return {
      total,
      byStatus,
      byCategory,
      byUrgency,
      resolved,
      inProgress,
      pending,
      resolutionRate,
      avgResolutionDays,
    };
  }, [occurrences]);

  // Get recent occurrences
  const recentOccurrences = useMemo(() => {
    return [...occurrences]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [occurrences]);

  // Category ranking
  const categoryRanking = useMemo(() => {
    return occurrenceCategories
      .map((cat) => ({
        ...cat,
        count: stats.byCategory[cat.id] || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [stats.byCategory]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Dashboard de Ocorrências</h1>
              <p className="text-muted-foreground">Visão geral de todas as ocorrências registradas na plataforma</p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[160px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                </SelectContent>
              </Select>

              <Button asChild>
                <Link to="/" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Ver mapa
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Registros</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-success inline-flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" /> +12%
                  </span>{" "}
                  vs. período anterior
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Resolução</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{stats.resolutionRate}%</div>

                <p className="text-xs text-muted-foreground mt-1">{stats.resolved} ocorrências concluídas</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Média de {stats.avgResolutionDays} dias para resolução
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando Triagem</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">Novos registros para análise</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Status distribution */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Status</CardTitle>
                <CardDescription>Situação atual de todas as ocorrências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {occurrenceStatuses.map((status) => {
                  const count = stats.byStatus[status.id] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                  return (
                    <div key={status.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                          <span className="text-foreground">{status.label}</span>
                        </div>
                        <span className="font-medium text-foreground">{count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: status.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Category ranking */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Categorias Mais Frequentes</CardTitle>
                <CardDescription>Top 5 tipos de ocorrência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryRanking.map((cat, index) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.count} {cat.count === 1 ? "ocorrência" : "ocorrências"}
                      </p>
                    </div>
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Urgency distribution */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Nível de Urgência</CardTitle>
                <CardDescription>Priorização das ocorrências</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urgencyLevels.map((level) => {
                    const count = stats.byUrgency[level.id] || 0;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                    return (
                      <div key={level.id} className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-xl flex flex-col items-center justify-center"
                          style={{ backgroundColor: `${level.color}15` }}
                        >
                          <span className="text-2xl font-bold" style={{ color: level.color }}>
                            {count}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{level.label}</p>
                          <p className="text-xs text-muted-foreground">{level.description}</p>
                          <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: level.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent occurrences */}
          <Card className="mt-6 border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Ocorrências Recentes</CardTitle>
                <CardDescription>Últimos registros na plataforma</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/meus-registros">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOccurrences.map((occurrence) => {
                  const category = occurrenceCategories.find((c) => c.id === occurrence.category);
                  const status = occurrenceStatuses.find((s) => s.id === occurrence.currentStatus);

                  return (
                    <div
                      key={occurrence.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category?.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground text-sm truncate">{category?.label}</p>
                          <div
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${status?.color}15`,
                              color: status?.color,
                            }}
                          >
                            {status?.label}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{occurrence.description}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{formatDate(occurrence.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Footer metrics info */}
          <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Métricas de Desempenho do Piloto</p>
                <p className="text-xs text-muted-foreground">
                  Tempo médio de triagem: 4.2h • Taxa de encaminhamento correto: 94% • Taxa de retorno em 7 dias: 87% •
                  Dados anonimizados e agregados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
