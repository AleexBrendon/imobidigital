import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrencyBR } from "../../utils/format";

type ContractFormData = {
  client_id: number | null;
  property_id: number | null;
  title: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  value: string;
  ai_value: string;
  fee: string;
  code: string;
};

const emptyForm: ContractFormData = {
  client_id: null,
  property_id: null,
  title: "",
  type: "Aluguel",
  status: "Pendente",
  start_date: "",
  end_date: "",
  value: "",
  ai_value: "",
  fee: "",
  code: "",
};

export function ContractFormModal({
  editingContract,
  clients,
  properties,
  onSave,
  onClose,
}: {
  editingContract: any | null;
  clients: any[];
  properties: any[];
  onSave: (data: ContractFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ContractFormData>(emptyForm);

  useEffect(() => {
    if (editingContract) {
      setForm({
        client_id: editingContract.client_id ?? null,
        property_id: editingContract.property_id ?? null,
        title: editingContract.title ?? "",
        type: editingContract.type ?? "Aluguel",
        status: editingContract.status ?? "Pendente",
        start_date: editingContract.start_date ?? "",
        end_date: editingContract.end_date ?? "",
        value: formatCurrencyBR(String(editingContract.value ?? "")),
        ai_value: formatCurrencyBR(String(editingContract.ai_value ?? "")),
        fee: formatCurrencyBR(String(editingContract.fee ?? "")),
        code: editingContract.code ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingContract]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Preencha o título do contrato.");
      return;
    }

    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-2xl border border-cyan-400/70 bg-[#101c2d] p-5 shadow-[0_0_28px_rgba(34,211,238,.35)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">
              {editingContract ? "Editar Contrato" : "Adicionar Contrato"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Vincule cliente, imóvel e valores do contrato.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Título"
            value={form.title}
            placeholder="Contrato de locação"
            onChange={(value) => setForm({ ...form, title: value })}
          />

          <Field
            label="Código"
            value={form.code}
            placeholder="CTR-001"
            onChange={(value) => setForm({ ...form, code: value })}
          />

          <Select
            label="Cliente"
            value={String(form.client_id ?? "")}
            onChange={(value) =>
              setForm({ ...form, client_id: value ? Number(value) : null })
            }
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>

          <Select
            label="Imóvel"
            value={String(form.property_id ?? "")}
            onChange={(value) =>
              setForm({ ...form, property_id: value ? Number(value) : null })
            }
          >
            <option value="">Selecione um imóvel</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </Select>

          <Select
            label="Tipo"
            value={form.type}
            onChange={(value) => setForm({ ...form, type: value })}
          >
            <option>Aluguel</option>
            <option>Venda</option>
            <option>Administração</option>
          </Select>

          <Select
            label="Status"
            value={form.status}
            onChange={(value) => setForm({ ...form, status: value })}
          >
            <option>Pendente</option>
            <option>Ativo</option>
            <option>Finalizado</option>
            <option>Cancelado</option>
          </Select>

          <Field
            label="Data inicial"
            type="date"
            value={form.start_date}
            onChange={(value) => setForm({ ...form, start_date: value })}
          />

          <Field
            label="Data final"
            type="date"
            value={form.end_date}
            onChange={(value) => setForm({ ...form, end_date: value })}
          />

          <Field
            label="Valor"
            value={form.value}
            placeholder="R$ 2.500,00"
            onChange={(value) =>
              setForm({ ...form, value: formatCurrencyBR(value) })
            }
          />

          <Field
            label="Taxa"
            value={form.fee}
            placeholder="R$ 250,00"
            onChange={(value) =>
              setForm({ ...form, fee: formatCurrencyBR(value) })
            }
          />

          <Field
            label="Valor IA"
            value={form.ai_value}
            placeholder="R$ 0,00"
            onChange={(value) =>
              setForm({ ...form, ai_value: formatCurrencyBR(value) })
            }
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            <Save size={17} />
            {editingContract ? "Salvar Alterações" : "Adicionar Contrato"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
          >
            <X size={17} />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-white/10 bg-slate-700/40 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-400"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-white/10 bg-slate-700/40 px-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
      >
        {children}
      </select>
    </label>
  );
}