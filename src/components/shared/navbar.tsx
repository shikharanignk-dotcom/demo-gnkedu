"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CheckSquare, ShieldCheck, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 font-heading text-base font-bold tracking-tight text-slate-900">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            GNK Edusolution <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Go to Website
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 font-heading text-lg font-extrabold tracking-tight text-slate-900">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            GNK <span className="text-indigo-600 font-medium">Demos</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold transition-colors hover:text-indigo-600 ${
                    isActive ? "text-indigo-600 font-bold" : "text-slate-500"
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
                className="text-xs px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all font-medium flex items-center gap-1"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Dashboard
              </Link>
            )}
            <a
              href="https://wa.me/919352483446"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md font-semibold transition-all"
            >
              Order Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="p-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600"
                title="Admin Panel"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 bg-white">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 px-3">
              <a
                href="https://wa.me/919352483446"
                target="_blank"
                rel="noreferrer"
                className="block w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold text-sm transition-all"
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
