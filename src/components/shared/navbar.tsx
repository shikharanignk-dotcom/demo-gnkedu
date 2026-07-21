"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, CheckSquare, ShieldCheck, Home, Star, Info, MessageCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Assignments", href: "/assignments" },
  { label: "Projects", href: "/projects" },
  { label: "Video Demos", href: "/videos" },
  { label: "Important Info", href: "/info" },
  { label: "Reviews", href: "/reviews" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch site settings from Convex
  const siteSettings = useQuery(api.site_settings.get) || [];
  
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const whatsappConfig = settingsObj.whatsapp_config || {};
  const homepageConfig = settingsObj.homepage_config || {};

  const logoText = homepageConfig.logo_text || "GNK Demos";
  let phone = whatsappConfig.phone || "919518877939";
  if (phone.length === 10 && !phone.startsWith("91")) {
    phone = "91" + phone;
  }

  useEffect(() => {
    // Check local storage for admin session
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("gnk_admin_logged_in") === "true";
      setIsAdmin(loggedIn);
    };

    checkAuth();
    // Watch for custom auth events or polling
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdminRoute = pathname?.startsWith("/omgnk");

  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/omgnk" className="flex items-center gap-2 font-heading text-sm font-extrabold tracking-tight text-slate-900">
            <ShieldCheck className="h-5 w-5 text-[#a15c00]" />
            <span>Guru Nanak Photostat</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-[#a15c00] border border-amber-500/20 font-bold uppercase tracking-wider">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors">
              Go to Website
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-lg shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 font-heading text-base font-extrabold tracking-tight text-slate-900">
              <CheckSquare className="h-5 w-5 text-[#a15c00]" />
              <span>{logoText}</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-[#a15c00] ${
                      isActive ? "text-[#a15c00]" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] px-4 py-2 rounded-full bg-[#a15c00] text-white hover:bg-[#854b00] shadow-sm font-bold uppercase tracking-wider transition-all"
              >
                Order Now
              </a>
            </div>

          </div>
        </nav>
      </header>

      {/* 📱 Premium Sticky Mobile Bottom Navigation Bar (Only Icon tab menu) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-t border-slate-200/80 py-3.5 flex justify-around items-center md:hidden shadow-lg select-none px-6">
        {/* Home */}
        <Link 
          href="/"
          className={`p-2.5 transition-all flex flex-col items-center justify-center rounded-xl ${
            pathname === "/" ? "text-[#a15c00] bg-amber-500/10 scale-105" : "text-slate-450 hover:bg-slate-50"
          }`}
        >
          <Home className="h-5.5 w-5.5" />
        </Link>

        {/* Reviews */}
        <Link 
          href="/reviews"
          className={`p-2.5 transition-all flex flex-col items-center justify-center rounded-xl ${
            pathname === "/reviews" ? "text-[#a15c00] bg-amber-500/10 scale-105" : "text-slate-450 hover:bg-slate-50"
          }`}
        >
          <Star className="h-5.5 w-5.5" />
        </Link>

        {/* Important Info */}
        <Link 
          href="/info"
          className={`p-2.5 transition-all flex flex-col items-center justify-center rounded-xl ${
            pathname === "/info" ? "text-[#a15c00] bg-amber-500/10 scale-105" : "text-slate-450 hover:bg-slate-50"
          }`}
        >
          <Info className="h-5.5 w-5.5" />
        </Link>

        {/* WhatsApp Chat Icon */}
        <a 
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noreferrer"
          className="p-2.5 transition-all flex flex-col items-center justify-center text-emerald-500 hover:text-emerald-600 scale-105 bg-emerald-50 rounded-xl border border-emerald-100/50 shadow-sm"
        >
          <MessageCircle className="h-5.5 w-5.5 fill-current text-emerald-500" />
        </a>
      </div>
    </>
  );
}
