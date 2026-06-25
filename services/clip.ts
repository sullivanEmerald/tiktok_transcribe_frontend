import { axiosInstance } from "@/lib/utils";
import { showToaster } from "@/lib/utils";

type ClipInterface = {
    videoUrl: string | undefined,
    text: string,
    startTime: string,
    endTime: string,
    platform: string | undefined,
}

export const createClip = async (data: ClipInterface) => {
    if (!data.videoUrl || !data.text || !data.startTime || !data.endTime || !data.platform) {
        throw new Error("Missing required clip data, Try again or contact support");
    }
    try {
        const response = await axiosInstance.post(`/clips/create`, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching user overview:", error);
        throw error;
    }
};

export const fetchClips = async (filters: any) => {
    try {
        const response = await axiosInstance.get(`/clips`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching clips:", error);
        throw error;
    }
};

export const moveClipToCollection = async (clipId: string, collectionId: string) => {
    try {
        const response = await axiosInstance.patch(`/clips/${clipId}/move`, { collectionId });
        return response.data;
    } catch (error) {
        console.error("Error moving clip:", error);
        throw error;
    }
};

export const updateClip = async (clipId: string, text: string) => {
    try {
        const response = await axiosInstance.patch(`/clips/${clipId}`, { text });
        return response.data;
    } catch (error) {
        console.error("Error updating clip:", error);
        throw error;
    }
};

export const deleteClip = async (clipId: string) => {
    try {
        const response = await axiosInstance.delete(`/clips/${clipId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting clip:", error);
        throw error;
    }
};


export const giveClipTitle = async (clipId: string, title: string) => {
    try {
        const response = await axiosInstance.patch(`/clips/${clipId}/title`, { title });
        return response.data;
    } catch (error) {
        console.error("Error updating clip title:", error);
        throw error;
    }
};
