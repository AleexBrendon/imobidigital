import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { DocumentCard } from "../components/documentos/DocumentCard";
import {
  DocumentFilters,
  type DocumentTypeFilter,
} from "../components/documentos/DocumentFilters";
import { DocumentPreviewPanel } from "../components/documentos/DocumentPreviewPanel";
import { initialDocuments } from "../components/data/documents";
import type { DocumentItem } from "../types/document";

export function Documents() {
  const [documents] = useState<DocumentItem[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    initialDocuments[0]
  );
  const [typeFilter, setTypeFilter] = useState<DocumentTypeFilter>("Todos");
  const [clientFilter, setClientFilter] = useState("Todos");

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchType =
        typeFilter === "Todos" || document.type === typeFilter;

      const matchClient =
        clientFilter === "Todos" || document.client === clientFilter;

      return matchType && matchClient;
    });
  }, [documents, typeFilter, clientFilter]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
      <section className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Repositório Central de Documentos
          </h2>

          <MoreHorizontal size={22} className="text-slate-400" />
        </div>

        <DocumentFilters
          type={typeFilter}
          client={clientFilter}
          onTypeChange={setTypeFilter}
          onClientChange={setClientFilter}
        />

        <div className="grid max-h-[calc(100vh-245px)] grid-cols-6 gap-3 overflow-auto pr-1 no-scrollbar">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              active={selectedDocument?.id === document.id}
              onClick={() => setSelectedDocument(document)}
            />
          ))}
        </div>
      </section>

      {selectedDocument && (
        <DocumentPreviewPanel
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}