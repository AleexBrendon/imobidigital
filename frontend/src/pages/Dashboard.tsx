import { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { ActivityPanel } from "../components/dashboard/ActivityPanel";
import { Card } from "../components/dashboard/Card";
import { ContractsPanel } from "../components/dashboard/ContractsPanel";
import { DocumentsPanel } from "../components/dashboard/DocumentsPanel";
import { KanbanColumn } from "../components/dashboard/KanbanColumn";
import { SignatureTimeline } from "../components/dashboard/SignatureTimeline";
import { columns, initialKanbanData } from "../components/data/dashboard";

export function Dashboard() {
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState<"all" | "variacoes">("all");
    const [kanbanData, setKanbanData] = useState(initialKanbanData);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeClientId = Number(active.id);
        const targetColumnId = String(over.id);

        let sourceColumnId: string | null = null;
        let movedClient = null;

        for (const columnId of Object.keys(kanbanData)) {
            const client = kanbanData[columnId as keyof typeof kanbanData].find(
                (item) => item.id === activeClientId
            );

            if (client) {
                sourceColumnId = columnId;
                movedClient = client;
                break;
            }
        }

        if (!sourceColumnId || !movedClient) return;
        if (sourceColumnId === targetColumnId) return;

        setKanbanData((current) => ({
            ...current,
            [sourceColumnId]: current[sourceColumnId as keyof typeof current].filter(
                (client) => client.id !== activeClientId
            ),
            [targetColumnId]: [
                ...current[targetColumnId as keyof typeof current],
                movedClient,
            ],
        }));
    }
    const filteredKanban = Object.fromEntries(
        Object.entries(kanbanData).map(([key, clients]) => [
            key,
            filter === "all"
                ? clients
                : clients.filter((c) => c.tag === "Proposta"),
        ])
    );
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
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${filter === "all"
                                        ? "bg-indigo-600 text-white"
                                        : "border border-white/10 text-slate-400 hover:bg-white/5"
                                        }`}
                                >
                                    All Clientes
                                </button>

                                <button
                                    onClick={() => setFilter("variacoes")}
                                    className={`rounded-lg px-3 py-1.5 text-sm ${filter === "variacoes"
                                        ? "bg-indigo-600 text-white"
                                        : "border border-white/10 text-slate-400 hover:bg-white/5"
                                        }`}
                                >
                                    Variações
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    const newClient = {
                                        id: Date.now(),
                                        name: "Novo Cliente",
                                        tag: "Status",
                                        avatar: Math.floor(Math.random() * 50),
                                    };

                                    setKanbanData((current) => ({
                                        ...current,
                                        prospeccao: [newClient, ...current.prospeccao],
                                    }));
                                }}
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium shadow-lg shadow-indigo-600/30"
                            >
                                <Plus size={16} />
                                Compensar
                            </button>

                            <button
                                onClick={() => setShowFilter((prev) => !prev)}
                                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:bg-white/5"
                            >
                                Filtro
                            </button>
                            {showFilter && (
                                <div className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
                                    <p className="text-slate-400">Filtro ativo (exemplo)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DndContext onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-4 gap-4">
                            {columns.map((column) => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    clients={filteredKanban[column.id as keyof typeof filteredKanban]}
                                    onSelectClient={(client) => console.log("cliente clicado", client)}
                                />
                            ))}
                        </div>
                    </DndContext>
                </Card>

                <div className="grid grid-cols-2 gap-5">
                    <DocumentsPanel title="Últimos Documentos" repeat />
                    <ContractsPanel />
                </div>
            </section>

            <aside className="space-y-5">
                <ActivityPanel />
                <DocumentsPanel />
                <SignatureTimeline />
            </aside>
        </div>
    );
}