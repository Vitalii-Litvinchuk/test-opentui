# Project Architecture

This project follows an **Atomic Modular Architecture** combined with a **Mediator (CQRS-lite)** pattern to ensure scalability, testability, and clear separation of concerns.

## 🏗️ Folder Structure

- `src/core`: Common infrastructure and utilities.
  - `db`: Drizzle ORM setup and migrations.
  - `di`: Scoped Dependency Injection container.
  - `mediator`: Central registry for commands, queries, and their handlers.
  - `router`: Dynamic routing logic and Proxy constants.
  - `common`: Shared types like `Result` and `AppError`.
- `src/modules`: Feature-based modules.
  - `[module_name]`:
    - `domain`: Entity schemas and models.
    - `data`: Repositories and data access logic.
    - `application`: Command/Query handlers (Business logic).
    - `presentation`: components, stores, and UI logic.
    - `register.tsx`: Module entry point for DI and Router registration.
- `src/components`: Global UI components (Layout, Router, etc.).
- `src/store`: Global Zustand stores.

## 🔄 Design Patterns

### 1. Mediator Pattern (CQRS-lite)
Instead of calling repositories directly from UI components, we use a central Mediator. This decouples the presentation layer from the business logic.
- **Command**: Changes state (e.g., `CreateTodoCommand`).
- **Query**: Retrieves data (e.g., `GetTodosQuery`).
- **Handler**: logic that executes a command or query.

### 2. Base Repository
All repositories extend a `BaseRepository` that provides generic CRUD operations using Drizzle ORM, ensuring consistent data access patterns.

### 3. Dynamic Routing Proxy
The `Routes` object is a recursive Proxy that automatically generates kebab-case paths based on property access.
- `Routes.TODO.ADD` -> `"todo/add"`.
- Supports **Module Augmentation** for full IDE autocompletion.

### 4. Discriminated Union Results
The `Result<T, E>` type is implemented as an union of `Success` and `Failure` classes, allowing TypeScript to automatically narrow the type upon checking `isSuccess` or `isFailure`.

## 🛡️ Error Handling

- **Level 1 (UI)**: Root `ErrorBoundary` captures rendering crashes.
- **Level 2 (Process)**: `uncaughtException` and `unhandledRejection` capture system failures.
- **Level 3 (Display)**: All errors are funneled to `useErrorStore` and displayed in the `Layout`'s sticky footer.
