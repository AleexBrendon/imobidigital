type CardProps = {
  title?: string;
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
  right?: React.ReactNode;
};

export function Card({
  children,
  title,
  right,
  glow,
  className,
}: CardProps) {
  return (
    <div
      className={`
        group relative min-w-0 overflow-hidden rounded-2xl border
        border-slate-700/70
        bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_34%),linear-gradient(180deg,rgba(15,28,46,0.98),rgba(12,24,39,0.98))]
        p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.32)]
        ${glow ? "border-cyan-500/35 shadow-[0_0_45px_rgba(6,182,212,0.16)]" : ""}
        ${className ?? ""}
      `}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />

      {(title || right) && (
        <div className="relative z-10 mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-[17px] font-bold tracking-tight text-white">
              {title}
            </h3>
          )}

          {right}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}