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
  clients = [],
  selectedClientId,
  onSelectClient,
}: {
  column: Column;
  clients?: Client[];
  selectedClientId?: number | null;
  onSelectClient?: (client: Client) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[620px] rounded-3xl border
        bg-[linear-gradient(180deg,#132238_0%,#0f1b2d_100%)]
        p-4 transition-all duration-300
        ${
          isOver
            ? "border-cyan-400/60 shadow-[0_0_35px_rgba(34,211,238,.18)]"
            : "border-white/10"
        }
      `}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-bold tracking-tight text-white">
            {column.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {clients.length} clientes
          </p>
        </div>
      </div>

      <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1 no-scrollbar">
        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">
            Nenhum cliente nesta etapa.
          </div>
        ) : (
          clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              selected={selectedClientId === client.id}
              onSelect={() => onSelectClient?.(client)}
            />
          ))
        )}
      </div>
    </div>
  );
}