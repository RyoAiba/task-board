import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Noto_Sans_JP } from "next/font/google"

import { LayoutWrapper } from "@/components/LayoutWrapper"
import "@/app/globals.css"

const SIDEBAR_COOKIE_KEY = "sidebar-collapsed"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://task-app-ts.vercel.app"),
  title: "TaskBoard",
  description: "ラベルや優先度でタスクを整理する個人向けタスク管理アプリ",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TaskBoard",
    description: "ラベルや優先度でタスクを整理する個人向けタスク管理アプリ",
    url: "https://task-app-ts.vercel.app",
    siteName: "TaskBoard",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const initialSidebarCollapsed = cookieStore.get(SIDEBAR_COOKIE_KEY)?.value === "true"

  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-noto-sans-jp bg-white`}>
        <LayoutWrapper initialSidebarCollapsed={initialSidebarCollapsed}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}