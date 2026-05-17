export type ClientType = "Comprador" | "Locador" | "Locatário" | "Investidor";

export type ClientStatus = "Ativo" | "Inativo" | "Lead";

export type ClientItem = {
  document: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  avatar?: number;
  image?: string | null;
  image_url?: string | null;
};