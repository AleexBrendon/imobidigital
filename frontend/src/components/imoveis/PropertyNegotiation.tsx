import {
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import type { NegotiationItem } from "../../types/property";

export function PropertyNegotiation({
  negotiations,
  onCreate,
  onEdit,
  onDelete,
}: {
  negotiations: NegotiationItem[];
  onCreate: () => void;
  onEdit: (item: NegotiationItem) => void;
  onDelete: (item: NegotiationItem) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="h-[165px] rounded-2xl border border-white/10 bg-[#101c2d]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Status da Negociação
        </h3>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
        >
          <Plus size={14} />
          Nova
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-5 gap-y-2 border-t border-white/10 pt-3">
        {negotiations.map((item) => (
          <div
            key={item.id}
            className="relative flex items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-white/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
              {item.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-100">
                {item.name} - {item.stage}
              </p>

              <div className="mt-1.5 h-1.5 rounded-full bg-slate-700/80">
                <div
                  className={`h-1.5 rounded-full ${
                    item.color === "red"
                      ? "bg-red-400"
                      : "bg-cyan-400"
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() =>
                setOpenMenuId(
                  openMenuId === item.id ? null : item.id
                )
              }
              className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <MoreHorizontal size={15} />
            </button>

            {openMenuId === item.id && (
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-white/10 bg-[#142438] p-1 shadow-2xl">
                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    onEdit(item);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                >
                  <Pencil size={15} />
                  Editar
                </button>

                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    onDelete(item);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}