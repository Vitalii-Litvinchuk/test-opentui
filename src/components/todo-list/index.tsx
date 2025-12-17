import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useEffect, useState } from "react";
import { useTodoStore } from "../../core/store/useTodoStore";

const VISIBLE_ITEMS = 5;

export function TodoList() {
    const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo, error } = useTodoStore();
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        fetchTodos();
    }, []);

    useKeyboard((key: { name: string }) => {
        if (key.name === "up") {
            setScrollOffset((prev) => Math.max(0, prev - 1));
        }
        if (key.name === "down") {
            setScrollOffset((prev) => Math.min(Math.max(0, todos.length - VISIBLE_ITEMS), prev + 1));
        }
    });

    useEffect(() => {
        if (scrollOffset > Math.max(0, todos.length - VISIBLE_ITEMS)) {
            setScrollOffset(Math.max(0, todos.length - VISIBLE_ITEMS));
        }
    }, [todos.length, scrollOffset]);

    const visibleTodos = todos.slice(scrollOffset, scrollOffset + VISIBLE_ITEMS);

    return (
        <box flexDirection="column">
            <text attributes={TextAttributes.DIM}>Use UP/DOWN arrows to scroll</text>
            <box flexDirection="column" marginTop={1} gap={0}>
                {error && <text attributes={TextAttributes.BOLD} style={{ fg: error.color }}>
                    {error.isCritical ? "[CRITICAL] " : ""}Error: {error.message}
                </text>}

                {todos.length === 0 && !error && (
                    <text attributes={TextAttributes.DIM}>No tasks found...</text>
                )}

                {scrollOffset > 0 && <text attributes={TextAttributes.DIM}>^ {scrollOffset} more above</text>}

                {visibleTodos.map((t) => (
                    <box key={t.id}>
                        <text
                            attributes={t.completed ? TextAttributes.BOLD : TextAttributes.DIM}
                            onMouseDown={() => toggleTodo(t.id, t.completed)}
                        >
                            [{t.completed ? "x" : " "}] {t.content}
                        </text>
                        <text marginLeft={2} attributes={TextAttributes.BOLD} style={{ fg: "red" }} onMouseDown={() => deleteTodo(t.id)}> (del)</text>
                    </box>
                ))}

                {todos.length - scrollOffset - VISIBLE_ITEMS > 0 && (
                    <text attributes={TextAttributes.DIM}>v {todos.length - scrollOffset - VISIBLE_ITEMS} more below</text>
                )}
            </box>

            <box
                onMouseDown={() => addTodo(`New Task ${new Date().toLocaleTimeString()}`)}
                marginTop={2} borderStyle="rounded" borderColor="blue" padding={1}>
                <text>
                    [ CLICK HERE TO ADD RANDOM TASK ]
                </text>
            </box>
        </box>
    );
}
