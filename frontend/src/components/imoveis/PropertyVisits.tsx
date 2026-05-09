import {
  FileCheck2,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import type { VisitItem } from "../../types/property";

export function PropertyVisits({
  visits,
  onCreate,
  onEdit,
  onDelete,
}: {
  visits: VisitItem[];
  onCreate: () => void;
  onEdit: (item: VisitItem) => void;
  onDelete: (item: VisitItem) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="h-[315px] rounded-2xl border border-white/10 bg-[#101c2d]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Visitas
        </h3>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
        >
          <Plus size={14} />
          Nova
        </button>
      </div>

      {visits.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
          Nenhuma visita cadastrada.
        </div>
      ) : (
        <div className="max-h-[245px] space-y-1 overflow-y-auto pr-2 no-scrollbar">
          {visits.map((visit, index) => {
            const Icon = getVisitIcon(visit.title);

            return (
              <div
                key={visit.id}
                className="relative flex gap-3 py-1"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      visit.color === "emerald"
                        ? "bg-emerald-500/25 text-emerald-300"
                        : "bg-violet-500/25 text-violet-300"
                    }`}
                  >
                    <Icon size={17} />
                  </div>

                  {index !== visits.length - 1 && (
                    <div className="mt-1 h-7 w-px bg-white/10" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate text-[13px] font-medium text-slate-100">
                    {visit.title}
                  </p>

                  <p className="text-xs text-slate-400">
                    {visit.time}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === visit.id ? null : visit.id
                    )
                  }
                  className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <MoreHorizontal size={15} />
                </button>

                {openMenuId === visit.id && (
                  <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-white/10 bg-[#142438] p-1 shadow-2xl">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onEdit(visit);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                    >
                      <Pencil size={15} />
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onDelete(visit);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getVisitIcon(title: string) {
  if (title.toLowerCase().includes("contrato")) {
    return ScrollText;
  }

  if (title.toLowerCase().includes("validado")) {
    return FileCheck2;
  }

  return FileText;
}