import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { copyToClipboard, formatMs } from "@/lib/utils";
import { Copy, Save } from "lucide-react";
import { showToaster } from "@/lib/utils";
import { createClip } from "@/services/clip";
import LineLoader from "../genreral/lineLoader";
import { useTranscription } from "@/hooks/useTranscribe";

import type { ClipData as HookClipData, SelectionCoords } from "@/hooks/useTextSelection";

type Props = {
    clipData: HookClipData | null;
    coords: SelectionCoords | null;
    setClipData: (c: HookClipData | null) => void;
    videoUrl?: string;
    platform?: string;
};

export const AddClip = ({ clipData, coords, setClipData, videoUrl, platform }: Props) => {
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div
            style={{
                position: "absolute",
                top: coords?.top,
                left: coords?.left,
                width: coords?.width,
                height: coords?.height,
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
                                copyToClipboard(clipData?.text || '', `${formatMs(clipData?.startTime ?? 0)} - ${formatMs(clipData?.endTime ?? 0)}`);
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
                                if (!clipData?.text) {
                                    return;
                                }
                                setIsSaving(true);
                                const payload = {
                                    text: clipData.text,
                                    startTime: formatMs(clipData?.startTime ?? 0),
                                    endTime: formatMs(clipData?.endTime ?? 0),
                                    videoUrl: videoUrl,
                                    platform: platform,
                                }
                                await createClip(payload)

                                showToaster(`Saved Clip Successfully`, "success");
                                setIsSaving(false);
                            }}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary text-white font-medium shadow-sm transition-transform duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                            disabled={isSaving || !clipData?.text}
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
                        {formatMs(clipData?.startTime ?? 0)} - {formatMs(clipData?.endTime ?? 0)}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};