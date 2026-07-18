import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'InternTrack — Smart Internship Application Manager',
    template: '%s | InternTrack',
  },
  description: 'Track, manage, and optimize your internship applications with InternTrack — a smart college placement management system with skill matching, interview scheduling, and analytics.',
  keywords: ['internship tracker', 'placement management', 'college internship', 'application tracker', 'skill matching'],
  authors: [{ name: 'Manasa' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'InternTrack — Smart Internship Application Manager',
    description: 'Track, manage, and optimize your internship applications with InternTrack.',
    siteName: 'InternTrack',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full bg-[#f8fafc] text-[#0f172a] antialiased">
        {children}
      </body>
    </html>
  );
}
