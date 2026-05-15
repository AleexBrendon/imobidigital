import { Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { matchesSearch } from "../utils/search";
import { DocumentCard } from "../components/documentos/DocumentCard";
import { DocumentEditModal } from "../components/documentos/DocumentEditModal";
import {
  DocumentFilters,
  type DocumentTypeFilter,
} from "../components/documentos/DocumentFilters";
import { DocumentPreviewPanel } from "../components/documentos/DocumentPreviewPanel";
import {
  deleteDocument,
  getDocuments,
  updateDocument,
  uploadDocument,
} from "../services/documents";
import type { DocumentItem } from "../types/document";

export function Documents() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null
  );
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(
    null
  );
  const [typeFilter, setTypeFilter] = useState<DocumentTypeFilter>("Todos");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadDocuments() {
    setLoading(true);

    try {
      const data = await getDocuments({
        type: typeFilter !== "Todos" ? typeFilter : undefined,
      });

      setDocuments(data);

      setSelectedDocument((current) => {
        if (!current) return data[0] ?? null;

        return (
          data.find((document: { id: number; }) => document.id === current.id) ??
          data[0] ??
          null
        );
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [typeFilter]);

  const clients = useMemo(() => {
    return Array.from(new Set(documents.map((document) => document.client)));
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesClient =
        clientFilter === "Todos" || document.client === clientFilter;

      const matchesGlobalSearch = matchesSearch(document, search);

      return matchesClient && matchesGlobalSearch;
    });
  }, [documents, clientFilter, search]);

  async function handleUpload(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const newDocument = await uploadDocument(formData);

      setDocuments((prev) => [newDocument, ...prev]);
      setSelectedDocument(newDocument);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = confirm("Deseja remover este documento?");

    if (!confirmed) return;

    await deleteDocument(id);

    setDocuments((prev) => {
      const updated = prev.filter((document) => document.id !== id);
      setSelectedDocument(updated[0] ?? null);
      return updated;
    });
  }

  async function handleUpdateDocument(data: {
    name: string;
    client_id: number | null;
    validation_date: string;
    expiration_date: string;
  }) {
    if (!editingDocument) return;

    const updatedDocument = await updateDocument(editingDocument.id, data);

    setDocuments((prev) =>
      prev.map((document) =>
        document.id === updatedDocument.id ? updatedDocument : document
      )
    );

    setSelectedDocument(updatedDocument);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
      <section className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Repositório Central de Documentos
          </h2>

          <div className="flex items-center gap-3">
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-cyan-500 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
              <Upload size={17} />
              {uploading ? "Enviando..." : "Enviar documento"}

              <input
                type="file"
                className="hidden"
                disabled={uploading}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    handleUpload(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <DocumentFilters
          type={typeFilter}
          client={clientFilter}
          clients={clients}
          onTypeChange={setTypeFilter}
          onClientChange={setClientFilter}
        />

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Carregando documentos...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            Nenhum documento encontrado.
          </div>
        ) : (
          <div className="grid max-h-[calc(100vh-245px)] grid-cols-6 gap-3 overflow-y-auto pr-1 no-scrollbar">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                active={selectedDocument?.id === document.id}
                onClick={() => setSelectedDocument(document)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedDocument && (
        <DocumentPreviewPanel
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDelete={() => handleDelete(selectedDocument.id)}
          onEdit={() => setEditingDocument(selectedDocument)}
        />
      )}

      {editingDocument && (
        <DocumentEditModal
          document={editingDocument}
          onClose={() => setEditingDocument(null)}
          onSubmit={handleUpdateDocument}
        />
      )}
    </div>
  );
}