"use client";
import {
    FaShare, FaCheck, FaFacebook,
    FaLinkedin,
    FaWhatsapp,
    FaTelegram,
    FaTwitter,
    FaReddit,
    FaCopy,
    FaEnvelope
} from "react-icons/fa";
import { CopyCurrentUrl } from '@/lib/utils';
import { ShareDialog } from "./shareDialog";
import { useRef, useState } from "react";
import { getShareData } from '@/lib/utils';
import { LinkIcon } from "lucide-react"

export default function EngagementButtons() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShareClick = async () => {
        setIsOpen(true);
    };

    const handleCopy = () => {
        CopyCurrentUrl();
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div>
            <div className="flex items-center gap-4">
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={handleCopy}>
                    {copied ? <FaCheck className="h-4 w-4" /> : <FaCopy />}
                    <span className="text-foreground/60 text-sm font-medium">{copied ? "Copied!" : "Copy URL"}</span>
                </button>
                <ShareDialog isOpen={isOpen} onOpenChange={setIsOpen} handleCopy={handleCopy} isCopied={copied} />
                <button className="flex items-center gap-1 cursor-pointer" onClick={handleShareClick}>
                    <FaShare />
                    <span className="text-foreground/60 text-sm font-medium">Share</span>
                </button>
            </div>
        </div>
    )
}