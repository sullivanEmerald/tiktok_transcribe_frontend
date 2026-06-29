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
    const activeElementRef = useRef<HTMLDivElement | null>(null);

    const handleSelectionEnd = useCallback((e: Event) => {
        // Fix 3 — longer delay for touch events
        const delay = e.type === 'touchend' ? 100 : 20;

        setTimeout(() => {
            const selection = window.getSelection();

            if (!selection || selection.isCollapsed || !selection.toString().trim()) {
                setClipData(null);
                setCoords(null);
                return;
            }

            const range = selection.getRangeAt(0);

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

            // Fix 2 — clamp position so popover never goes off-screen on mobile
            const POPOVER_HEIGHT = 44;
            const top = rect.top < POPOVER_HEIGHT
                ? rect.bottom + window.scrollY + 8   // show below if too close to top
                : rect.top + window.scrollY - 8;     // show above normally

            const left = Math.min(
                Math.max(rect.left + window.scrollX, 80),
                window.innerWidth - 80
            );

            setCoords({
                top,
                left,
                width: rect.width,
                height: rect.height,
            });

            setClipData({
                text: selection.toString(),
                startTime,
                endTime,
            });
        }, delay); // Fix 3 — variable delay
    }, []);

    const clearSelection = useCallback((e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]')) {
            return;
        }
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setClipData(null);
            setCoords(null);
        }
    }, []);

    const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
        if (activeElementRef.current) {
            activeElementRef.current.removeEventListener("mouseup", handleSelectionEnd);
            activeElementRef.current.removeEventListener("touchend", handleSelectionEnd);
        }

        activeElementRef.current = node;

        if (node) {
            node.addEventListener("mouseup", handleSelectionEnd);
            node.addEventListener("touchend", handleSelectionEnd); // Fix 1 — already here, kept
        }
    }, [handleSelectionEnd]);

    useEffect(() => {
        document.addEventListener("mousedown", clearSelection);
        return () => document.removeEventListener("mousedown", clearSelection);
    }, [clearSelection]);

    // Fix 2 — suppress native mobile callout via inline style helper
    const transcriptContainerStyle: React.CSSProperties = {
        WebkitUserSelect: 'text',
        userSelect: 'text',
        WebkitTouchCallout: 'none' as any,
    };

    return { clipData, coords, containerRefCallback, setClipData, transcriptContainerStyle };
}