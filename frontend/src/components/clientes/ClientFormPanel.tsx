import { Camera, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ClientItem } from "../../types/client";
import { formatPhone } from "../../utils/format.ts";

type FormDataState = {
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  image: File | null;
};

export function ClientFormPanel({
  open,
  editingClient,
  onSave,
  onClose,
}: {
  open: boolean;
  editingClient: ClientItem | null;
  onSave: (data: FormDataState) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormDataState>({
    name: "",
    email: "",
    phone: "",
    type: "Comprador",
    status: "Ativo",
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm({
      name: editingClient?.name ?? "",
      email: editingClient?.email ?? "",
      phone: editingClient?.phone ?? "",
      type: editingClient?.type ?? "Comprador",
      status: editingClient?.status ?? "Ativo",
      image: null,
    });

    setPreview(editingClient?.image_url ?? editingClient?.image ?? null);
  }, [open, editingClient]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  function handleImage(file: File | null) {
    setForm((prev) => ({ ...prev, image: file }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#101c2d] p-6 shadow-[0_30px_90px_rgba(0,0,0,.55)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {editingClient ? "Editar Cliente" : "Adicionar Cliente"}
            </h2>
            <p className="text-sm text-slate-400">
              Preencha os dados do cliente.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {preview ? (
                <img
                  src={preview}
                  alt={form.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera className="text-slate-400" size={28} />
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
              />
            </label>

            <div>
              <p className="text-sm font-medium text-white">
                Imagem do cliente
              </p>
              <p className="text-xs text-slate-400">
                JPG, PNG ou WEBP até 2MB.
              </p>
            </div>
          </div>

          <input
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nome"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            required
          />

          <input
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="E-mail"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
          />

          <input
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                phone: formatPhone(e.target.value),
              }))
            }
            placeholder="Telefone"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="rounded-xl border border-white/10 bg-[#0f1b2d] px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
            >
              <option>Comprador</option>
              <option>Locador</option>
              <option>Locatário</option>
              <option>Investidor</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="rounded-xl border border-white/10 bg-[#0f1b2d] px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
            >
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Pendente</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvando..." : editingClient ? "Salvar Alterações" : "Cadastrar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}