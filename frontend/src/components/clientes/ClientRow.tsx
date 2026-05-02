import { Edit3, Trash2 } from "lucide-react";
import type { ClientItem } from "../../types/client";

export function ClientRow({
  client,
  active,
  onSelect,
  onEdit,
  onDelete,
}: {
  client: ClientItem;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`grid cursor-pointer grid-cols-[42px_1.5fr_1.3fr_1.2fr_.8fr_.7fr_.5fr] items-center rounded-lg px-3 py-2.5 text-sm ${
        active
          ? "border border-cyan-400 bg-cyan-400/10"
          : "hover:bg-white/5"
      }`}
    >
      <div className="h-5 w-5 rounded border border-white/15" />

      <div className="flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/80?img=${client.avatar}`}
          className="h-9 w-9 rounded-full"
        />
        {client.name}
      </div>

      <span>{client.email}</span>
      <span>{client.phone}</span>
      <span>{client.type}</span>

      <span
        className={`text-xs ${
          client.status === "Ativo"
            ? "text-emerald-400"
            : client.status === "Lead"
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        {client.status}
      </span>

      <div className="flex gap-2">
        <Edit3
          size={16}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        />
        <Trash2
          size={16}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </div>
  );
}