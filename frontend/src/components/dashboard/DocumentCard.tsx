import type { DashboardDocument } from "../../types/dashboard";

export function DocumentCard({
  doc,
}: {
  doc: DashboardDocument;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1627] p-3 text-center">
      <div className="mx-auto mb-3 flex h-16 w-12 items-end justify-center rounded bg-slate-100 pb-1">
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-bold text-white ${
            doc.type === "PDF" ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {doc.type}
        </span>
      </div>

      <p className="mb-2 truncate text-xs text-slate-300">{doc.name}</p>

      <span
        className={`rounded-full px-2 py-1 text-[11px] ${
          doc.color === "emerald"
            ? "bg-emerald-500/20 text-emerald-300"
            : doc.color === "yellow"
            ? "bg-yellow-500/20 text-yellow-300"
            : "bg-red-500/20 text-red-300"
        }`}
      >
        {doc.status}
      </span>
    </div>
  );
}