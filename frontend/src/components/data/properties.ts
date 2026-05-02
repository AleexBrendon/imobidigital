import type { NegotiationItem, PropertyItem, VisitItem } from "../../types/property";

export const property: PropertyItem = {
  id: 1,
  title: "Apartamento Jardins",
  area: "270.6 m²",
  bedrooms: 3,
  parkingSpaces: 1,
  price: "R$ 550,00",
  images: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=900",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=900",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=900",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900",
  ],
};

export const negotiations: NegotiationItem[] = [
  { id: 1, name: "Maria Lima", stage: "Prospecção", avatar: 47, progress: 68, color: "cyan" },
  { id: 2, name: "Maria Lima", stage: "Prospecção", avatar: 47, progress: 76, color: "cyan" },
  { id: 3, name: "Maria Lima", stage: "Proposta", avatar: 47, progress: 86, color: "cyan" },
  { id: 4, name: "Maria Lima", stage: "Prospecção", avatar: 47, progress: 66, color: "cyan" },
  { id: 5, name: "Maria Lima", stage: "Proposta", avatar: 47, progress: 58, color: "cyan" },
  { id: 6, name: "Tendonate", stage: "", avatar: 12, progress: 52, color: "red" },
];

export const visits: VisitItem[] = [
  { id: 1, title: "Contrato assinado om Maria", time: "8 horas ago · 12:00", color: "violet" },
  { id: 2, title: "Contrato assinado om Vei", time: "3 hours ago · 12:00", color: "emerald" },
  { id: 3, title: "Documento validado: RG", time: "2 hours ago · 12:00", color: "violet" },
  { id: 4, title: "Documento validado: RG", time: "2 hours ago · 12:00", color: "violet" },
];