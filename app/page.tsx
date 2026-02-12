"use client"
import { Layout } from "@/components/genreral/layout";
import TranscribeSection from "@/components/main/transcribeForm";
import TranscriptProcess from "@/components/main/process";
import Platforms from "@/components/main/platforms";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-16 mb-8">
        <TranscribeSection />
        <TranscriptProcess />
        <Platforms />
      </div>
    </Layout>

  );
}
