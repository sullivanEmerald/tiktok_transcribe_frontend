import { axiosInstance } from "@/lib/utils";

export const getUserOverview = async () => {
    try {
        const response = await axiosInstance.get(`/users/overview`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user overview:", error);
        throw error;
    }
};
