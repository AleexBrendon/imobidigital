import { MoreHorizontal } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { propertyImages } from "../data/dashboard";
import type { Client } from "../../types/kanban";

export function ClientCard({
  client,
  onSelect,
}: {
  client: Client;
  onSelect?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: client.id,
      data: client,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className="cursor-grab rounded-xl border border-white/10 bg-[#0b1627] p-2 shadow-lg transition active:cursor-grabbing"
    >
      <div className="mb-2 flex items-center gap-2">
        <img
          src={`https://i.pravatar.cc/80?img=${client.avatar}`}
          className="h-6 w-6 rounded-full"
        />

        <span className="text-xs font-medium">{client.name}</span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            console.log("opções", client);
          }}
          className="ml-auto"
        >
          <MoreHorizontal size={14} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {propertyImages.map((image) => (
          <img key={image} src={image} className="h-14 rounded-md object-cover" />
        ))}
      </div>

      <span className="mt-2 inline-flex rounded-md bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
        {client.tag}
      </span>
    </div>
  );
}