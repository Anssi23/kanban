import { expect, test } from "@playwright/test";

test.describe("Kanban MVP", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("board")).toBeVisible();
    await expect(page.getByTestId("column-title-col-todo")).toBeEditable();
  });

  test("shows single board with 5 columns", async ({ page }) => {
    await expect(page.getByTestId(/column-col-/)).toHaveCount(5);
  });

  test("renames a column", async ({ page }) => {
    const title = page.getByTestId("column-title-col-todo");
    await title.fill("Ready");
    await title.press("Enter");

    await expect(title).toHaveValue("Ready");
  });

  test("adds a card", async ({ page }) => {
    const form = page.getByTestId("add-card-col-review");
    await form.locator("input").fill("Customer signoff");
    await form.locator("textarea").fill("Share release notes and final checklist.");
    await form.getByRole("button", { name: "Add card" }).click();

    await expect(
      page.getByTestId("column-col-review").getByText("Customer signoff"),
    ).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    const sourceColumn = page.getByTestId("column-col-backlog");
    await sourceColumn
      .getByRole("button", { name: "Delete Collect references" })
      .click();

    await expect(sourceColumn.getByText("Collect references")).toHaveCount(0);
  });

  test("drags card between columns", async ({ page }) => {
    const card = page.getByRole("button", { name: "Drag Project kickoff" });
    const dropZone = page.locator('[data-testid="column-col-review"] >> text=Drop card here').first();

    const cardBox = await card.boundingBox();
    const dropZoneBox = await dropZone.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(dropZoneBox).not.toBeNull();

    await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      dropZoneBox!.x + dropZoneBox!.width / 2,
      dropZoneBox!.y + dropZoneBox!.height / 2,
      { steps: 10 },
    );
    await page.mouse.up();

    await expect(
      page.locator('[data-testid="column-col-review"]').getByText("Project kickoff"),
    ).toBeVisible();
  });
});
