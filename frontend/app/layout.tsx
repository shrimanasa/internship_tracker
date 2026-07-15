import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InternTrack - Smart Internship Application & Readiness Tracker",
  description: "Track every internship application, schedule interviews, store offers, identify technical skill gaps, and monitor your placement readiness in one central place.",
  keywords: "Internship tracker, student placement, DBMS project, interview scheduler, skill gap analysis, resume verification",
  authors: [{ name: "InternTrack College Team" }]
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
