import { AlertTriangle, X, Trash2 } from "lucide-react";

type ConfirmDeleteModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  open,
  title = "Confirmar exclusão",
  description = "Essa ação não poderá ser desfeita.",
  itemName,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101c2d] p-5 shadow-[0_18px_45px_rgba(0,0,0,.45)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-300">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                {title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {description}
              </p>

              {itemName && (
                <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200">
                  {itemName}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}