import { TextAttributes } from "@opentui/core";
import { useEffect } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { Routes } from "../../../../core/router/constants";


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

                {categories.map((c) => (
                    <box key={c.id}>
                        <text attributes={TextAttributes.BOLD}>- {c.name}</text>
                    </box>
                ))}
            </box>

            <box
                onMouseDown={() => navigate(Routes.CATEGORIES.ADD)}
                marginTop={2} borderStyle="rounded" borderColor="green" padding={1}>
                <text attributes={TextAttributes.BOLD}>
                    [ + ] ADD NEW CATEGORY
                </text>
            </box>
        </box>
    );
}

