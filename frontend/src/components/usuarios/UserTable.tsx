import type { UserItem } from "../../types/user";
import { UserRow } from "./UserRow";

export function UserTable({
  users,
  selectedUserId,
  onSelect,
  onEdit,
  onDelete,
}: {
  users: UserItem[];
  selectedUserId: number | null;
  onSelect: (user: UserItem) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid grid-cols-[42px_1.5fr_1.3fr_.8fr_.7fr_.45fr] items-center rounded-lg bg-slate-700/40 px-3 py-3 text-sm text-slate-300">
        <div className="h-5 w-5 rounded border border-white/15" />
        <span>Nome Completo</span>
        <span>E-mail</span>
        <span>Função</span>
        <span>Status</span>
        <span>Ações</span>
      </div>

      <div className="mt-2 space-y-1">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            active={selectedUserId === user.id}
            onSelect={() => onSelect(user)}
            onEdit={() => onEdit(user)}
            onDelete={() => onDelete(user.id)}
          />
        ))}
      </div>
    </div>
  );
}