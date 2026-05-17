import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from 'next-themes'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clip Script Transcript Generator",
  description: "Turn TikTok, Reels & Shorts into clean transcripts instantly.",

  metadataBase: new URL("https://www.useclipscript.com"),

  keywords: [
    "transcript generator",
    "video to text",
    "video transcription",
    "auto transcript",
    "clip transcript",


    "TikTok transcript",
    "TikTok to text",
    "Instagram Reels transcript",
    "Reels to text",
    "YouTube Shorts transcript",
    "Shorts to text",

    "content creator tools",
    "social media transcript",
    "video captions generator",
    "transcribe video online",
    "free transcript tool",
    "AI transcript generator",

    "how to transcribe TikTok videos",
    "convert TikTok audio to text",
    "Instagram reels to text converter",
    "YouTube shorts transcription tool",
  ],

  openGraph: {
    title: "Clip Script Transcript Generator",
    description:
      "Turn TikTok, Reels & Shorts into clean transcripts instantly.",
    url: "https://www.useclipscript.com",
    siteName: "ClipScript",
    images: [
      {
        url: "https://www.useclipscript.com/social-preview.png", // 👈 FULL URL (not relative)
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Clip Script Transcript Generator",
    description:
      "Turn TikTok, Reels & Shorts into clean transcripts instantly.",
    images: ["/social-preview.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      "max-image-preview": "large",
    },
  },

};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="bigTCQtTYsLnoUVcCmEuWhFWvO6Nz6ve5fTtoZBnQqA" />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYSTIC_ID!} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
