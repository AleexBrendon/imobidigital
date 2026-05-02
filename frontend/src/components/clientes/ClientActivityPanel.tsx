import { ArrowRight, UserPlus, MoreHorizontal } from "lucide-react";

const activities = [
  {
    text: "Novo cliente cadastrado: Maria Souza",
    icon: UserPlus,
    color: "bg-indigo-500/30 text-indigo-300",
  },
  {
    text: "Cliente atualizado: João Silva",
    icon: UserPlus,
    color: "bg-emerald-500/30 text-emerald-300",
  },
  {
    text: "Documento enviado por cliente",
    icon: ArrowRight,
    color: "bg-violet-500/30 text-violet-300",
  },
];

export function ClientActivityPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Atividade de Clientes</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      <div className="space-y-5">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color}`}>
                  <Icon size={20} />
                </div>

                {index !== activities.length - 1 && (
                  <div className="mt-2 h-8 w-px bg-white/10" />
                )}
              </div>

              <div>
                <p className="font-medium text-slate-100">{activity.text}</p>
                <p className="text-sm text-slate-400">2 hours ago · 12:00</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}