import { Loader2 } from "lucide-react";

export default function LineLoader({ className, text = "white" }: { className?: string, text?: string }) {
    return (
        <>
            <Loader2 className={`ml-3 w-5 h-5 text-${text} animate-spin ${className}`} />
        </>
    );
}