import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { 
  FileText, Filter, Clock, CheckCircle, Sparkles, Lightbulb, 
  Trash, Construction, AlertTriangle, Accessibility, HeartHandshake, 
  TreeDeciduous, ChevronRight, MapPin, ArrowRight, Send, Wrench, 
  CalendarClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { occurrenceCategories, occurrenceStatuses } from '@/config/app.config';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const categoryIcons: Record<string, React.ElementType> = {
  zeladoria: Sparkles,
  iluminacao: Lightbulb,
  descarte: Trash,
  mobiliario: Construction,
  incidente: AlertTriangle,
  acessibilidade: Accessibility,
  vulnerabilidade: HeartHandshake,
  ambiental: TreeDeciduous,
};

const statusIcons: Record<string, React.ElementType> = {
  recebido: Send,
  triagem: Clock,
  encaminhado: ArrowRight,
  execucao: Wrench,
  concluido: CheckCircle,
  programado: CalendarClock,
};

// Mock data para demonstração
const mockRegistros = [
  {
    id: '1',
    category: 'iluminacao',
    description: 'Poste de iluminação apagado há mais de uma semana na esquina com a Rua das Flores. Área fica muito escura à noite.',
    status: 'concluido',
    createdAt: new Date('2024-11-28'),
    location: 'Rua das Flores, 123',
    statusHistory: [
      { status: 'recebido', date: new Date('2024-11-28'), note: 'Registro recebido com sucesso.' },
      { status: 'triagem', date: new Date('2024-11-29'), note: 'Em análise pela equipe técnica.' },
      { status: 'encaminhado', date: new Date('2024-11-30'), note: 'Encaminhado para CEB.' },
      { status: 'execucao', date: new Date('2024-12-02'), note: 'Equipe técnica em deslocamento.' },
      { status: 'concluido', date: new Date('2024-12-03'), note: 'Lâmpada substituída. Obrigado pela contribuição!' },
    ],
  },
  {
    id: '2',
    category: 'descarte',
    description: 'Entulho de construção descartado irregularmente na calçada, obstruindo a passagem de pedestres.',
    status: 'execucao',
    createdAt: new Date('2024-12-05'),
    location: 'Av. Central, próximo ao nº 456',
    statusHistory: [
      { status: 'recebido', date: new Date('2024-12-05'), note: 'Registro recebido com sucesso.' },
      { status: 'triagem', date: new Date('2024-12-06'), note: 'Classificado como descarte irregular.' },
      { status: 'encaminhado', date: new Date('2024-12-07'), note: 'Encaminhado para SLU.' },
      { status: 'execucao', date: new Date('2024-12-09'), note: 'Remoção agendada para os próximos dias.' },
    ],
  },
  {
    id: '3',
    category: 'acessibilidade',
    description: 'Calçada com buraco grande dificultando a passagem de cadeirantes e pessoas com mobilidade reduzida.',
    status: 'encaminhado',
    createdAt: new Date('2024-12-08'),
    location: 'Quadra 5, Bloco B',
    statusHistory: [
      { status: 'recebido', date: new Date('2024-12-08'), note: 'Registro recebido com sucesso.' },
      { status: 'triagem', date: new Date('2024-12-09'), note: 'Identificado como problema de acessibilidade.' },
      { status: 'encaminhado', date: new Date('2024-12-10'), note: 'Encaminhado para Novacap - Setor de Manutenção.' },
    ],
  },
  {
    id: '4',
    category: 'vulnerabilidade',
    description: 'Pessoa em situação de rua aparentemente precisando de assistência social próximo à praça.',
    status: 'triagem',
    createdAt: new Date('2024-12-10'),
    location: 'Praça da Estação',
    statusHistory: [
      { status: 'recebido', date: new Date('2024-12-10'), note: 'Registro recebido com sucesso.' },
      { status: 'triagem', date: new Date('2024-12-11'), note: 'Avaliando melhor forma de encaminhamento para rede de assistência social.' },
    ],
  },
  {
    id: '5',
    category: 'zeladoria',
    description: 'Mato muito alto na área verde do condomínio, com acúmulo de lixo entre a vegetação.',
    status: 'recebido',
    createdAt: new Date('2024-12-12'),
    location: 'Área verde - Quadra 10',
    statusHistory: [
      { status: 'recebido', date: new Date('2024-12-12'), note: 'Registro recebido. Aguardando análise inicial.' },
    ],
  },
  {
    id: '6',
    category: 'ambiental',
    description: 'Árvore com galhos secos ameaçando cair sobre a via pública.',
    status: 'programado',
    createdAt: new Date('2024-11-15'),
    location: 'Rua dos Ipês, 78',
    statusHistory: [
      { status: 'recebido', date: new Date('2024-11-15'), note: 'Registro recebido com sucesso.' },
      { status: 'triagem', date: new Date('2024-11-16'), note: 'Avaliação técnica solicitada.' },
      { status: 'programado', date: new Date('2024-11-20'), note: 'Situação avaliada. Poda programada para o cronograma mensal de manutenção arbórea.' },
    ],
  },
];

const MeusRegistros = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRegistros = mockRegistros.filter((reg) => {
    if (categoryFilter !== 'all' && reg.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
    return true;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (statusId: string) => {
    return occurrenceStatuses.find((s) => s.id === statusId);
  };

  const getCategoryInfo = (categoryId: string) => {
    return occurrenceCategories.find((c) => c.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Meus registros
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o status das ocorrências que você registrou.
            </p>
          </div>

          {/* Trust indicator */}
          <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {mockRegistros.length} contribuições verificadas
                </p>
                <p className="text-xs text-muted-foreground">
                  Suas contribuições ajudam a melhorar a cidade para todos.
                </p>
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

          {/* Records list */}
          {filteredRegistros.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum registro encontrado
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nenhum registro corresponde aos filtros selecionados.
              </p>
              <Button asChild variant="outline">
                <a href="/">Ir para o mapa</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistros.map((registro) => {
                const category = getCategoryInfo(registro.category);
                const status = getStatusInfo(registro.status);
                const IconComponent = categoryIcons[registro.category] || FileText;
                const StatusIcon = statusIcons[registro.status] || Clock;
                const isExpanded = expandedId === registro.id;
                const lastUpdate = registro.statusHistory[registro.statusHistory.length - 1];

                return (
                  <div
                    key={registro.id}
                    className={cn(
                      "rounded-xl bg-card border border-border transition-all duration-200",
                      isExpanded ? "shadow-lg" : "hover:shadow-civic"
                    )}
                  >
                    {/* Card Header - Clickable */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : registro.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start gap-4">
                        {/* Category icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${category?.color}15` }}
                        >
                          <IconComponent 
                            className="h-6 w-6" 
                            style={{ color: category?.color }} 
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="font-medium text-foreground text-sm">
                                {category?.label}
                              </h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{registro.location}</span>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1.5 px-2.5 py-1"
                              style={{
                                backgroundColor: `${status?.color}15`,
                                color: status?.color,
                                borderColor: `${status?.color}30`,
                              }}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {status?.label}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {registro.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Registrado em {formatDate(registro.createdAt)}
                            </span>
                            <ChevronRight 
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                isExpanded && "rotate-90"
                              )} 
                            />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border">
                        <div className="pt-4">
                          {/* Status Explanation */}
                          <div 
                            className="p-3 rounded-lg mb-4"
                            style={{ backgroundColor: `${status?.color}08` }}
                          >
                            <p className="text-sm text-muted-foreground">
                              <strong className="text-foreground">O que significa:</strong>{' '}
                              {status?.description}
                            </p>
                          </div>

                          {/* Timeline */}
                          <div className="space-y-0">
                            <h4 className="text-sm font-medium text-foreground mb-3">
                              Histórico de atualizações
                            </h4>
                            <div className="relative pl-4 border-l-2 border-border space-y-4">
                              {registro.statusHistory.map((entry, index) => {
                                const entryStatus = getStatusInfo(entry.status);
                                const EntryIcon = statusIcons[entry.status] || Clock;
                                const isLatest = index === registro.statusHistory.length - 1;

                                return (
                                  <div key={index} className="relative">
                                    {/* Timeline dot */}
                                    <div 
                                      className={cn(
                                        "absolute -left-[21px] w-4 h-4 rounded-full flex items-center justify-center",
                                        isLatest ? "ring-2 ring-offset-2 ring-offset-background" : ""
                                      )}
                                      style={{ 
                                        backgroundColor: entryStatus?.color,
                                        // @ts-ignore - ring color via CSS variable
                                        '--tw-ring-color': entryStatus?.color,
                                      } as React.CSSProperties}
                                    >
                                      <EntryIcon className="h-2 w-2 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="ml-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span 
                                          className="text-sm font-medium"
                                          style={{ color: entryStatus?.color }}
                                        >
                                          {entryStatus?.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDateTime(entry.date)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {entry.note}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              Os prazos de atendimento variam conforme a natureza e complexidade de cada solicitação. 
              A plataforma não substitui os canais oficiais de emergência.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeusRegistros;
