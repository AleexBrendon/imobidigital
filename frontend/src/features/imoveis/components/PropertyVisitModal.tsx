import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { VisitItem } from "../../../types/property";
import type { ClientOption, VisitPayload } from "../services/propertyRelations";

export function PropertyVisitModal({
  open,
  clients,
  editingItem,
  onClose,
  onSubmit,
}: {
  open: boolean;
  clients: ClientOption[];
  editingItem?: VisitItem | null;
  onClose: () => void;
  onSubmit: (data: VisitPayload) => Promise<void>;
}) {
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [status, setStatus] = useState("Agendada");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setClientId(editingItem?.clientId ? String(editingItem.clientId) : "");
    setTitle(editingItem?.title ?? "");
    setDescription(editingItem?.description ?? "");
    setScheduledAt(editingItem?.scheduledAt?.slice(0, 16) ?? "");
    setStatus(editingItem?.status ?? "Agendada");
  }, [editingItem, open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        client_id: clientId ? Number(clientId) : null,
        title,
        description,
        scheduled_at: scheduledAt || null,
        status,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101c2d] p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {editingItem ? "Editar visita" : "Nova visita"}
          </h3>

          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Cliente">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            >
              <option value="">Sem cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Título">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[90px] w-full rounded-lg border border-white/10 bg-[#142438] px-3 py-3 text-white outline-none"
            />
          </Field>

          <Field label="Agendamento">
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            />
          </Field>

          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            >
              <option>Agendada</option>
              <option>Realizada</option>
              <option>Cancelada</option>
            </select>
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
            Cancelar
          </button>

          <button type="submit" disabled={loading} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}