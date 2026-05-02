import { MoreHorizontal } from "lucide-react";

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <MoreHorizontal size={20} className="text-slate-400" />
    </div>
  );
}