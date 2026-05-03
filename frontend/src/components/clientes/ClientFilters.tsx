type Filter = "all" | "comprador" | "locador" | "locatario" | "investidor";

export function ClientFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: Filter;
  onChange: (filter: Filter) => void;
}) {
  const filters = [
    { label: "Todos", value: "all" },
    { label: "Compradores", value: "comprador" },
    { label: "Locadores", value: "locador" },
    { label: "Locatários", value: "locatario" },
    { label: "Investidores", value: "investidor" },
  ] as const;

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            activeFilter === filter.value
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}