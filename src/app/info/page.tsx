"use client";

import { useEffect, useState } from "react";
import { Info, HelpCircle, Bell, ArrowRight, HelpCircle as FAQIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_INFO: any[] = [];

export default function InfoPage() {
  const [notices, setNotices] = useState<any[]>(FALLBACK_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("information")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setNotices(data);
        }
      } catch (err) {
        console.log("Using fallback mock data for notices.");
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  return (
    <div className="w-full mx-auto max-w-3xl px-4 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Important <span className="text-gradient">Information</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md mx-auto">
          Read FAQs, writing instructions, and important guidelines posted by the administration.
        </p>
      </div>

      {/* Notices List - Single Column, perfect for Mobile screen sizing */}
      <div className="space-y-6">
        {notices.map((item) => {
          const isImportant = item.is_important;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                isImportant
                  ? "bg-amber-500/5 border-amber-200 shadow-sm"
                  : "bg-white border-slate-100 shadow-premium"
              }`}
            >
              {/* Category tag */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
                  <span className="flex items-center gap-1 text-[9px] text-amber-700 font-semibold uppercase">
                    <Bell className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
                    <span>Important</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-heading font-bold text-slate-900 mt-3 leading-snug">
                {item.title}
              </h3>

              {/* Content text */}
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA card */}
      <div className="p-6 rounded-2xl bg-brand-primary-light border border-brand-primary-light text-center space-y-4">
        <h4 className="text-sm font-heading font-bold text-indigo-950">Have another question?</h4>
        <p className="text-xs text-indigo-800">We are responsive on WhatsApp to clear your custom assignment doubts.</p>
        <a
          href="https://wa.me/919352483446"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs tracking-wider uppercase transition-colors"
        >
          <span>Chat on WhatsApp</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
