import { TextAttributes } from "@opentui/core";
import { useEffect } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { Routes } from "../../../../core/router/constants";
import moment from "moment";
import { Focusable, FocusableList } from "../../../../components/focusable";
import type { Todo } from "../../domain/schema";

const VISIBLE_ITEMS = 5;

export function TodoList() {
    const { todos, fetchTodos, toggleTodo, deleteTodo, error } = useTodoStore();
    const { navigate } = useRouterStore();

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleItemAction = (item: Todo, keyName: string) => {
        if (keyName === 'space') {
            toggleTodo(item.id, item.completed);
        } else if (keyName === 'd') {
            deleteTodo(item.id);
        }
    };

    return (
        <box flexDirection="column">
            <text attributes={TextAttributes.DIM}>Focus List & [SPACE] to enter | [UP/DOWN] to scroll | [D] to delete</text>
            <box flexDirection="column" marginTop={1} gap={0}>
                {error && <text attributes={TextAttributes.BOLD} style={{ fg: error.color }}>
                    {error.isCritical ? "[CRITICAL] " : ""}Error: {error.message}
                </text>}

                {todos.length === 0 && !error && (
                    <text attributes={TextAttributes.DIM}>No tasks found...</text>
                )}

                <FocusableList
                    items={todos}
                    visibleCount={VISIBLE_ITEMS}
                    onItemAction={handleItemAction}
                    renderItem={(t, isSelected) => (
                        <box gap={1}>
                            <text
                                style={{
                                    fg: isSelected ? "black" : (t.completed ? "white" : "grey"),
                                    bg: isSelected ? "cyan" : "transparent"
                                }}
                                attributes={t.completed ? TextAttributes.BOLD : TextAttributes.DIM}
                            >
                                {isSelected ? "> " : "  "}[{t.completed ? "x" : " "}] {t.content} {t.category ? `(${t.category.name}) ` : ""}{moment(t.createdAt).fromNow()}
                            </text>
                            {isSelected && (
                                <text style={{ fg: "red" }} attributes={TextAttributes.BOLD}> (D to del)</text>
                            )}
                        </box>
                    )}
                />
            </box>

            <Focusable onAction={() => navigate(Routes.TODO.ADD)}>
                {(isFocused) => (
                    <box
                        marginTop={2} borderStyle="rounded" borderColor={isFocused ? "cyan" : "green"} padding={1}>
                        <text
                            style={{ fg: isFocused ? "cyan" : "white" }}
                            attributes={TextAttributes.BOLD}
                        >
                            {isFocused ? "> " : "  "}[ + ] ADD NEW TASK
                        </text>
                    </box>
                )}
            </Focusable>
        </box>
    );
}
