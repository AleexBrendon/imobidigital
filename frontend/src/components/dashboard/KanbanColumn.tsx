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

  const groupsOfThree = Math.ceil(clients.length / 3);

  const columnHeight =
    clients.length <= 3
      ? 290
      : 290 + (groupsOfThree - 1) * 250;

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: `${columnHeight}px`,
      }}
      className={`
        w-full rounded-2xl border
        bg-[linear-gradient(180deg,#18283d_0%,#111d2e_100%)]
        p-3 transition-all duration-300
        ${
          isOver || column.highlight
            ? "border-cyan-400/70 shadow-[0_0_35px_rgba(34,211,238,.25)]"
            : "border-white/10"
        }
      `}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold leading-none text-white">
            {column.title}
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            {clients.length} {clients.length === 1 ? "cliente" : "clientes"}
          </p>
        </div>

        <button className="rounded-lg px-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
          ⋮
        </button>
      </div>

      <div className="space-y-2.5 overflow-visible">
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