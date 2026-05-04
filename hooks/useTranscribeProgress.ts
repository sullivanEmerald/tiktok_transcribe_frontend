import { useEffect, useState, useCallback } from "react";
import { useSocket } from "./useSocket";
import { TranscriptData } from "@/types/transcribe";
import { showToaster } from "@/lib/utils";


export function useTranscribeProgress() {
    const socketRef = useSocket();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
    const [transcript, setTranscript] = useState<TranscriptData | null>(null);

    const reset = useCallback(() => {
        setStatus("idle");
        setProgress(0);
        // setTranscript(null);
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handleProgress = (value: number) => setProgress(value);

        const handleCompleted = (data: TranscriptData) => {
            setProgress(100);
            setStatus("completed");
            setTranscript(data);

        };

        const handleError = (errorMessage: string) => {
            showToaster(errorMessage, "error");
            setStatus("idle");
            setProgress(0);
            setTranscript(null);
        };

        socket.on(`progress-transcribe`, handleProgress);
        socket.on(`completed-transcribe`, handleCompleted);
        socket.on(`error-transcribe`, handleError);

        return () => {
            socket.off(`progress-transcribe`, handleProgress);
            socket.off(`completed-transcribe`, handleCompleted);
            socket.off(`error-transcribe`, handleError);
        };
    }, [socketRef.current]);


    return { progress, status, transcript, setStatus, reset };
}