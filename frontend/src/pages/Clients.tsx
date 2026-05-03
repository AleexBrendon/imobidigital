import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ClientActivityPanel,
  type ClientActivity,
  type ClientActivityType,
} from "../components/clientes/ClientActivityPanel";

import { ClientFilters } from "../components/clientes/ClientFilters";
import { ClientFormPanel } from "../components/clientes/ClientFormPanel";
import { ClientTable } from "../components/clientes/ClientTable";

import type { ClientItem } from "../types/client";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
  type ClientPayload,
} from "../services/clients";

type Filter = "all" | "comprador" | "locador" | "locatario" | "investidor";

function normalizeClient(client: any): ClientItem {
  return {
    id: client.id,
    name: client.name,
    email: client.email ?? "",
    phone: client.phone ?? "",
    type: client.type,
    status: client.status,
    avatar: client.avatar ?? Math.floor(Math.random() * 50) + 1,
  };
}

function createActivity(
  text: string,
  type: ClientActivityType
): ClientActivity {
  return {
    id: crypto.randomUUID(),
    text,
    type,
    date: new Date().toLocaleString("pt-BR"),
  };
}

export function Clients() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ClientActivity[]>([]);

  function addActivity(text: string, type: ClientActivityType) {
    setActivities((prev) => [createActivity(text, type), ...prev]);
  }

  async function loadClients() {
    try {
      setLoading(true);

      const data = await getClients();

      setClients(data.map(normalizeClient));
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

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

    if (filter === "investidor") {
      return clients.filter((client) => client.type === "Investidor");
    }

    return clients;
  }, [clients, filter]);

  async function saveClient(data: Omit<ClientItem, "id" | "avatar">) {
    try {
      const payload: ClientPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        status: data.status,
      };

      if (editingClient) {
        const updated = await updateClient(editingClient.id, payload);
        const normalized = normalizeClient(updated);

        setClients((current) =>
          current.map((client) =>
            client.id === editingClient.id
              ? {
                  ...client,
                  ...normalized,
                  avatar: client.avatar,
                }
              : client
          )
        );

        addActivity(`Cliente atualizado: ${normalized.name}`, "updated");

        setEditingClient(null);
        setShowForm(false);
        return;
      }

      const created = await createClient(payload);
      const normalized = normalizeClient(created);

      setClients((current) => [normalized, ...current]);
      setSelectedClientId(normalized.id);
      setShowForm(false);

      addActivity(`Novo cliente cadastrado: ${normalized.name}`, "created");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar cliente.");
    }
  }

  async function handleDeleteClient(id: number) {
    const clientToDelete = clients.find((client) => client.id === id);

    const confirmDelete = confirm("Deseja excluir este cliente?");

    if (!confirmDelete) return;

    try {
      await deleteClient(id);

      setClients((current) => current.filter((client) => client.id !== id));

      if (clientToDelete) {
        addActivity(`Cliente removido: ${clientToDelete.name}`, "deleted");
      }

      if (selectedClientId === id) {
        setSelectedClientId(null);
      }

      if (editingClient?.id === id) {
        setEditingClient(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir cliente.");
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
            <h2 className="text-2xl font-semibold">
              Gerenciamento de Clientes
            </h2>

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

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">
            Carregando clientes...
          </div>
        ) : (
          <ClientTable
            clients={filteredClients}
            selectedClientId={selectedClientId}
            onSelect={(client) => setSelectedClientId(client.id)}
            onEdit={openEditForm}
            onDelete={handleDeleteClient}
          />
        )}
      </section>

      <aside className="space-y-5">
        <ClientActivityPanel activities={activities} />

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