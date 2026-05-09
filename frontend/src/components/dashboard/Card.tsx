export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl border border-white/10
        bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_30%),linear-gradient(180deg,rgba(15,28,46,0.98),rgba(12,24,39,0.98))]
        p-5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}