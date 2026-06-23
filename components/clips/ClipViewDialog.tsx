"use client";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input"; // Removed Input import — use native textarea for multi-line editing
import { Button } from "@/components/ui/button";
import { updateClip } from "@/services/clip";
import { Clip } from "@/types/clips";
import { toast } from "react-toastify";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import LineLoader from "../genreral/lineLoader";
import { Textarea } from "@/components/ui/textarea"

export default function ClipViewDialog({
    open,
    clip,
    onOpenChange,
}: {
    open: boolean;
    clip: Clip | null;
    onOpenChange: (open: boolean) => void;
}) {
    const [value, setValue] = useState(clip?.text || "");
    const { handleEditClip, isEditing } = useStore(useShallow((state) => ({
        handleEditClip: state.handleEditClip,
        isEditing: state.isloading.isEditing,
    })));

    useEffect(() => {
        setValue(clip?.text || "");
    }, [clip]);

    if (!clip) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl border-none">
                <DialogHeader>
                    <DialogTitle>View Clip</DialogTitle>
                    <DialogDescription>View and edit the clip text below.</DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-48 p-3 rounded-md border border-input bg-transparent text-base resize-vertical"
                        placeholder="Clip text"
                    />
                </div>

                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isEditing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            await handleEditClip(clip._id, value.trim());
                            onOpenChange(false);
                        }}
                        disabled={isEditing || value.trim() === clip.text}
                        className="disabled:opacity-50 cursor-pointer"
                    >
                        {isEditing ? <LineLoader /> : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
