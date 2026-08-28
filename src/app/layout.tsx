import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ChatbotWidget from "@/components/ChatbotWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "C.O. Cárcara Martínez | Portal de Pacientes",
  description: "Portal de visualización y descarga de estudios 3D y radiografías.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "C.O. Martínez",
  },
};

export const viewport = {
  themeColor: "#111827",
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
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex`}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen w-full relative">
          <div className="md:hidden h-16 w-full"></div> {/* Spacer for mobile toggle button */}
          {children}
        </main>
        <ChatbotWidget />
      </body>
    </html>
  );
}
