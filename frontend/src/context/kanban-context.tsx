"use client";

import { initialBoard } from "@/lib/initial-board";
import { kanbanReducer } from "@/lib/kanban-reducer";
import { BoardState, KanbanAction, MoveCardPayload } from "@/types/kanban";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";

type KanbanContextValue = {
  state: BoardState;
  dispatch: Dispatch<KanbanAction>;
  renameColumn: (columnId: string, title: string) => void;
  addCard: (columnId: string, title: string, details: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (payload: MoveCardPayload) => void;
};

const KanbanContext = createContext<KanbanContextValue | null>(null);

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(kanbanReducer, initialBoard);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      renameColumn: (columnId: string, title: string) => {
        dispatch({ type: "rename_column", payload: { columnId, title } });
      },
      addCard: (columnId: string, title: string, details: string) => {
        dispatch({
          type: "add_card",
          payload: { columnId, title, details },
        });
      },
      deleteCard: (columnId: string, cardId: string) => {
        dispatch({ type: "delete_card", payload: { columnId, cardId } });
      },
      moveCard: (payload: MoveCardPayload) => {
        dispatch({ type: "move_card", payload });
      },
    }),
    [state],
  );

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error("useKanban must be used inside KanbanProvider");
  }

  return context;
};
