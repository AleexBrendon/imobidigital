import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NegotiationItem } from "../../../types/property";
import type {
  ClientOption,
  NegotiationPayload,
} from "../services/propertyRelations";

export function PropertyNegotiationModal({
  open,
  clients,
  editingItem,
  onClose,
  onSubmit,
}: {
  open: boolean;
  clients: ClientOption[];
  editingItem?: NegotiationItem | null;
  onClose: () => void;
  onSubmit: (data: NegotiationPayload) => Promise<void>;
}) {
  const [clientId, setClientId] = useState("");
  const [stage, setStage] = useState("Prospecção");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ativo");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setClientId(editingItem?.clientId ? String(editingItem.clientId) : "");
    setStage(editingItem?.stage ?? "Prospecção");
    setProgress(editingItem?.progress ?? 0);
    setStatus(editingItem?.status ?? "Ativo");
  }, [editingItem, open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        client_id: clientId ? Number(clientId) : null,
        stage,
        progress,
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
        <Header title={editingItem ? "Editar negociação" : "Nova negociação"} onClose={onClose} />

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

          <Field label="Etapa">
            <input
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            />
          </Field>

          <Field label="Progresso (%)">
            <input
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            />
          </Field>

          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-white outline-none"
            >
              <option>Ativo</option>
              <option>Fechado</option>
              <option>Perdido</option>
            </select>
          </Field>
        </div>

        <Actions loading={loading} onClose={onClose} />
      </form>
    </div>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
        <X size={20} />
      </button>
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

function Actions({ loading, onClose }: { loading: boolean; onClose: () => void }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
        Cancelar
      </button>
      <button type="submit" disabled={loading} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}