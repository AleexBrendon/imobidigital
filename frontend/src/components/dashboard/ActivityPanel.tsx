import { FileText } from "lucide-react";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

type ActivityItem = {
  id: number;
  title: string;
  description?: string;
  type: string;
  created_at: string;
};

export function ActivityPanel({
  activities,
}: {
  activities: ActivityItem[];
}) {
  return (
    <Card>
      <SectionHeader title="Atividade Recente" />

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-4 border-b border-white/5 pb-4 last:border-0"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/10">
              <FileText size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {activity.title}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {activity.description || "Sem descrição"}
              </p>

              <p className="mt-2 text-[11px] text-slate-500">
                {new Date(activity.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}