import type { UserItem } from "../../types/user";
import { UserRow } from "./UserRow";

const userGrid =
  "grid-cols-[minmax(220px,1.5fr)_minmax(220px,1.4fr)_minmax(130px,.8fr)_minmax(110px,.7fr)_90px]";

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
      <div
        className={`grid ${userGrid} items-center rounded-lg bg-slate-700/40 px-4 py-3 text-sm font-medium text-slate-300`}
      >
        <span>Nome Completo</span>
        <span>E-mail</span>
        <span>Função</span>
        <span className="text-center">Ações</span>
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