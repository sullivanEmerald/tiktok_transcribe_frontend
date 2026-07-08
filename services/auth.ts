import { axiosInstance } from "@/lib/utils";
import { showToaster } from "@/lib/utils";


export const login = async (data: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error);
        showToaster(error.response?.data?.message || "Login failed. Please try again.", "error");
        throw error;
    }
};

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    } catch (error: any) {
        console.error("Registration error:", error);
        showToaster(error.response?.data?.message || "Registration failed. Please try again.", "error");
        throw error;
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        return response.data;
    } catch (error: any) {
        showToaster(error?.response?.data?.message || "An error occurred while verifying email. Please try again.");
        throw error;
    }
};

export const changePassword = async (passwords: any) => {
    try {
        const response = await axiosInstance.post("/auth/change-password", passwords);
        return response.data;
    } catch (error: any) {
        showToaster(error?.response?.data?.message || "An error occurred while changing password. Please try again.");
        throw error;
    };
};


export const resendVerificationEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post("/auth/resend-verification-email", { email });
        return response.data;
    } catch (error: any) {
        if (error.status === 500) {
            showToaster("An error occurred while resending verification email. Please try again later.", "error");
        } else {
            showToaster(error?.response?.data?.message || "An error occurred while resending verification email. Please try again.");
            throw error;
        }

    }
};

export const resetPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error: any) {
        if (error.status === 500) {
            showToaster("An error occurred while resending verification email. Please try again later.", "error");
        } else {
            showToaster(error?.response?.data?.message || "An error occurred while resending verification email. Please try again.");
            throw error;
        }

    }
};

export const CurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    } catch (error: any) {
        if (error.status === 500) {
            showToaster("Check your internet connetion. Please try again later.", "error");
        } else {
            showToaster(error?.response?.data?.message || "An error occurred while resending verification email. Please try again.");
            throw error;
        }

    }
}

export const Logout = async () => {
    await axiosInstance.post('/auth/logout');
}


