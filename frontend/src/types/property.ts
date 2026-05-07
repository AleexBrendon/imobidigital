export type PropertyStatus =
  | "Disponível"
  | "Reservado"
  | "Alugado"
  | "Vendido"
  | "Inativo";

export type PropertyType =
  | "Casa"
  | "Apartamento"
  | "Terreno"
  | "Comercial"
  | "Rural";

export type NegotiationItem = {
  id: number;
  propertyId: number;
  clientId: number | null;
  name: string;
  stage: string;
  progress: number;
  status: string;
  color: "cyan" | "red";
};

export type VisitItem = {
  id: number;
  propertyId: number;
  clientId: number | null;
  title: string;
  description?: string | null;
  scheduledAt?: string | null;
  status: string;
  time: string;
  color: "emerald" | "violet";
};

export type PropertyItem = {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  price: string;
  area: string;
  bedrooms: number;
  parkingSpaces: number;
  type: PropertyType;
  status: PropertyStatus;
  images: string[];
  ownerName?: string;
  latitude?: number;
  longitude?: number;

  negotiations?: NegotiationItem[];
  visits?: VisitItem[];
};