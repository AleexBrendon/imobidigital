import type { PropertyItem } from "../../../types/property";

const defaultImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900",
];

export function normalizeProperty(property: any): PropertyItem {
  return {
    id: property.id,
    title: property.title ?? "Imóvel sem título",
    address: property.address ?? "",
    city: property.city ?? "",
    state: property.state ?? "",
    price: property.price ?? "R$ 0,00",
    area: property.area ?? "0 m²",
    bedrooms: Number(property.bedrooms ?? 0),
    parkingSpaces: Number(
      property.parkingSpaces ?? property.parking_spaces ?? 0
    ),
    type: property.type ?? "Apartamento",
    status: property.status ?? "Disponível",
    images: property.images?.length ? property.images : defaultImages,
    ownerName: property.ownerName ?? property.owner_name ?? "",
    latitude: Number(property.latitude ?? -23.55052),
    longitude: Number(property.longitude ?? -46.633308),

    negotiations: (property.negotiations ?? []).map((item: any) => ({
      id: item.id,
      propertyId: item.property_id,
      clientId: item.client_id,
      name: item.name ?? item.client?.name ?? "Cliente não informado",
      stage: item.stage ?? "Prospecção",
      progress: Number(item.progress ?? 0),
      status: item.status ?? "Ativo",
      color: item.color ?? (item.status === "Perdido" ? "red" : "cyan"),
    })),

    visits: (property.visits ?? []).map((item: any) => ({
      id: item.id,
      propertyId: item.property_id,
      clientId: item.client_id,
      title: item.title,
      description: item.description,
      scheduledAt: item.scheduled_at,
      status: item.status ?? "Agendada",
      time: item.time ?? "Sem data",
      color: item.color ?? (item.status === "Realizada" ? "emerald" : "violet"),
    })),
  };
}