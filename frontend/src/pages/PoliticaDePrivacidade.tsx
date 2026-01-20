import { Header } from "@/components/layout/Header";
import { Shield, Lock, Eye, FileText, Users, Database, Bell, Trash2, Scale, Mail } from "lucide-react";
import { appInfo } from "@/config/app.config";
import { Link } from "react-router-dom";

const sections = [
  {
    icon: FileText,
    title: "1. Introdução",
    content: `Esta Política de Privacidade descreve como o ${appInfo.name} coleta, utiliza, armazena e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais normas aplicáveis.

Nosso compromisso é garantir a transparência no tratamento de suas informações e assegurar que você tenha controle sobre seus dados pessoais.`,
  },
  {
    icon: Database,
    title: "2. Dados Coletados",
    content: `Coletamos apenas os dados estritamente necessários para a prestação do serviço:

**Dados de Cadastro:**
• Nome completo
• E-mail
• Telefone (formato E.164)
• Senha (armazenada de forma criptografada)

**Dados das Ocorrências:**
• Localização geográfica do registro (latitude/longitude)
• Endereço aproximado
• Categoria e descrição da ocorrência
• Nível de urgência
• Fotos anexadas (opcional)

**Dados de Navegação:**
• Endereço IP
• Tipo de dispositivo e navegador
• Data e horário de acesso

Os registros podem ser feitos de forma anônima. Neste caso, não há vinculação entre a ocorrência e dados pessoais identificáveis.`,
  },
  {
    icon: Eye,
    title: "3. Finalidade do Tratamento",
    content: `Seus dados são utilizados exclusivamente para:

• **Prestação do serviço:** Registrar, encaminhar e acompanhar ocorrências urbanas
• **Comunicação:** Informar sobre o status das solicitações e atualizações
• **Identificação:** Autenticar usuários e prevenir fraudes
• **Melhoria contínua:** Aprimorar a experiência e funcionalidades da plataforma
• **Estatísticas públicas:** Gerar relatórios anonimizados sobre demandas urbanas
• **Cumprimento legal:** Atender obrigações legais e regulatórias

Não utilizamos seus dados para fins de marketing, publicidade direcionada ou comercialização a terceiros.`,
  },
  {
    icon: Users,
    title: "4. Compartilhamento de Dados",
    content: `Seus dados podem ser compartilhados com:

• **Órgãos públicos competentes:** Para encaminhamento e resolução das ocorrências registradas
• **Autoridades legais:** Quando exigido por lei, decisão judicial ou procedimento administrativo
• **Prestadores de serviço:** Fornecedores de infraestrutura tecnológica, mediante contratos de confidencialidade

**Importante:** Dados sensíveis são anonimizados para análises estatísticas e relatórios públicos. Apenas os agentes públicos responsáveis pelo atendimento têm acesso às informações completas das ocorrências.

Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.`,
  },
  {
    icon: Lock,
    title: "5. Segurança dos Dados",
    content: `Implementamos medidas técnicas e organizacionais para proteger seus dados:

• **Criptografia:** Senhas são armazenadas com hash seguro; transmissões utilizam HTTPS/TLS
• **Controle de acesso:** Apenas pessoal autorizado acessa dados pessoais
• **Monitoramento:** Sistemas de detecção de intrusão e registro de acessos
• **Backups:** Cópias de segurança regulares com proteção adequada
• **Atualizações:** Manutenção contínua de patches de segurança

Apesar de todos os esforços, nenhum sistema é 100% seguro. Em caso de incidente de segurança que possa causar risco relevante, os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD) serão notificados.`,
  },
  {
    icon: Shield,
    title: "6. Seus Direitos (LGPD)",
    content: `Conforme a LGPD, você tem direito a:

• **Confirmação e acesso:** Saber se tratamos seus dados e acessar as informações
• **Correção:** Solicitar a atualização de dados incompletos, inexatos ou desatualizados
• **Anonimização ou bloqueio:** Requerer quando os dados forem desnecessários ou tratados em desconformidade
• **Eliminação:** Solicitar a exclusão de dados tratados com base no consentimento
• **Portabilidade:** Receber seus dados em formato estruturado para transferência
• **Revogação do consentimento:** Retirar o consentimento a qualquer momento
• **Informação:** Saber com quais entidades seus dados são compartilhados
• **Oposição:** Opor-se a tratamentos realizados em descumprimento à lei

Para exercer seus direitos, entre em contato através dos canais indicados ao final desta política.`,
  },
  {
    icon: Bell,
    title: "7. Bases Legais para Tratamento",
    content: `O tratamento de seus dados pessoais é fundamentado nas seguintes bases legais da LGPD:

• **Consentimento (Art. 7º, I):** Para envio de comunicações e registro de ocorrências não anônimas
• **Execução de políticas públicas (Art. 7º, III):** Para encaminhamento de demandas a órgãos competentes
• **Interesse legítimo (Art. 7º, IX):** Para melhoria dos serviços e prevenção de fraudes
• **Cumprimento de obrigação legal (Art. 7º, II):** Quando exigido por lei ou autoridade competente

Você pode revogar o consentimento a qualquer momento, sem prejuízo dos tratamentos realizados anteriormente.`,
  },
  {
    icon: Trash2,
    title: "8. Retenção e Eliminação",
    content: `Seus dados são mantidos pelo tempo necessário para:

• **Dados de cadastro:** Enquanto a conta estiver ativa ou conforme obrigação legal
• **Dados de ocorrências:** Pelo prazo necessário ao atendimento e arquivamento público
• **Logs de acesso:** Por 6 meses, conforme Marco Civil da Internet

Após o término do tratamento, os dados serão:
• Eliminados de forma segura; ou
• Anonimizados para fins estatísticos e de pesquisa

Você pode solicitar a exclusão de sua conta e dados a qualquer momento, ressalvadas as obrigações legais de retenção.`,
  },
  {
    icon: Scale,
    title: "9. Cookies e Tecnologias Similares",
    content: `Utilizamos cookies e tecnologias similares para:

• **Cookies essenciais:** Necessários para o funcionamento básico da plataforma
• **Cookies de sessão:** Para manter você autenticado durante a navegação
• **Armazenamento local:** Para funcionamento offline e salvamento de rascunhos

Não utilizamos cookies de rastreamento publicitário. Você pode configurar seu navegador para recusar cookies, mas algumas funcionalidades podem ser afetadas.`,
  },
  {
    icon: Mail,
    title: "10. Contato e Encarregado de Dados",
    content: `Para exercer seus direitos, esclarecer dúvidas ou fazer reclamações sobre o tratamento de dados pessoais, entre em contato:

**Encarregado de Proteção de Dados (DPO):**
• Setor de Proteção de Dados do Governo do Distrito Federal
• E-mail: lgpd@gdf.gov.br

**Autoridade Nacional de Proteção de Dados (ANPD):**
• Para reclamações não resolvidas: www.gov.br/anpd

Responderemos sua solicitação no prazo de 15 dias, conforme estabelecido pela LGPD.`,
  },
];

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Política de Privacidade</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          {/* LGPD Badge */}
          <section className="mb-10 p-6 rounded-2xl bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Compromisso com a LGPD
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  O {appInfo.name} está em total conformidade com a Lei Geral de Proteção de Dados 
                  (Lei nº 13.709/2018). Coletamos apenas o necessário, nunca compartilhamos 
                  informações pessoais sem consentimento explícito e garantimos seus direitos 
                  como titular dos dados.
                </p>
              </div>
            </div>
          </section>

          {/* Sections */}
          <div className="space-y-6 mb-10">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <section key={index} className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line pl-13 prose-sm">
                    {section.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-foreground">{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Footer notes */}
          <section className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Alterações nesta Política
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente para refletir 
                mudanças em nossas práticas ou na legislação. Recomendamos revisar esta página 
                regularmente. Alterações significativas serão comunicadas através da plataforma.
              </p>
              <p>
                Consulte também nossos{" "}
                <Link to="/termos-de-uso" className="text-primary hover:underline font-medium">
                  Termos de Uso
                </Link>{" "}
                para conhecer as regras de utilização da plataforma.
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

export default PoliticaDePrivacidade;
