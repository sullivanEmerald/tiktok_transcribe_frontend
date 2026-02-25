"use client";
import { Layout } from "@/components/genreral/layout";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { TranscribeService } from "@/services/transcribe";
import { useTranscription } from "@/hooks/useTranscribe";
import { useState } from "react";
import { RecentTranscriptData } from "@/types/transcribe";
import { Loader } from "@/components/genreral/loader";
import { copyToClipboard, downLoadFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clipboard, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { showToaster } from "@/lib/utils";
import { HiArrowLongLeft } from 'react-icons/hi2';
import { downLoadVideo } from "@/lib/utils";
import { SpinnerLoader } from "@/components/genreral/common";


export default function TranscriptPage() {
    const { id } = useParams();
    const router = useRouter();
    const { recentTranscripts } = useTranscription();
    const [singleTranscript, setSingleTranscript] = useState<RecentTranscriptData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);


    useEffect(() => {
        const fetchTranscript = async () => {
            if (typeof id === "string") {
                setIsLoading(true);
                try {
                    const data = await TranscribeService.getTranscriptById(id);
                    setSingleTranscript(data);
                } catch (err) {
                    console.error(`Failed to fetch transcript for ID ${id}:`, err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (id && recentTranscripts.length > 0) {
            const transcript = recentTranscripts.find(t => t._id === id);
            console.log("Found transcript in recent transcripts:", transcript);
            setSingleTranscript(transcript ?? null);
            return;
        } else {
            fetchTranscript();
        }
    }, [id]);

    return (
        <Layout>
            {isLoading ? (
                <Loader />
            ) : singleTranscript === null ? (
                <div className="text-center">
                    <p className="text-gray-600">Transcript not found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <button
                            className="flex items-center gap-2 text-gray-600 hover:text-primary w-fit cursor-pointer"
                            onClick={() => router.back()}
                            aria-label="Go back"
                        >
                            <HiArrowLongLeft size={30} color='text-primary' />
                            <span>Back</span>
                        </button>
                        <p className="text-xs text-red-400">
                            {singleTranscript?.createdAt ? (
                                moment(singleTranscript.createdAt).isSame(moment(), 'day')
                                    ? `Today, ${moment(singleTranscript.createdAt).format('h:mm A')}`
                                    : moment(singleTranscript.createdAt).format('MMM D, YYYY, h:mm A')
                            ) : ''}
                        </p>
                    </div>
                    <pre className="bg-muted text-primary font-mono p-4 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">
                        {singleTranscript?.transcript}
                    </pre>
                    <div className="flex gap-4 mt-4 justify-end">
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-primary text-white border border-primary hover:bg-transparent hover:text-primary hover:border-primary transition-colors duration-200"
                            onClick={() => copyToClipboard(singleTranscript?.transcript)}
                        >
                            <Clipboard className="w-4 h-4" /> Copy
                        </Button>
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-transparent hover:text-[#ff3040] transition-colors duration-200 hover:border-[#ff3040] border border-[#ff3040]"
                            onClick={() => downLoadFile(singleTranscript?.transcript)}
                        >
                            <Download className="w-4 h-4" /> Download Copy
                        </Button>
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                            onClick={async () => {
                                setIsDownloading(true);
                                await downLoadVideo(singleTranscript?.jobId);
                                setIsDownloading(false);
                            }}
                            disabled={isDownloading}
                        >
                            {isDownloading ? <SpinnerLoader /> : <>  <Download className="w-4 h-4" /> Download Video</>}
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
