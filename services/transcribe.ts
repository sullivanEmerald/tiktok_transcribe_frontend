import { axiosInstance } from "@/lib/utils";
import { sendGTMEvent } from '@next/third-parties/google';

type Utterance = {
    text: string;
    start: number;
    end: number;
}

export const TranscribeService = {
    createTranscription: async (videoUrl: string, captchaToken?: string | null) => {
        try {
            const response = await axiosInstance.post('/transcription', {
                videoUrl,
                captchaToken
            });
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            console.log(error?.response?.data);
            throw error;
        }
    },

    getJobStatus: async (id: string) => {
        const response = await axiosInstance.get(`/transcription/${id}/status`);
        console.log(`Status for job ${id}:`, response.data);
        return {
            progress: response.data.progress,
            status: response.data.status
        }
    },

    getJobResult: async (id: string) => {
        const response = await axiosInstance.get(`/transcription/${id}/result`);
        console.log(`Result for job ${id}:`, response.data);
        return response.data;
    },

    getRecentTranscripts: async () => {
        const response = await axiosInstance.get('/transcription/recent');
        console.log("Recent transcripts fetched:", response.data);
        return response.data;
    },

    getTranscriptById: async (id: string) => {
        const response = await axiosInstance.get(`/transcription/${id}`);
        console.log(`Transcript for job ${id} fetched:`, response.data);
        return response.data;
    },

    getVideoUrl: async (jobId: string) => {
        console.log(`Fetching video URL for job ${jobId}`);
        const response = await axiosInstance.get(`/transcription/${jobId}/download`);
        console.log(`Video URL for job ${jobId} fetched:`, response.data);
        return response.data;
    },

    updateTranscriptName: async (id: string, newName: string) => {
        const response = await axiosInstance.put(`/transcription/${id}/rename`, { newName });
        console.log(`Transcript ${id} renamed to ${newName}:`, response.data);
        return response.data;
    },

    improveTranscript: async (utterances: Utterance[] | undefined) => {
        if (!utterances?.length) return;
        try {
            const response = await axiosInstance.post('/transcription/improve', { utterances });
            console.log(`AI improvement for video ${utterances} fetched:`, response.data);
            return response.data;
        } catch (error) {
            console.log(`Error fetching AI improvement for video ${utterances}:`, error);
            throw error;
        }
    }

}