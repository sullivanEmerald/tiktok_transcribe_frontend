import { axiosInstance } from "@/lib/utils";

export const CreateCollection = async (name: string) => {
    try {
        const response = await axiosInstance.post(`/collections/create`, { name });
        return response.data;
    } catch (error) {
        console.error("Error fetching user overview:", error);
        throw error;
    }
};

export const getAllCollections = async () => {
    try {
        const response = await axiosInstance.get(`/collections`);
        console.log("getAllCollections response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all collections:", error);
        throw error;
    }
};
