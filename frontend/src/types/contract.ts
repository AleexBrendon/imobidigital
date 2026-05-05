export type ContractClauseStatus = "approved" | "pending";

export type ContractClause = {
  id: number;
  title: string;
  description?: string;
  status: ContractClauseStatus;
  expanded: boolean;
  contractId?: number;
};

export type ContractDetails = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  value: string;
  fee: string;
  aiValue: string;
  property: string;
  code: string;
  category: string;
};

export type ContractDocument = {
  status: string;
  id: number;
  title: string;
  color: "emerald" | "violet";
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