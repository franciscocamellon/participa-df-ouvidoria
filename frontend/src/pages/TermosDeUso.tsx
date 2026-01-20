import { Header } from "@/components/layout/Header";
import { FileText, Scale, AlertTriangle, Users, Shield, Clock, CheckCircle2 } from "lucide-react";
import { appInfo } from "@/config/app.config";
import { Link } from "react-router-dom";

const sections = [
  {
    icon: FileText,
    title: "1. Aceitação dos Termos",
    content: `Ao acessar e utilizar a plataforma ${appInfo.name}, você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição aqui estabelecida, solicitamos que não utilize os serviços oferecidos.

O uso continuado da plataforma após eventuais atualizações destes Termos implica na aceitação automática das modificações realizadas.`,
  },
  {
    icon: Users,
    title: "2. Descrição do Serviço",
    content: `O ${appInfo.name} é uma plataforma de ouvidoria digital que permite aos cidadãos do Distrito Federal:

• Registrar ocorrências relacionadas a serviços públicos urbanos
• Acompanhar o status de suas solicitações
• Contribuir para a melhoria da gestão urbana

A plataforma atua como canal de comunicação entre cidadãos e órgãos públicos competentes, facilitando o encaminhamento e a resolução de demandas.`,
  },
  {
    icon: Shield,
    title: "3. Cadastro e Responsabilidades do Usuário",
    content: `Para utilizar determinadas funcionalidades, o usuário deve fornecer informações verdadeiras, completas e atualizadas. O usuário é responsável por:

• Manter a confidencialidade de suas credenciais de acesso
• Toda atividade realizada em sua conta
• Informar imediatamente qualquer uso não autorizado
• Não compartilhar sua conta com terceiros

O fornecimento de informações falsas ou a utilização indevida da plataforma pode resultar no bloqueio do acesso.`,
  },
  {
    icon: Scale,
    title: "4. Uso Adequado da Plataforma",
    content: `O usuário compromete-se a utilizar a plataforma de forma ética e responsável, sendo vedado:

• Registrar ocorrências falsas, fraudulentas ou de má-fé
• Utilizar linguagem ofensiva, discriminatória ou que viole direitos de terceiros
• Fazer uso da plataforma para fins ilícitos ou não autorizados
• Tentar acessar áreas restritas ou sistemas internos
• Sobrecarregar os servidores com requisições excessivas

Os registros passam por análise e triagem, podendo ser descartados se não atenderem aos critérios de uso adequado.`,
  },
  {
    icon: AlertTriangle,
    title: "5. Limitação de Responsabilidade",
    content: `O ${appInfo.name} não é canal de emergência. Para situações de risco imediato, o cidadão deve contatar os serviços de emergência:

• Polícia Militar: 190
• Corpo de Bombeiros: 193
• SAMU: 192
• Defesa Civil: 199

A plataforma não garante prazos específicos para resolução de ocorrências, pois o atendimento depende dos órgãos públicos competentes. Não nos responsabilizamos por:

• Interrupções temporárias do serviço
• Danos decorrentes do uso ou impossibilidade de uso da plataforma
• Ações ou omissões de órgãos públicos no tratamento das ocorrências`,
  },
  {
    icon: Clock,
    title: "6. Disponibilidade e Manutenção",
    content: `A plataforma opera em regime 24/7, porém pode haver interrupções programadas para manutenção ou atualizações. Em caso de indisponibilidade não programada, envidamos esforços para restabelecer o serviço o mais breve possível.

O ${appInfo.name} reserva-se o direito de modificar, suspender ou descontinuar funcionalidades a qualquer momento, mediante comunicação prévia quando possível.`,
  },
  {
    icon: CheckCircle2,
    title: "7. Propriedade Intelectual",
    content: `Todo o conteúdo da plataforma, incluindo marca, logotipos, design, textos e software, é protegido por direitos de propriedade intelectual. É vedada a reprodução, distribuição ou modificação sem autorização prévia.

Os registros de ocorrências feitos pelos usuários poderão ser utilizados, de forma anonimizada, para:

• Geração de estatísticas públicas
• Planejamento urbano
• Pesquisas acadêmicas
• Melhoria contínua dos serviços`,
  },
];

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Termos de Uso</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Condições gerais de uso da plataforma {appInfo.name}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          {/* Intro */}
          <section className="mb-10 p-6 rounded-2xl bg-card border border-border">
            <p className="text-muted-foreground leading-relaxed">
              Bem-vindo ao {appInfo.name}! Estes Termos de Uso estabelecem as regras para utilização 
              da nossa plataforma de ouvidoria digital. Ao utilizar nossos serviços, você concorda 
              em cumprir estas condições. Por favor, leia atentamente antes de prosseguir.
            </p>
          </section>

          {/* Sections */}
          <div className="space-y-6 mb-10">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <section key={index} className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line pl-13">
                    {section.content}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Footer notes */}
          <section className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Disposições Finais
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Estes Termos de Uso são regidos pelas leis brasileiras. Eventuais disputas serão 
                resolvidas no foro da cidade de Brasília, Distrito Federal.
              </p>
              <p>
                Para dúvidas sobre estes termos, entre em contato através da seção{" "}
                <Link to="/sobre" className="text-primary hover:underline font-medium">
                  Sobre nós
                </Link>
                .
              </p>
              <p>
                Consulte também nossa{" "}
                <Link to="/politica-de-privacidade" className="text-primary hover:underline font-medium">
                  Política de Privacidade
                </Link>{" "}
                para entender como tratamos seus dados pessoais.
              </p>
            </div>
          </section>

          {/* Version info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              {appInfo.name} • Versão {appInfo.version}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermosDeUso;
