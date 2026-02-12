import { History, ChevronLeft, X } from "lucide-react";
import { useEffect } from "react";
import { useTranscription } from "@/hooks/useTranscribe";
import { Skeleton } from "../ui/skeleton";
import moment from "moment";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TranscribedChatsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function TranscribedChats({ open, setOpen }: TranscribedChatsProps) {
    const { isFetching, fetchRecentTranscripts, recentTranscripts } = useTranscription();

    useEffect(() => {
        if (open) fetchRecentTranscripts();
    }, [fetchRecentTranscripts, open]);

    if (!open) {
        return (
            // <Button
            //     className="bg-white border border-slate-200 rounded-r-lg shadow px-2 py-1 flex items-center transition-all duration-300 hover:bg-slate-50 fixed top-4 left-0 z-40"
            //     onClick={() => setOpen(true)}
            //     aria-label="Open sidebar"
            // >
            //     <ChevronLeft className="w-4 h-4 text-primary" />
            // </Button>
            null
        );
    }

    return (
        <aside className="w-80 h-screen border border-slate-200 bg-white flex flex-col rounded-lg shadow-sm fixed left-0 top-0 z-30 overflow-auto transition-all duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0209b2]" />
                <h2 className="text-lg font-bold text-primary">
                    Recent Transcripts
                </h2>
                <Button
                    className="bg-white ml-auto hover:bg-transparent cursor-pointer"
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar"
                >
                    <X className="w-4 h-4 text-primary" />
                </Button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {isFetching ? (
                    <div className="px-5 py-4">
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                    </div>
                ) : recentTranscripts.length === 0 ? (
                    <div className="px-5 py-4 text-slate-400">You have no recent transcripts.</div>
                ) : (
                    recentTranscripts.map((chat, index) => (
                        <Link
                            href={`/transcript/${chat._id}`}
                            key={index}
                            className="w-full flex flex-col px-5 py-4 border-b border-slate-100 hover:bg-[#0209b2]/5 transition group cursor-pointer"
                            onClick={() => {
                                // Only close sidebar on mobile
                                if (window.innerWidth < 640) setOpen(false);
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-medium text-slate-900 truncate">
                                    {chat.transcript || chat.transcript?.slice(0, 5)}
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
                            {/* Active indicator (future selection state) */}
                            <div className="mt-2 h-0.5 w-0 bg-[#0209b2] group-hover:w-8 transition-all" />
                        </Link>
                    ))
                )}
            </div>
        </aside>
    );
}
