import { Header } from '@/components/layout/Header';
import { Shield, Eye, Scale, Clock, Users, Lock, FileText, Heart } from 'lucide-react';
import { appInfo } from '@/config/app.config';

const principles = [
  {
    icon: Shield,
    title: 'Ética e transparência',
    description: 'Todas as decisões são documentadas e comunicadas com clareza. Não há ações ocultas ou processos que não possam ser explicados ao cidadão.',
  },
  {
    icon: Lock,
    title: 'Privacidade primeiro',
    description: 'Seus dados são protegidos pela LGPD. Coletamos apenas o necessário e nunca compartilhamos informações pessoais sem consentimento explícito.',
  },
  {
    icon: Scale,
    title: 'Critérios públicos de priorização',
    description: 'As ocorrências são priorizadas com base em critérios transparentes: urgência, impacto coletivo, vulnerabilidade e viabilidade de execução.',
  },
  {
    icon: Clock,
    title: 'Compromisso de retorno',
    description: 'Todo registro recebe uma resposta. Mesmo que a ação não seja imediata, você será informado sobre o encaminhamento e próximos passos.',
  },
];

const governance = [
  {
    title: 'Como funciona a triagem',
    content: 'Cada registro passa por uma análise inicial onde verificamos a categoria, localização e urgência. Em seguida, encaminhamos ao órgão ou equipe mais adequada.',
  },
  {
    title: 'Quem tem acesso aos dados',
    content: 'Apenas os agentes públicos responsáveis pelo atendimento têm acesso às informações. Dados sensíveis são anonimizados para análises estatísticas.',
  },
  {
    title: 'Métricas de desempenho',
    content: 'Monitoramos tempo médio de triagem, taxa de encaminhamento correto e taxa de retorno ao cidadão. Esses indicadores são públicos e revisados periodicamente.',
  },
];

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
              Mediação Territorial Integrada
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma de coordenação urbana focada em confiança, transparência e retorno ao cidadão.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-10 p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Nossa missão
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Facilitar a comunicação entre cidadãos e a gestão urbana, promovendo uma cultura de cuidado 
              compartilhado com o espaço público. Não substituímos instituições — trabalhamos para que elas 
              funcionem melhor, com mais visibilidade e responsividade.
            </p>
          </section>

          {/* Principles */}
          <section className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Princípios fundamentais
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-card border border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Governance */}
          <section className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Governança e transparência
            </h2>
            
            <div className="space-y-4">
              {governance.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-muted/30 border border-border"
                >
                  <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy notice */}
          <section className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Política de privacidade
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Dados coletados:</strong> localização da ocorrência, 
                categoria, descrição e foto (opcional). Dados de identificação são usados apenas para 
                acompanhamento e retorno.
              </p>
              <p>
                <strong className="text-foreground">Finalidade:</strong> coordenação de ações urbanas, 
                encaminhamento a órgãos competentes e geração de estatísticas públicas anonimizadas.
              </p>
              <p>
                <strong className="text-foreground">Direitos do cidadão:</strong> você pode solicitar 
                acesso, correção ou exclusão de seus dados a qualquer momento.
              </p>
              <p className="pt-2">
                {appInfo.privacyNote}
              </p>
            </div>
          </section>

          {/* Version info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>{appInfo.name} • Versão {appInfo.version}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre;
