import {
  ArrowRight,
  MoreHorizontal,
  Trash2,
  UserPlus,
  Pencil,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ClientActivityType = "created" | "updated" | "deleted" | "document";

export type ClientActivity = {
  id: string | number;
  type: ClientActivityType;
  clientName: string;
  userName: string;
  date: string;
};

const activityConfig: Record<
  ClientActivityType,
  {
    icon: LucideIcon;
    color: string;
    title: string;
  }
> = {
  created: {
    icon: UserPlus,
    color: "bg-indigo-500/30 text-indigo-300",
    title: "Cliente adicionado",
  },
  updated: {
    icon: Pencil,
    color: "bg-emerald-500/30 text-emerald-300",
    title: "Cliente editado",
  },
  deleted: {
    icon: Trash2,
    color: "bg-red-500/30 text-red-300",
    title: "Cliente excluído",
  },
  document: {
    icon: ArrowRight,
    color: "bg-violet-500/30 text-violet-300",
    title: "Documento vinculado",
  },
};

export function ClientActivityPanel({
  activities = [],
}: {
  activities?: ClientActivity[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            Notificações de Clientes
          </h3>
          <p className="text-sm text-slate-400">
            Últimas ações realizadas no sistema
          </p>
        </div>

        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nenhuma notificação registrada.
        </p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${config.color}`}
                  >
                    <Icon size={20} />
                  </div>

                  {index !== activities.length - 1 && (
                    <div className="mt-2 h-8 w-px bg-white/10" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-slate-100">
                    {config.title}
                  </p>

                  <p className="text-sm text-slate-300">
                    Cliente:{" "}
                    <span className="font-medium text-white">
                      {activity.clientName}
                    </span>
                  </p>

                  <p className="text-sm text-slate-400">
                    Ação realizada por{" "}
                    <span className="font-medium text-slate-200">
                      {activity.userName}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {activity.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}