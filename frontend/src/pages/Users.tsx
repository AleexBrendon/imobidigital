import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  UserActivityPanel,
  type UserActivity,
} from "../components/usuarios/UserActivityPanel";

import { UserFilters } from "../components/usuarios/UserFilters";
import { UserFormPanel } from "../components/usuarios/UserFormPanel";
import { UserTable } from "../components/usuarios/UserTable";

import type { UserItem, UserRole } from "../types/user";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type ApiUser,
  type UserPayload,
} from "../services/users";

import { getActivities } from "../services/activities";
import { useToast } from "../contexts/ToastContext";

type Filter = "all" | "corretor" | "administrador";

function toApiStatus(status: string): UserPayload["status"] {
  return status === "Offline" ? "blocked" : "active";
}

function fromApiStatus(status?: string) {
  return status === "blocked" ? "Offline" : "Online";
}

function normalizeUser(user: ApiUser): UserItem {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    document: user.document ?? "",
    role: fromApiRole(user.role),
    status: fromApiStatus(user.status),
    avatar: user.avatar ?? Math.floor(Math.random() * 50) + 1,
  };
}

function fromApiRole(role: string): UserRole {
  if (role === "admin") return "Administrador";
  if (role === "corretor") return "Corretor";
  return "Usuário";
}

function toApiRole(role: UserRole): UserPayload["role"] {
  if (role === "Administrador") return "admin";
  if (role === "Corretor") return "corretor";
  return "usuario";
}

export function Users() {
  const toast = useToast();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);

      const [usersData, activitiesData] = await Promise.all([
        getUsers(),
        getActivities<UserActivity>({
          subject_type: "App\\Models\\User",
        }),
      ]);

      setUsers(usersData.map(normalizeUser));
      setActivities(activitiesData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (filter === "corretor") {
      return users.filter((user) => user.role === "Corretor");
    }

    if (filter === "administrador") {
      return users.filter((user) => user.role === "Administrador");
    }

    return users;
  }, [filter, users]);

  async function handleSaveUser(data: Omit<UserItem, "id" | "avatar"> & {
    password?: string;
  }) {
    try {
      const payload: UserPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        role: toApiRole(data.role),
        status: toApiStatus(data.status),
        password: data.password,
      };

      if (editingUser) {
        await updateUser(editingUser.id, payload);

        toast.success(`Usuário ${data.name} atualizado com sucesso.`);

        setEditingUser(null);
        setShowForm(false);

        await loadUsers();
        return;
      }

      if (!data.password) {
        toast.error("Informe uma senha para o novo usuário.");
        return;
      }

      await createUser(payload);

      toast.success(`Usuário ${data.name} cadastrado com sucesso.`);

      setShowForm(false);

      await loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar usuário.");
    }
  }

  async function handleDeleteUser(id: number) {
    const user = users.find((user) => user.id === id);

    const confirmDelete = confirm("Deseja excluir este usuário?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      toast.info(
        user
          ? `Usuário ${user.name} foi excluído.`
          : "Usuário excluído com sucesso."
      );

      if (selectedUserId === id) {
        setSelectedUserId(null);
      }

      if (editingUser?.id === id) {
        setEditingUser(null);
        setShowForm(false);
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir usuário.");
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
            <h2 className="text-2xl font-semibold">
              Gerenciamento de Usuários
            </h2>

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

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">
            Carregando usuários...
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            selectedUserId={selectedUserId}
            onSelect={(user) => setSelectedUserId(user.id)}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteUser}
          />
        )}
      </section>

      <aside className="space-y-5">
        <UserActivityPanel activities={activities} />

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