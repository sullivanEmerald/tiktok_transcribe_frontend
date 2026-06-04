import { getUserOverview } from "@/services/profile";
import { useState } from "react";
import { UserOverview } from "@/types/overview";
import { TranscriptData } from "@/types/transcribe";
import { DownloadOverview } from "@/types/overview";

export const useProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statistics, setStatistics] = useState<UserOverview | null>(null);
    const [transcribeHistory, setTranscribeHistory] = useState<TranscriptData[]>([]);
    const [downloads, setDownloads] = useState<DownloadOverview[]>([]);
    const getProfile = async () => {
        setIsLoading(true);
        try {
            const profile = await getUserOverview();
            console.log('User Overview:', profile);
            setStatistics(profile.statistics);
            setTranscribeHistory(profile.transcriptions);
            setDownloads(profile.downloads);
            return profile;
        } catch (error) {
            console.error("Error fetching user overview:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { getProfile, isLoading, statistics, transcribeHistory, downloads };
}