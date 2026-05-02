type CardProps = {
  children: React.ReactNode;
  title?: string;
  right?: React.ReactNode;
  glow?: boolean;
};

export function Card({ children, title, right, glow }: CardProps) {
  return (
    <div
      className={`rounded-2xl border bg-[#101c2d]/95 p-5 
      ${glow 
        ? "border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.25)]" 
        : "border-white/10"
      }`}
    >
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-slate-100">
              {title}
            </h3>
          )}
          {right}
        </div>
      )}

      {children}
    </div>
  );
}