import {
  CalendarDays,
  Search,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { NotificationsDropdown } from "../components/NotificationsDropdown";
import { UserDropdown } from "../components/UserDropdown";

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";

  const selectedDate = searchParams.get("date") ?? "";

  const canUseCalendar =
    pathname === "/dashboard" || pathname === "/relatorios";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  }

  function handleSearch(value: string) {
    updateParam("q", value);
  }

  function handleDate(value: string) {
    if (!canUseCalendar) return;

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("date", value);
    } else {
      params.delete("date");
    }

    navigate({
      pathname,
      search: params.toString(),
    });
  }

  return (
    <header className="flex h-[88px] items-center justify-between border-b border-white/10 bg-[#081321] px-9">
      <h1 className="text-2xl font-semibold text-white">
        {titles[pathname] ?? "Painel de Controle"}
      </h1>

      <div className="flex h-12 w-[570px] items-center gap-3 rounded-xl border border-white/10 bg-[#172337] px-4 text-slate-400">
        <Search size={20} />

        <input
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Pesquisar clientes, contratos ou documentos"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
        />

        {search && (
          <button
            type="button"
            onClick={() => handleSearch("")}
            className="text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="relative h-10 w-10">
          <button
            type="button"
            disabled={!canUseCalendar}
            className={`flex h-10 w-10 items-center justify-center rounded-lg p-2 transition ${canUseCalendar
              ? "text-slate-300 hover:bg-white/10 hover:text-white"
              : "text-slate-500"
              }`}
          >
            <CalendarDays size={22} />
          </button>

          {canUseCalendar && (
            <input
              type={pathname === "/relatorios" ? "month" : "date"}
              value={selectedDate}
              onChange={(event) => handleDate(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          )}
        </div>

        <NotificationsDropdown />

        <UserDropdown />
      </div>
    </header>
  );
}