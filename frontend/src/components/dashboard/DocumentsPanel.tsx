import { Card } from "./Card";
import { DocumentCard } from "./DocumentCard";
import { SectionHeader } from "./SectionHeader";
import type { DashboardDocument } from "../../types/dashboard";

export function DocumentsPanel({
  title = "Central de Documentos",
  documents = [],
}: {
  title?: string;
  documents?: DashboardDocument[];
}) {
  return (
    <Card>
      <SectionHeader title={title} />

      {documents.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center text-sm text-slate-400">
          Nenhum documento encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </Card>
  );
}