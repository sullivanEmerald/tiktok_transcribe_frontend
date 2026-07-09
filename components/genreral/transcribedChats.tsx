import { History, ChevronLeft, X, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranscription } from "@/hooks/useTranscribe";
import { Skeleton } from "../ui/skeleton";
import moment from "moment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Edit2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { showToaster } from "@/lib/utils";
import { TranscribeService } from "@/services/transcribe";

interface TranscribedChatsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function TranscribedChats({ open, setOpen }: TranscribedChatsProps) {
    const { isFetching, fetchRecentTranscripts, recentTranscripts, setRecentTranscripts } = useTranscription();
    const [renameDialog, setRenameDialog] = useState<{ open: boolean; id: string | null; value: string }>({ open: false, id: null, value: "" });

    useEffect(() => {
        if (open) fetchRecentTranscripts();
    }, [open]);

    const handleRename = async () => {
        if (!renameDialog.id) return;
        if (renameDialog.value.trim() === "") {
            showToaster("Transcript name cannot be empty.", "error");
            return;
        }
        await TranscribeService.updateTranscriptName(renameDialog.id, renameDialog.value);
        setRecentTranscripts((prev) =>
            prev.map((transcript) =>
                transcript._id === renameDialog.id ? { ...transcript, title: renameDialog.value } : transcript
            )
        );
        setRenameDialog({ open: false, id: null, value: "" });
    };

    return (
        <aside className="w-80 h-screen bg-card md:bg-card/50 flex flex-col rounded-lg shadow-md shadow-card fixed left-0 top-0 z-30 overflow-auto transition-all duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/30 flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold text-primary/80">
                    History
                </h2>
                <Button
                    className="bg-white ml-auto group cursor-pointer"
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar"
                >
                    <X className="w-4 h-4 text-primary group-hover:text-white" />
                </Button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {isFetching ? (
                    <div className="px-5 py-4">
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                    </div>
                ) : recentTranscripts.length === 0 ? (
                    <div className="px-5 py-4 text-slate-400">You have no recent transcripts.</div>
                ) : (
                    recentTranscripts.map((chat, index) => (
                        <div key={chat._id} className="relative">
                            <Link
                                href={`/dashboard/transcript/${chat._id}`}
                                className="w-full flex flex-col px-5 py-4 border-b border-text hover:bg-[#0209b2]/5 transition group cursor-pointer rounded"
                                onClick={() => {
                                    // Only close sidebar on mobile
                                    if (window.innerWidth < 640) setOpen(false);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-medium text-foreground truncate">
                                        {chat.title !== null ? chat.title : chat.transcript}
                                    </h3>
                                </div>

                                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                    {chat.transcript || chat.transcript}
                                </p>
                                <span className="text-xs text-red-400 ml-auto mt-2">
                                    {chat?.createdAt ? (
                                        moment(chat.createdAt).isSame(moment(), 'day')
                                            ? `Today, ${moment(chat.createdAt).format('h:mm A')}`
                                            : moment(chat.createdAt).format('MMM D, YYYY, h:mm A')
                                    ) : ''}
                                </span>
                            </Link>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        className="p-1 absolute right-1 top-1 rounded-full hover:bg-slate-100 focus:outline-none"
                                        onClick={e => {
                                            e.stopPropagation();
                                        }}
                                        aria-label="Open actions"
                                        type="button"
                                    >
                                        <MoreVertical className="w-4 h-4 text-slate-500" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-40 p-2 border border-gray-700 bg-text text-foreground">
                                    <button
                                        className="flex items-center w-full px-2 py-1.5 rounded text-sm  cursor-pointer "
                                        onClick={e => {
                                            e.stopPropagation();
                                            setRenameDialog({ open: true, id: chat._id, value: chat.title !== null ? chat.title : chat.transcript || "" });
                                        }}
                                        type="button"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" /> <span className="">Rename</span>
                                    </button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    ))
                )}
            </div>
            <Dialog open={renameDialog.open} onOpenChange={open => setRenameDialog(r => ({ ...r, open }))}>
                <DialogContent className="border-none shadow-md bg-text text-foreground">
                    <DialogHeader>
                        <DialogTitle>Rename Transcript</DialogTitle>
                        <DialogDescription>Set a new name for this transcript.</DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleRename();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <Input
                            className="py-6 rounded-lg"
                            value={renameDialog.value}
                            onChange={e => setRenameDialog(r => ({ ...r, value: e.target.value }))}
                            autoFocus
                            placeholder="Transcript name"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setRenameDialog({ open: false, id: null, value: "" })}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </aside>
    );
}
