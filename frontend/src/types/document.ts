export type DocumentType = "PDF" | "DOCX" | "Imagem";

export type DocumentStatus =
  | "Validado por IA"
  | "Pendente"
  | "Expirando"
  | "Expira em 10 dias"
  | "Expira em 1 dia";

export type DocumentItem = {
  id: number;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  client: string;
  validationDate: string;
  expirationDate: string;
};

export type DocumentValidation = {
  id: number;
  text: string;
  time: string;
  color: "violet" | "emerald";
};