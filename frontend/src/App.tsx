import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { PublicBotWidget } from "./components/bot/PublicBotWidget";

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
      <PublicBotWidget />
    </HashRouter>
  );
}