// components/clips/ClipRowActions.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Pencil, FolderInput, Trash2, Check, X, Folder, Plus } from "lucide-react";
import { Clip } from "@/types/clips";
import { toast } from "react-toastify";
import { useStore } from "@/stores/store";
import LineLoader from "../genreral/lineLoader";
import { useShallow } from "zustand/react/shallow";
import AddNewCollection from "./AddNewCollection";
import { giveClipTitle } from "@/services/clip";
import { Input } from "../ui/input";

interface Collection {
    _id: string;
    name: string;
}

interface ClipRowActionsProps {
    clip: Clip | null;
    anchorEl: HTMLTableRowElement | null;
    collections: Collection[];
    onClose: () => void;
    onRenamed: (clipId: string, newText: string) => void;
    onMoved: (clipId: string, collectionId: string | null) => void;
    onDeleted: (clipId: string) => void;
    onMouseEnter?: () => void;
}

type View = 'main' | 'rename' | 'move';

export default function ClipRowActions({
    clip,
    anchorEl,
    collections,
    onClose,
    onRenamed,
    onMoved,
    onDeleted,
    onMouseEnter
}: ClipRowActionsProps) {
    const [view, setView] = useState<View>('main');
    const [renameValue, setRenameValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);
    const { isMoving, handleMoveClip, isDeleteing, deleteClip, isGivingTitle, giveClipTitle } = useStore(useShallow((state) => ({
        isMoving: state.isloading.isMoving,
        handleMoveClip: state.handleMoveClip,
        isDeleteing: state.isloading.isDeleteing,
        deleteClip: state.deleteClip,
        isGivingTitle: state.isloading.isGivingTitle,
        giveClipTitle: state.giveClipTitle,
    })));
    const [open, setOpen] = useState(false);
    const [isMovingId, setIsMovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!anchorEl) return;
        const rect = anchorEl.getBoundingClientRect();
        setPos({
            top: rect.top + window.scrollY + rect.height / 2,
            left: rect.right + window.scrollX - 12,
        });
    }, [anchorEl]);

    useEffect(() => {
        if (clip) {
            setView('main');
            setRenameValue(clip?.title ?? "");
        }
    }, [clip?._id]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (open) return; // don't close popover while dialog is open
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                anchorEl &&
                !anchorEl.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [anchorEl, onClose, open]);

    const handleRename = useCallback(async () => {
        if (!clip || !renameValue.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/clips/${clip._id}/rename`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: renameValue.trim() }),
            });
            if (!res.ok) throw new Error();
            onRenamed(clip._id, renameValue.trim());
            toast.success("Clip updated");
            onClose();
        } catch {
            toast.error("Failed to rename clip");
        } finally {
            setIsLoading(false);
        }
    }, [clip, renameValue, onRenamed, onClose]);



    if (!clip || !anchorEl) return null;




    return (
        <>
            <div
                ref={popoverRef}
                style={{
                    position: "absolute",
                    top: pos.top,
                    left: pos.left,
                    transform: "translate(-100%, -50%)",
                    zIndex: 50,
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={() => {
                    if (open) return;
                    onClose();
                }}
            >
                {/* ── Main toolbar ── */}
                {view === 'main' && (
                    <div className="flex items-center gap-0.5 bg-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-shadow-background px-1 py-1">
                        {/* Rename */}
                        { }
                        <button
                            onClick={() => setView('rename')}
                            title="Give clip a title"
                            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>

                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

                        {/* Move to folder */}
                        <button
                            onClick={() => setView('move')}
                            title="Move to folder"
                            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                        >
                            <FolderInput className="w-4 h-4" />
                        </button>

                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

                        {/* Delete */}
                        {isMovingId === clip._id ? (
                            <LineLoader text='primary' />
                        ) : (
                            <button
                                onClick={async () => {
                                    setIsMovingId(clip._id);
                                    await deleteClip(clip._id);
                                    setIsMovingId(null);
                                }}
                                disabled={isDeleteing || isMoving || isLoading}
                                title="Delete"
                                className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-red-500 hover:bg-background transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* ── Rename inline ── */}
                {view === 'rename' && (
                    <div className="flex items-center gap-1 bg-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-shadow-background px-2 py-1.5">
                        <button
                            onClick={() => setView('main')}
                            title="Cancel"
                            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <Input
                            autoFocus
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            disabled={isLoading || isGivingTitle}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    setIsMovingId(clip._id);
                                    await giveClipTitle(clip._id, renameValue);
                                    setIsMovingId(null);
                                }
                                if (e.key === 'Escape') setView('main');
                            }}
                            className="w-48 px-2 py-1 text-sm bg-background text-foreground border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-primary"
                        />
                        <button
                            onClick={async () => {
                                setIsMovingId(clip._id);
                                await giveClipTitle(clip._id, renameValue);
                                setIsMovingId(null);
                            }}
                            disabled={isLoading || !renameValue.trim()}
                            title="Save"
                            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-primary hover:bg-background transition-colors disabled:opacity-50"
                        >
                            {isGivingTitle && clip._id === isMovingId ? (
                                <LineLoader text="primary" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                )}

                {/* ── Move to folder dropdown ── */}
                {view === 'move' && (
                    <div className="bg-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-shadow-background overflow-hidden min-w-[180px]">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setView('main')}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ←
                            </button>
                            <span className="text-xs font-medium text-muted-foreground">Move to folder</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1">
                            {collections.map((col) => (
                                isMoving && isMovingId === col._id ? (
                                    <div key={col._id} className="px-3 py-1">
                                        <LineLoader className="w-4 h-4 flex-shrink-0" text="red" />
                                    </div>
                                ) : (
                                    <button
                                        key={col._id}
                                        onClick={async () => {
                                            setIsMovingId(col._id);
                                            await handleMoveClip(clip._id, col._id);
                                            setIsMovingId(null);
                                        }}
                                        disabled={isLoading || isMoving || isDeleteing}
                                        className="w-full text-sm text-foreground hover:bg-background transition-colors cursor-pointer disabled:opacity-50 truncate flex items-center gap-2 px-3 py-1 mb-2"
                                    >
                                        <Folder className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                                        {col.name.charAt(0).toUpperCase() + col.name.slice(1)}
                                    </button>
                                )
                            ))}
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 cursor-pointer border-t border-t-border py-2 mt-2"
                                onClick={(e) => {
                                    // e.preventDefault();
                                    e.stopPropagation();
                                    setOpen(true);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                <span className='text-sm text-foreground'>New</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <AddNewCollection show={open} onHide={() => setOpen(false)} />

        </>
    );
}