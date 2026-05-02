import { ArrowLeft, Download, Eye, MoreHorizontal, X } from "lucide-react";
import type { DocumentItem } from "../../types/document";
import { DocumentIcon } from "./DocumentCard";
import { DocumentValidationList } from "./DocumentValidationList";

export function DocumentPreviewPanel({
  document,
  onClose,
}: {
  document: DocumentItem;
  onClose: () => void;
}) {
  function handleView() {
    alert(`Visualizando documento: ${document.name}`);
  }

  function handleDownload() {
    const content = `Documento: ${document.name}\nTipo: ${document.type}\nCliente: ${document.client}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.name.replace(/\s+/g, "-").toLowerCase();
    link.click();

    URL.revokeObjectURL(url);
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
          <MoreHorizontal size={22} className="text-slate-400" />
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

      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          onClick={handleView}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
        >
          <Eye size={17} />
          Visualizar
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5"
        >
          <Download size={17} />
          Baixar
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
        </div>
      </div>

      <div className="mb-5 h-px bg-white/10" />

      <DocumentValidationList />
    </aside>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100">{value}</span>
    </div>
  );
}