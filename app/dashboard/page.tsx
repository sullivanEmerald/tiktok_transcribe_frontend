"use client"
import CommonComponents from "@/components/main/CommonStaticPages"
import TranscribeSection from "@/components/main/transcribeForm"
export default function Dashboard() {
    return (
        <div className="space-y-10">
            <TranscribeSection />
            <CommonComponents />
        </div>
    )
}