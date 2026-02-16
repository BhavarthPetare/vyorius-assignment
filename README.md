# 🚀 WebSocket-Powered Kanban Board

A real-time Kanban board application built using **React**, **Node.js**, and **Socket.IO**, featuring drag-and-drop task management, live updates, task persistence, and comprehensive testing (Unit, Integration, and E2E).

---

## 📌 Project Overview

This application implements a fully functional Kanban workflow board where users can:

- Create, update, delete, and move tasks between columns
- Upload attachments to tasks
- Assign priority and category via dropdowns
- View real-time updates across multiple clients
- Visualize task progress using a live chart
- Persist tasks across server restarts
- Run unit, integration, and end-to-end tests

The system uses WebSockets to synchronize updates instantly across all connected users.

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Socket.IO Client
- dnd-kit (Drag & Drop)
- Recharts (Progress Visualization)
- Vitest + React Testing Library
- Playwright (E2E Testing)

### Backend
- Node.js
- Express
- Socket.IO
- Local JSON-based persistence (`tasks.json`)

---

## 📂 Project Structure

```

websocket-kanban-vitest-playwright/
│
├── backend/
│ ├── server.js
│ ├── tasks.example.json
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ ├── tests/
│ │ │ ├── unit/
│ │ │ ├── integration/
│ │ │ └── e2e/
│ └── package.json
│
├── .gitignore
└── README.md

```

## ✅ Implemented Features

### Core Kanban Functionality
- [x] Create tasks
- [x] Update tasks
- [x] Delete tasks
- [x] Drag & drop tasks between columns
- [x] Real-time WebSocket synchronization

### Task Enhancements
- [x] Priority selection (Low / Medium / High)
- [x] Category selection (Bug / Feature / Enhancement)
- [x] File attachment upload
- [x] Image preview support
- [x] File link display for non-image files

### Visualization
- [x] Task count per column
- [x] Completion percentage calculation
- [x] Real-time chart updates

### Persistence
- [x] Tasks persist across server restarts using local JSON storage

### Testing
- [x] Unit tests (Vitest)
- [x] Integration tests (WebSocket sync validation)
- [x] End-to-end tests (Playwright)

---

## 🔄 Real-Time Architecture

WebSocket events implemented:

- `task:create`
- `task:update`
- `task:move`
- `task:delete`
- `sync:tasks`

New clients receive the full task state via `sync:tasks`.

---

## 💾 Persistence Strategy

Tasks are stored locally in:

backend/tasks.json


This file:
- Is automatically updated on every task mutation
- Is ignored by Git
- Ensures persistence without requiring a database

A `tasks.example.json` file is provided for setup.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <https://github.com/BhavarthPetare/vyorius-assignment>
cd websocket-kanban-vitest-playwright
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp tasks.example.json tasks.json
npm run dev
```

Backend runs on:
http://localhost:5000/

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
http://localhost:3000/

# 🧪 Running Tests
### Unit & Integration Tests
```bash
cd frontend
npx vitest
```

### End-to-End Tests (Playwright)
```bash
cd frontend
npx playwright test
```

### Interactive mode:
```bash
npx playwright test --ui
```

# 🌐 Deployment

Backend deployed to:
<https://vyorius-assignment.onrender.com>


Frontend deployed to:
<https://vyorius-assignment.vercel.app/>


Environment variable required in frontend:
VITE_SOCKET_URL=<https://vyorius-assignment.onrender.com>

# 🧠 Design Decisions

- Used local JSON persistence instead of MongoDB to ensure persistence without introducing database complexity.

- Implemented real-time state synchronization via Socket.IO.

- Used dnd-kit for modern, performant drag-and-drop behavior.

- Structured tests into unit, integration, and e2e for clarity and maintainability.

- Used role-based selectors in Playwright for stable end-to-end testing.

# 🚀 Future Improvements

- MongoDB persistence layer

- Authentication system

- Within-column task ordering

- Task filtering & search

- CI/CD integration

# 👤 Author
## Bhavarth Petare