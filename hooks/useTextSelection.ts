// hooks/useTextSelection.ts
import { useState, useEffect, useCallback, useRef } from "react";

export interface SelectionCoords {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface ClipData {
    text: string;
    startTime: number;
    endTime: number;
}

export function useTextSelection() {
    const [clipData, setClipData] = useState<ClipData | null>(null);
    const [coords, setCoords] = useState<SelectionCoords | null>(null);

    // Keep track of the active element internally
    const activeElementRef = useRef<HTMLDivElement | null>(null);

    const handleSelectionEnd = useCallback(() => {
        setTimeout(() => {
            const selection = window.getSelection();

            if (!selection || selection.isCollapsed || !selection.toString().trim()) {
                setClipData(null);
                setCoords(null);
                return;
            }

            const range = selection.getRangeAt(0);

            // Safety boundary verification using our active tracking element
            if (activeElementRef.current && !activeElementRef.current.contains(range.commonAncestorContainer)) {
                return;
            }

            const getClosestTimestampElement = (node: Node | null) => {
                if (!node) return null;
                const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
                return element?.closest("[data-start]");
            };

            const startElement = getClosestTimestampElement(range.startContainer);
            const endElement = getClosestTimestampElement(range.endContainer);

            const startTime = parseFloat(startElement?.getAttribute("data-start") ?? "0");
            const endTime = parseFloat(endElement?.getAttribute("data-end") ?? startElement?.getAttribute("data-end") ?? "0");

            const rect = range.getBoundingClientRect();

            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
            });

            setClipData({
                text: selection.toString(),
                startTime,
                endTime,
            });
        }, 20);
    }, []);

    // Inside hooks/useTextSelection.ts
    const clearSelection = useCallback((e: MouseEvent) => {
        // If the user clicked inside the popover overlay itself, do nothing
        if ((e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]')) {
            return;
        }

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setClipData(null);
            setCoords(null);
        }
    }, []);

    // The secret sauce: A callback ref that runs every time the DOM node mounts/unmounts
    const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
        // 1. Clean up old listeners from the previous node if it exists
        if (activeElementRef.current) {
            activeElementRef.current.removeEventListener("mouseup", handleSelectionEnd);
            activeElementRef.current.removeEventListener("touchend", handleSelectionEnd);
        }

        // 2. Assign the new active node
        activeElementRef.current = node;

        // 3. Bind clean listeners to the fresh DOM layout
        if (node) {
            node.addEventListener("mouseup", handleSelectionEnd);
            node.addEventListener("touchend", handleSelectionEnd);
        }
    }, [handleSelectionEnd]);

    // Global listener tracking to reset the popover state on empty outside clicks
    useEffect(() => {
        document.addEventListener("mousedown", clearSelection);
        return () => document.removeEventListener("mousedown", clearSelection);
    }, [clearSelection]);

    return { clipData, coords, containerRefCallback, setClipData };
}