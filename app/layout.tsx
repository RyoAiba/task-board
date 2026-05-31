import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "../components/LayoutWrapper";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://task-app-ts.vercel.app"),
  title: "TaskBoard",
  description: "カテゴリや優先度でタスクを整理する個人向けタスク管理アプリ",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TaskBoard",
    description: "カテゴリや優先度でタスクを整理する個人向けタスク管理アプリ",
    url: "https://task-app-ts.vercel.app",
    siteName: "TaskBoard",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-noto-sans-jp bg-white text-gray-200`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}