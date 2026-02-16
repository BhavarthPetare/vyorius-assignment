import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../../components/TaskCard";

describe("TaskCard", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    priority: "Low",
    status: "todo",
  };

  it("renders task title", () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("calls delete handler", () => {
    const mockDelete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onUpdate={vi.fn()}
        onDelete={mockDelete}
      />
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("enters edit mode", () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
  });
});