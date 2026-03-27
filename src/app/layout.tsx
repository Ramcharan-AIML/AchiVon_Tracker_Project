import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import StoreInitializer from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: "AchiVon — Life Curator",
  description:
    "Track your habits, goals, and daily progress with advanced analytics and visual tracking.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreInitializer />
        <Sidebar />
        <TopBar />
        <main className="ml-[220px] mt-[60px] min-h-[calc(100vh-60px)] p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
