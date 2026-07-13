import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { WhatsAppWidget } from "@/components/shared/whatsapp-widget";

export const metadata: Metadata = {
  title: "GNK Edusolution - Demo & Assignment Showcase",
  description: "Official demo portfolio of GNK Edusolution. Explore academic assignments, project source codes, video tutorials, and verified student reviews.",
  keywords: "gnk edusolution, assignment demo, handwriting assignments, projects demo, student assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-bg-dark text-slate-100 antialiased selection:bg-brand-purple/30 selection:text-white">
        {/* Navigation Header */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">{children}</main>

        {/* Footer Navigation */}
        <Footer />

        {/* Floating WhatsApp Widget */}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
