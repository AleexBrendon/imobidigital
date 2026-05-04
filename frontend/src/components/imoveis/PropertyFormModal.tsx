import { ImagePlus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  PropertyItem,
  PropertyStatus,
  PropertyType,
} from "../../types/property";
import { formatCurrencyBR } from "../../utils/format";

type PropertyFormData = Omit<PropertyItem, "id" | "images"> & {
  images: File[];
};

const emptyForm: PropertyFormData = {
  title: "",
  address: "",
  city: "",
  state: "",
  price: "",
  area: "",
  bedrooms: 0,
  parkingSpaces: 0,
  type: "Apartamento",
  status: "Disponível",
  images: [],
  ownerName: "",
};

export function PropertyFormModal({
  editingProperty,
  onSave,
  onClose,
}: {
  editingProperty: PropertyItem | null;
  onSave: (data: PropertyFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PropertyFormData>(emptyForm);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (editingProperty) {
      setForm({
        title: editingProperty.title,
        address: editingProperty.address,
        city: editingProperty.city,
        state: editingProperty.state,
        price: editingProperty.price,
        area: editingProperty.area,
        bedrooms: editingProperty.bedrooms,
        parkingSpaces: editingProperty.parkingSpaces,
        type: editingProperty.type,
        status: editingProperty.status,
        images: [],
        ownerName: editingProperty.ownerName ?? "",
      });

      setPreviewImages(editingProperty.images ?? []);
    } else {
      setForm(emptyForm);
      setPreviewImages([]);
    }
  }, [editingProperty]);

  function handleImagesChange(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);

    setForm({ ...form, images: selectedFiles });

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim() || !form.address.trim() || !form.price.trim()) {
      alert("Preencha título, endereço e preço.");
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
              {editingProperty ? "Editar Imóvel" : "Adicionar Imóvel"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Preencha os dados principais do imóvel.
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
            placeholder="Apartamento Jardins"
            onChange={(value) => setForm({ ...form, title: value })}
          />

          <Field
            label="Preço"
            value={form.price}
            placeholder="R$ 450.000,00"
            onChange={(value) =>
              setForm({ ...form, price: formatCurrencyBR(value) })
            }
          />

          <Field
            label="Endereço"
            value={form.address}
            placeholder="Rua das Flores, 123"
            onChange={(value) => setForm({ ...form, address: value })}
          />

          <Field
            label="Cidade"
            value={form.city}
            placeholder="São Paulo"
            onChange={(value) => setForm({ ...form, city: value })}
          />

          <Field
            label="Estado"
            value={form.state}
            placeholder="SP"
            onChange={(value) => setForm({ ...form, state: value })}
          />

          <Field
            label="Área"
            value={form.area}
            placeholder="120 m²"
            onChange={(value) => setForm({ ...form, area: value })}
          />

          <Field
            label="Quartos"
            type="number"
            value={String(form.bedrooms)}
            onChange={(value) =>
              setForm({ ...form, bedrooms: Number(value) })
            }
          />

          <Field
            label="Vagas"
            type="number"
            value={String(form.parkingSpaces)}
            onChange={(value) =>
              setForm({ ...form, parkingSpaces: Number(value) })
            }
          />

          <SelectField
            label="Tipo"
            value={form.type}
            onChange={(value) =>
              setForm({ ...form, type: value as PropertyType })
            }
            options={["Apartamento", "Casa", "Terreno", "Comercial", "Rural"]}
          />

          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) =>
              setForm({ ...form, status: value as PropertyStatus })
            }
            options={[
              "Disponível",
              "Reservado",
              "Alugado",
              "Vendido",
              "Inativo",
            ]}
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Imagens do imóvel
          </span>

          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-700/30 px-4 py-6 text-center transition hover:border-cyan-400 hover:bg-cyan-400/5">
            <ImagePlus size={28} className="mb-2 text-cyan-300" />

            <p className="text-sm font-medium text-slate-200">
              Clique para importar imagens
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Você pode selecionar várias imagens
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => handleImagesChange(event.target.files)}
              className="absolute opacity-0"
            />
          </div>
        </label>

        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {previewImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-lg border border-white/10"
              >
                <img
                  src={image}
                  className="h-20 w-full object-cover"
                  alt={`Imagem ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            <Save size={17} />
            {editingProperty ? "Salvar Alterações" : "Adicionar Imóvel"}
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

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
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
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}