import { CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

const toastStyle = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  },
  error: {
    icon: XCircle,
    className: "border-red-400/40 bg-red-500/10 text-red-300",
  },
  info: {
    icon: Info,
    className: "border-cyan-400/40 bg-cyan-500/10 text-cyan-300",
  },
};

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: (id: string) => void;
}) {
  const config = toastStyle[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={`flex min-w-[320px] max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur ${config.className}`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />

      <p className="flex-1 text-sm font-medium text-slate-100">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}