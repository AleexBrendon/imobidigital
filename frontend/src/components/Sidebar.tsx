import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  FileText,
  Home,
  Users,
  CircleUserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  getPublicBotNotifications,
  type PublicBotNotification,
} from "../services/publicBotNotifications";

import { PublicBotNotificationsModal } from "./notifications/PublicBotNotificationsModal";

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
  const [notifications, setNotifications] = useState<PublicBotNotification[]>(
    []
  );

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  async function loadNotifications() {
    const data = await getPublicBotNotifications();
    setNotifications(data);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  return (
    <>
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

        <button
          onClick={() => {
            loadNotifications();
            setShowNotificationsModal(true);
          }}
          className="mt-auto rounded-xl border border-white/10 bg-[#132236] p-4 text-left shadow-xl transition hover:border-cyan-400/40 hover:bg-[#172a43]"
        >
          <div className="relative mb-4 w-fit">
            <Bell size={25} className="text-slate-300" />

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-white">Notificações Urgentes</h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Alertas importantes sobre cadastros, documentos e imóveis realizado através do bot.
          </p>
        </button>
      </aside>

      <PublicBotNotificationsModal
        open={showNotificationsModal}
        notifications={notifications}
        onClose={() => setShowNotificationsModal(false)}
      />
    </>
  );
}