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
  title: "DEVORA — Learn. Build. Prove. | IT Learning & Career Platform",
  description:
    "Devora is an IT Learning & Career Platform that helps learners develop practical technology skills through structured learning pathways, comprehensive assessments, and verified credentials.",
  icons: {
    icon: "/techverse-academy/devora-logo.png",
    apple: "/techverse-academy/devora-logo.png",
  },
  keywords: [
    "DEVORA",
    "IT learning",
    "programming courses",
    "tech career",
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