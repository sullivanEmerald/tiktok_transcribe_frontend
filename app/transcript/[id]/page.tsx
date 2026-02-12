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

export default function TranscriptPage() {
    const { id } = useParams();
    const { recentTranscripts, } = useTranscription();
    const [singleTranscript, setSingleTranscript] = useState<RecentTranscriptData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                <div className="">
                    <pre className="bg-muted text-primary font-mono p-4 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">
                        {singleTranscript?.transcript}
                    </pre>
                    <div className="flex gap-4 mt-4 justify-end">
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/80"
                            onClick={() => copyToClipboard(singleTranscript?.transcript)}
                        >
                            <Clipboard className="w-4 h-4" /> Copy
                        </Button>
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-[#e62a38]"
                            onClick={() => downLoadFile(singleTranscript?.transcript)}
                        >
                            <Download className="w-4 h-4" /> Download
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
