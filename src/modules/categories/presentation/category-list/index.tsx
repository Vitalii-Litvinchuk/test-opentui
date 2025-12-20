import { TextAttributes } from "@opentui/core";
import { useEffect } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { Routes } from "../../../../core/router/constants";
import { Focusable, FocusableList } from "../../../../components/focusable";


export function CategoryList() {
    const { categories, fetchCategories, error } = useCategoryStore();
    const { navigate } = useRouterStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <box flexDirection="column">
            <box flexDirection="column" marginTop={1} gap={0}>
                {error && <text attributes={TextAttributes.BOLD} style={{ fg: "red" }}>
                    Error: {error.message}
                </text>}

                {categories.length === 0 && !error && (
                    <text attributes={TextAttributes.DIM}>No categories found...</text>
                )}

                <FocusableList
                    items={categories}
                    visibleCount={5}
                    renderItem={(c, isSelected) => (
                        <box>
                            <text
                                style={{
                                    fg: isSelected ? "black" : "white",
                                    bg: isSelected ? "cyan" : "transparent"
                                }}
                                attributes={TextAttributes.BOLD}
                            >
                                {isSelected ? "> " : "- "}{c.name}
                            </text>
                        </box>
                    )}
                />
            </box>

            <Focusable onAction={() => navigate(Routes.CATEGORIES.ADD)}>
                {(isFocused) => (
                    <box
                        marginTop={2} borderStyle="rounded" borderColor={isFocused ? "cyan" : "green"} padding={1}>
                        <text
                            style={{ fg: isFocused ? "cyan" : "white" }}
                            attributes={TextAttributes.BOLD}
                        >
                            {isFocused ? "> " : "  "}[ + ] ADD NEW CATEGORY
                        </text>
                    </box>
                )}
            </Focusable>
        </box>
    );
}

