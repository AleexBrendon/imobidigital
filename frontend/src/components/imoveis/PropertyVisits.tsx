import { FileText, MoreHorizontal, ScrollText } from "lucide-react";
import { useState } from "react";
import type { VisitItem } from "../../types/property";

export function PropertyVisits({ visits }: { visits: VisitItem[] }) {
  const [onlyDocuments, setOnlyDocuments] = useState(false);

  const filtered = onlyDocuments
    ? visits.filter((visit) => visit.title.includes("Documento"))
    : visits;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Visitas</h3>

        <button onClick={() => setOnlyDocuments((current) => !current)}>
          <MoreHorizontal size={22} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setOnlyDocuments((current) => !current)}
          className={`rounded-lg px-3 py-1.5 text-xs ${
            onlyDocuments
              ? "bg-indigo-600 text-white"
              : "border border-white/10 text-slate-400 hover:bg-white/5"
          }`}
        >
          {onlyDocuments ? "Mostrando documentos" : "Filtrar documentos"}
        </button>
      </div>

      <div className="max-h-[275px] space-y-2 overflow-auto no-scrollbar">
        {filtered.map((visit, index) => {
          const Icon = visit.title.includes("Contrato") ? ScrollText : FileText;

          return (
            <div key={visit.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    visit.color === "emerald"
                      ? "bg-emerald-500/30 text-emerald-300"
                      : "bg-violet-500/30 text-violet-300"
                  }`}
                >
                  <Icon size={19} />
                </div>

                {index !== filtered.length - 1 && (
                  <div className="mt-2 h-8 w-px bg-white/10" />
                )}
              </div>

              <div>
                <p className="font-medium text-slate-100">{visit.title}</p>
                <p className="text-sm text-slate-400">{visit.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}