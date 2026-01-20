import { Header } from "@/components/layout/Header";
import { MapView } from "@/components/map/MapView";
import { FailedSyncRetry } from "@/components/ui/FailedSyncRetry";

const Index = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="main-content" className="flex-1 relative">
        {/* Failed sync retry panel - shows when there are failed items */}
        <div className="absolute top-2 left-2 right-2 z-10 max-w-md">
          <FailedSyncRetry />
        </div>
        <MapView />
      </main>
    </div>
  );
};

export default Index;
