import {
  ArrowLeft,
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { downloadDocumentBlob } from "../../services/documents";
import type { DocumentItem } from "../../types/document";
import { DocumentIcon, StatusBadge } from "./DocumentCard";
import { DocumentValidationList } from "./DocumentValidationList";

export function DocumentPreviewPanel({
  document,
  onClose,
  onDelete,
  onEdit,
}: {
  document: DocumentItem;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  async function handleView() {
    const blob = await downloadDocumentBlob(document.id);
    const fileUrl = URL.createObjectURL(blob);

    window.open(fileUrl, "_blank");
  }

  async function handleDownload() {
    const blob = await downloadDocumentBlob(document.id);
    const fileUrl = URL.createObjectURL(blob);

    const link = window.document.createElement("a");
    link.href = fileUrl;
    link.download = document.name;
    link.click();

    URL.revokeObjectURL(fileUrl);
  }

  return (
    <aside className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <MoreHorizontal size={22} />
          </button>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-cyan-400/70 bg-[#142438] p-6 shadow-[0_0_28px_rgba(34,211,238,.35)]">
        <DocumentIcon type={document.type} large />
      </div>

      <div className="mb-5 flex justify-center">
        <StatusBadge status={document.status} />
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <button
          onClick={handleView}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
        >
          <Eye size={17} />
          Ver
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5"
        >
          <Download size={17} />
          Baixar
        </button>

        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10"
        >
          <Trash2 size={17} />
          Excluir
        </button>
      </div>

      <div className="mb-6">
        <h4 className="mb-3 text-lg font-semibold">Metadata</h4>

        <div className="space-y-2 text-sm">
          <Meta label="Nome" value={document.name} />
          <Meta label="Tipo" value={document.type} />
          <Meta label="Data de Validação" value={document.validationDate} />
          <Meta label="Cliente" value={document.client} />
          <Meta label="Data de Vencimento" value={document.expirationDate} />
          <Meta
            label="Tamanho"
            value={`${(document.size / 1024).toFixed(2)} KB`}
          />
        </div>
      </div>

      <div className="mb-5 h-px bg-white/10" />

      <DocumentValidationList document={document} />
    </aside>
  );
}

function Meta({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="break-words text-slate-100">{value || "-"}</span>
    </div>
  );
}