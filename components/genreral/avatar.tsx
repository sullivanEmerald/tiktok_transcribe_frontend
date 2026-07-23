"use client";
import Avatar from "react-avatar";
import { User } from "@/types/user";
import { Avatar as ProfileAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function DisplayAvatar({ user, canShowName = true }: { user?: User | null, canShowName?: boolean }) {
    return (
        <div className="flex items-center space-x-2">
            {user?.avartar ? (
                <ProfileAvatar className="w-9 h-9">
                    <AvatarImage src={user.avartar} alt={user.firstName} />
                </ProfileAvatar>
            ) : (
                <Avatar name={user?.firstName} size="36" round={true} />
            )}
            {canShowName && <span className="hidden md:inline text-foreground font-medium">Hi, {user?.firstName}</span>}
        </div>
    );
}

