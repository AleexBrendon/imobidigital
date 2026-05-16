import { X } from "lucide-react";
import { useState } from "react";

type ClientOption = {
  id: number;
  name: string;
};

type Props = {
  clients: ClientOption[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: string;
    status: string;
    client_id: number | null;
    validation_date: string;
    expiration_date: string;
    file: File;
  }) => Promise<void>;
};

export function DocumentAddModal({ clients, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [clientId, setClientId] = useState("");
  const [validationDate, setValidationDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!file) {
      alert("Selecione um arquivo.");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        name,
        type,
        status,
        client_id: clientId ? Number(clientId) : null,
        validation_date: validationDate,
        expiration_date: expirationDate,
        file,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101c2d] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Adicionar documento
            </h2>
            <p className="text-sm text-slate-400">
              Preencha os dados do documento antes do envio.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Arquivo</span>
            <input
              type="file"
              required
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-slate-300"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-slate-300">Nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-slate-300">Tipo</span>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              placeholder="CPF, Contrato, Escritura..."
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-slate-300">Cliente</span>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="">Sem cliente vinculado</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm text-slate-300">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="validated">Validado</option>
              <option value="expiring">Expirado</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm text-slate-300">
              Data de validação
            </span>
            <input
              type="date"
              value={validationDate}
              onChange={(e) => setValidationDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-slate-300">
              Data de expiração
            </span>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b1626] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Adicionar documento"}
          </button>
        </div>
      </form>
    </div>
  );
}