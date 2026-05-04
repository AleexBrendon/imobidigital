import { ChevronDown, MapPin, MoreHorizontal } from "lucide-react";
import type { PropertyItem } from "../../types/property";

export function PropertyMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
}: {
  properties: PropertyItem[];
  selectedPropertyId: number;
  onSelectProperty: (id: number) => void;
}) {
  const selectedProperty =
    properties.find((property) => property.id === selectedPropertyId) ??
    properties[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Localização do Imóvel</h3>
        <MoreHorizontal size={22} className="text-slate-400" />
      </div>

      <div className="mb-3 flex items-center gap-3 text-sm text-slate-400">
        <span>Imóvel:</span>

        <div className="relative flex-1">
          <select
            value={selectedProperty.id}
            onChange={(event) => onSelectProperty(Number(event.target.value))}
            className="h-9 w-full appearance-none rounded-lg border border-white/10 bg-[#0f1b2c] px-3 pr-8 text-sm text-slate-200 outline-none focus:border-cyan-400"
          >
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <div className="mb-3 text-sm text-slate-400">
        {selectedProperty.address}, {selectedProperty.city} -{" "}
        {selectedProperty.state}
      </div>

      <div className="relative h-[245px] overflow-hidden rounded-xl border border-white/10 bg-[#102033]">
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(30deg,rgba(148,163,184,.16)_1px,transparent_1px),linear-gradient(120deg,rgba(148,163,184,.14)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute left-8 top-16 h-24 w-72 rotate-[-18deg] rounded-full border-4 border-slate-500/40" />
        <div className="absolute bottom-8 left-20 h-20 w-64 rotate-[12deg] rounded-full border-4 border-slate-500/30" />

        <MapPin
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-blue-500 text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,.8)]"
          size={56}
        />

        <span className="absolute bottom-3 left-3 text-xl font-semibold">
          Google
        </span>
      </div>
    </div>
  );
}