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
import { Clipboard, Download } from "lucide-react";

export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, error, transcript } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <h1 className="text-2xl font-bold">Video Transcript Generator</h1>
                    <p className="text-muted-foreground">
                        Paste a TikTok, Instagram Reel, or YouTube Shorts link and get an instant transcript.
                    </p>
                </div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-primary mb-1">Video URL</label>
                <Input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    autoComplete="off"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="border-2 border-primary focus:border-primary focus:ring-primary rounded-lg px-4 py-6 text-primary placeholder:text-primary/60 bg-transparent"
                    placeholder="Paste TikTok, Instagram Reel, or YouTube Shorts URL"
                />
                <Recaptcha onChange={onCaptchaChange} />
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-lg font-semibold mt-2 disabled:opacity-50"
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transcript Result</DialogTitle>
                        <DialogDescription>
                            {transcript ? (
                                <>
                                    <pre className="bg-muted text-primary font-mono p-4 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">
                                        {transcript.transcript}
                                    </pre>
                                    <div className="flex gap-4 mt-4 justify-end">
                                        <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/80"
                                            onClick={() => {
                                                navigator.clipboard.writeText(transcript.transcript);
                                                toast.success("Transcript copied to clipboard!");
                                            }}
                                        >
                                            <Clipboard className="w-4 h-4" /> Copy
                                        </Button>
                                        <Button
                                            variant="default"
                                            className="flex items-center gap-2 bg-[#ff3040] text-white hover:bg-[#e62a38]"
                                            onClick={() => {
                                                const blob = new Blob([transcript.transcript], { type: "text/plain" });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = "transcript.txt";
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                                toast.success("Transcript downloaded!");
                                            }}
                                        >
                                            <Download className="w-4 h-4" /> Download
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