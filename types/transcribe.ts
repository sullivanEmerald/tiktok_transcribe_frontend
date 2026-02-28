export interface TranscriptData {
    transcript: string;
    status?: string;
    jobId?: string;
    platform?: string,
    videoUrl?: string,
    utterances?: Array<{
        text: string;
        start: number;
        end: number;
    }>;
}

export type UtteranceType = {
    text: string;
    start: number;
    end?: number;
}

export interface RecentTranscriptData {
    transcript: string;
    createdAt?: string;
    jobId?: string;
    _id: string;
    platform?: string,
    videoUrl?: string,
    utterances?: Array<UtteranceType>;
}