import { CalendarDays, ChevronDown } from "lucide-react";
import type { DocumentType } from "../../types/document";

export type DocumentTypeFilter = "Todos" | DocumentType;

export function DocumentFilters({
  type,
  client,
  clients,
  onTypeChange,
  onClientChange,
}: {
  type: DocumentTypeFilter;
  client: string;
  clients: string[];
  onTypeChange: (type: DocumentTypeFilter) => void;
  onClientChange: (client: string) => void;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 text-sm">
      <span className="text-slate-400">Filtros:</span>

      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as DocumentTypeFilter)}
        className="h-10 rounded-lg border border-white/10 bg-[#142438] px-3 text-slate-200 outline-none"
      >
        <option>Todos</option>
        <option>PDF</option>
        <option>DOCX</option>
        <option>Imagem</option>
        <option>Arquivo</option>
      </select>

      <button className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#142438] px-3 text-slate-200 hover:bg-white/5">
        <CalendarDays size={17} />
        Data de Validação
        <ChevronDown size={16} />
      </button>

      <select
        value={client}
        onChange={(e) => onClientChange(e.target.value)}
        className="h-10 rounded-lg border border-white/10 bg-[#142438] px-3 text-slate-200 outline-none"
      >
        <option>Todos</option>

        {clients.map((client) => (
          <option key={client}>{client}</option>
        ))}
      </select>
    </div>
  );
}