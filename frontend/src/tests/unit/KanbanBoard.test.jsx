import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

let socketEvents = {};

vi.mock("../../socket", () => ({
  socket: {
    on: (event, callback) => {
      socketEvents[event] = callback;
    },
    off: vi.fn(),
  },
}));

vi.mock("../../components/ProgressChart", () => ({
  default: () => <div data-testid="mock-chart">Mock Chart</div>,
}));

vi.mock("../../services/taskService", () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import KanbanBoard from "../../components/KanbanBoard";

beforeEach(() => {
  socketEvents = {};
  vi.clearAllMocks();
});

// TODO: Add more unit tests for individual components

describe("KanbanBoard", () => {

  test("renders after sync", async () => {
    render(<KanbanBoard />);

    await act(async () => {
      socketEvents["sync:tasks"]([]);
    });

    await waitFor(() =>
      expect(screen.getByText("Kanban Board")).toBeInTheDocument()
    );
  });

  test("opens create modal", async () => {
    render(<KanbanBoard />);

    await act(async () => {
      socketEvents["sync:tasks"]([]);
    });

    await waitFor(() =>
      expect(screen.getByText("+ Create Task")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("+ Create Task"));

    expect(screen.getByText("Create New Task")).toBeInTheDocument();
  });

});