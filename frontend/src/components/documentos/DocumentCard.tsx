import { FileImage, FileText } from "lucide-react";
import type { DocumentItem } from "../../types/document";

export function DocumentCard({
  document,
  active,
  onClick,
}: {
  document: DocumentItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border bg-[#142438] p-2 transition hover:-translate-y-0.5 hover:bg-[#182b43] ${
        active
          ? "border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,.45)]"
          : "border-white/10"
      }`}
    >
      <DocumentIcon type={document.type} />

      <div className="mt-3">
        <StatusBadge status={document.status} />
      </div>
    </button>
  );
}

export function DocumentIcon({
  type,
  large = false,
}: {
  type: DocumentItem["type"];
  large?: boolean;
}) {
  const isPdf = type === "PDF";
  const isImage = type === "Imagem";

  return (
    <div
      className={`relative mx-auto flex items-end justify-center rounded-t-md bg-slate-100 pb-2 text-white shadow-lg ${
        large ? "h-48 w-36" : "h-24 w-16"
      }`}
    >
      <div className="absolute right-0 top-0 h-0 w-0 border-l-[24px] border-t-[24px] border-l-slate-300 border-t-[#142438]" />

      {isImage ? (
        <div className="flex flex-col items-center">
          <FileImage className="mb-1 text-slate-500" size={large ? 52 : 30} />
          <span className="rounded bg-emerald-500 px-2 py-1 text-xs font-bold">
            IMG
          </span>
        </div>
      ) : (
        <>
          <FileText
            className={`absolute top-7 ${
              isPdf ? "text-red-500" : "text-slate-400"
            }`}
            size={large ? 62 : 34}
          />

          <span
            className={`rounded px-2 py-1 text-sm font-bold ${
              isPdf ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {type}
          </span>
        </>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: DocumentItem["status"] }) {
  const labels: Record<DocumentItem["status"], string> = {
    pending: "Pendente",
    validated: "Validado",
    expiring: "Expirando",
    expired: "Vencido",
  };

  const styles: Record<DocumentItem["status"], string> = {
    pending: "bg-yellow-500/20 text-yellow-300",
    validated: "bg-emerald-500/20 text-emerald-300",
    expiring: "bg-orange-500/20 text-orange-300",
    expired: "bg-red-500/20 text-red-300",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}