import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KanbanApp } from "@/components/kanban-app";

describe("KanbanApp", () => {
  it("renders five columns from initial data", () => {
    render(<KanbanApp />);

    expect(screen.getByTestId("board")).toBeInTheDocument();
    expect(screen.getAllByTestId(/^column-col-/)).toHaveLength(5);
  });

  it("renames a column by committing title input", () => {
    render(<KanbanApp />);

    const titleInput = screen.getByTestId("column-title-col-todo");
    fireEvent.change(titleInput, { target: { value: "Ready" } });
    fireEvent.blur(titleInput);

    expect(titleInput).toHaveValue("Ready");
  });

  it("adds a card to selected column", () => {
    render(<KanbanApp />);

    const form = screen.getByTestId("add-card-col-review");
    const titleField = within(form).getByPlaceholderText("Card title");
    const detailField = within(form).getByPlaceholderText("Card details");

    fireEvent.change(titleField, { target: { value: "Ship MVP" } });
    fireEvent.change(detailField, { target: { value: "Merge and deploy the board." } });
    fireEvent.submit(form);

    expect(screen.getByText("Ship MVP")).toBeInTheDocument();
  });

  it("deletes a card", () => {
    render(<KanbanApp />);

    const cardTitle = screen.getByText("Collect references");
    const cardContainer = cardTitle.closest("article");
    expect(cardContainer).not.toBeNull();

    const deleteButton = within(cardContainer!).getByRole("button", {
      name: "Delete Collect references",
    });

    fireEvent.click(deleteButton);

    expect(screen.queryByText("Collect references")).not.toBeInTheDocument();
  });
});
