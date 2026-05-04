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
};

export type NegotiationItem = {
  id: number;
  name: string;
  stage?: string;
  progress: number;
  color: "cyan" | "red";
};

export type VisitItem = {
  id: number;
  title: string;
  time: string;
  color: "emerald" | "violet";
};