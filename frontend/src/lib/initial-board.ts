import { BoardState } from "@/types/kanban";

export const initialBoard: BoardState = {
  columnOrder: [
    "col-backlog",
    "col-todo",
    "col-inprogress",
    "col-review",
    "col-done",
  ],
  columns: {
    "col-backlog": {
      id: "col-backlog",
      title: "Backlog",
      cardIds: ["card-1", "card-2"],
    },
    "col-todo": {
      id: "col-todo",
      title: "To Do",
      cardIds: ["card-3", "card-4"],
    },
    "col-inprogress": {
      id: "col-inprogress",
      title: "In Progress",
      cardIds: ["card-5"],
    },
    "col-review": {
      id: "col-review",
      title: "Review",
      cardIds: ["card-6"],
    },
    "col-done": {
      id: "col-done",
      title: "Done",
      cardIds: ["card-7"],
    },
  },
  cards: {
    "card-1": {
      id: "card-1",
      title: "Project kickoff",
      details: "Align goals and define MVP milestones.",
    },
    "card-2": {
      id: "card-2",
      title: "Collect references",
      details: "Gather board layout and motion inspiration.",
    },
    "card-3": {
      id: "card-3",
      title: "Create component map",
      details: "List all UI components for Kanban board.",
    },
    "card-4": {
      id: "card-4",
      title: "Define color tokens",
      details: "Map the required palette to CSS variables.",
    },
    "card-5": {
      id: "card-5",
      title: "Build drag interactions",
      details: "Implement sortable cards with keyboard support.",
    },
    "card-6": {
      id: "card-6",
      title: "Write test scenarios",
      details: "Cover add, delete, rename and drag workflows.",
    },
    "card-7": {
      id: "card-7",
      title: "Landing polish",
      details: "Tune spacing, contrast and animation pacing.",
    },
  },
};
