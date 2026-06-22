"use client";
import { Loader } from '@/components/genreral/loader';
import { useStore } from '@/stores/store';
import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { useShallow } from "zustand/react/shallow";
import CustomTable from '@/components/genreral/Table';
import { CustomTableColumn } from '@/components/genreral/Table';
import { TranscriptData } from '@/types/transcribe';
import { formatCount } from '@/lib/utils';
import moment from 'moment';
import PlatformIcons from '@/lib/icons';
import { Clip } from '@/types/clips';
import Link from 'next/link';
import ClipsFilterSelection from '@/components/clips/filter';
import ClipRowActions from '@/components/clips/ClipHovered';
import ClipViewDialog from '@/components/clips/ClipViewDialog';

// export const metadata: Metadata = {
//     title: 'Profile Overview',
//     description: 'View your transcription activities and download history.',
// };


export default function UserClips() {
    const { clips, isLoading, getAllClips, ClipsFilter, collections } = useStore(useShallow((state) => ({
        clips: state.clips,
        isLoading: state.isloading.isfetching,
        getAllClips: state.getAllClips,
        ClipsFilter: state.clipFilters,
        collections: state.collections,

    })));
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);
    const [hoveredClip, setHoveredClip] = useState<Clip | null>(null);
    const [hoveredAnchor, setHoveredAnchor] = useState<HTMLTableRowElement | null>(null);

    const [activeClip, setActiveClip] = useState<Clip | null>(null);
    const [viewOpen, setViewOpen] = useState(false);

    useEffect(() => {
        const params = {
            platform: ClipsFilter.platform,
            collectionId: ClipsFilter.collectionId,
            search: ClipsFilter.search,
            currentPage: ClipsFilter.currentPage,
            limit: ClipsFilter.limit,
        };
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== '' && v != null && v !== undefined)
        );
        getAllClips(cleanParams);
    }, [
        ClipsFilter.platform,
        ClipsFilter.collectionId,
        ClipsFilter.search,
        ClipsFilter.currentPage,
        ClipsFilter.limit,
    ]);

    const columns = useMemo<CustomTableColumn<Clip>[]>(() => [
        {
            id: 'title',
            accessorFn: (row: any) => row.title || "-",
            header: (): React.ReactNode => "Title",
            cell: (info: any) => {
                const title = (info.value as string) || "-";
                return (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        {title}
                    </div>
                );
            },
        },
        {
            id: 'text',
            accessorFn: (row: any) => ({ clip: row.text, createdAt: row.createdAt, }),
            header: (): React.ReactNode => "Clips",
            cell: (info: any) => {
                const { clip, createdAt } = info.value as { clip: string; createdAt: string };
                // const words = transcript.split(" ");
                // const fewWords = words.slice(0, 10).join(" ");
                return (
                    <div className="flex items-center gap-2">
                        <div className='max-w-xs overflow-hidden'>
                            <span className="block truncate font-normal text-foreground">{clip}</span>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>{moment(createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        // {
        //     accessorKey: "videoUrl",
        //     header: () => "Visit",
        //     cell: (info: any) => (
        //         <Link href={info.value} target="_blank" className="text-primary underline cursor-pointer">
        //             visit
        //         </Link>
        //     ),
        // },
        {
            id: "expand",
            accessorFn: (row: any) => ({ clip: row.text }),
            header: () => "Expand",
            cell: (info: any) => {
                const row = info.row as Clip;
                return (
                    <button
                        className="text-primary underline cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveClip(row);
                            setViewOpen(true);
                        }}
                    >
                        View
                    </button>
                );
            },
        },
        {
            id: 'length',
            accessorFn: (row: any) => ({ startTime: row.startTime, endTime: row.endTime }),
            header: (): React.ReactNode => "Length",
            cell: (info: any) => {
                const { startTime, endTime } = info.value as { startTime: string; endTime: string };
                return (
                    <div className='max-w-xs overflow-hidden'>
                        <span className='block truncate text-muted-foreground'>
                            {startTime}s - {endTime}s
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'platform',
            accessorFn: (row: any) => row.platform || "",
            header: (): React.ReactNode => "Platform",
            cell: (info: any) => {
                const platform = (info.value as string) || "";
                const icon = PlatformIcons[platform.toLowerCase() as keyof typeof PlatformIcons]
                return (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-8 h-8">{icon}</span>
                        {platform}
                    </div>
                );
            },
        },

    ], [setActiveClip, setViewOpen]);

    // Small delay before hiding so user can move mouse into the popover
    const handleRowHover = useCallback((row: Clip, anchor: HTMLTableRowElement) => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setHoveredClip(row);
        setHoveredAnchor(anchor);
    }, []);

    const handleRowHoverEnd = useCallback(() => {
        hideTimeout.current = setTimeout(() => {
            setHoveredClip(null);
            setHoveredAnchor(null);
        }, 200); // 200ms grace period to move into popover
    }, []);

    const cancelHide = useCallback(() => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
    }, []);

    return (
        <main className='space-y-4'>
            <div>
                <h1 className="text-2xl font-bold">Clips Library</h1>
                <p className="text-sm text-muted-foreground">
                    Your created clips from various platforms.
                </p>
            </div>
            <ClipsFilterSelection />
            {isLoading ? (
                <Loader />
            ) : (
                <div className="space-y-2">
                    <CustomTable
                        columns={columns}
                        data={clips || []}
                        currentPage={1}
                        totalPages={1}
                        onPageChange={() => { }}
                        onRowHover={handleRowHover}
                        onRowHoverEnd={handleRowHoverEnd}
                    />
                </div>
            )}
            <ClipRowActions
                clip={hoveredClip}
                anchorEl={hoveredAnchor}
                collections={collections}
                onClose={() => {
                    setHoveredClip(null);
                    setHoveredAnchor(null);
                }}
                onRenamed={() => { }}
                onMoved={() => { }}
                onDeleted={() => { }}
                onMouseEnter={cancelHide}
            />
            <ClipViewDialog
                open={viewOpen}
                clip={activeClip}
                onOpenChange={(open: boolean) => {
                    setViewOpen(open);
                    if (!open) setActiveClip(null);
                }}
            />
        </main>
    )
}