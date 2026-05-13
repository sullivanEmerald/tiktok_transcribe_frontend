
import { Layout } from "@/components/genreral/layout"
interface LayoutProps {
    children: React.ReactNode
}

export default function BlogLayout({ children }: LayoutProps) {
    return <Layout>{children}</Layout>
}