import type { DocumentItem, DocumentValidation } from "../../types/document";

export const initialDocuments: DocumentItem[] = [
  { id: 1, name: "Contrato Silva.pdf", type: "PDF", status: "Validado por IA", client: "Contrato Silva", validationDate: "03/03/2021", expirationDate: "07/03/2023" },
  { id: 2, name: "RG Carlos.docx", type: "DOCX", status: "Validado por IA", client: "Carlos Lima", validationDate: "04/03/2021", expirationDate: "08/03/2023" },
  { id: 3, name: "Imagem imóvel.png", type: "Imagem", status: "Pendente", client: "Maria Lima", validationDate: "05/03/2021", expirationDate: "09/03/2023" },
  { id: 4, name: "Comprovante.docx", type: "DOCX", status: "Pendente", client: "João Silva", validationDate: "06/03/2021", expirationDate: "10/03/2023" },
  { id: 5, name: "Contrato aluguel.docx", type: "DOCX", status: "Pendente", client: "Maria Souza", validationDate: "07/03/2021", expirationDate: "11/03/2023" },
  { id: 6, name: "Contrato final.pdf", type: "PDF", status: "Expira em 1 dia", client: "Contrato Silva", validationDate: "08/03/2021", expirationDate: "12/03/2023" },
  { id: 7, name: "Laudo.pdf", type: "PDF", status: "Validado por IA", client: "Carlos Lima", validationDate: "09/03/2021", expirationDate: "13/03/2023" },
  { id: 8, name: "Ficha.docx", type: "DOCX", status: "Validado por IA", client: "Maria Lima", validationDate: "10/03/2021", expirationDate: "14/03/2023" },
  { id: 9, name: "Documento.docx", type: "DOCX", status: "Pendente", client: "João Silva", validationDate: "11/03/2021", expirationDate: "15/03/2023" },
  { id: 10, name: "Anexo.docx", type: "DOCX", status: "Pendente", client: "Maria Souza", validationDate: "12/03/2021", expirationDate: "16/03/2023" },
  { id: 11, name: "Contrato vencendo.pdf", type: "PDF", status: "Expirando", client: "Contrato Silva", validationDate: "13/03/2021", expirationDate: "17/03/2023" },
  { id: 12, name: "Contrato urgência.docx", type: "DOCX", status: "Expira em 1 dia", client: "Carlos Lima", validationDate: "14/03/2021", expirationDate: "18/03/2023" },
  { id: 13, name: "RG frente.pdf", type: "PDF", status: "Validado por IA", client: "Maria Lima", validationDate: "15/03/2021", expirationDate: "19/03/2023" },
  { id: 14, name: "Fiador.pdf", type: "PDF", status: "Validado por IA", client: "João Silva", validationDate: "16/03/2021", expirationDate: "20/03/2023" },
  { id: 15, name: "Contrato assinado.pdf", type: "PDF", status: "Validado por IA", client: "Maria Souza", validationDate: "17/03/2021", expirationDate: "21/03/2023" },
  { id: 16, name: "Imagem vistoria.png", type: "Imagem", status: "Pendente", client: "Contrato Silva", validationDate: "18/03/2021", expirationDate: "22/03/2023" },
  { id: 17, name: "Imagem imóvel 2.png", type: "Imagem", status: "Expira em 10 dias", client: "Carlos Lima", validationDate: "19/03/2021", expirationDate: "23/03/2023" },
  { id: 18, name: "Imagem documento.png", type: "Imagem", status: "Expirando", client: "Maria Lima", validationDate: "20/03/2021", expirationDate: "24/03/2023" },
];

export const validations: DocumentValidation[] = [
  { id: 1, text: "Contrato assinado por Maria Souza", time: "2 hours ago · 12:00", color: "violet" },
  { id: 2, text: "Documento validado: RG de Carlos Lima", time: "2 hours ago · 12:00", color: "emerald" },
  { id: 3, text: "Documento validado: Dr. Maria Souza", time: "2 hours ago · 12:00", color: "violet" },
];