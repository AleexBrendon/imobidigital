import type { ClientItem } from "../../types/client";
import { ClientRow } from "./ClientRow";

export function ClientTable({
  clients,
  selectedClientId,
  onSelect,
  onEdit,
  onDelete,
}: {
  clients: ClientItem[];
  selectedClientId: number | null;
  onSelect: (client: ClientItem) => void;
  onEdit: (client: ClientItem) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid grid-cols-[1.5fr_1.3fr_1.2fr_1.1fr_.8fr_.7fr_.45fr] items-center rounded-lg bg-slate-700/40 px-3 py-3 text-sm text-slate-300">
        <span>Nome Completo</span>
        <span>E-mail</span>
        <span>Telefone</span>
        <span>Documento</span>
        <span>Tipo</span>
        <span>Status</span>
        <span>Ações</span>
      </div>

      <div className="mt-2 space-y-1">
        {clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            active={selectedClientId === client.id}
            onSelect={() => onSelect(client)}
            onEdit={() => onEdit(client)}
            onDelete={() => onDelete(client.id)}
          />
        ))}
      </div>
    </div>
  );
}