
export interface UserOverview {
    totalTranscriptions: number;
    totalDownloads: number;
    totalEngagements: number;
    successfulTranscriptionRate: number;
    successfulDownloadRate: number;
}


export interface DownloadOverview {
    thumbnail: string,
    duration: string,
    caption: string,
    source: string,
    videoUrl: string,
    createdAt: string,
}