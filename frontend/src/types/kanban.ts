export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type BoardState = {
  columnOrder: string[];
  columns: Record<string, Column>;
  cards: Record<string, Card>;
};

export type MoveCardPayload = {
  cardId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
};

export type KanbanAction =
  | { type: "rename_column"; payload: { columnId: string; title: string } }
  | {
      type: "add_card";
      payload: { columnId: string; title: string; details: string };
    }
  | { type: "delete_card"; payload: { columnId: string; cardId: string } }
  | { type: "move_card"; payload: MoveCardPayload };
