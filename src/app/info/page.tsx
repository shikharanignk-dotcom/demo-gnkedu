"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Info, HelpCircle, Bell, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function InfoPage() {
  // Fetch notices from Convex
  const notices = useQuery(api.information.get) || [];
  const siteSettings = useQuery(api.site_settings.get) || [];

  // Map settings
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const whatsappConfig = settingsObj.whatsapp_config || {};
  const phone = whatsappConfig.phone || "919518877939";

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-8 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Important <span className="text-[#a15c00]">Information</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Read FAQs, writing instructions, and important guidelines posted by the administration.
        </p>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((item: any) => {
          const isImportant = item.is_important;
          return (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all ${
                isImportant
                  ? "bg-amber-500/5 border-amber-200 shadow-sm"
                  : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isImportant
                      ? "bg-amber-100 text-amber-800"
                      : item.category === "FAQ"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {item.category || "Notice"}
                </span>

                {isImportant && (
                  <span className="flex items-center gap-1 text-[8px] text-amber-700 font-semibold uppercase">
                    <Bell className="h-3 w-3 text-amber-600 animate-bounce" />
                    <span>Important</span>
                  </span>
                )}
              </div>

              <h3 className="text-xs sm:text-sm font-heading font-extrabold text-slate-900 mt-3 leading-snug">
                {item.title}
              </h3>

              <p className="text-[10px] sm:text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA card */}
      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-200 text-center space-y-4">
        <h4 className="text-xs font-heading font-extrabold text-slate-900">Have another question?</h4>
        <p className="text-[10px] text-slate-500">We are responsive on WhatsApp to clear your custom assignment doubts.</p>
        <a
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white font-bold text-[10px] tracking-wider uppercase transition-colors"
        >
          <span>Chat on WhatsApp</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
