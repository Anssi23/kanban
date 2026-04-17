"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useKanban } from "@/context/kanban-context";
import { Column } from "@/types/kanban";

type KanbanColumnProps = {
  column: Column;
  children: ReactNode;
};

export const KanbanColumn = ({ column, children }: KanbanColumnProps) => {
  const { renameColumn, addCard } = useKanban();
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDetails, setDraftDetails] = useState("");

  const handleTitleCommit = () => {
    const nextTitle = columnTitle.trim();
    if (!nextTitle) {
      setColumnTitle(column.title);
      return;
    }

    renameColumn(column.id, nextTitle);
  };

  const handleAddCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draftTitle.trim() || !draftDetails.trim()) {
      return;
    }

    addCard(column.id, draftTitle, draftDetails);
    setDraftTitle("");
    setDraftDetails("");
  };

  return (
    <article
      className="rounded-2xl border border-[var(--line-muted)] bg-[var(--surface)] p-4 shadow-[0_15px_40px_rgba(3,33,71,0.08)]"
      data-testid={`column-${column.id}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <input
          aria-label={`Column ${column.title} name`}
          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-base font-semibold text-[var(--dark-navy)] outline-none transition focus:border-[var(--blue-primary)] focus:bg-white"
          value={columnTitle}
          onChange={(event) => setColumnTitle(event.target.value)}
          onBlur={handleTitleCommit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleTitleCommit();
            }
          }}
          data-testid={`column-title-${column.id}`}
        />
        <span className="rounded-full bg-[var(--accent-yellow)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--dark-navy)]">
          {column.cardIds.length}
        </span>
      </div>

      <div className="space-y-3">{children}</div>

      <form onSubmit={handleAddCard} className="mt-4 space-y-2" data-testid={`add-card-${column.id}`}>
        <input
          placeholder="Card title"
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          className="w-full rounded-lg border border-[var(--line-muted)] bg-white px-3 py-2 text-sm text-[var(--dark-navy)] outline-none transition focus:border-[var(--blue-primary)]"
        />
        <textarea
          placeholder="Card details"
          value={draftDetails}
          onChange={(event) => setDraftDetails(event.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-[var(--line-muted)] bg-white px-3 py-2 text-sm text-[var(--text-muted)] outline-none transition focus:border-[var(--blue-primary)]"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--purple-secondary)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Add card
        </button>
      </form>
    </article>
  );
};
