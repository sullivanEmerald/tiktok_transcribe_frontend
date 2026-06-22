import { Layout } from "@/components/genreral/layout"
interface LayoutProps {
    children: React.ReactNode
}

export default function UserClipsLayout({ children }: LayoutProps) {
    return <Layout>{children}</Layout>
}