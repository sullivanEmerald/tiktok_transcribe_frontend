"use client";
import React from 'react';
import { Metadata } from 'next';
import { useEffect, useMemo, useLayoutEffect } from "react";
import { useTranscription } from "@/hooks/useTranscribe";
import { formatCount, overviewContents } from "@/lib/utils";
import { useProfile } from '@/hooks/useProfileHook';
import { FileText, Download, Activity, CheckCircle } from 'lucide-react';
import ProfileOverview from "@/components/profile/overview";
import HistoryOverview from '@/components/profile/history';
import DownloadedOverview from '@/components/profile/downloads';
import { Loader } from '@/components/genreral/loader';

// export const metadata: Metadata = {
//     title: 'Profile Overview',
//     description: 'View your transcription activities and download history.',
// };


export default function GuestProfile() {
    const { getProfile, isLoading, statistics, transcribeHistory, downloads } = useProfile();

    useLayoutEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className='space-y-6'>
                    <ProfileOverview statistics={statistics} />
                    <HistoryOverview transcribeHistory={transcribeHistory} />
                    <DownloadedOverview downloads={downloads} />
                </div>
            )}
        </>
    );
}