"use client";
import Avatar from "react-avatar";
export default function DisplayAvatar({ name, canShowName = true }: { name?: string, canShowName?: boolean }) {
    return (
        <div className="flex items-center space-x-2">
            <Avatar name={name} size="36" round={true} />
            {canShowName && <span className="hidden md:inline text-gray-700 font-medium">Hi, {name}</span>}
        </div>
    );
}
