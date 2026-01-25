import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aplica preferências de acessibilidade o mais cedo possível.
import "@/stores/useAcessibilidadeStore";

createRoot(document.getElementById("root")!).render(<App />);
