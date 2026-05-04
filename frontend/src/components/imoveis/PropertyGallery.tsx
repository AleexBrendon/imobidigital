import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";
import type { PropertyItem } from "../../types/property";

const fallbackImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900",
];

export function PropertyGallery({
  property,
  onOpenList,
}: {
  property: PropertyItem;
  onOpenList: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const images = property.images?.length ? property.images : fallbackImages;

  function openImageModal(index: number) {
    setSelectedImage(index);
    setShowImageModal(true);
  }

  function closeImageModal() {
    setShowImageModal(false);
  }

  function nextImage() {
    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  function prevImage() {
    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Detalhes do Imóvel: {property.title}
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFavorite((current) => !current)}
              className={`rounded-lg border px-3 py-2 transition ${
                favorite
                  ? "border-red-400 bg-red-500/10 text-red-400"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              <Heart size={18} fill={favorite ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={onOpenList}
              className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-6">
          <div>
            <div className="relative grid grid-cols-3 gap-4">
              {images.slice(0, 3).map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => openImageModal(index)}
                  className={`overflow-hidden rounded-xl border text-left transition ${
                    selectedImage === index
                      ? "border-cyan-400 shadow-[0_0_22px_rgba(34,211,238,.55)]"
                      : "border-white/10"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - imagem ${index + 1}`}
                    className="h-[310px] w-full object-cover transition hover:scale-105"
                  />
                </button>
              ))}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-thumb-${index}`}
                  onClick={() => openImageModal(index)}
                  className={`overflow-hidden rounded-xl border transition ${
                    selectedImage === index
                      ? "border-2 border-cyan-400 shadow-[0_0_22px_rgba(34,211,238,.65)]"
                      : "border-white/10"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - miniatura ${index + 1}`}
                    className="h-[105px] w-[128px] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <PropertyInfo property={property} />
        </div>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl rounded-2xl border border-white/10 bg-[#101c2d] p-5 shadow-[0_20px_70px_rgba(0,0,0,.55)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">
                  {property.title}
                </h3>
                <p className="text-sm text-slate-400">
                  Imagem {selectedImage + 1} de {images.length}
                </p>
              </div>

              <button
                type="button"
                onClick={closeImageModal}
                className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <img
                src={images[selectedImage]}
                alt={`${property.title} - imagem ampliada`}
                className="max-h-[70vh] w-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-3 overflow-auto pb-1 no-scrollbar">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-modal-thumb-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 overflow-hidden rounded-lg border transition ${
                    selectedImage === index
                      ? "border-2 border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.55)]"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - miniatura modal ${
                      index + 1
                    }`}
                    className="h-20 w-28 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
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

      <InfoCard title="Tipo" value={property.type} />
      <InfoCard title="Status" value={property.status} />
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