"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useCaptcha } from "@/hooks/useCaptcha";
import Recaptcha from "@/components/ui/Recaptcha";
import { useTranscription } from "@/hooks/useTranscribe";
import { Switch } from "@/components/ui/switch"
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
import { Clipboard, Download, Copy, Sparkles, FileText, Eye, Heart, MessageCircle, Share2, Save } from "lucide-react";
import { copyToClipboard, downLoadFile, downLoadVideo, downloadFile, downloadUtterances } from "@/lib/utils";
import { formatMs } from "@/lib/utils";
import LineLoader from "../genreral/lineLoader";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { downloadFileActions } from "@/lib/utils";
import { useDownloadProgress } from "@/hooks/useDownloadProgress";
import { showToaster, detectPlatform, validatePlatformUrl } from "@/lib/utils";
import { User } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { handleDownloadThumbnail } from "@/lib/utils";
import { TranscribeService } from "@/services/transcribe";
import { useTextSelection } from "@/hooks/useTextSelection";
import { createClip } from "@/services/clip";

export default function TranscribeSection() {
    const [videoUrl, setVideoUrl] = useState("");
    const { captchaToken, onCaptchaChange } = useCaptcha();
    const { submitTranscription, loading, downloadVideo, isDownloading, transcript, showCaptcha } = useTranscription();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<boolean>(false)
    const [isGettingSummary, setIsGettingSummary] = useState(false);
    const [isSaving, setIsSaving] = useState(false)

    // const transcriptContainerRef = useRef<HTMLDivElement>(null);
    const { clipData, coords, containerRefCallback, setClipData } = useTextSelection();

    useEffect(() => {
        setIsDialogOpen(transcript !== null);
    }, [transcript]);

    const handleSubmit = async () => {
        const platform = detectPlatform(videoUrl);
        if (!platform) {
            showToaster("Unsupported platform. Please enter a TikTok, Instagram Reel, or YouTube Shorts URL.", "error");
            return;
        }
        if (!validatePlatformUrl(videoUrl)) {
            showToaster("Invalid or unsupported URL. Please paste a full TikTok, Instagram Reel, or YouTube Shorts URL.", "error");
            return;
        }

        // Only require captchaToken if CAPTCHA is shown
        if (showCaptcha && !captchaToken) {
            showToaster("Please complete the CAPTCHA", "error");
            return;
        }

        // You may pass platform to the backend if desired: submitTranscription(videoUrl, captchaToken, platform)
        await submitTranscription(videoUrl, captchaToken);
    };


    return (
        <>
            <main
                className={
                    transcript
                        ? "space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                        : "flex justify-center items-center min-h-[60vh]"
                }
            >
                <section className={`${transcript ? "w-full" : "w-full md:w-1/2  "} h-full bg-background rounded-xl shadow-md hover:shadow-lg shadow-shadow-background p-6 transition-shadow flex flex-col gap-4`}>
                    <div>
                        <h1 className="text-2xl font-bold text-center">Clip Script Transcript Generator</h1>
                        <p className="text-muted-foreground mt-1 text-center">
                            Turn TikTok, Reels & Shorts into clean transcripts instantly.
                        </p>
                    </div>
                    <div className="relative w-full">
                        <Input
                            id="videoUrl"
                            name="videoUrl"
                            type="url"
                            autoComplete="off"
                            required
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="border-2 border-primary/15 focus:border-primary focus:ring-primary rounded-3xl px-4 py-8 pr-17 w-full placeholder:primary-foreground bg-transparent"
                            placeholder="Paste TikTok, Instagram Reel, or YouTube Shorts URL"
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-primary/80 p-2 rounded-md "
                            title="Paste from clipboard"
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    setVideoUrl(text);
                                } catch {
                                    setVideoUrl("");
                                }
                            }}
                            tabIndex={-1}
                        >
                            <Clipboard className="w-6 h-6" />
                        </button>
                    </div>
                    {showCaptcha && !loading && (
                        <Recaptcha onChange={onCaptchaChange} />
                    )}
                    <div className="flex flex-col items-start gap-2 w-full p-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            title={
                                loading
                                    ? "Transcription in progress..."
                                    : !videoUrl
                                        ? "Please enter a video URL"
                                        : "Generate Transcript"
                            }
                            className="w-full bg-primary text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-primary/80 transition-colors duration-200"
                            disabled={loading || isDownloading || !videoUrl}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LineLoader />
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5 text-white" />
                                    Generate Transcript
                                </div>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={async () => {
                                const platform = detectPlatform(videoUrl);
                                if (!platform || !validatePlatformUrl(videoUrl)) {
                                    showToaster("Unsupported or invalid platform URL. Please enter a TikTok, Instagram Reel, or YouTube Shorts URL.", "error");
                                    return;
                                }

                                await downloadVideo(videoUrl, captchaToken);

                            }}
                            title={
                                isDownloading
                                    ? "Downloading in progress..."
                                    : !videoUrl
                                        ? "Please enter a video URL"
                                        : "Download Video"
                            }
                            className="w-full bg-muted text-white py-4 rounded-3xl font-semibold mt-2 disabled:opacity-50 hover:bg-destructive/80 transition-colors duration-200"
                            disabled={loading || isDownloading || !videoUrl || status === 'processing'}
                        >
                            {isDownloading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LineLoader />
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Download className="w-5 h-5 text-white" />
                                    Download Video
                                </div>
                            )}
                        </button>
                    </div>
                </section>
                {/* Metadata and Stats Section */}
                {transcript && (
                    <div className="w-full bg-background rounded-xl shadow-md p-6 shadow-shadow-background hover:shadow-lg flex h-full overflow-y-auto items-start gap-6">
                        <div className=" w-full md:w-1/2 relative h-full">
                            {transcript?.metadata?.media?.thumbnailUrl ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={transcript.metadata.media.thumbnailUrl}
                                        alt="Thumbnail"
                                        className="rounded-lg object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadThumbnail(transcript.metadata.media.thumbnailUrl)}
                                        title="Download thumbnail"
                                        className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full shadow hover:bg-white/90 transition cursor-pointer"
                                    >
                                        <Download className="w-4 h-4 text-primary" />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        <section className="flex flex-col gap-4 w-full md:w-1/2">
                            <div className="flex items-center gap-3 mb-2">
                                {transcript?.metadata?.author?.avatarUrl ? (
                                    <img
                                        src={transcript.metadata.author.avatarUrl}
                                        alt="Avatar"
                                        className="rounded-full border border-gray-300 object-cover w-14 h-14"
                                    />
                                ) : null}
                                <div>
                                    <div className="font-semibold text-base">{transcript?.metadata?.author?.displayName}</div>
                                    <div className="text-sm text-gray-500">@{transcript?.metadata?.author?.username}</div>
                                </div>
                            </div>
                            <span className="text-lg font-bold mb-2 text-foreground">{transcript?.metadata?.description}</span>
                            <div className="text-sm text-gray-700">
                                <div className="mb-2">
                                    <span className="font-semibold text-red-600">Platform:</span> {transcript?.metadata?.platform &&
                                        transcript.metadata.platform.charAt(0).toUpperCase() +
                                        transcript.metadata.platform.slice(1).toLowerCase()
                                    }
                                </div>
                                {transcript?.videoUrl && (
                                    <div className="mb-2">
                                        <span className="font-semibold">Video URL:</span> <a href={transcript?.videoUrl} target="_blank" className="text-primary underline break-all">{transcript?.videoUrl}</a>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className=" flex items-center gap-1">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript?.metadata?.stats?.views)} views
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript?.metadata?.stats?.likes)} likes
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript?.metadata?.stats?.comments)} comments
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Share2 className="w-4 h-4 text-gray-500" />
                                        {formatCount(transcript?.metadata?.stats?.shares)} shares
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);

            }}>
                <DialogContent
                    className="shadow-md shadow-shadow-background border-none bg-card"
                    onInteractOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('[data-radix-popper-content-wrapper]') || target.closest('.pointer-events-auto')) {
                            e.preventDefault();
                        }
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="font-semibold text-muted-foreground">Review, Copy, Download or Improve</DialogTitle>
                        <div className="flex items-center justify-between w-full mt-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Switch
                                        id="viewModeToggle"
                                        checked={viewMode}
                                        onCheckedChange={() => setViewMode(!viewMode)}
                                    />
                                    <p>Timestamp</p>
                                </div>
                                <button
                                    className="flex items-center gap-1 bg-background hover:bg-background/80 border border-transparent hover:border-yellow-500 py-1 px-4 rounded-2xl cursor-pointer hover:text-yellow-500 transition group"
                                    disabled={isGettingSummary}
                                    onClick={async () => {
                                        try {
                                            setIsGettingSummary(true);
                                            await TranscribeService.improveTranscript(transcript?.utterances);
                                        } catch (error) {
                                            console.log(`Error fetching AI improvement for video ${transcript?.videoUrl}:`, error);
                                        } finally {
                                            setIsGettingSummary(false);
                                        }
                                    }}
                                >
                                    <Sparkles className={`w-5 h-5 text-yellow-500 ${isGettingSummary ? 'animate-pulse' : ''}`} />
                                    <span>Extract Summary</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                {!viewMode ? (
                                    <Clipboard className="w-5 h-5 text-primary cursor-pointer" onClick={() => copyToClipboard(transcript?.transcript || '')} />
                                ) : (
                                    <Clipboard
                                        className="w-5 h-5 text-primary cursor-pointer"
                                        onClick={() => {
                                            const transcribeTimestampsText = downloadUtterances(transcript?.utterances);
                                            copyToClipboard(transcribeTimestampsText!);
                                        }}
                                    />
                                )}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Download className="w-5 h-5 text-primary cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-50 bg-background text-foreground shadow-md shadow-shadow-background hover:shadow-lg border-none">
                                        <div className="flex flex-col gap-1">
                                            <p className="">Download as:</p>
                                            <hr className="border-t border-gray-200 my-1" />
                                            {downloadFileActions.map(({ label, icon: Icon, onClick }) => (
                                                <button
                                                    key={label}
                                                    onClick={() => {
                                                        const content = viewMode
                                                            ? downloadUtterances(transcript?.utterances)
                                                            : (transcript?.transcript?.replace(/([.?!])\s*/g, '$1\n') || "")

                                                        if (!content) return;

                                                        onClick(content);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-card cursor-pointer hover:text-primary transition group"
                                                >
                                                    <Icon size={16} className="text-red-300 group-hover:text-red-400" />
                                                    <span className="text-sm">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogDescription asChild>
                            {transcript ? (
                                <div>
                                    <div
                                        className={`text-foreground p-2 rounded max-h-[70vh] overflow-auto whitespace-pre-wrap leading-8`}
                                        ref={containerRefCallback}
                                    >
                                        {!viewMode ? (
                                            <>
                                                {Array.isArray(transcript.utterances) && transcript.utterances.length > 0 ? (
                                                    transcript.utterances.map((utt, idx) => (
                                                        <span
                                                            key={idx}
                                                            data-start={utt.start}
                                                            data-end={utt.end}
                                                            className="selection:bg-primary/30 cursor-text inline"
                                                        >
                                                            {utt.text}{" "}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <>
                                                        <span data-start="0" data-end="0" className="selection:bg-primary/30">
                                                            {transcript?.transcript}
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {Array.isArray(transcript.utterances) && transcript.utterances.length > 0 ? (
                                                    <div className="space-y-2 w-full">
                                                        {transcript.utterances.map((utt, idx) => (
                                                            <div key={idx} className="flex items-start gap-4 bg-background text-foreground p-2 rounded-lg">
                                                                <div className="flex flex-col gap-2 items-center">
                                                                    <span className=" text-primary/60">
                                                                        {formatMs(utt.start)}
                                                                    </span>
                                                                    <button onClick={() => copyToClipboard(utt.text, formatMs(utt.start))} className="p-1 rounded hover:bg-primary/10 transition-colors duration-200">
                                                                        <Copy className="w-4 h-4 text-primary/60" />
                                                                    </button>
                                                                </div>
                                                                <span className="">{utt.text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No utterances available.</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                            ) : "No transcript available."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {coords && clipData && (
                <div
                    style={{
                        position: "absolute",
                        top: coords.top,
                        left: coords.left,
                        width: coords.width,
                        height: coords.height,
                        pointerEvents: "none",
                    }}
                >
                    <Popover open={true}>
                        {/* Radix Popover Content will center itself over this invisible boundary anchor box */}
                        <PopoverTrigger asChild>
                            <div className="w-full h-full" />
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="center"
                            sideOffset={8}
                            className="w-auto p-2 flex items-center gap-2 pointer-events-auto bg-background shadow-xl border-none rounded-lg"
                            onPointerDownOutside={(e) => e.preventDefault()}
                            onFocusOutside={(e) => e.preventDefault()}
                        >
                            <div className="flex items-center gap-2 bg-background px-2 py-1 rounded">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(clipData.text, `${formatMs(clipData.startTime)} - ${formatMs(clipData.endTime)}`);
                                        setClipData(null)
                                        // showToaster(`Copied clip (${formatMs(clipData.startTime)} - ${formatMs(clipData.endTime)})`, "success");
                                    }}
                                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary text-white font-medium shadow-sm transition-transform duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Clip</span>
                                </button>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        setIsSaving(true);
                                        const payload = {
                                            text: clipData.text,
                                            startTime: formatMs(clipData.startTime),
                                            endTime: formatMs(clipData.endTime),
                                            videoUrl: transcript?.videoUrl,
                                            platform: transcript?.metadata?.platform,
                                        }
                                        await createClip(payload)

                                        showToaster(`Saved Clip Successfully`, "success");
                                        setIsSaving(false);
                                    }}
                                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary text-white font-medium shadow-sm transition-transform duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                    disabled={isSaving}
                                >
                                    {
                                        isSaving ? (
                                            <div className="flex items-center gap-1">
                                                <LineLoader />
                                                <span>Saving Clip</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <Save className="w-4 h-4" />
                                                <span>Save Clip</span>
                                            </div>
                                        )

                                    }

                                </button>
                            </div>
                            <div className="text-[10px] text-muted-foreground border-l pl-2">
                                {formatMs(clipData.startTime)} - {formatMs(clipData.endTime)}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </>
    );
}