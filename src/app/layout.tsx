import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechVerse Academy — Master IT Skills, Earn Certificates",
  description:
    "A professional IT learning platform with structured pathways, hands-on projects, and verifiable completion certificates across 60+ technology disciplines.",
  keywords: [
    "IT learning",
    "programming courses",
    "tech certification",
    "coding education",
    "software development",
    "AI engineering",
    "cybersecurity",
    "cloud computing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#07070a] text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
