import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Virgo TV — Watch. Stream. Chat. Live.",
  description:
    "A new universe of entertainment. Virgo Originals, live shows, on-demand, and podcasts — all with live chat. Coming soon.",
  openGraph: {
    title: "Virgo TV — Coming Soon",
    description: "Watch. Stream. Chat. Live.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-sans">
        {children}
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
