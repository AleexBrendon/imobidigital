import { Bell, CalendarDays, ChevronDown, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/dashboard": "Painel de Controle",
  "/usuarios": "Usuários",
  "/clientes": "Clientes",
  "/imoveis": "Imóveis",
  "/documentos": "Documentos",
  "/contratos": "Contratos",
  "/relatorios": "Relatórios",
};

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="flex h-[88px] items-center justify-between border-b border-white/10 bg-[#081321] px-9">
      <h1 className="text-2xl font-semibold text-white">
        {titles[pathname] ?? "Painel de Controle"}
      </h1>

      <div className="flex h-12 w-[570px] items-center gap-3 rounded-xl border border-white/10 bg-[#172337] px-4 text-slate-400">
        <Search size={20} />
        <span className="text-sm">Pesquisar clientes, contratos ou documentos (Command + K)</span>
      </div>

      <div className="flex items-center gap-5">
        <CalendarDays size={22} className="text-slate-300" />

        <div className="relative">
          <Bell size={24} className="text-slate-300" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
            3
          </span>
        </div>

        <img
          src="https://i.pravatar.cc/80?img=47"
          className="h-11 w-11 rounded-full border border-white/20 object-cover"
        />

        <ChevronDown size={18} className="text-slate-400" />
      </div>
    </header>
  );
}