import { Header } from '@/components/layout/Header';
import { MapView } from '@/components/map/MapView';

const Index = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      
      <Header />
      
      <main id="main-content" className="flex-1 pt-[88px]">
        <MapView />
      </main>
    </div>
  );
};

export default Index;
