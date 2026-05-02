export type ClauseStatus = "approved" | "pending";

export type ContractClause = {
  id: number;
  title: string;
  status: ClauseStatus;
  expanded?: boolean;
};

export type ContractDetails = {
  title: string;
  startDate: string;
  endDate: string;
  value: string;
  aiValue: string;
  fee: string;
  property: string;
  code: string;
  category: string;
};

export type SignatureStep = {
  id: number;
  label: string;
  completed: boolean;
};

export type SignatureEvent = {
  id: number;
  time: string;
  title: string;
  description: string;
  completed: boolean;
};

export type ContractDocument = {
  id: number;
  title: string;
  color: "violet" | "emerald";
};

export type ContractItem = {
  id: number;
  title: string;
  client: string;
  status: "Ativo" | "Pendente" | "Finalizado";
  details: ContractDetails;
  clauses: ContractClause[];
  signatureSteps: SignatureStep[];
  signatureEvents: SignatureEvent[];
  documents: ContractDocument[];
};