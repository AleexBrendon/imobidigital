import { FileCheck2, FileText, Filter, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { ContractDocument } from "../../types/contract";

export function ContractDocumentsPanel({
  documents,
}: {
  documents: ContractDocument[];
}) {
  const [onlyValidated, setOnlyValidated] = useState(false);

  const visibleDocuments = onlyValidated
    ? documents.filter((item) => item.color === "emerald")
    : documents;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Central de Documentos</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">Validaded por IA</span>

        <button
          onClick={() => setOnlyValidated((current) => !current)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ${
            onlyValidated
              ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
              : "border-white/10 text-slate-400 hover:bg-white/5"
          }`}
        >
          <Filter size={15} />
          Filtra
        </button>
      </div>

      <div className="max-h-[260px] space-y-3 overflow-auto no-scrollbar">
        {visibleDocuments.map((item, index) => {
          const Icon = item.color === "emerald" ? FileCheck2 : FileText;

          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    item.color === "emerald"
                      ? "bg-emerald-500/30 text-emerald-300"
                      : "bg-violet-500/30 text-violet-300"
                  }`}
                >
                  <Icon size={19} />
                </div>

                {index !== visibleDocuments.length - 1 && (
                  <div className="mt-2 h-8 w-px bg-white/10" />
                )}
              </div>

              <div>
                <p className="font-medium text-slate-100">{item.title}</p>
                <p className="text-sm text-slate-400">2 hours ago · 12:00</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}