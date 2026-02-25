import React from "react";
import { Loader2 } from "lucide-react";

export function SpinnerLoader() {
    return (
        <span className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </span>
    );
}


