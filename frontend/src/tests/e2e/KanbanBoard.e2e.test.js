import { test, expect } from "@playwright/test";

test("User can add a task and see it on the board", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Real-time Kanban Board",)).toBeVisible();
});

test("User can create and move a task", async ({ page }) => {
  await page.goto("/");
  // Wait for board
  await expect(page.getByText("Kanban Board", {exact: true})).toBeVisible();

  // Wait for Create Task button specifically
  await expect(page.getByRole("button", { name: /Create Task/i })).toBeVisible({ timeout: 10000 });
  // Create task
  await page.click("text=+ Create Task");
  await page.fill('input[placeholder="Task Title"]', "E2E Task");
  await page.getByRole("button", { name: /^Create$/ }).click();

  await expect(page.getByText("E2E Task")).toBeVisible();

  // Drag to Done column
  const task = page.locator("text=E2E Task");
  const doneColumn = page
    .getByRole("heading", { name: "Done" })
    .locator("..");

  await task.dragTo(doneColumn);

  // Verify still visible
  await expect(page.getByText("E2E Task")).toBeVisible();
});
