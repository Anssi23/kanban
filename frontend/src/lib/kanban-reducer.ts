import { BoardState, KanbanAction, MoveCardPayload } from "@/types/kanban";

const createCardId = () =>
  `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const clampIndex = (index: number, max: number) => {
  if (index < 0) {
    return 0;
  }

  if (index > max) {
    return max;
  }

  return index;
};

export const moveCard = (
  state: BoardState,
  payload: MoveCardPayload,
): BoardState => {
  const {
    cardId,
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex,
  } = payload;

  const sourceColumn = state.columns[sourceColumnId];
  const destinationColumn = state.columns[destinationColumnId];

  if (!sourceColumn || !destinationColumn) {
    return state;
  }

  if (sourceColumn.cardIds[sourceIndex] !== cardId) {
    return state;
  }

  if (sourceColumnId === destinationColumnId && sourceIndex === destinationIndex) {
    return state;
  }

  const nextColumns = { ...state.columns };

  if (sourceColumnId === destinationColumnId) {
    const reorderedCardIds = [...sourceColumn.cardIds];
    reorderedCardIds.splice(sourceIndex, 1);
    reorderedCardIds.splice(
      clampIndex(destinationIndex, reorderedCardIds.length),
      0,
      cardId,
    );

    nextColumns[sourceColumnId] = {
      ...sourceColumn,
      cardIds: reorderedCardIds,
    };

    return {
      ...state,
      columns: nextColumns,
    };
  }

  const sourceCardIds = [...sourceColumn.cardIds];
  sourceCardIds.splice(sourceIndex, 1);

  const destinationCardIds = [...destinationColumn.cardIds];
  destinationCardIds.splice(
    clampIndex(destinationIndex, destinationCardIds.length),
    0,
    cardId,
  );

  nextColumns[sourceColumnId] = {
    ...sourceColumn,
    cardIds: sourceCardIds,
  };

  nextColumns[destinationColumnId] = {
    ...destinationColumn,
    cardIds: destinationCardIds,
  };

  return {
    ...state,
    columns: nextColumns,
  };
};

export const kanbanReducer = (
  state: BoardState,
  action: KanbanAction,
): BoardState => {
  switch (action.type) {
    case "rename_column": {
      const { columnId, title } = action.payload;
      const column = state.columns[columnId];

      if (!column || !title.trim()) {
        return state;
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            title: title.trim(),
          },
        },
      };
    }

    case "add_card": {
      const { columnId, title, details } = action.payload;
      const column = state.columns[columnId];

      if (!column || !title.trim() || !details.trim()) {
        return state;
      }

      const nextCardId = createCardId();

      return {
        ...state,
        cards: {
          ...state.cards,
          [nextCardId]: {
            id: nextCardId,
            title: title.trim(),
            details: details.trim(),
          },
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            cardIds: [...column.cardIds, nextCardId],
          },
        },
      };
    }

    case "delete_card": {
      const { columnId, cardId } = action.payload;
      const column = state.columns[columnId];

      if (!column || !state.cards[cardId]) {
        return state;
      }

      const nextCards = { ...state.cards };
      delete nextCards[cardId];

      return {
        ...state,
        cards: nextCards,
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          },
        },
      };
    }

    case "move_card":
      return moveCard(state, action.payload);

    default:
      return state;
  }
};
