import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useKeyboard } from '@opentui/react';

interface FocusContextType {
    focusedId: string | null;
    isElementActive: boolean;
    register: (id: string) => void;
    unregister: (id: string) => void;
    setFocusedId: (id: string | null) => void;
    setIsElementActive: (active: boolean) => void;
    moveNext: () => void;
    movePrev: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
    const [elements, setElements] = useState<string[]>([]);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [isElementActive, setIsElementActive] = useState(false);

    const register = useCallback((id: string) => {
        setElements((prev) => [...new Set([...prev, id])]);
    }, []);

    const unregister = useCallback((id: string) => {
        setElements((prev) => prev.filter((el) => el !== id));
        setFocusedId((prev) => (prev === id ? null : prev));
    }, []);

    const moveNext = useCallback(() => {
        if (isElementActive) return;
        setElements((currentElements) => {
            if (currentElements.length === 0) return currentElements;
            const currentIndex = focusedId ? currentElements.indexOf(focusedId) : -1;
            const nextIndex = (currentIndex + 1) % currentElements.length;
            setFocusedId(currentElements[nextIndex] ?? null);
            return currentElements;
        });
    }, [focusedId, isElementActive]);

    const movePrev = useCallback(() => {
        if (isElementActive) return;
        setElements((currentElements) => {
            if (currentElements.length === 0) return currentElements;
            const currentIndex = focusedId ? currentElements.indexOf(focusedId) : -1;
            const prevIndex = (currentIndex - 1 + currentElements.length) % currentElements.length;
            setFocusedId(currentElements[prevIndex] ?? null);
            return currentElements;
        });
    }, [focusedId, isElementActive]);

    useKeyboard((key) => {
        if (isElementActive && key.name !== 'escape') return;

        switch (key.name) {
            case 'up':
            case 'left':
                movePrev();
                break;
            case 'down':
            case 'right':
                moveNext();
                break;
            case 'space':
                if (focusedId) setIsElementActive(true);
                break;
            case 'escape':
                setIsElementActive(false);
                break;
        }
    });

    // Initialize focus if none exists
    useEffect(() => {
        if (!focusedId && elements.length > 0) {
            setFocusedId(elements[0] ?? null);
        }
    }, [elements, focusedId]);

    return (
        <FocusContext.Provider
            value={{
                focusedId,
                isElementActive,
                register,
                unregister,
                setFocusedId,
                setIsElementActive,
                moveNext,
                movePrev,
            }}
        >
            {children}
        </FocusContext.Provider>
    );
}

export function useFocus() {
    const context = useContext(FocusContext);
    if (!context) {
        throw new Error('useFocus must be used within a FocusProvider');
    }
    return context;
}
