import { Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { matchesSearch } from "../utils/search";
import { useToast } from "../contexts/ToastContext";
import { getClients } from "../services/clients";
import { DocumentCard } from "../components/documentos/DocumentCard";
import { DocumentEditModal } from "../components/documentos/DocumentEditModal";
import { DocumentAddModal } from "../components/documentos/DocumentAddModal";
import { DocumentPreviewPanel } from "../components/documentos/DocumentPreviewPanel";
import {
  DocumentFilters,
  type DocumentTypeFilter,
} from "../components/documentos/DocumentFilters";
import {
  deleteDocument,
  getDocuments,
  updateDocument,
  uploadDocument,
} from "../services/documents";
import type { DocumentItem } from "../types/document";
import { ConfirmDeleteModal } from "../components/ui/ConfirmDeleteModal";

export function Documents() {
  useToast();
  const toast = useToast();

  const [documentToDelete, setDocumentToDelete] = useState<DocumentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [clientOptions, setClientOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [addingDocument, setAddingDocument] = useState(false);

  const [typeFilter, setTypeFilter] = useState<DocumentTypeFilter>("Todos");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [loading, setLoading] = useState(false);

  async function loadDocuments() {
    setLoading(true);

    try {
      const data = await getDocuments({
        type: typeFilter !== "Todos" ? typeFilter : undefined,
      });

      setDocuments(data);

      setSelectedDocument((current) => {
        if (!current) return data[0] ?? null;

        return data.find((document: DocumentItem) => document.id === current.id) ?? data[0] ?? null;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
    loadClients();
  }, [typeFilter]);

  const clients = useMemo(() => {
    return Array.from(
      new Set(
        documents
          .map((document) => document.client)
          .filter(Boolean)
      )
    );
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesClient =
        clientFilter === "Todos" || document.client === clientFilter;

      const matchesGlobalSearch = matchesSearch(document, search);

      return matchesClient && matchesGlobalSearch;
    });
  }, [documents, clientFilter, search]);

  async function handleCreateDocument(data: {
    name: string;
    type: string;
    status: string;
    client_id: number | null;
    validation_date: string;
    expiration_date: string;
    file: File;
  }) {
    const formData = new FormData();

    formData.append("file", data.file);
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("status", data.status);

    if (data.client_id) {
      formData.append("client_id", String(data.client_id));
    }

    if (data.validation_date) {
      formData.append("validation_date", data.validation_date);
    }

    if (data.expiration_date) {
      formData.append("expiration_date", data.expiration_date);
    }

    const newDocument = await uploadDocument(formData);

    setDocuments((prev) => [newDocument, ...prev]);
    setSelectedDocument(newDocument);
  }

  function handleDelete(document: DocumentItem) {
    setDocumentToDelete(document);
  }

  async function confirmDeleteDocument() {
    if (!documentToDelete) return;

    try {
      setDeleting(true);

      await deleteDocument(documentToDelete.id);

      setDocuments((prev) => {
        const updated = prev.filter(
          (document) => document.id !== documentToDelete.id
        );

        setSelectedDocument(updated[0] ?? null);

        return updated;
      });

      toast.info(`Documento ${documentToDelete.name} foi excluído com sucesso.`);

      setDocumentToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir documento.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdateDocument(data: {
    name: string;
    status: string;
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
    setEditingDocument(null);
  }

  async function loadClients() {
    const data = await getClients();

    setClientOptions(
      data.map((client: any) => ({
        id: client.id,
        name: client.name,
      }))
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
      <section className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Repositório Central de Documentos
          </h2>

          <button
            type="button"
            onClick={() => setAddingDocument(true)}
            className="flex h-10 items-center gap-2 rounded-lg bg-cyan-500 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            <Upload size={17} />
            Adicionar documento
          </button>
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
          onDelete={() => handleDelete(selectedDocument)}
          onEdit={() => setEditingDocument(selectedDocument)}
        />
      )}

      {addingDocument && (
        <DocumentAddModal
          clients={clientOptions}
          onClose={() => setAddingDocument(false)}
          onSubmit={handleCreateDocument}
        />
      )}

      {editingDocument && (
        <DocumentEditModal
          document={editingDocument}
          clients={clientOptions}
          onClose={() => setEditingDocument(null)}
          onSubmit={handleUpdateDocument}
        />
      )}

      <ConfirmDeleteModal
        open={!!documentToDelete}
        itemName={documentToDelete?.name}
        title="Excluir documento"
        description="Tem certeza que deseja excluir este documento? Essa ação não poderá ser desfeita."
        loading={deleting}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={confirmDeleteDocument}
      />
    </div>
  );
}