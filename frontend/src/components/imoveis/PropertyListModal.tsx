import { Edit3, Plus, Trash2, X } from "lucide-react";
import type { PropertyItem } from "../../types/property";

export function PropertyListModal({
  properties,
  selectedPropertyId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: {
  properties: PropertyItem[];
  selectedPropertyId: number | null;
  onSelect: (property: PropertyItem) => void;
  onAdd: () => void;
  onEdit: (property: PropertyItem) => void;
  onDelete: (property: PropertyItem) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-[#101c2d] p-5 shadow-[0_20px_70px_rgba(0,0,0,.45)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Listagem de Imóveis</h3>
            <p className="mt-1 text-sm text-slate-400">
              Gerencie, edite ou exclua imóveis cadastrados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAdd}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              <Plus size={17} />
              Adicionar Imóvel
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1.4fr_1fr_.8fr_.7fr_.7fr_.5fr] border-b border-white/10 px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Imóvel</span>
          <span>Localização</span>
          <span>Tipo</span>
          <span>Status</span>
          <span>Preço</span>
          <span>Ações</span>
        </div>

        <div className="max-h-[520px] space-y-2 overflow-auto pt-3 no-scrollbar">
          {properties.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">
              Nenhum imóvel cadastrado.
            </div>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                onClick={() => onSelect(property)}
                className={`grid cursor-pointer grid-cols-[1.4fr_1fr_.8fr_.7fr_.7fr_.5fr] items-center rounded-lg px-3 py-3 text-sm transition ${
                  selectedPropertyId === property.id
                    ? "border border-cyan-400 bg-cyan-400/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-300">
                    {property.title.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-100">
                      {property.title}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {property.area} · {property.bedrooms} quartos
                    </p>
                  </div>
                </div>

                <span className="truncate text-slate-300">
                  {property.city} - {property.state}
                </span>

                <span className="text-slate-300">{property.type}</span>

                <span
                  className={`text-xs ${
                    property.status === "Disponível"
                      ? "text-emerald-400"
                      : property.status === "Reservado"
                      ? "text-yellow-400"
                      : property.status === "Vendido" ||
                        property.status === "Alugado"
                      ? "text-cyan-400"
                      : "text-red-400"
                  }`}
                >
                  {property.status}
                </span>

                <span className="text-slate-300">{property.price}</span>

                <div className="flex gap-2">
                  <Edit3
                    size={16}
                    className="cursor-pointer text-slate-400 transition hover:text-cyan-400"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(property);
                    }}
                  />

                  <Trash2
                    size={16}
                    className="cursor-pointer text-slate-400 transition hover:text-red-400"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(property);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}