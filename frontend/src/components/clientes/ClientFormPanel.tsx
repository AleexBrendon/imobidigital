import { useState, useEffect } from "react";
import type { ClientItem, ClientType, ClientStatus } from "../../types/client";

export function ClientFormPanel({
  editingClient,
  onSave,
  onCancel,
}: {
  editingClient: ClientItem | null;
  onSave: (data: Omit<ClientItem, "id" | "avatar">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Comprador" as ClientType,
    status: "Lead" as ClientStatus,
  });

  useEffect(() => {
    if (editingClient) {
      setForm(editingClient);
    }
  }, [editingClient]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="p-4 border border-cyan-400 rounded-xl">
      <h3 className="mb-4 text-lg font-semibold">
        {editingClient ? "Editar Cliente" : "Novo Cliente"}
      </h3>

      <input placeholder="Nome" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input placeholder="Telefone" value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <select
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value as ClientType })
        }
      >
        <option>Comprador</option>
        <option>Locador</option>
        <option>Locatário</option>
        <option>Investidor</option>
      </select>

      <select
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value as ClientStatus })
        }
      >
        <option>Ativo</option>
        <option>Inativo</option>
        <option>Lead</option>
      </select>

      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}