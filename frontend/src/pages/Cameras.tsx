import { Header } from '@/components/layout/Header';
import { Video, Settings } from 'lucide-react';

const CamerasPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[100px] pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
              <Video className="h-10 w-10 text-accent" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Câmeras públicas
            </h1>
            <p className="text-muted-foreground">
              Visualização pública de apoio situacional
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Settings className="h-5 w-5 text-accent animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-lg font-medium text-foreground">Em integração</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Estamos trabalhando na integração com as câmeras públicas da cidade. 
              Em breve você poderá visualizar imagens em tempo real para apoio situacional.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CamerasPage;
