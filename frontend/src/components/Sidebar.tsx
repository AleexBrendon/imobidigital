import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  FileText,
  Home,
  Users,
  CircleUserRound
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { label: "Painel", icon: Home, path: "/dashboard" },
  { label: "Usuários", icon: CircleUserRound, path: "/usuarios" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Imóveis", icon: Building2, path: "/imoveis" },
  { label: "Documentos", icon: FileText, path: "/documentos" },
  { label: "Contratos", icon: ClipboardList, path: "/contratos" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios" },
];

export function Sidebar() {
  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-white/10 bg-[#091423] px-4 py-6">
      <div className="mb-16 flex items-center gap-3 px-2">
        <div className="flex h-8 items-end gap-1">
          <span className="h-4 w-2 rounded bg-indigo-500" />
          <span className="h-6 w-2 rounded bg-cyan-400" />
          <span className="h-8 w-2 rounded bg-blue-500" />
        </div>
        <span className="text-xl font-bold text-white">ImobiDigital</span>
      </div>

      <nav className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-[0_0_22px_rgba(79,70,229,.45)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={21} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-[#132236] p-4 shadow-xl">
        <div className="relative mb-4 w-fit">
          <Bell size={25} className="text-slate-300" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px]">
            3
          </span>
        </div>

        <h3 className="font-semibold">Notificações Urgentes</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Alertas importantes sobre contratos, documentos e vencimentos.
        </p>
      </div>
    </aside>
  );
}