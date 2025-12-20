import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Layout } from "./components/layout";
import { Router, Route } from "./components/router";
import { Routes } from "./core/router/constants";
import { useErrorStore } from "./store/useErrorStore";
import { AppError } from "./core/common/app-error";

process.on('uncaughtException', (error) => {
  useErrorStore.getState().addError(
    AppError.critical(`SYSTEM ERROR: ${error.message}`)
  );
});

process.on('unhandledRejection', (reason) => {
  useErrorStore.getState().addError(
    AppError.critical(`ASYNC ERROR: ${reason instanceof Error ? reason.message : String(reason)}`)
  );
});

declare module "./core/router/constants" {
  interface AppRoutes {
    ABOUT: string;
  }
}

function About() {
  return (
    <box flexDirection="column">
      <text>This is a simple Todo App built with:</text>
      <text>- OpenTUI (Renderer)</text>
      <text>- React (UI Library)</text>
      <text>- Zustand (State Management)</text>
      <text>- Mediator Pattern (CQRS-lite)</text>
      <text>- Drizzle ORM (Database)</text>
    </box>
  );
}

function App() {
  return (
    <Layout>
      <Router>
        <Route path={Routes.ABOUT} title="About" isMain={true}>
          <About />
        </Route>
      </Router>
    </Layout>
  );
}

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  enableMouseMovement: true,
  useMouse: true,
  useThread: true
});

// Bootstrap application (register handlers, etc.)
await import("./core/bootstrap").then(m => m.bootstrapApplication());

createRoot(renderer).render(<App />);
