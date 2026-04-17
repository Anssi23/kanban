import { describe, expect, it } from "vitest";
import { initialBoard } from "@/lib/initial-board";
import { kanbanReducer, moveCard } from "@/lib/kanban-reducer";

describe("kanbanReducer", () => {
  it("renames a column", () => {
    const nextState = kanbanReducer(initialBoard, {
      type: "rename_column",
      payload: { columnId: "col-todo", title: "Next Up" },
    });

    expect(nextState.columns["col-todo"].title).toBe("Next Up");
  });

  it("adds a card to a column", () => {
    const nextState = kanbanReducer(initialBoard, {
      type: "add_card",
      payload: {
        columnId: "col-review",
        title: "Approve release",
        details: "Final acceptance pass",
      },
    });

    expect(nextState.columns["col-review"].cardIds.length).toBe(
      initialBoard.columns["col-review"].cardIds.length + 1,
    );

    const newestId = nextState.columns["col-review"].cardIds.at(-1);
    expect(newestId).toBeDefined();
    expect(nextState.cards[newestId!].title).toBe("Approve release");
  });

  it("deletes a card from a column", () => {
    const targetCardId = initialBoard.columns["col-todo"].cardIds[0];

    const nextState = kanbanReducer(initialBoard, {
      type: "delete_card",
      payload: { columnId: "col-todo", cardId: targetCardId },
    });

    expect(nextState.cards[targetCardId]).toBeUndefined();
    expect(nextState.columns["col-todo"].cardIds).not.toContain(targetCardId);
  });

  it("moves card across columns", () => {
    const sourceColumn = initialBoard.columns["col-backlog"];
    const cardId = sourceColumn.cardIds[0];

    const nextState = moveCard(initialBoard, {
      cardId,
      sourceColumnId: "col-backlog",
      destinationColumnId: "col-review",
      sourceIndex: 0,
      destinationIndex: 0,
    });

    expect(nextState.columns["col-backlog"].cardIds).not.toContain(cardId);
    expect(nextState.columns["col-review"].cardIds[0]).toBe(cardId);
  });
});
