import { MoreHorizontal, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserItem, UserRole, UserStatus } from "../../types/user";

type FormData = {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  role: "Corretor",
  status: "Online",
};

export function UserFormPanel({
  editingUser,
  onSave,
  onCancelEdit,
}: {
  editingUser: UserItem | null;
  onSave: (data: FormData) => void;
  onCancelEdit: () => void;
}) {
  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingUser]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Preencha nome e e-mail.");
      return;
    }

    onSave(form);
    setForm(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cyan-400/70 bg-[#101c2d]/95 p-5 shadow-[0_0_28px_rgba(34,211,238,.35)]"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">
          {editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
        </h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      <div className="space-y-4">
        <Field
          label="Nome completo"
          value={form.name}
          placeholder="João Silva"
          onChange={(value) => setForm({ ...form, name: value })}
        />

        <Field
          label="E-mail"
          value={form.email}
          placeholder="joao@email.com"
          onChange={(value) => setForm({ ...form, email: value })}
        />

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Função</span>
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
            className="h-10 w-full rounded-lg border border-white/10 bg-slate-700/40 px-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
          >
            <option>Administrador</option>
            <option>Corretor</option>
            <option>Proposta</option>
            <option>Função</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Status</span>
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as UserStatus })}
            className="h-10 w-full rounded-lg border border-white/10 bg-slate-700/40 px-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
          >
            <option>Online</option>
            <option>Offline</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
        >
          <Save size={17} />
          {editingUser ? "Salvar Alterações" : "Adicionar Usuário"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
          >
            <X size={17} />
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-white/10 bg-slate-700/40 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-400"
      />
    </label>
  );
}