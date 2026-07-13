"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Mail, Phone, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function Footer() {
  const [phone, setPhone] = useState("919352483446");
  const [logoText, setLogoText] = useState("GNK Demos");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .then(({ data }) => {
        if (data) {
          const wa = data.find((row) => row.key === "whatsapp_config")?.value;
          const hc = data.find((row) => row.key === "homepage_config")?.value;
          if (wa && wa.phone) {
            setPhone(wa.phone);
          }
          if (hc && hc.logo_text) {
            setLogoText(hc.logo_text);
          }
        }
      });
  }, []);

  const displayPhone = phone.startsWith("91") && phone.length === 12 
    ? `+91 ${phone.slice(2, 7)} ${phone.slice(7)}` 
    : phone;

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-10 mt-auto pb-24 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900">
              <CheckSquare className="h-5 w-5 text-brand-primary" />
              <span>{logoText}</span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Premium showcase of our handwriting assignments, academic projects, coding demos, and course reviews. Verified trust and quality service for students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/assignments" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  Assignments
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  Video Demos
                </Link>
              </li>
              <li>
                <Link href="/info" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  Important Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="h-3.5 w-3.5 text-indigo-600" />
                <span>{displayPhone}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 text-indigo-600" />
                <span>onlineservicemart@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-[10px] text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Response in minutes (9 AM - 9 PM)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400">
            &copy; {new Date().getFullYear()} Guru Nanak Photostat Fatehabad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
