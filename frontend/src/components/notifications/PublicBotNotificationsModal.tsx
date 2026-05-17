import { X } from "lucide-react";
import { useState } from "react";
import type { PublicBotNotification } from "../../services/publicBotNotifications";

type Tab = "cadastro" | "documento" | "imovel";

const tabs: { label: string; value: Tab }[] = [
  { label: "Clientes", value: "cadastro" },
  { label: "Documentos", value: "documento" },
  { label: "Imóveis", value: "imovel" },
];

export function PublicBotNotificationsModal({
  open,
  notifications,
  onClose,
}: {
  open: boolean;
  notifications: PublicBotNotification[];
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("cadastro");

  if (!open) return null;

  const filtered = notifications.filter(
    (notification) => notification.category === activeTab
  );

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f1725] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Notificações do Bot
            </h2>
            <p className="text-sm text-slate-400">
              Solicitações recebidas pelo atendimento público.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 border-b border-white/10 px-6 py-3">
          {tabs.map((tab) => {
            const count = notifications.filter(
              (item) => item.category === tab.value
            ).length;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  activeTab === tab.value
                    ? "bg-cyan-400 text-slate-950"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="max-h-[430px] space-y-3 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Nenhuma notificação nesta aba.
            </div>
          ) : (
            filtered.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl border border-white/10 bg-[#132236] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">
                      {notification.title}
                    </h3>

                    {notification.message && (
                      <p className="mt-1 text-sm text-slate-400">
                        {notification.message}
                      </p>
                    )}
                  </div>

                  {!notification.read && (
                    <span className="rounded-full bg-red-500/15 px-2 py-1 text-[11px] text-red-300">
                      Nova
                    </span>
                  )}
                </div>

                {notification.data && (
                  <div className="mt-4 grid gap-2 rounded-xl bg-black/15 p-3 text-sm text-slate-300">
                    {notification.data.name && (
                      <p>Nome: {notification.data.name}</p>
                    )}

                    {notification.data.phone && (
                      <p>Telefone: {notification.data.phone}</p>
                    )}

                    {notification.data.document && (
                      <p>CPF: {notification.data.document}</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}