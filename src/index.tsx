
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { TodoList } from "./components/todo-list";
import { Layout } from "./components/layout";
import { useNavigation } from "./hooks/useNavigation";

function App() {
  const { currentView } = useNavigation();

  return (
    <Layout title={currentView === 'home' ? "Todo App" : "About"}>
      {currentView === 'home' && <TodoList />}
      {currentView === 'about' && (
        <box flexDirection="column">
          <text>This is a simple Todo App built with:</text>
          <text>- OpenTUI (Renderer)</text>
          <text>- React (UI Library)</text>
          <text>- Zustand (State Management)</text>
          <text>- Mediator Pattern (CQRS-lite)</text>
          <text>- Drizzle ORM (Database)</text>
        </box>
      )}
    </Layout>
  );
}

const renderer = await createCliRenderer();

// Bootstrap application (register handlers, etc.)
await import("./core/bootstrap").then(m => m.bootstrapApplication());

createRoot(renderer).render(<App />);
