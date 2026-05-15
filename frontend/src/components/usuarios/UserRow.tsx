import { Edit3, Trash2 } from "lucide-react";
import type { UserItem } from "../../types/user";

const userGrid =
  "grid-cols-[220px_240px_130px_120px_90px] lg:grid-cols-[minmax(220px,1.5fr)_minmax(220px,1.4fr)_minmax(130px,.8fr)_minmax(110px,.7fr)_90px]";

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);

  if (!parts.length) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserRow({
  user,
  active,
  onSelect,
  onEdit,
  onDelete,
}: {
  user: UserItem;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`grid ${userGrid} cursor-pointer items-center rounded-lg px-4 py-3 text-sm transition ${
        active
          ? "border border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,.45)]"
          : "border border-transparent hover:bg-white/5"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xs font-bold text-cyan-200">
          {getInitials(user.name)}
        </div>

        <span className="truncate font-medium text-slate-100">
          {user.name}
        </span>
      </div>

      <span className="truncate text-slate-300">{user.email}</span>

      <span className="truncate text-slate-300">{user.role}</span>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <Edit3 size={18} className="text-cyan-300 hover:text-cyan-200" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={18} className="text-red-400 hover:text-red-300" />
        </button>
      </div>
    </div>
  );
}