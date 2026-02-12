import { axiosInstance } from "@/lib/utils";
import { get } from "http";


export const TranscribeService = {
    createTranscription: async (videoUrl: string, captchaToken: string) => {
        const response = await axiosInstance.post('/transcription', {
            videoUrl,
            captchaToken
        });
        console.log("Transcription job created:", response.data);
        return {
            jobId: response.data.jobId
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
    }
}