import { Header } from '@/components/layout/Header';
import { Lightbulb, Users, Building, ArrowRight, AlertCircle, Heart, Leaf, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appInfo } from '@/config/app.config';

const suggestions = [
  {
    title: 'Mutirão de limpeza comunitária',
    description: 'Participe do próximo mutirão de limpeza na Praça Central. Uma iniciativa da comunidade em parceria com a gestão local.',
    date: 'Sábado, 20/01 às 8h',
    icon: Leaf,
    color: '#16a34a',
    type: 'Ação coordenada',
  },
  {
    title: 'Programa de acolhimento social',
    description: 'Saiba como encaminhar pessoas em situação de vulnerabilidade para os serviços de assistência social disponíveis.',
    link: '#',
    icon: Heart,
    color: '#be185d',
    type: 'Orientação',
  },
  {
    title: 'Iluminação: como funciona o processo',
    description: 'Entenda como são priorizados os pedidos de manutenção de iluminação pública e qual o prazo médio de atendimento.',
    link: '#',
    icon: Lightbulb,
    color: '#f59e0b',
    type: 'Transparência',
  },
];

const partners = [
  { name: 'Secretaria de Obras', role: 'Infraestrutura e mobiliário' },
  { name: 'Serviço de Limpeza Urbana', role: 'Zeladoria e resíduos' },
  { name: 'Assistência Social', role: 'Atendimento a vulnerabilidades' },
  { name: 'Iluminação Pública', role: 'Manutenção de postes' },
];

const Sugestoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Sugestões e ações
            </h1>
            <p className="text-muted-foreground">
              Orientações práticas, campanhas e ações coordenadas com nossos parceiros institucionais.
            </p>
          </div>

          {/* Important notice */}
          <div className="mb-8 p-4 rounded-xl bg-info/5 border border-info/20 flex items-start gap-3">
            <Shield className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Esta plataforma não substitui instituições
              </p>
              <p className="text-sm text-muted-foreground">
                A Mediação Territorial Integrada é uma ferramenta de apoio à coordenação urbana. 
                Para situações de emergência, acione os canais oficiais: 190 (Polícia), 193 (Bombeiros), 192 (SAMU).
              </p>
            </div>
          </div>

          {/* Active suggestions */}
          <section className="mb-10">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Ações em destaque
            </h2>

            <div className="space-y-4">
              {suggestions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-card border border-border hover:shadow-civic transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: item.color }} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${item.color}15`, color: item.color }}
                          >
                            {item.type}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        
                        {item.date && (
                          <p className="text-sm font-medium text-accent">{item.date}</p>
                        )}
                        
                        {item.link && (
                          <Button variant="ghost" size="sm" className="gap-1 -ml-3 text-accent">
                            Saiba mais <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Partners */}
          <section className="mb-10">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-accent" />
              Parceiros institucionais
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-card border border-border flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency disclaimer */}
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {appInfo.emergencyDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sugestoes;
