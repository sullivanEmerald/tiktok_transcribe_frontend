"use client"
import React from 'react';
import { useProfile } from '@/hooks/useProfileHook';
import { formatCount, overviewContentsTyped } from "@/lib/utils";
import { UserOverview } from '@/types/overview';
import { useMemo } from "react";
import moment from "moment";
import CustomTable, { CustomTableColumn } from '../genreral/Table';
import { TranscriptData } from '@/types/transcribe';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const PlatformIcons = {
    instagram: <FaInstagram className="w-5 h-5 text-pink-500" />,
    tiktok: <FaTiktok className="w-5 h-5 text-black dark:text-white" />,
    youtube: <FaYoutube className="w-5 h-5 text-red-500" />,
};


export default function HistoryOverview({ transcribeHistory }: { transcribeHistory: TranscriptData[] }) {
    const router = useRouter();
    const columns = useMemo<CustomTableColumn<TranscriptData>[]>(() => [
        {
            id: 'content',
            accessorFn: (row: any) => ({ transcript: row.transcript, username: row.metadata?.author?.username, views: row.metadata?.stats?.views, image: row.metadata?.media?.thumbnailUrl, title: row.title }),
            header: (): React.ReactNode => "Result",
            cell: (info: any) => {
                const { transcript, username, views, image, title } = info.value as { transcript: string; views?: number, username?: string, image: string, title: string };
                // const words = transcript.split(" ");
                // const fewWords = words.slice(0, 10).join(" ");
                return (
                    <div className="flex items-center gap-2">
                        <img
                            src={image}
                            alt="thumbnail"
                            className="rounded-full w-10 h-10 object-cover"
                        />
                        <div className='max-w-xs overflow-hidden'>
                            <span className="block truncate font-normal text-foreground">{title || transcript}</span>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>@{username}</span>
                                <span className="text-sm text-muted-foreground">{formatCount(views || 0)} views</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'description',
            accessorFn: (row: any) => row.metadata?.description || "",
            header: (): React.ReactNode => "Description",
            cell: (info: any) => {
                const description = (info.value as string) || "";
                // const words = description.split(" ");
                // const fewWords = words.slice(0, 5).join(" ");
                return (
                    <div className='max-w-xs overflow-hidden'>
                        <span className='block truncate text-muted-foreground'>
                            {description}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'platform',
            accessorFn: (row: any) => row.metadata?.platform || "",
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
        {
            accessorKey: "createdAt",
            header: () => "Transcribed",
            cell: (info: any) => <span className='text-muted-foreground'>{moment(info.value).format("MMMM Do YYYY")}</span>,
        },
    ], []);

    const handleOnRowClick = (data: TranscriptData) => {
        router.push(`/transcript/${data._id}`)
    }


    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Transcription Overview</h1>
                <p className="text-sm text-muted-foreground">
                    Your past transcription activities.
                </p>
            </div>
            <CustomTable
                columns={columns}
                data={transcribeHistory || []}
                onRowClick={handleOnRowClick}
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
            />
        </div>
    )
}   