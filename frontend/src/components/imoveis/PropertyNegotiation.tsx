import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { NegotiationItem } from "../../types/property";

export function PropertyNegotiation({
  negotiations,
}: {
  negotiations: NegotiationItem[];
}) {
  const [selectedId, setSelectedId] = useState<number | null>(
    negotiations[0]?.id ?? null
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Status da Negociação</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      {negotiations.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nenhuma negociação registrada.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-x-7 gap-y-4 border-t border-white/10 pt-5">
          {negotiations.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`flex items-center gap-3 rounded-lg border-b border-white/10 px-2 py-2 pb-4 text-left transition ${
                selectedId === item.id
                  ? "bg-cyan-400/10 shadow-[0_0_18px_rgba(34,211,238,.25)]"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-300">
                {item.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {item.name}
                  {item.stage && ` - ${item.stage}`}
                </p>

                <div className="mt-2 h-2 rounded-full bg-slate-700">
                  <div
                    className={`h-2 rounded-full ${
                      item.color === "red" ? "bg-red-400" : "bg-cyan-400"
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}