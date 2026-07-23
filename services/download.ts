import { showToaster } from "@/lib/utils";
const API_URL = process.env.NEXT_PUBLIC_API_URL
import { sendGTMEvent } from '@next/third-parties/google';
import { detectPlatform } from "@/lib/utils";

export const downloadService = {
    downloadVideo: async (videoUrl: string, captchaToken?: string | null) => {
        try {
            const response = await fetch(`${API_URL}/downloader/download`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ videoUrl, captchaToken }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ message: 'Download failed' }));
                throw new Error(err.message ?? 'Download failed');
            }

            const disposition = response.headers.get('Content-Disposition') ?? '';
            const match = disposition.match(/filename="(.+?)"/);
            const filename = match?.[1] ?? 'video.mp4';

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // Required in Firefox
            a.click();
            document.body.removeChild(a); // Clean up DOM

            URL.revokeObjectURL(url);

            showToaster('Video downloaded successfully!', 'success');
            window.gtag('event', 'transcription_downloaded', {
                platform: detectPlatform(videoUrl),
                videoUrl,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Something went wrong while downloading the video';
            showToaster(message, 'error');
        }
    },


    downloadVideoAsQuest: async (videoUrl: string, captchaToken?: string | null) => {
        try {
            const response = await fetch(`${API_URL}/guest/downloader/download`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ videoUrl, captchaToken }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ message: 'Download failed' }));
                throw new Error(err.message ?? 'Download failed');
            }

            const disposition = response.headers.get('Content-Disposition') ?? '';
            const match = disposition.match(/filename="(.+?)"/);
            const filename = match?.[1] ?? 'video.mp4';

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // Required in Firefox
            a.click();
            document.body.removeChild(a); // Clean up DOM

            URL.revokeObjectURL(url);

            showToaster('Video downloaded successfully!', 'success');
            window.gtag('event', 'transcription_downloaded', {
                platform: detectPlatform(videoUrl),
                videoUrl,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Something went wrong while downloading the video';
            showToaster(message, 'error');
        }
    },

};