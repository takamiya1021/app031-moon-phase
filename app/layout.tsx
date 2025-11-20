import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "月の満ち欠け表示",
  description: "今日の月の満ち欠けを確認できるアプリ",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1e293b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
