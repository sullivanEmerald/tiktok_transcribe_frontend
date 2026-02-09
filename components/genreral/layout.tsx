import { NavigationBar } from "../ui/NavigationIndex"
import TranscribedChats from "./transcribedChats"

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar: TranscribedChats */}
            <aside className="fixed left-0 top-0 h-full w-80 z-30 bg-background">
                <TranscribedChats />
            </aside>
            {/* Main content area */}
            <div className="flex-1 flex flex-col ml-80">
                {/* Fixed Top NavigationBar */}
                <header className="fixed top-0 left-80 right-0 z-20 ">
                    <NavigationBar />
                </header>
                {/* Main content below NavigationBar */}
                <main
                    className=" min-h-[calc(100vh-5rem)]"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
