import React, { useEffect, useId, type ReactNode } from 'react';
import { useFocus } from './provider';

export * from './list';

interface FocusableProps {
    children: (isFocused: boolean, isActive: boolean) => ReactNode;
    id?: string;
    onAction?: () => void;
}

export function Focusable({ children, id: providedId, onAction }: FocusableProps) {
    const generatedId = useId();
    const id = providedId || generatedId;
    const { focusedId, isElementActive, register, unregister, setIsElementActive } = useFocus();

    const isFocused = focusedId === id;
    const isActive = isFocused && isElementActive;

    useEffect(() => {
        register(id);
        return () => unregister(id);
    }, [id, register, unregister]);

    useEffect(() => {
        if (isActive && onAction) {
            onAction();
            setIsElementActive(false);
        }
    }, [isActive, onAction, setIsElementActive]);

    return <>{children(isFocused, isActive)}</>;
}
