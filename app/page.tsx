import CommonComponents from "@/components/main/CommonStaticPages";
import HomeLayout from "@/components/main/homeLayout";
import GuestTranscribeSection from "@/components/guest/TranscriptionComponent";
export default function Home() {
  return (
    <HomeLayout>
      <GuestTranscribeSection />
      <CommonComponents />
    </HomeLayout>
  );
}
