import { Edit3, Trash2 } from "lucide-react";
import type { UserItem } from "../../types/user";

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
      className={`grid cursor-pointer grid-cols-[42px_1.5fr_1.3fr_.8fr_.7fr_.45fr] items-center rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "border border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,.55)]"
          : "border border-transparent hover:bg-white/5"
      }`}
    >
      <div className="h-5 w-5 rounded border border-white/15" />

      <div className="flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/80?img=${user.avatar}`}
          className="h-9 w-9 rounded-full border border-white/20 object-cover"
        />
        <span className="font-medium text-slate-100">{user.name}</span>
      </div>

      <span className="text-slate-300">{user.email}</span>
      <span className="text-slate-300">{user.role}</span>

      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            user.status === "Online" ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <span>{user.status}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <Edit3 size={18} className="text-cyan-300 hover:text-cyan-200" />
        </button>

        <button
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