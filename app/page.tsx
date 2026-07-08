import CommonComponents from "@/components/main/CommonStaticPages";
import HomeLayout from "@/components/main/homeLayout";
import GuestTranscribeSection from "@/components/guest/TranscriptionComponent";
export default function Home() {
  return (
    <HomeLayout>
      <div className="space-y-10">
        <GuestTranscribeSection />
        <CommonComponents />
      </div>
    </HomeLayout>
  );
}
