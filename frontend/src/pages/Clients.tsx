import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ClientActivityPanel,
  type ClientActivity,
} from "../components/clientes/ClientActivityPanel";

import { ClientFilters } from "../components/clientes/ClientFilters";
import { ClientFormPanel } from "../components/clientes/ClientFormPanel";
import { ClientTable } from "../components/clientes/ClientTable";
import { ClientProfileModal } from "../components/clientes/ClientProfileModal";

import type { ClientItem } from "../types/client";

import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
  type ClientPayload,
} from "../services/clients";

import { getActivities } from "../services/activities";

import {
  getClientActivities,
  getClientContracts,
  getClientDocuments,
  getClientProperties,
} from "../services/clientProfile";

import { useToast } from "../contexts/ToastContext";

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

export function Clients() {
  const toast = useToast();

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [profileClientId, setProfileClientId] = useState<number | null>(null);

  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState<ClientActivity[]>([]);

  const [clientActivities, setClientActivities] = useState<any[]>([]);
  const [clientDocuments, setClientDocuments] = useState<any[]>([]);
  const [clientContracts, setClientContracts] = useState<any[]>([]);
  const [clientProperties, setClientProperties] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

  async function loadClients() {
    try {
      setLoading(true);

      const [clientsData, activitiesData] = await Promise.all([
        getClients(),
        getActivities<ClientActivity>({
          subject_type: "App\\Models\\Client",
        }),
      ]);

      setClients(clientsData.map(normalizeClient));
      setActivities(activitiesData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  async function loadClientProfile(clientId: number) {
    try {
      setLoadingProfile(true);

      const [activitiesData, documentsData, contractsData, propertiesData] =
        await Promise.all([
          getClientActivities(clientId),
          getClientDocuments(clientId),
          getClientContracts(clientId),
          getClientProperties(clientId),
        ]);

      setClientActivities(activitiesData);
      setClientDocuments(documentsData);
      setClientContracts(contractsData);
      setClientProperties(propertiesData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do perfil do cliente.");
    } finally {
      setLoadingProfile(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (!profileClientId || showForm) return;

    loadClientProfile(profileClientId);
  }, [profileClientId, showForm]);

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

  const profileClient = useMemo(() => {
    return clients.find((client) => client.id === profileClientId) ?? null;
  }, [clients, profileClientId]);

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
        await updateClient(editingClient.id, payload);

        toast.success(`Cliente ${data.name} atualizado com sucesso.`);

        setEditingClient(null);
        setShowForm(false);
        setProfileClientId(null);

        await loadClients();
        return;
      }

      const created = await createClient(payload);
      const normalized = normalizeClient(created);

      toast.success(`Cliente ${normalized.name} cadastrado com sucesso.`);

      setSelectedClientId(normalized.id);
      setShowForm(false);
      setProfileClientId(null);

      await loadClients();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar cliente.");
    }
  }

  async function handleDeleteClient(id: number) {
    const client = clients.find((client) => client.id === id);

    const confirmDelete = confirm("Deseja excluir este cliente?");

    if (!confirmDelete) return;

    try {
      await deleteClient(id);

      toast.info(
        client
          ? `Cliente ${client.name} foi excluído.`
          : "Cliente excluído com sucesso."
      );

      if (selectedClientId === id) {
        setSelectedClientId(null);
      }

      if (profileClientId === id) {
        setProfileClientId(null);
      }

      if (editingClient?.id === id) {
        setEditingClient(null);
        setShowForm(false);
      }

      await loadClients();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir cliente.");
    }
  }

  function openCreateForm() {
    setEditingClient(null);
    setSelectedClientId(null);
    setProfileClientId(null);
    setShowForm(true);
  }

  function openEditForm(client: ClientItem) {
    setEditingClient(client);
    setSelectedClientId(client.id);
    setProfileClientId(null);
    setShowForm(true);
  }

  function openProfileModal(client: ClientItem) {
    setSelectedClientId(client.id);
    setEditingClient(null);
    setShowForm(false);
    setProfileClientId(client.id);
  }

  function closeForm() {
    setEditingClient(null);
    setShowForm(false);
  }

  function closeProfileModal() {
    setProfileClientId(null);
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
          <div className="max-h-[calc(100vh-245px)] overflow-y-auto pr-1 no-scrollbar">
            <ClientTable
              clients={filteredClients}
              selectedClientId={selectedClientId}
              onSelect={openProfileModal}
              onEdit={openEditForm}
              onDelete={handleDeleteClient}
            />
          </div>
        )}
      </section>

      <aside className="max-h-[calc(100vh-120px)] space-y-5 overflow-y-auto pr-2 no-scrollbar">
        <ClientActivityPanel activities={activities} />

        {showForm && (
          <ClientFormPanel
            editingClient={editingClient}
            onSave={saveClient}
            onCancel={closeForm}
          />
        )}
      </aside>

      <ClientProfileModal
        open={!!profileClient && !showForm}
        client={profileClient}
        loading={loadingProfile}
        activities={clientActivities}
        documents={clientDocuments}
        contracts={clientContracts}
        properties={clientProperties}
        onClose={closeProfileModal}
      />
    </div>
  );
}