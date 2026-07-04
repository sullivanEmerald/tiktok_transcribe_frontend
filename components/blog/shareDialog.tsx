import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { LinkIcon } from "lucide-react";
import { getShareData } from '@/lib/utils';
import PlatformIcons from "@/lib/icons";
import { platform } from "os";
const ShareDialog = ({ isOpen, onOpenChange, handleCopy, isCopied }: { isOpen: boolean; handleCopy: () => void; isCopied: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!isOpen) return null;

    const { title, url } = getShareData();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "X",
            platform: "twitter",
            icon: FaTwitter,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            name: "WhatsApp",
            icon: FaWhatsapp,
            platform: "whatsapp",
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },
        {
            name: "TikTok",
            icon: FaTelegram,
            platform: "tiktok",
            href: `https://www.tiktok.com/`,
        },
        {
            name: "Facebook",
            icon: FaFacebook,
            platform: "facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: "Instagram",
            icon: FaTelegram,
            platform: "instagram",
            href: `https://www.instagram.com/`,
        },
        // {
        //     name: 'YouTube',
        //     icon: FaTelegram,
        //     platform: "youtube",
        //     href: `https://www.youtube.com/share?url=${encodedUrl}&text=${encodedTitle}`,
        // }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="border-none shadow-md">
                <DialogHeader>
                    <DialogTitle>Share this article</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-4 py-4 sm:grid-cols-4">
                    {shareLinks.map(({ name, icon: Icon, href, platform }) => {
                        const icon = PlatformIcons[platform.toLowerCase() as keyof typeof PlatformIcons];
                        return (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1 group transition-colors"
                            >
                                <div className="group-hover:bg-muted-foreground/10 p-2 flex items-center justify-center rounded-full">
                                    {icon}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {name}
                                </span>
                            </a>
                        )
                    })}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-muted-foreground p-2">
                    <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        readOnly
                        value={url}
                        className="flex-1 bg-transparent text-sm outline-none border-none truncate"
                    />
                    <button
                        onClick={handleCopy}
                        className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs text-white font-medium hover:primary/70 transition-colors"
                    >
                        {isCopied ? "Copied" : "Copy"}
                    </button>
                </div>

            </DialogContent>
        </Dialog >
    );
};

export { ShareDialog };
