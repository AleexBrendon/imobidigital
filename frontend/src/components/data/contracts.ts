import type {
  ContractClause,
  ContractDetails,
  ContractDocument,
  SignatureEvent,
  SignatureStep,
} from "../../types/contract";

export const initialClauses: ContractClause[] = [
  { id: 1, title: "Contrato de Aluguel: Maria Lima vs. Rinal", status: "approved" },
  { id: 2, title: "Contrato de Venda: João Silva", status: "approved" },
  { id: 3, title: "Contrato de Locação: Carlos Lima", status: "approved" },
  { id: 4, title: "Contrato de Compra: Ana Souza", status: "pending" },
  { id: 5, title: "Contrato de Temporada: Pedro Santos", status: "pending" },
];

export const contractDetailsByClauseId: Record<number, ContractDetails> = {
  1: {
    title: "Contrato de Aluguel",
    startDate: "23/03/2023",
    endDate: "25/03/2023",
    value: "$5,000,00",
    aiValue: "$2:3,00",
    fee: "$39,00",
    property: "Apartamento Jardins",
    code: "Contrato Rini - 0719-2019",
    category: "Aluguel",
  },
  2: {
    title: "Contrato de Venda",
    startDate: "10/04/2023",
    endDate: "30/04/2023",
    value: "$850,000,00",
    aiValue: "$91,00",
    fee: "$120,00",
    property: "Casa Alphaville",
    code: "Contrato JOAO - 0832-2023",
    category: "Venda",
  },
  3: {
    title: "Contrato de Locação",
    startDate: "01/02/2023",
    endDate: "01/02/2024",
    value: "$3,200,00",
    aiValue: "$42,00",
    fee: "$80,00",
    property: "Apartamento Centro",
    code: "Contrato CARLOS - 0455-2023",
    category: "Locação",
  },
  4: {
    title: "Contrato de Compra",
    startDate: "15/05/2023",
    endDate: "20/06/2023",
    value: "$620,000,00",
    aiValue: "$76,00",
    fee: "$99,00",
    property: "Casa Jardim Europa",
    code: "Contrato ANA - 1001-2023",
    category: "Compra",
  },
  5: {
    title: "Contrato de Temporada",
    startDate: "05/07/2023",
    endDate: "20/07/2023",
    value: "$9,800,00",
    aiValue: "$18,00",
    fee: "$45,00",
    property: "Casa Praia",
    code: "Contrato PEDRO - 2040-2023",
    category: "Temporada",
  },
};

export const signatureStepsByClauseId: Record<number, SignatureStep[]> = {
  1: [
    { id: 1, label: "Locador", completed: true },
    { id: 2, label: "Locatário", completed: true },
    { id: 3, label: "Fiador", completed: true },
    { id: 4, label: "Testemunhas", completed: false },
  ],
  2: [
    { id: 1, label: "Vendedor", completed: true },
    { id: 2, label: "Comprador", completed: false },
    { id: 3, label: "Cartório", completed: false },
    { id: 4, label: "Testemunhas", completed: false },
  ],
  3: [
    { id: 1, label: "Locador", completed: true },
    { id: 2, label: "Locatário", completed: true },
    { id: 3, label: "Fiador", completed: true },
    { id: 4, label: "Testemunhas", completed: true },
  ],
  4: [
    { id: 1, label: "Vendedor", completed: true },
    { id: 2, label: "Comprador", completed: true },
    { id: 3, label: "Banco", completed: false },
    { id: 4, label: "Cartório", completed: false },
  ],
  5: [
    { id: 1, label: "Locador", completed: true },
    { id: 2, label: "Hóspede", completed: false },
    { id: 3, label: "Caução", completed: false },
    { id: 4, label: "Vistoria", completed: false },
  ],
};

export const signatureEventsByClauseId: Record<number, SignatureEvent[]> = {
  1: [
    { id: 1, time: "07:28-09:10", title: "Assinatura Locador", description: "2 hours ago · 12:00", completed: true },
    { id: 2, time: "08:07-12:00", title: "Assinatura Locatário", description: "2 hours ago · 12:00", completed: true },
    { id: 3, time: "09:07-13:00", title: "Assinatura Fiador", description: "2 hours ago · 12:00", completed: true },
    { id: 4, time: "12:03-20:00", title: "Assinatura Testemunha", description: "Pendente", completed: false },
  ],
  2: [
    { id: 1, time: "09:20-10:00", title: "Assinatura Vendedor", description: "1 hour ago · 09:20", completed: true },
    { id: 2, time: "10:10-11:00", title: "Assinatura Comprador", description: "Pendente", completed: false },
  ],
  3: [
    { id: 1, time: "08:00-08:30", title: "Assinatura Locador", description: "Finalizado", completed: true },
    { id: 2, time: "08:40-09:00", title: "Assinatura Locatário", description: "Finalizado", completed: true },
  ],
  4: [
    { id: 1, time: "11:00-11:30", title: "Assinatura Comprador", description: "Concluído", completed: true },
    { id: 2, time: "13:00-14:00", title: "Validação bancária", description: "Pendente", completed: false },
  ],
  5: [
    { id: 1, time: "15:00-15:30", title: "Reserva confirmada", description: "Concluído", completed: true },
    { id: 2, time: "16:00-17:00", title: "Assinatura hóspede", description: "Pendente", completed: false },
  ],
};

export const contractDocumentsByClauseId: Record<number, ContractDocument[]> = {
  1: [
    { id: 1, title: "Contrato assinado por Maria Souza", color: "violet" },
    { id: 2, title: "Documento validado: RG de Carlos Lima", color: "emerald" },
  ],
  2: [
    { id: 1, title: "Contrato de venda enviado", color: "violet" },
    { id: 2, title: "RG comprador validado por IA", color: "emerald" },
  ],
  3: [
    { id: 1, title: "Contrato final validado", color: "emerald" },
    { id: 2, title: "Laudo de vistoria validado", color: "emerald" },
  ],
  4: [
    { id: 1, title: "Comprovante bancário pendente", color: "violet" },
    { id: 2, title: "Documento comprador validado", color: "emerald" },
  ],
  5: [
    { id: 1, title: "Documento de reserva enviado", color: "violet" },
    { id: 2, title: "Caução aguardando validação", color: "violet" },
  ],
};