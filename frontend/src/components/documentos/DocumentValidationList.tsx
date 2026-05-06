import { FileCheck2, FileClock, FileWarning } from "lucide-react";
import type { DocumentItem } from "../../types/document";

export function DocumentValidationList({
  document,
}: {
  document: DocumentItem;
}) {
  const validations = [
    {
      id: 1,
      text: "Documento enviado para o repositório",
      time: document.validationDate,
      color: "emerald",
      icon: FileCheck2,
    },
    {
      id: 2,
      text: getValidationText(document.status),
      time: document.expirationDate,
      color: document.status === "expired" ? "red" : "violet",
      icon: document.status === "expired" ? FileWarning : FileClock,
    },
  ];

  return (
    <div>
      <h4 className="mb-4 text-lg font-semibold">Validações</h4>

      <div className="space-y-3">
        {validations.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    item.color === "emerald"
                      ? "bg-emerald-500/30 text-emerald-300"
                      : item.color === "red"
                      ? "bg-red-500/30 text-red-300"
                      : "bg-violet-500/30 text-violet-300"
                  }`}
                >
                  <Icon size={17} />
                </div>

                {index !== validations.length - 1 && (
                  <div className="mt-2 h-7 w-px bg-white/10" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-100">
                  {item.text}
                </p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getValidationText(status: DocumentItem["status"]) {
  const texts: Record<DocumentItem["status"], string> = {
    pending: "Documento pendente de validação",
    validated: "Documento validado automaticamente",
    expiring: "Documento próximo do vencimento",
    expired: "Documento vencido",
  };

  return texts[status];
}