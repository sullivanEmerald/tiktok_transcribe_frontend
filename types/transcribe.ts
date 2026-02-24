export interface TranscriptData {
    transcript: string;
    status?: string;
    jobId?: string;
}

export interface RecentTranscriptData {
    transcript: string;
    createdAt?: string;
    jobId?: string;
    _id: string;
}