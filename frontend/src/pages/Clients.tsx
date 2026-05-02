import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { initialClients } from "../components/data/clients";
import { ClientActivityPanel } from "../components/clientes/ClientActivityPanel";
import { ClientFilters } from "../components/clientes/ClientFilters";
import { ClientFormPanel } from "../components/clientes/ClientFormPanel";
import { ClientTable } from "../components/clientes/ClientTable";

import type { ClientItem } from "../types/client";

type Filter = "all" | "comprador" | "locador" | "locatario";

export function Clients() {
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredClients = useMemo(() => {
    if (filter === "comprador") {
      return clients.filter((client) => client.type === "Comprador");
    }

    if (filter === "locador") {
      return clients.filter((client) => client.type === "Locador");
    }

    if (filter === "locatario") {
      return clients.filter((client) => client.type === "Locatário");
    }

    return clients;
  }, [clients, filter]);

  function saveClient(data: Omit<ClientItem, "id" | "avatar">) {
    if (editingClient) {
      setClients((current) =>
        current.map((client) =>
          client.id === editingClient.id ? { ...client, ...data } : client
        )
      );

      setEditingClient(null);
      setShowForm(false);
      return;
    }

    const newClient: ClientItem = {
      id: Date.now(),
      avatar: Math.floor(Math.random() * 50) + 1,
      ...data,
    };

    setClients((current) => [newClient, ...current]);
    setSelectedClientId(newClient.id);
    setShowForm(false);
  }

  function deleteClient(id: number) {
    const confirmDelete = confirm("Deseja excluir este cliente?");

    if (!confirmDelete) return;

    setClients((current) => current.filter((client) => client.id !== id));

    if (selectedClientId === id) {
      setSelectedClientId(null);
    }

    if (editingClient?.id === id) {
      setEditingClient(null);
      setShowForm(false);
    }
  }

  function openCreateForm() {
    setEditingClient(null);
    setSelectedClientId(null);
    setShowForm(true);
  }

  function openEditForm(client: ClientItem) {
    setEditingClient(client);
    setSelectedClientId(client.id);
    setShowForm(true);
  }

  function closeForm() {
    setEditingClient(null);
    setShowForm(false);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_430px] gap-5">
      <section className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Gerenciamento de Clientes</h2>

            <div className="mt-4">
              <ClientFilters activeFilter={filter} onChange={setFilter} />
            </div>
          </div>

          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            <Plus size={17} />
            Adicionar Cliente
          </button>
        </div>

        <ClientTable
          clients={filteredClients}
          selectedClientId={selectedClientId}
          onSelect={(client) => setSelectedClientId(client.id)}
          onEdit={openEditForm}
          onDelete={deleteClient}
        />
      </section>

      <aside className="space-y-5">
        <ClientActivityPanel />

        {showForm && (
          <ClientFormPanel
            editingClient={editingClient}
            onSave={saveClient}
            onCancel={closeForm}
          />
        )}
      </aside>
    </div>
  );
}