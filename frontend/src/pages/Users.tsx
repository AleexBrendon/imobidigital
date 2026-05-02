import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { UserActivityPanel } from "../components/users/UserActivityPanel";
import { UserFilters } from "../components/users/UserFilters";
import { UserFormPanel } from "../components/users/UserFormPanel";
import { UserTable } from "../components/users/UserTable";
import { initialUsers } from "../components/data/users";
import type { UserItem } from "../types/user";

type Filter = "all" | "corretor" | "administrador";

export function Users() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(3);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredUsers = useMemo(() => {
    if (filter === "corretor") {
      return users.filter((user) => user.role === "Corretor");
    }

    if (filter === "administrador") {
      return users.filter((user) => user.role === "Administrador");
    }

    return users;
  }, [filter, users]);

  function handleSaveUser(data: Omit<UserItem, "id" | "avatar">) {
    if (editingUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id ? { ...user, ...data } : user
        )
      );

      setEditingUser(null);
      setShowForm(false);
      return;
    }

    const newUser: UserItem = {
      id: Date.now(),
      avatar: Math.floor(Math.random() * 50) + 1,
      ...data,
    };

    setUsers((current) => [newUser, ...current]);
    setSelectedUserId(newUser.id);
    setShowForm(false);
  }

  function handleDeleteUser(id: number) {
    const confirmDelete = confirm("Deseja excluir este usuário?");

    if (!confirmDelete) return;

    setUsers((current) => current.filter((user) => user.id !== id));

    if (selectedUserId === id) {
      setSelectedUserId(null);
    }

    if (editingUser?.id === id) {
      setEditingUser(null);
      setShowForm(false);
    }
  }

  function handleOpenCreateForm() {
    setEditingUser(null);
    setSelectedUserId(null);
    setShowForm(true);
  }

  function handleOpenEditForm(user: UserItem) {
    setEditingUser(user);
    setSelectedUserId(user.id);
    setShowForm(true);
  }

  function handleCloseForm() {
    setEditingUser(null);
    setShowForm(false);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_430px] gap-5">
      <section className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>

            <div className="mt-4">
              <UserFilters activeFilter={filter} onChange={setFilter} />
            </div>
          </div>

          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            <Plus size={17} />
            Adicionar Usuário
          </button>
        </div>

        <UserTable
          users={filteredUsers}
          selectedUserId={selectedUserId}
          onSelect={(user) => setSelectedUserId(user.id)}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteUser}
        />
      </section>

      <aside className="space-y-5">
        <UserActivityPanel />

        {showForm && (
          <UserFormPanel
            editingUser={editingUser}
            onSave={handleSaveUser}
            onCancelEdit={handleCloseForm}
          />
        )}
      </aside>
    </div>
  );
}