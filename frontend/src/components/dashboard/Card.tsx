export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#101c2d]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,.25)] ${className}`}
    >
      {children}
    </div>
  );
}