import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { WhatsAppWidget } from "@/components/shared/whatsapp-widget";
import { ConvexClientProvider } from "@/components/shared/convex-provider";

export const metadata: Metadata = {
  title: "Guru Nanak Photostat Fatehabad - Demo & Assignment Showcase",
  description: "Official demo portfolio of Guru Nanak Photostat Fatehabad. Explore academic assignments, project source codes, video tutorials, and verified student reviews.",
  keywords: "guru nanak photostat fatehabad, assignment demo, handwriting assignments, projects demo, student assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600/20 selection:text-indigo-900">
        <ConvexClientProvider>
          {/* Navigation Header */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 w-full flex flex-col">{children}</main>

          {/* Footer Navigation */}
          <Footer />

          {/* Floating WhatsApp Widget */}
          <WhatsAppWidget />
        </ConvexClientProvider>
      </body>
    </html>
  );
}

