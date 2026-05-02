import { MoreHorizontal } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import type { Client } from "../../types/kanban";
import { ClientCard } from "./ClientCard";

export type Column = {
  id: string;
  title: string;
  highlight?: boolean;
};

export function KanbanColumn({
  column,
  clients,
  onSelectClient,
}: {
  column: Column;
  clients: Client[];
  onSelectClient?: (client: Client) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[420px] rounded-xl border bg-[#111f33] p-3 transition ${
        column.highlight
          ? "border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,.45)]"
          : "border-white/10"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{column.title}</h3>
          <p className="text-xs text-slate-400">{clients.length} clientes</p>
        </div>

        <button type="button">
          <MoreHorizontal size={18} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onSelect={() => onSelectClient?.(client)}
          />
        ))}
      </div>
    </div>
  );
}