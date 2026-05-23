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
  title: "TaskBoard",
  description: "Personal task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-noto-sans-jp bg-white text-zinc-900`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}