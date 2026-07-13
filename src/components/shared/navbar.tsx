"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CheckSquare, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Assignments", href: "/assignments" },
  { label: "Projects", href: "/projects" },
  { label: "Video Demos", href: "/videos" },
  { label: "Reviews", href: "/reviews" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    // Listen for auth updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Don't show public navbar on dedicated admin routes (except login/public dashboard view if desired)
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-bg-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-white">
            <ShieldCheck className="h-5 w-5 text-brand-purple" />
            GNK Edusolution <span className="text-xs px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple border border-brand-purple/30">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-text-muted hover:text-white transition-colors">
              Go to Website
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg-dark/75 backdrop-blur-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight text-white">
            <CheckSquare className="h-6 w-6 text-brand-purple animate-pulse" />
            GNK <span className="text-gradient font-medium">Demos</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    isActive ? "text-brand-purple font-semibold" : "text-text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all font-medium flex items-center gap-1"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Dashboard
              </Link>
            )}
            <a
              href="https://wa.me/919352483446"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 shadow-md shadow-brand-purple/10 font-semibold tracking-wide transition-all"
            >
              Order Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="p-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/10 text-brand-purple"
                title="Admin Panel"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-white p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-2 animate-fadeIn">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "text-text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 px-3">
              <a
                href="https://wa.me/919352483446"
                target="_blank"
                rel="noreferrer"
                className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white text-center font-semibold transition-all"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
