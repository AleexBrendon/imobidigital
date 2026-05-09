import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { PropertyItem } from "../../types/property";
import { geocodeAddress } from "../../features/imoveis/services/geocode";

import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function PropertyMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
}: {
  properties: PropertyItem[];
  selectedPropertyId: number;
  onSelectProperty: (id: number) => void;
}) {
  const selectedProperty =
    properties.find((property) => property.id === selectedPropertyId) ??
    properties[0];

  const latitude = Number(selectedProperty?.latitude ?? -23.55052);
  const longitude = Number(selectedProperty?.longitude ?? -46.633308);

  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  useEffect(() => {
    async function loadPosition() {
      const fullAddress = [
        selectedProperty?.address,
        selectedProperty?.city,
        selectedProperty?.state,
        "Brasil",
      ]
        .filter(Boolean)
        .join(", ");

      if (!fullAddress.trim()) {
        setPosition([latitude, longitude]);
        return;
      }

      const result = await geocodeAddress(fullAddress);

      if (result) {
        setPosition([result.latitude, result.longitude]);
      } else {
        setPosition([latitude, longitude]);
      }
    }

    loadPosition();
  }, [selectedProperty?.id]);

  if (!selectedProperty) return null;

  return (
    <div className="relative z-0 h-[292px] rounded-2xl border border-white/10 bg-[#101c2d]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Localização do Imóvel
        </h3>
      </div>

      <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
        <span>Filtros:</span>

        <div className="relative flex-1">
          <select
            value={selectedProperty.id}
            onChange={(event) => onSelectProperty(Number(event.target.value))}
            className="h-8 w-full appearance-none rounded-lg border border-white/10 bg-[#142438] px-3 pr-8 text-xs text-slate-200 outline-none focus:border-cyan-400"
          >
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.type} - {property.title}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <div className="relative z-0 h-[190px] overflow-hidden rounded-xl border border-white/10 bg-[#102033]">
        <MapContainer
          key={`${position[0]}-${position[1]}-${selectedProperty.id}`}
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          className="relative z-0 h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position} icon={markerIcon}>
            <Popup>
              <strong>{selectedProperty.title}</strong>
              <br />
              {selectedProperty.address}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}