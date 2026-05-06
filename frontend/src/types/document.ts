export type DocumentType = "PDF" | "DOCX" | "Imagem" | "Arquivo";

export type DocumentStatus = "pending" | "validated" | "expiring" | "expired";

export type DocumentItem = {
  id: number;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  client: string;
  client_id: number | null;
  validationDate: string;
  expirationDate: string;
  filePath: string;
  mimeType: string;
  size: number;
};