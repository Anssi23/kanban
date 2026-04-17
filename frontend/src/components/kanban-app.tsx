"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { KanbanProvider, useKanban } from "@/context/kanban-context";
import { KanbanCard } from "@/components/kanban-card";
import { KanbanColumn } from "@/components/kanban-column";
import { Card } from "@/types/kanban";

const BOARD_TITLE = "Momentum Board";

const EmptyDropZone = ({ columnId }: { columnId: string }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-drop-${columnId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-3 min-h-24 rounded-xl border-2 border-dashed p-3 text-sm transition-colors ${
        isOver
          ? "border-[var(--accent-yellow)] bg-[color-mix(in_srgb,var(--accent-yellow),white_86%)]"
          : "border-[var(--line-muted)] bg-[var(--surface-soft)] text-[var(--text-muted)]"
      }`}
    >
      Drop card here
    </div>
  );
};

const Board = () => {
  const { state, moveCard } = useKanban();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const cardToColumn = useMemo(() => {
    const map = new Map<string, string>();

    for (const columnId of state.columnOrder) {
      const column = state.columns[columnId];
      for (const cardId of column.cardIds) {
        map.set(cardId, columnId);
      }
    }

    return map;
  }, [state]);

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = String(event.active.id);
    const card = state.cards[cardId];
    if (card) {
      setActiveCard(card);
    }
  };

  const resolveDropTarget = (overId: string) => {
    if (overId.startsWith("column-drop-")) {
      const columnId = overId.replace("column-drop-", "");
      const column = state.columns[columnId];

      if (!column) {
        return null;
      }

      return {
        destinationColumnId: columnId,
        destinationIndex: column.cardIds.length,
      };
    }

    const destinationColumnId = cardToColumn.get(overId);
    if (!destinationColumnId) {
      return null;
    }

    const destinationIndex = state.columns[destinationColumnId].cardIds.indexOf(overId);

    return {
      destinationColumnId,
      destinationIndex,
    };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);

    const { active, over } = event;
    if (!over) {
      return;
    }

    const cardId = String(active.id);
    const overId = String(over.id);

    const sourceColumnId = cardToColumn.get(cardId);
    if (!sourceColumnId) {
      return;
    }

    const sourceIndex = state.columns[sourceColumnId].cardIds.indexOf(cardId);
    const destination = resolveDropTarget(overId);

    if (!destination || sourceIndex === -1) {
      return;
    }

    const { destinationColumnId, destinationIndex } = destination;

    if (sourceColumnId === destinationColumnId) {
      const sourceColumn = state.columns[sourceColumnId];
      const reordered = arrayMove(sourceColumn.cardIds, sourceIndex, destinationIndex);
      const normalizedDestinationIndex = reordered.indexOf(cardId);

      moveCard({
        cardId,
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex: normalizedDestinationIndex,
      });

      return;
    }

    moveCard({
      cardId,
      sourceColumnId,
      destinationColumnId,
      sourceIndex,
      destinationIndex,
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--blue-primary)]">
          Single board MVP
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--dark-navy)] sm:text-4xl">
          {BOARD_TITLE}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
          Rename columns, add cards, delete cards, and drag them across the 5 fixed columns.
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <section className="grid gap-4 sm:gap-5 lg:grid-cols-5" data-testid="board">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const cards = column.cardIds.map((cardId) => state.cards[cardId]);

            return (
              <SortableContext
                key={column.id}
                items={cards.map((card) => card.id)}
                strategy={rectSortingStrategy}
              >
                <KanbanColumn column={column}>
                  {cards.map((card) => (
                    <KanbanCard
                      key={card.id}
                      card={card}
                      columnId={column.id}
                    />
                  ))}
                  <EmptyDropZone columnId={column.id} />
                </KanbanColumn>
              </SortableContext>
            );
          })}
        </section>

        <DragOverlay>
          {activeCard ? (
            <div className="w-[280px] rotate-1 rounded-2xl border border-[var(--line-muted)] bg-white p-4 shadow-2xl">
              <h3 className="mb-2 text-base font-semibold text-[var(--dark-navy)]">
                {activeCard.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">{activeCard.details}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export const KanbanApp = () => {
  return (
    <KanbanProvider>
      <Board />
    </KanbanProvider>
  );
};
