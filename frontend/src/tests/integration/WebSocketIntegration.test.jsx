import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// mock socket.io-client library
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
  default: () => <div>Mock Chart</div>,
}));


import KanbanBoard from "../../components/KanbanBoard";

beforeEach(() => {
  socketEvents = {};
  vi.clearAllMocks();
});

// TODO: Add more integration tests

describe("WebSocket Integration", () => {

  it("sync:tasks updates board", async () => {
    render(<KanbanBoard />);

    await act(async () => {
      socketEvents["sync:tasks"]([
        { id: "1", title: "Socket Task", status: "todo", priority: "Low" }
      ]);
    });

    await waitFor(() =>
      expect(screen.getByText("Socket Task")).toBeInTheDocument()
    );
  });

  it("task:deleted removes task", async () => {
    render(<KanbanBoard />);

    await act(async () => {
      socketEvents["sync:tasks"]([
        { id: "1", title: "To Delete", status: "todo", priority: "Low" }
      ]);
    });

    await act(async () => {
      socketEvents["task:deleted"]("1");
    });

    await waitFor(() =>
      expect(screen.queryByText("To Delete")).not.toBeInTheDocument()
    );
  });

});