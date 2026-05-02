export function FunnelChart() {
  const data = [
    { label: "Prospecção", width: "100%", color: "bg-indigo-500" },
    { label: "Visita", width: "80%", color: "bg-cyan-400" },
    { label: "Proposta", width: "60%", color: "bg-yellow-400" },
    { label: "Fechamento", width: "40%", color: "bg-red-400" },
  ];

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <p className="text-xs text-slate-400">{item.label}</p>
          <div className="h-4 w-full rounded bg-white/5">
            <div
              className={`h-4 rounded ${item.color}`}
              style={{ width: item.width }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}