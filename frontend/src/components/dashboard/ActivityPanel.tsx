import { FileText } from "lucide-react";
import { activities } from "../data/dashboard";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

export function ActivityPanel() {
  return (
    <Card>
      <SectionHeader title="Atividade Recente" />

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
              <FileText size={18} />
            </div>

            <div>
              <p className="text-sm font-medium">{activity}</p>
              <p className="text-xs text-slate-400">
                {index === 0 ? "8 horas ago" : "2 hours ago"} · 12:00
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}