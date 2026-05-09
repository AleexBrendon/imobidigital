import { FileCheck2, FileText } from "lucide-react";
import type { ContractDocument } from "../../types/contract";

export function ContractDocumentsPanel({
  documents,
}: {
  documents: ContractDocument[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5">
      <h3 className="mb-5 text-xl font-semibold">Documentos</h3>

      <div className="max-h-[245px] space-y-3 overflow-y-auto pr-2 no-scrollbar">
        {documents.map((doc) => {
          const isValid =
            doc.status === "Autenticado em Cartório";

          const Icon = isValid ? FileCheck2 : FileText;

          return (
            <div key={doc.id} className="flex gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isValid
                    ? "bg-emerald-500/30 text-emerald-300"
                    : "bg-violet-500/30 text-violet-300"
                }`}
              >
                <Icon size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-100">
                  {doc.title}
                </p>
                <p className="text-xs text-slate-400">
                  {doc.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}