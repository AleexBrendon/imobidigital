import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { PublicBotWidget } from "./components/bot/PublicBotWidget";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <PublicBotWidget />
    </BrowserRouter>
  );
}