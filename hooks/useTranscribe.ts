import { useState, useCallback, useEffect } from "react"
import { TranscriptData, RecentTranscriptData } from "@/types/transcribe";
import { TranscribeService } from "@/services/transcribe";
import { showToaster } from "@/lib/utils";
import { downloadService } from "@/services/download";
import { sendGTMEvent } from '@next/third-parties/google';
import { detectPlatform } from "@/lib/utils";


export function useTranscription() {
    const [recentTranscripts, setRecentTranscripts] = useState<RecentTranscriptData[]>([]);
    const [transcript, setTranscript] = useState<TranscriptData | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);


    const fetchRecentTranscripts = useCallback(async () => {
        setIsFetching(true);
        try {
            const res = await TranscribeService.getRecentTranscripts();
            setRecentTranscripts(res);
        } catch (error) {
            console.error("Error fetching recent transcripts:", error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    const submitTranscription = useCallback(
        async (videoUrl: string, captchaToken?: string | null) => {
            setLoading(true);
            setError(null);

            try {
                const response = await TranscribeService.createTranscription(videoUrl, captchaToken);
                setTranscript(response.data);
                sendGTMEvent({
                    event: 'transcription_created',
                    platform: detectPlatform(videoUrl),
                    videoUrl
                });
            } catch (err: any) {
                const errorMessage = err?.response?.data;
                if (errorMessage?.requireCaptcha) {
                    setShowCaptcha(true);
                    showToaster(errorMessage.message, "error");
                    return;
                }
                showToaster(err.response?.data?.message || "Failed to generate transcript", "error");
            } finally {
                setLoading(false);
            }
        },
        []);

    const downloadVideo = async (videoUrl: string, captchaToken?: string | null) => {
        if (!videoUrl) return;

        setIsDownloading(true);

        try {
            const result = await downloadService.downloadVideo(videoUrl, captchaToken);
            console.log(result);
        } catch (error) {
            console.error("Error downloading video:", error);
        } finally {
            setIsDownloading(false);
        }
    }



    return {
        loading,
        error,
        transcript,
        submitTranscription,
        isFetching,
        recentTranscripts,
        fetchRecentTranscripts,
        isDownloading,
        downloadVideo,
        showCaptcha,
    }
}