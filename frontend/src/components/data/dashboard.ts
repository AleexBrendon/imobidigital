export const columns = [
  { id: "prospeccao", title: "Prospecção" },
  { id: "visita", title: "Visita" },
  { id: "proposta", title: "Proposta" },
  { id: "fechamento", title: "Fechamento", highlight: true },
];

export const initialKanbanData = {
  prospeccao: [
    { id: 1, name: "João Silva", tag: "Status", avatar: 12 },
    { id: 2, name: "Maria Lima", tag: "Proposta", avatar: 47 },
  ],
  visita: [
    { id: 3, name: "Carlos Lima", tag: "Visita", avatar: 14 },
  ],
  proposta: [
    { id: 4, name: "Ana Souza", tag: "Proposta", avatar: 32 },
    { id: 5, name: "Pedro Santos", tag: "Status", avatar: 15 },
  ],
  fechamento: [
    { id: 6, name: "Juliana Costa", tag: "Fechamento", avatar: 16 },
  ],
};

export const propertyImages = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400",
];

export const activities = [
  "Contrato assinado por Maria Souza",
  "Documento validado: RG de Carlos Lima",
  "Documento validado: Dr. Maria Souza",
];

export const documents = [
  { type: "PDF", status: "Validado por IA", color: "emerald" },
  { type: "DOCX", status: "Pendente", color: "yellow" },
  { type: "DOCX", status: "Expira em 10 dias", color: "red" },
];