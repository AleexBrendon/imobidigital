import { Mail, MoreHorizontal, Phone } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Client } from "../../types/kanban";

export function ClientCard({
  client,
  selected = false,
  onSelect,
}: {
  client: Client;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: client.id,
      data: client,
    });

  const initial = client.name?.charAt(0)?.toUpperCase() ?? "?";

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`
        cursor-grab rounded-2xl border
        bg-[linear-gradient(180deg,#101c2f_0%,#0d1727_100%)]
        p-3 shadow-[0_15px_35px_rgba(0,0,0,0.28)]
        transition-all duration-200
        hover:-translate-y-1 hover:border-cyan-400/30
        active:cursor-grabbing
        ${
          selected
            ? "border-cyan-400/80 shadow-[0_0_30px_rgba(34,211,238,.25)]"
            : "border-white/10"
        }
      `}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-300 ring-2 ring-cyan-400/30">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white">
            {client.name}
          </p>

          <p className="truncate text-[11px] text-slate-400">
            {client.stage || client.status || client.tag || "Cliente"}
          </p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            console.log("opções", client);
          }}
          className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.03] p-3">
        {client.email && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Mail size={13} className="text-cyan-300" />
            <span className="truncate">{client.email}</span>
          </div>
        )}

        {client.phone && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Phone size={13} className="text-cyan-300" />
            <span className="truncate">{client.phone}</span>
          </div>
        )}
      </div>

      <span className="mt-3 inline-flex rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/10">
        {client.tag || "Sem tipo"}
      </span>
    </div>
  );
}