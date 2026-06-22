import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"
import { UtteranceType } from "@/types/transcribe";
import {
  FileText,
  FileSpreadsheet,
  FileJson,
  FileType,
  FileDown
} from 'lucide-react';
import { Download, Activity, CheckCircle } from 'lucide-react';
import type { ComponentType } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const axiosInstance = axios.create({
  baseURL: API_URL,
  // timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// export function getDeviceId() {
//   if (typeof window === 'undefined') {
//     return null;
//   }

//   let deviceId = localStorage.getItem('deviceId');

//   if (!deviceId) {
//     deviceId = crypto.randomUUID();
//     localStorage.setItem('deviceId', deviceId);
//   }

//   return deviceId;
// }

// axiosInstance.interceptors.request.use((config) => {
//   config.headers['x-device-id'] = getDeviceId();

//   return config;
// });

export const showToaster = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
  toast(message, { type });
};


export const copyToClipboard = (text: string, timeStamp?: string) => {

  const textCopy = timeStamp ? `${timeStamp} ${text}` : text

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textCopy).then(() => {
      showToaster('Copied to clipboard!', 'success');
    }).catch(err => {
      showToaster('Failed to copy!', 'error');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToaster('Copied to clipboard!', 'success');
    } catch (err) {
      showToaster('Failed to copy!', 'error');
    }
    document.body.removeChild(textarea);
  }
}


export const downLoadFile = (content: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clipscript_transcript.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToaster('File downloaded!', 'success');
}

type FileType = 'txt' | 'pdf' | 'docx' | 'csv';

export const downloadFile = async (
  content: string,
  type: FileType
) => {
  switch (type) {
    case 'txt': {
      const blob = new Blob([content], { type: 'text/plain' });
      triggerDownload(blob, 'Clip_Script.txt');
      break;
    }

    case 'pdf': {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.text(content, 10, 10);
      doc.save('Clip_Script.pdf');
      break;
    }

    case 'docx': {
      const { Document, Packer, Paragraph } = await import('docx');
      const { saveAs } = await import('file-saver');

      const doc = new Document({
        sections: [{ children: [new Paragraph(content)] }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Clip_Script.docx');
      break;
    }

    case 'csv': {
      const blob = new Blob([content], { type: 'text/csv' });
      triggerDownload(blob, 'Clip_Script.csv');
      break;
    }
  }
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downLoadVideo = async (jobId?: string) => {
  if (!jobId) return;
  try {
    const res = await fetch(`${API_URL}/transcription/${jobId}/download`);
    if (!res.ok) {
      console.error("Failed to fetch video:", res);
      showToaster("Failed to download video. Please try again later.");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clipscript_${jobId}.mp4`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    showToaster("Failed to download video. Please try again later.");
    console.error(err);
  }
};


// Helper to format ms to mm:ss
export function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


export function downloadUtterances(transcript: Array<UtteranceType> | undefined) {
  const utteranceText = transcript?.map(utt => `${formatMs(utt.start)} - ${utt.text}`).join('\n');
  return utteranceText;
}



export const downloadFileActions = [
  {
    label: "PDF",
    icon: FileText,
    onClick: (transcript: string) => downloadFile(transcript, 'pdf')
  },
  {
    label: "TXT",
    icon: FileText,
    onClick: (transcript: string) => downloadFile(transcript, 'txt')
  },
  {
    label: "DOCX",
    icon: FileType,
    onClick: (transcript: string) => downloadFile(transcript, 'docx')
  },
  {
    label: "CSV",
    icon: FileSpreadsheet,
    onClick: (transcript: string) => downloadFile(transcript, 'csv')
  },
];


const PLATFORM_REGEX: Record<string, RegExp> = {
  YouTube: /(?:youtube\.com\/(?:shorts|watch)|youtu\.be)\/?.*/i,
  TikTok: /(?:tiktok\.com\/(?:@[^\/]+\/video\/\d+|t\/|v\/)|vm\.tiktok\.com|m\.tiktok\.com)\/?.*/i,
  Instagram: /(?:instagram\.com\/(?:p|reel|tv)\/|instagr\.am\/)\/?.*/i,
  Facebook: /(?:web\.facebook\.com\/|facebook\.com\/(?:.*\/videos\/|watch\/)|fb\.watch\/|m\.facebook\.com\/|facebook\.com\/watch)\/?.*/i,
};

function normalizeMaybeUrl(input: string): string | null {
  if (!input) return null;
  try {
    const u = new URL(input);
    return u.toString();
  } catch (err) {
    // Try to prepend protocol and parse again
    try {
      const u = new URL(`https://${input}`);
      return u.toString();
    } catch (err) {
      return null;
    }
  }
}

/**
 * Detects which platform the provided URL belongs to (YouTube, TikTok, Instagram, Facebook)
 * Returns the platform name as a string or null when unknown/invalid.
 */
export const detectPlatform = (rawUrl: string): string | null => {
  const url = normalizeMaybeUrl(rawUrl);
  if (!url) return null;

  for (const [platform, rx] of Object.entries(PLATFORM_REGEX)) {
    if (rx.test(url)) return platform;
  }

  return null;
};

/**
 * Validates that the provided URL is a supported platform URL.
 * If expectedPlatform is provided, it also enforces that the URL matches that platform.
 */
export const validatePlatformUrl = (rawUrl: string, expectedPlatform?: string): boolean => {
  const url = normalizeMaybeUrl(rawUrl);
  if (!url) return false;

  const detected = detectPlatform(url);
  if (!detected) return false;
  if (!expectedPlatform) return true;

  return detected.toLowerCase() === expectedPlatform.toLowerCase();
};


export function formatCount(num?: number | null) {
  if (num == null || isNaN(num)) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}


// Add download handler for thumbnail images
export const handleDownloadThumbnail = async (url?: string | null) => {
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const filename = `thumbnail.${ext}`;
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    showToaster('Failed to download thumbnail', 'error');
  }
};

export const overviewContents = {
  totalTranscriptions: {
    label: 'Total Transcriptions',
    icon: FileText,
  },
  totalDownloads: {
    label: 'Downloaded Videos',
    icon: Download
  },
  totalEngagements: {
    label: 'Total Engagements',
    icon: Activity,
    percentage: false
  },
  successfulTranscriptionRate: {
    label: 'Transcription Success Rate',
    icon: CheckCircle,
    percentage: true
  }
}

// Typed overview map to allow optional fields like `percentage`
export type OverviewContent = {
  label: string;
  icon: ComponentType<any>;
  percentage?: boolean;
};

export const overviewContentsTyped: Record<string, OverviewContent> = overviewContents as Record<string, OverviewContent>;



