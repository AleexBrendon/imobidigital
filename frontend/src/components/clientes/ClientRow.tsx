import { Edit3, Trash2 } from "lucide-react";
import type { ClientItem } from "../../types/client";
import { formatCpfCnpj, formatPhone } from "../../utils/format";

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
  const initial = client.name?.charAt(0)?.toUpperCase() || "?";

  const formattedPhone = client.phone
    ? formatPhone(client.phone)
    : "Não informado";

  const formattedDocument = client.document
    ? formatCpfCnpj(client.document)
    : "Documento não informado";

  return (
    <div
      onClick={onSelect}
      className={`grid cursor-pointer grid-cols-[42px_1.5fr_1.3fr_1.2fr_1.1fr_.8fr_.7fr_.45fr] items-center rounded-lg px-3 py-2.5 text-sm ${
        active
          ? "border border-cyan-400 bg-cyan-400/10"
          : "hover:bg-white/5"
      }`}
    >
      <div className="h-5 w-5 rounded border border-white/15" />

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
          {client.image_url ? (
            <img
              src={client.image_url}
              alt={client.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-cyan-200">{initial}</span>
          )}
        </div>

        <p className="truncate font-medium text-white">{client.name}</p>
      </div>

      <p className="truncate text-xs text-slate-400">
        {client.email || "E-mail não informado"}
      </p>

      <p className="truncate text-xs text-slate-400">{formattedPhone}</p>

      <p className="truncate text-xs text-slate-400">{formattedDocument}</p>

      <p className="truncate text-xs text-slate-400">{client.type}</p>

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

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-cyan-400"
        >
          <Edit3 size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}