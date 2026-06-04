import { useProfile } from '@/hooks/useProfileHook';
import { formatCount, overviewContentsTyped } from "@/lib/utils";
import { UserOverview } from '@/types/overview';

export default function ProfileOverview({ statistics }: { statistics: UserOverview | null }) {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Activities Overview</h1>
                <p className="text-sm text-muted-foreground">
                    Your recent activities and interactions.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statistics && Object.entries(statistics).map(([k, value]) => {
                    const key = k as keyof typeof overviewContentsTyped;
                    const content = overviewContentsTyped[key];
                    const Icon = content?.icon as React.ComponentType<any> | undefined;
                    return (
                        <div key={String(k)} className="p-10 bg-card rounded-lg shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                {Icon ? <Icon className="w-6 h-6 text-primary" /> : null}
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">{content?.label}</div>
                                <div className="text-2xl font-semibold">{formatCount(value || 0)}{content?.percentage ? '%' : ''}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}   