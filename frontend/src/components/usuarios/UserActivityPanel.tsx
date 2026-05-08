import {
  ArrowRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type UserActivityType = "created" | "updated" | "deleted" | "info";

export type UserActivity = {
  id: string | number;
  type: UserActivityType;
  title: string;
  description?: string | null;
  userName: string;
  date: string;
};

const activityConfig: Record<
  UserActivityType,
  {
    icon: LucideIcon;
    color: string;
  }
> = {
  created: {
    icon: UserPlus,
    color: "bg-indigo-500/30 text-indigo-300",
  },
  updated: {
    icon: Pencil,
    color: "bg-emerald-500/30 text-emerald-300",
  },
  deleted: {
    icon: Trash2,
    color: "bg-red-500/30 text-red-300",
  },
  info: {
    icon: ArrowRight,
    color: "bg-violet-500/30 text-violet-300",
  },
};

export function UserActivityPanel({
  activities = [],
}: {
  activities?: UserActivity[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Atividade de Usuários</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nenhuma atividade registrada.
        </p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type] ?? activityConfig.info;
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

                <div>
                  <p className="font-medium text-slate-100">
                    {activity.title}
                  </p>

                  {activity.description && (
                    <p className="text-sm text-slate-400">
                      {activity.description}
                    </p>
                  )}

                  <p className="text-xs text-slate-500">
                    Por {activity.userName} • {activity.date}
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