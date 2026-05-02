import { ChevronLeft, ChevronRight, Heart, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { PropertyItem } from "../../types/property";

export function PropertyGallery({ property }: { property: PropertyItem }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);

  function nextImage() {
    setSelectedImage((current) =>
      current === property.images.length - 1 ? 0 : current + 1
    );
  }

  function prevImage() {
    setSelectedImage((current) =>
      current === 0 ? property.images.length - 1 : current - 1
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Detalhes do Imóvel: {property.title}
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFavorite((current) => !current)}
            className={`rounded-lg border px-3 py-2 transition ${
              favorite
                ? "border-red-400 bg-red-500/10 text-red-400"
                : "border-white/10 text-slate-400 hover:bg-white/5"
            }`}
          >
            <Heart size={18} fill={favorite ? "currentColor" : "none"} />
          </button>

          <MoreHorizontal size={22} className="text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-6">
        <div>
          <div className="relative grid grid-cols-3 gap-4">
            {property.images.slice(0, 3).map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-xl border text-left transition ${
                  selectedImage === index
                    ? "border-cyan-400 shadow-[0_0_22px_rgba(34,211,238,.55)]"
                    : "border-white/10"
                }`}
              >
                <img
                  src={image}
                  className="h-[310px] w-full object-cover transition hover:scale-105"
                />
              </button>
            ))}

            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="mt-5 flex gap-3">
            {property.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-xl border transition ${
                  selectedImage === index
                    ? "border-2 border-cyan-400 shadow-[0_0_22px_rgba(34,211,238,.65)]"
                    : "border-white/10"
                }`}
              >
                <img src={image} className="h-[105px] w-[128px] object-cover" />
              </button>
            ))}
          </div>
        </div>

        <PropertyInfo property={property} />
      </div>
    </div>
  );
}

function PropertyInfo({ property }: { property: PropertyItem }) {
  return (
    <div className="space-y-4">
      <InfoCard title="Área" value={property.area} />
      <div className="grid grid-cols-2 gap-4">
        <InfoCard title="Quartos" value={String(property.bedrooms)} />
        <InfoCard title="Vagas" value={String(property.parkingSpaces)} />
      </div>
      <InfoCard title="Preço" value={property.price} highlight />
    </div>
  );
}

function InfoCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-[#0f1b2c] p-4 ${
        highlight
          ? "border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,.55)]"
          : "border-white/10"
      }`}
    >
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}