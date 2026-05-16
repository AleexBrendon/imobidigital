import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { DocumentItem } from "../../types/document";

type ClientOption = {
  id: number;
  name: string;
};

type StatusOption = "validated" | "expiring";

export function DocumentEditModal({
  document,
  clients,
  onClose,
  onSubmit,
}: {
  document: DocumentItem;
  clients: ClientOption[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    status: StatusOption;
    client_id: number | null;
    validation_date: string;
    expiration_date: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(document.name);
  const [status, setStatus] = useState<StatusOption>(
    normalizeStatus(document.status)
  );

  const [clientId, setClientId] = useState<string>(
    document.client_id ? String(document.client_id) : ""
  );

  const [validationDate, setValidationDate] = useState(
    document.validationDate ?? ""
  );

  const [expirationDate, setExpirationDate] = useState(
    document.expirationDate ?? ""
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(document.name);
    setStatus(normalizeStatus(document.status));
    setClientId(document.client_id ? String(document.client_id) : "");
    setValidationDate(document.validationDate ?? "");
    setExpirationDate(document.expirationDate ?? "");
  }, [document]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);

    try {
      await onSubmit({
        name,
        status,
        client_id: clientId ? Number(clientId) : null,
        validation_date: validationDate,
        expiration_date: expirationDate,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101c2d] p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            Editar documento
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Nome do documento">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-sm text-white outline-none"
              required
            />
          </Field>

          <Field label="Cliente">
            <select
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-sm text-white outline-none"
            >
              <option value="">Sem cliente vinculado</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusOption)
              }
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-sm text-white outline-none"
            >
              <option value="validated">Validado</option>
              <option value="expiring">Expirado</option>
            </select>
          </Field>

          <Field label="Data de validação">
            <input
              type="date"
              value={validationDate}
              onChange={(event) => setValidationDate(event.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-sm text-white outline-none"
            />
          </Field>

          <Field label="Data de vencimento">
            <input
              type="date"
              value={expirationDate}
              onChange={(event) => setExpirationDate(event.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#142438] px-3 text-sm text-white outline-none"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

function normalizeStatus(status: string): StatusOption {
  if (status === "expiring") {
    return "expiring";
  }

  return "validated";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      {children}
    </label>
  );
}