import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Plus } from "lucide-react";

import { getDashboard } from "../services/dashboard";
import type { DashboardResponse } from "../types/dashboard";

import { ActivityPanel } from "../components/dashboard/ActivityPanel";
import { Card } from "../components/dashboard/Card";
import { ContractsPanel } from "../components/dashboard/ContractsPanel";
import { DocumentsPanel } from "../components/dashboard/DocumentsPanel";
import { KanbanColumn } from "../components/dashboard/KanbanColumn";
import { SignatureTimeline } from "../components/dashboard/SignatureTimeline";

import { updateNegotiationStage } from "../features/imoveis/services/propertyNegotiations";

const columns = [
  { id: "lead", title: "Lead" },
  { id: "ativo", title: "Ativo" },
  { id: "negociacao", title: "Negociação" },
  { id: "fechado", title: "Fechado" },
];

function columnToStage(columnId: string) {
  const map: Record<string, string> = {
    lead: "Lead",
    ativo: "Ativo",
    negociacao: "Proposta",
    fechado: "Fechamento",
  };

  return map[columnId] ?? "Lead";
}

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<any>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<"all" | "variacoes">("all");
  const [kanbanData, setKanbanData] = useState<Record<string, any[]>>({});

  async function loadDashboard() {
    try {
      setLoading(true);

      const data = await getDashboard();

      setDashboard(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeNegotiationId = Number(active.id);
    const targetColumnId = String(over.id);

    let sourceColumnId: string | null = null;
    let movedItem: any = null;

    for (const columnId of Object.keys(kanbanData)) {
      const item = kanbanData[columnId]?.find(
        (item) => item.id === activeNegotiationId
      );

      if (item) {
        sourceColumnId = columnId;
        movedItem = item;
        break;
      }
    }

    if (!sourceColumnId || !movedItem) return;
    if (sourceColumnId === targetColumnId) return;

    const newStage = columnToStage(targetColumnId);

    setKanbanData((current) => ({
      ...current,
      [sourceColumnId]:
        current[sourceColumnId]?.filter(
          (item) => item.id !== activeNegotiationId
        ) ?? [],
      [targetColumnId]: [
        {
          ...movedItem,
          stage: newStage,
          tag: newStage,
        },
        ...(current[targetColumnId] ?? []),
      ],
    }));

    try {
      await updateNegotiationStage(activeNegotiationId, newStage);
    } catch (error) {
      console.error(error);
      await loadDashboard();
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (dashboard?.kanban) {
      setKanbanData(dashboard.kanban);
    }

    if (dashboard?.signature_timeline && !selectedTimeline) {
      setSelectedTimeline(dashboard.signature_timeline);
    }
  }, [dashboard, selectedTimeline]);

  const filteredKanban = Object.fromEntries(
    Object.entries(kanbanData).map(([key, clients]) => [
      key,
      filter === "all"
        ? clients
        : clients.filter((client) => client.tag === "Proposta"),
    ])
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Carregando painel...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-5">
      <section className="space-y-5">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Painel de Clientes</h2>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    filter === "all"
                      ? "bg-indigo-600 text-white"
                      : "border border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  Todos Clientes
                </button>

                <button
                  onClick={() => setFilter("variacoes")}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    filter === "variacoes"
                      ? "bg-indigo-600 text-white"
                      : "border border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  Propostas
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:bg-white/5"
              >
                Filtro
              </button>

              {showFilter && (
                <div className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400">
                  Filtro ativo
                </div>
              )}

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium shadow-lg shadow-indigo-600/30"
              >
                <Plus size={16} />
                Novo
              </button>
            </div>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-4 gap-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  clients={filteredKanban[column.id] ?? []}
                  selectedClientId={selectedClientId}
                  onSelectClient={(client) => {
                    setSelectedClientId(client.id);
                    setSelectedTimeline(
                      client.signature_timeline ??
                        dashboard?.signature_timeline ??
                        null
                    );
                  }}
                />
              ))}
            </div>
          </DndContext>
        </Card>

        <div className="grid grid-cols-2 gap-5">
          <DocumentsPanel
            documents={dashboard?.documents ?? []}
            title="Últimos Documentos"
          />

          <ContractsPanel contracts={dashboard?.contracts ?? []} />
        </div>
      </section>

      <aside className="space-y-5">
        <ActivityPanel activities={dashboard?.activities ?? []} />

        <DocumentsPanel
          title="Central de Documentos"
          documents={dashboard?.documents ?? []}
        />

        <SignatureTimeline timeline={selectedTimeline} />
      </aside>
    </div>
  );
}