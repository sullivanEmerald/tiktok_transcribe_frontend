"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCaptcha } from "@/hooks/useCaptcha";
import Recaptcha from "@/components/ui/Recaptcha";
import { useTranscription } from "@/hooks/useTranscribe";
import { showToaster } from "@/lib/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Clipboard, Download, Clock, FileText, Copy } from "lucide-react";
import { copyToClipboard, downLoadFile, downLoadVideo, downloadUtterances } from "@/lib/utils";
import { SpinnerLoader } from "../genreral/common";
import { formatMs } from "@/lib/utils";


export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, error, transcript } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [viewMode, setViewMode] = useState<'transcript' | 'utterances'>('transcript');


    useEffect(() => {
        setIsDialogOpen(transcript !== null);
    }, [transcript]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            toast.error("Please complete the CAPTCHA");
            return;
        }
        await submitTranscription(videoUrl, captchaToken);
    };

    return (
        <>
            <form className="space-y-4 flex flex-col justify-center items-center" onSubmit={handleSubmit} >
                <div>
                    <h1 className="text-2xl font-bold text-center">Video Transcript Generator</h1>
                    <p className="text-muted-foreground text-center mt-1">
                        Turn TikTok, Reels & Shorts into clean transcripts instantly.
                    </p>
                </div>
                <Input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    autoComplete="off"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="border-2 border-primary focus:border-primary focus:ring-primary rounded-3xl px-4 py-8 w-full md:w-1/2 placeholder:text-primary/60 bg-transparent"
                    placeholder="Paste TikTok, Instagram Reel, or YouTube Shorts URL"
                />
                {!loading && <Recaptcha onChange={onCaptchaChange} />}
                <button
                    type="submit"
                    className="w-full md:w-1/2 bg-primary text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-primary/80 transition-colors duration-200"
                    disabled={loading || !captchaToken}
                >
                    {loading ? "Transcribing..." : "Generate Transcript"}
                </button>
                {error && <p className="text-red-500 text-sm">{toast.error(error)}</p>}
            </form>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setVideoUrl("");
            }}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle className="font-semibold">Review, Copy or Download</DialogTitle>
                        {/* Toggle buttons for view mode */}
                        <div className="flex gap-2 mt-2 mb-2 justify-end">
                            <button
                                className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${viewMode === 'transcript' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary hover:bg-primary/10'}`}
                                onClick={() => setViewMode('transcript')}
                                type="button"
                            >
                                <FileText className="w-5 h-5" />
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${viewMode === 'utterances' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary hover:bg-primary/10'}`}
                                onClick={() => setViewMode('utterances')}
                                type="button"
                            >
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>
                        <DialogDescription>
                            {transcript ? (
                                <>
                                    {viewMode === 'transcript' ? (
                                        <div>
                                            <pre className="font-mono p-4 rounded max-h-[70vh] text-black bg-muted overflow-auto whitespace-pre-wrap">
                                                {transcript.transcript}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="p-2 rounded max-h-[70vh] overflow-auto">
                                            {Array.isArray(transcript.utterances) && transcript.utterances.length > 0 ? (
                                                <div className="space-y-2">
                                                    {transcript.utterances.map((utt, idx) => (
                                                        <div key={idx} className="flex items-start gap-4 font-mono border-b border-gray-200 pb-1">
                                                            <div className="flex flex-col gap-2 items-center">
                                                                <span className=" text-primary/60">
                                                                    {formatMs(utt.start)}
                                                                </span>
                                                                <button onClick={() => copyToClipboard(utt.text)} className="p-1 rounded hover:bg-primary/10 transition-colors duration-200">
                                                                    <Copy className="w-4 h-4 text-primary/60" />
                                                                </button>
                                                            </div>
                                                            <span className="text-black">{utt.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">No utterances available.</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex gap-4 mt-4 justify-end">
                                        {viewMode === "transcript" ? (
                                            <Button
                                                variant="default"
                                                className="flex items-center gap-2 bg-primary text-white border border-primary hover:bg-transparent hover:text-primary hover:border-primary transition-colors duration-200"
                                                onClick={() => copyToClipboard(transcript.transcript)}
                                            >
                                                <Clipboard className="w-4 h-4" /> Copy
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                className="flex items-center gap-2 bg-primary text-white border border-primary hover:bg-transparent hover:text-primary hover:border-primary transition-colors duration-200"
                                                onClick={() => {
                                                    const transcribeTimestampsText = downloadUtterances(transcript?.utterances);
                                                    copyToClipboard(transcribeTimestampsText!);
                                                }}
                                            >
                                                <Clipboard className="w-4 h-4" /> Copy
                                            </Button>
                                        )}

                                        {viewMode === "transcript" ? (
                                            <Button
                                                variant="default"
                                                className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-transparent hover:text-[#ff3040] transition-colors duration-200 hover:border-[#ff3040] border border-[#ff3040]"
                                                onClick={() => downLoadFile(transcript.transcript)}
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-transparent hover:text-[#ff3040] transition-colors duration-200 hover:border-[#ff3040] border border-[#ff3040]"
                                                onClick={() => {
                                                    const downloadVideoFile = downloadUtterances(transcript?.utterances);
                                                    downLoadFile(downloadVideoFile!);
                                                }}
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </Button>
                                        )}
                                        {/* <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-transparent hover:text-[#ff3040] transition-colors duration-200 hover:border-[#ff3040] border border-[#ff3040]"
                                            onClick={() => downLoadFile(transcript.transcript)}
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </Button> */}
                                        <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                                            onClick={async () => {
                                                setIsDownloading(true);
                                                await downLoadVideo(transcript?.jobId);
                                                setIsDownloading(false);
                                            }}
                                        >
                                            {isDownloading ? <SpinnerLoader /> : <><Download className="w-4 h-4" /> Download Video</>}
                                        </Button>
                                    </div>
                                </>
                            ) : "No transcript available."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}