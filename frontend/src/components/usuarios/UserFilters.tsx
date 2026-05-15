type Filter = "all" | "corretor" | "administrador" | "blocked";

export function UserFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: Filter;
  onChange: (filter: Filter) => void;
}) {
  const filters: { label: string; value: Filter }[] = [
    { label: "Todos", value: "all" },
    { label: "Corretores", value: "corretor" },
    { label: "Administradores", value: "administrador" },
    { label: "Bloqueados", value: "blocked" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === filter.value
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}