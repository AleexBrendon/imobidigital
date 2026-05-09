export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-[17px] font-bold tracking-tight text-white">
        {title}
      </h3>
    </div>
  );
}