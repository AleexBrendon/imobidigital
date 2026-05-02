import { ChevronDown, MapPin, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export function PropertyMap() {
  const [filter, setFilter] = useState("Apartamento Jardins");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Visitado do Imóvel</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      <div className="mb-3 flex items-center gap-3 text-sm text-slate-400">
        <span>Filtros:</span>

        <button className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-200 hover:bg-white/5">
          Tipo
        </button>

        <button
          onClick={() =>
            setFilter((current) =>
              current === "Apartamento Jardins" ? "Casa Alphaville" : "Apartamento Jardins"
            )
          }
          className="flex flex-1 items-center justify-between rounded-lg border border-white/10 px-3 py-1.5 text-slate-200 hover:bg-white/5"
        >
          {filter}
          <ChevronDown size={15} />
        </button>
      </div>

      <div className="relative h-[245px] overflow-hidden rounded-xl border border-white/10 bg-[#102033]">
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(30deg,rgba(148,163,184,.16)_1px,transparent_1px),linear-gradient(120deg,rgba(148,163,184,.14)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute left-8 top-16 h-24 w-72 rotate-[-18deg] rounded-full border-4 border-slate-500/40" />
        <div className="absolute bottom-8 left-20 h-20 w-64 rotate-[12deg] rounded-full border-4 border-slate-500/30" />
        <MapPin className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-blue-500 text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,.8)]" size={56} />
        <span className="absolute bottom-3 left-3 text-xl font-semibold">Google</span>
      </div>
    </div>
  );
}