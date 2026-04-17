"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useKanban } from "@/context/kanban-context";
import { Card } from "@/types/kanban";

type KanbanCardProps = {
  card: Card;
  columnId: string;
};

export const KanbanCard = ({ card, columnId }: KanbanCardProps) => {
  const { deleteCard } = useKanban();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border border-[var(--line-muted)] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isDragging ? "opacity-60" : "opacity-100"
      }`}
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="cursor-grab text-left active:cursor-grabbing"
          aria-label={`Drag ${card.title}`}
          suppressHydrationWarning
          {...attributes}
          {...listeners}
        >
          <h3 className="text-sm font-semibold text-[var(--dark-navy)]">{card.title}</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{card.details}</p>
        </button>
        <button
          type="button"
          onClick={() => deleteCard(columnId, card.id)}
          className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-yellow)]/25 hover:text-[var(--dark-navy)]"
          aria-label={`Delete ${card.title}`}
          data-testid={`delete-${card.id}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
};
