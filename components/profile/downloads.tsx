"use client"
import React from 'react';
import { useProfile } from '@/hooks/useProfileHook';
import { formatCount, overviewContentsTyped } from "@/lib/utils";
import { UserOverview } from '@/types/overview';
import { useMemo } from "react";
import moment from "moment";
import CustomTable, { CustomTableColumn } from '../genreral/Table';
import { TranscriptData } from '@/types/transcribe';
import { useRouter } from 'next/navigation';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { DownloadOverview } from '@/types/overview';
import Link from 'next/link';
import PlatformIcons from '@/lib/icons';

// const PlatformIcons = {
//     instagram: <FaInstagram className="w-5 h-5 text-pink-500" />,
//     tiktok: <FaTiktok className="w-5 h-5 text-black dark:text-white" />,
//     youtube: <FaYoutube className="w-5 h-5 text-red-500" />,
// };


export default function DownloadedOverview({ downloads }: { downloads: DownloadOverview[] }) {
    const router = useRouter();
    const columns = useMemo<CustomTableColumn<DownloadOverview>[]>(() => [
        {
            id: 'thumbnail',
            accessorFn: (row: any) => ({ thumbnail: row.thumbnail, caption: row.caption }),
            accessorKey: "thumbnail",
            header: () => "Content",
            cell: (info: any) => {
                const { thumbnail, caption } = info.value as { thumbnail: string; caption: string };
                return (
                    <div className="flex items-center gap-2">
                        <img
                            src={thumbnail}
                            alt="thumbnail"
                            className="rounded-full w-10 h-10 object-cover"
                        />
                        <div className='max-w-xs overflow-hidden'>
                            <span className="block truncate font-normal text-foreground">{caption}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "duration",
            header: () => "Duration",
            cell: (info: any) => {
                const duration = (info.value as string) || "";
                return (
                    <span className='text-muted-foreground'>{duration}s</span>
                );
            },
        },
        {
            accessorKey: "videoUrl",
            header: () => "Visit",
            cell: (info: any) => {
                const videoUrl = (info.value as string) || "";
                return (
                    <Link href={videoUrl} target="_blank" className="text-primary underline">
                        Watch
                    </Link>
                );
            },
        },
        {
            accessorKey: "source",
            header: () => "Platform",
            cell: (info: any) => {
                const source = (info.value.split(".")[0] as string) || "";
                const icon = PlatformIcons[source.toLowerCase() as keyof typeof PlatformIcons]
                return (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-8 h-8">{icon}</span>
                        {source}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: () => "Downloaded",
            cell: (info: any) => <span className='text-muted-foreground'>{moment(info.value).format("MMMM Do YYYY")}</span>,
        },
    ], []);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Download Overview</h1>
                <p className="text-sm text-muted-foreground">
                    Your past download activities.
                </p>
            </div>
            <CustomTable
                columns={columns}
                data={downloads || []}
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
            />
        </div>
    )
}   