import React, { useState, useEffect, type ReactNode } from 'react';
import { useKeyboard } from '@opentui/react';
import { Focusable } from './index';

interface FocusableListProps<T> {
    items: T[];
    visibleCount: number;
    renderItem: (item: T, isSelected: boolean) => ReactNode;
    onItemAction?: (item: T, keyName: string) => void;
    id?: string;
    gap?: number;
}

export function FocusableList<T>({
    items,
    visibleCount,
    renderItem,
    onItemAction,
    id,
    gap = 0
}: FocusableListProps<T>) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);

    // Keep selectedIndex in bounds if items change
    useEffect(() => {
        if (selectedIndex >= items.length) {
            setSelectedIndex(Math.max(0, items.length - 1));
        }
    }, [items.length]);

    // Ensure scrollOffset is valid
    useEffect(() => {
        if (scrollOffset > Math.max(0, items.length - visibleCount)) {
            setScrollOffset(Math.max(0, items.length - visibleCount));
        }
    }, [items.length, visibleCount, scrollOffset]);


    const handleKeyDown = (keyName: string, isActive: boolean) => {
        if (!isActive) return;

        if (keyName === 'up') {
            setSelectedIndex((prev) => {
                const next = prev > 0 ? prev - 1 : prev;
                // Update scroll
                if (next < scrollOffset) {
                    setScrollOffset(next);
                }
                return next;
            });
        } else if (keyName === 'down') {
            setSelectedIndex((prev) => {
                const next = prev < items.length - 1 ? prev + 1 : prev;
                // Update scroll
                if (next >= scrollOffset + visibleCount) {
                    setScrollOffset(next - visibleCount + 1);
                }
                return next;
            });
        } else if (onItemAction && items[selectedIndex]) {
            onItemAction(items[selectedIndex], keyName);
        }
    };

    const visibleItems = items.slice(scrollOffset, scrollOffset + visibleCount);

    return (
        <Focusable id={id}>
            {(isFocused, isActive) => {
                // We use a custom keyboard hook behavior here or just rely on global keyboard if active
                // To keep it simple, we'll use a local useKeyboard enabled only when isActive
                return (
                    <box flexDirection="column">
                        <ListKeyboardHandler
                            isActive={isActive}
                            onKey={(key) => handleKeyDown(key, isActive)}
                        />
                        <box
                            flexDirection="column"
                            borderStyle={isFocused ? "double" : "single"}
                            borderColor={isActive ? "cyan" : (isFocused ? "white" : "grey")}
                            padding={1}
                            gap={gap}
                        >
                            {scrollOffset > 0 && (
                                <text style={{ fg: "grey" }}>^ {scrollOffset} more above</text>
                            )}

                            {visibleItems.map((item, index) => {
                                const realIndex = index + scrollOffset;
                                return (
                                    <React.Fragment key={realIndex}>
                                        {renderItem(item, realIndex === selectedIndex && isActive)}
                                    </React.Fragment>
                                );
                            })}

                            {items.length > scrollOffset + visibleCount && (
                                <text style={{ fg: "grey" }}>
                                    v {items.length - (scrollOffset + visibleCount)} more below
                                </text>
                            )}
                        </box>
                    </box>
                );
            }}
        </Focusable>
    );
}

function ListKeyboardHandler({ isActive, onKey }: { isActive: boolean; onKey: (name: string) => void }) {
    useKeyboard((key) => {
        if (isActive) {
            onKey(key.name);
        }
    });
    return null;
}
