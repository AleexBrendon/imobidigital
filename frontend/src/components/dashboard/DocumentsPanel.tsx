import { documents } from "../data/dashboard";
import { Card } from "./Card";
import { DocumentCard } from "./DocumentCard";
import { SectionHeader } from "./SectionHeader";

export function DocumentsPanel({
  title = "Central de Documentos",
  repeat = false,
}: {
  title?: string;
  repeat?: boolean;
}) {
  const items = repeat ? documents.concat(documents.slice(0, 3)) : documents;

  return (
    <Card>
      <SectionHeader title={title} />

      <div className="grid grid-cols-3 gap-3">
        {items.map((doc, index) => (
          <DocumentCard key={index} doc={doc} />
        ))}
      </div>
    </Card>
  );
}