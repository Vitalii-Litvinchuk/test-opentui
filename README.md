# OpenTUI Todo Application

A modern Terminal User Interface (TUI) Todo application built with React, modular architecture, and a robust backend stack.

## 🚀 Tech Stack

- **Framework**: [OpenTUI](https://git.new/create-tui)
- **UI Library**: **React 19**
- **State Management**: **Zustand**
- **Architecture**: Atomic Modular Architecture + **Mediator Pattern** (CQRS-lite)
- **Database**: **Drizzle ORM** with **Bun SQLite**
- **Styling**: Vanilla CSS (Terminal-compatible)

## ✨ Key Features

- **Modular Design**: Self-contained modules (e.g., `todos`) with their own domain, data, and presentation layers.
- **Dynamic Routing**: A "self-expanding" routing system based on a Proxy registry. No manual config required for new routes.
- **Global Error Dashboard**: Real-time error reporting with a sticky footer and `Ctrl+Shift+R` clearing mechanism.
- **Root Error Boundary**: Comprehensive crash protection for both UI and background process exceptions.
- **Type Safety**: Full use of Discriminated Unions for `Result<T, E>` types and typed dependency injection.

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime installed.

### Installation

```bash
bun install
```

### Database Migration

```bash
bun db:migrate
```

### Run Development Server

```bash
bun dev
```

## ⌨️ Keyboard Shortcuts

- `[TAB]`: Cycle through main routes.
- `[Ctrl+Shift+R]`: Clear global error dashboard.
- `[Q]`: Quit application safely.
- In Todo List: `[UP/DOWN]` to scroll.
- In Todo Form: `[ENTER]` to save, `[ESC]` to cancel.

---

For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md).
