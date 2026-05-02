export type ClientType = "Comprador" | "Locador" | "Locatário" | "Investidor";

export type ClientStatus = "Ativo" | "Inativo" | "Lead";

export type ClientItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: ClientType;
  status: ClientStatus;
  avatar: number;
};