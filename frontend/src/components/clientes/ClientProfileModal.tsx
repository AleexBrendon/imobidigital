import { useState } from "react";
import { Building2, FileText, ScrollText, Timer, X } from "lucide-react";
import type { ClientItem } from "../../types/client";

type Tab = "info" | "activities" | "documents" | "contracts" | "properties";

type Props = {
  client: ClientItem | null;
  open: boolean;
  loading?: boolean;
  activities?: any[];
  documents?: any[];
  contracts?: any[];
  properties?: any[];
  onClose: () => void;
};

export function ClientProfileModal({
  client,
  open,
  loading = false,
  activities = [],
  documents = [],
  contracts = [],
  properties = [],
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  if (!open || !client) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 p-6">
      <div className="relative h-[88vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-cyan-400/40 bg-[#101c2d] shadow-[0_0_45px_rgba(34,211,238,.35)]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-lg bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="grid h-full grid-rows-[auto_1fr]">
          <header className="border-b border-white/10 p-6">
            <div className="flex gap-6">
              <div className="h-36 w-36 overflow-hidden rounded-2xl border border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,.35)]">
                <img
                  src={`https://i.pravatar.cc/220?img=${client.avatar}`}
                  alt={client.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-semibold text-white">
                  Perfil de Cliente: {client.name}
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-x-20 gap-y-2 text-sm text-slate-400">
                  <p>Tipo: <span className="text-white">{client.type}</span></p>
                  <p>Status: <span className="text-white">{client.status}</span></p>
                  <p>E-mail: <span className="text-cyan-300">{client.email || "Não informado"}</span></p>
                  <p>Telefone: <span className="text-white">{client.phone || "Não informado"}</span></p>
                </div>

                <div className="mt-6 flex gap-8 border-b border-white/10">
                  <TabButton active={activeTab === "info"} onClick={() => setActiveTab("info")}>
                    Informações
                  </TabButton>

                  <TabButton active={activeTab === "activities"} onClick={() => setActiveTab("activities")}>
                    Atividades
                  </TabButton>

                  <TabButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")}>
                    Documentos
                  </TabButton>

                  <TabButton active={activeTab === "contracts"} onClick={() => setActiveTab("contracts")}>
                    Contratos
                  </TabButton>

                  <TabButton active={activeTab === "properties"} onClick={() => setActiveTab("properties")}>
                    Imóveis
                  </TabButton>
                </div>
              </div>
            </div>
          </header>

          <main className="overflow-y-auto p-6 no-scrollbar">
            {loading ? (
              <Empty text="Carregando dados do cliente..." />
            ) : (
              <>
                {activeTab === "info" && (
                  <div className="grid grid-cols-2 gap-5">
                    <Card title="Informações Pessoais">
                      <Info label="Nome" value={client.name} />
                      <Info label="Tipo" value={client.type} />
                      <Info label="Status" value={client.status} />
                      <Info label="E-mail" value={client.email || "Não informado"} />
                      <Info label="Telefone" value={client.phone || "Não informado"} />
                    </Card>

                    <Card title="Resumo">
                      <Summary icon={Timer} label="Atividades" value={activities.length} />
                      <Summary icon={FileText} label="Documentos" value={documents.length} />
                      <Summary icon={ScrollText} label="Contratos" value={contracts.length} />
                      <Summary icon={Building2} label="Imóveis" value={properties.length} />
                    </Card>
                  </div>
                )}

                {activeTab === "activities" && (
                  <Card title="Notificações de Clientes">
                    {activities.length === 0 ? (
                      <Empty text="Nenhuma atividade registrada para este cliente." />
                    ) : (
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="font-medium text-white">{activity.title}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              {activity.description || "Sem descrição."}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              Tipo: {activity.type} • {formatDate(activity.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {activeTab === "documents" && (
                  <Card title="Documentos">
                    {documents.length === 0 ? (
                      <Empty text="Nenhum documento vinculado a este cliente." />
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {documents.map((doc) => (
                          <div key={doc.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <FileText className="mb-3 text-cyan-300" />
                            <p className="font-medium text-white">{doc.name}</p>
                            <p className="text-sm text-slate-400">{doc.type}</p>
                            <p className="mt-2 text-xs text-slate-500">{doc.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {activeTab === "contracts" && (
                  <Card title="Contratos">
                    {contracts.length === 0 ? (
                      <Empty text="Nenhum contrato vinculado a este cliente." />
                    ) : (
                      <div className="space-y-4">
                        {contracts.map((contract) => (
                          <div key={contract.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="font-medium text-white">{contract.title}</p>
                            <p className="text-sm text-slate-400">
                              {contract.type} • {contract.status}
                            </p>
                            <p className="mt-2 text-sm text-cyan-300">
                              {formatMoney(contract.value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {activeTab === "properties" && (
                  <Card title="Imóveis">
                    {properties.length === 0 ? (
                      <Empty text="Nenhum imóvel vinculado a este cliente." />
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {properties.map((property) => (
                          <div key={property.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="font-medium text-white">{property.title}</p>
                            <p className="text-sm text-slate-400">
                              {property.type} • {property.status}
                            </p>
                            <p className="text-sm text-slate-500">
                              {property.city}/{property.state}
                            </p>
                            <p className="mt-2 text-sm text-cyan-300">
                              {formatMoney(property.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "border-b-2 border-indigo-500 pb-3 text-sm font-medium text-indigo-300"
          : "pb-3 text-sm text-slate-400 hover:text-white"
      }
    >
      {children}
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-white/[0.03] p-5 shadow-[0_0_25px_rgba(34,211,238,.12)]">
      <h3 className="mb-5 text-xl font-semibold text-white">{title}</h3>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium text-slate-100">{value}</p>
    </div>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <Icon size={22} className="text-cyan-300" />
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Sem data";
  return new Date(value).toLocaleString("pt-BR");
}

function formatMoney(value?: number | string) {
  const number = Number(value ?? 0);

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}