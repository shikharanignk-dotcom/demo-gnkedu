"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  CheckCircle2, ChevronRight, GraduationCap, BookOpen, 
  Building2, FileText, HeartHandshake, Zap, Star, X, ShoppingCart, HelpCircle 
} from "lucide-react";

const PROGRAMS = [
  {
    id: "dece-assignment",
    title: "DECE Assignment",
    fullName: "Diploma in Early Childhood Care (Solved Sheets)",
    badge: "Click to Watch Demo ➔",
    icon: GraduationCap,
  },
  {
    id: "dece-project",
    title: "DECE Project",
    fullName: "DECE-4 Project Work Report & Synopsis Guide",
    badge: "Click to Watch Demo ➔",
    icon: FileText,
  },
  {
    id: "ma",
    title: "MA Assignments",
    fullName: "Master of Arts All Subjects (MPS, MHD, MEG, MAHI)",
    badge: "Click to Watch Demo ➔",
    icon: BookOpen,
  },
  {
    id: "ba",
    title: "BA Assignments",
    fullName: "Bachelor of Arts & Gen/Honors Solved Sheets",
    badge: "Click to Watch Demo ➔",
    icon: Building2,
  },
];

export default function HomePage() {
  const router = useRouter();

  // Convex Queries
  const siteSettings = useQuery(api.site_settings.get) || [];
  const reviews = useQuery(api.reviews.get, { limit: 4 }) || [];

  // Map settings
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const homepageConfig = settingsObj.homepage_config || {};
  const whatsappConfig = settingsObj.whatsapp_config || {};

  const phone = whatsappConfig.phone || "919518877939";
  const whatsappMsg = whatsappConfig.message || "Hello Guru Nanak Photostat, I want to inquire about assignments/projects.";

  return (
    <div className="w-full min-h-screen bg-bg-page pb-24 md:pb-12">
      {/* 🚀 Hero Section (Screenshot 1) */}
      <section className="bg-white border-b border-slate-100 py-10 text-center">
        <div className="mx-auto max-w-xl px-4 space-y-4">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            <CheckCircle2 className="h-3 w-3 text-amber-600" />
            <span>verified quality documentation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-tight">
            {homepageConfig.hero_title || "Verify Assignment Quality Before You Order"}
          </h1>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {homepageConfig.hero_subtitle || "Trusted by thousands of IGNOU students. Get accurate, high-quality, and prompt assignment delivery at your doorstep."}
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/10 transition-all active:scale-95 cursor-pointer"
            >
              Order on WhatsApp Now
            </a>
          </div>
        </div>
      </section>



      {/* 📊 dynamic trust statistics section */}
      {settingsObj.counters && (
        <section className="mx-auto max-w-xl px-4 mt-6">
          <div className="grid grid-cols-3 gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div>
              <span className="block text-xl font-heading font-extrabold text-[#a15c00] leading-none">
                {settingsObj.counters.students || 500}+
              </span>
              <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-2.5 block leading-none">Happy Students</span>
            </div>
            <div className="border-x border-slate-100">
              <span className="block text-xl font-heading font-extrabold text-[#a15c00] leading-none">
                {settingsObj.counters.assignments || 1000}+
              </span>
              <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-2.5 block leading-none">Assignments</span>
            </div>
            <div>
              <span className="block text-xl font-heading font-extrabold text-[#a15c00] leading-none">
                {settingsObj.counters.projects || 50}+
              </span>
              <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-2.5 block leading-none">Field Projects</span>
            </div>
          </div>
        </section>
      )}

      {/* 📁 Explore Programs (Screenshot 1) */}
      <section className="mx-auto max-w-xl px-4 mt-10 space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <h2 className="text-sm font-heading font-extrabold text-slate-900 uppercase tracking-wider">
              Watch Demo
            </h2>
            <p className="text-[9px] font-bold text-slate-400">
              Select your program to view preview demos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PROGRAMS.map((prog) => {
            const Icon = prog.icon;
            return (
              <Link
                key={prog.id}
                href={`/courses/${prog.id}`}
                className="group bg-white p-4 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between items-start gap-4 cursor-pointer text-left relative overflow-hidden"
              >
                {/* Icon & Badge */}
                <div className="flex justify-between items-center w-full">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#a15c00]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[7px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-550 font-extrabold uppercase tracking-wider">
                    {prog.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-0.5 z-10 w-full">
                  <h3 className="text-xs font-heading font-extrabold text-slate-900 group-hover:text-[#a15c00] transition-colors leading-tight">
                    {prog.title}
                  </h3>
                  <p className="text-[8px] text-slate-400 leading-snug line-clamp-2">
                    {prog.fullName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 🛡️ Services features row (Moved to bottom) */}
      <section className="mx-auto max-w-xl px-4 mt-10 grid grid-cols-1 gap-3">
        {[
          { title: "Solved Papers", desc: "2023-24 Updates", icon: FileText, bg: "bg-blue-50 text-blue-600" },
          { title: "Pan India Delivery", desc: "Within 3-5 working days", icon: Zap, bg: "bg-amber-50 text-amber-600" },
          { title: "Expert Support", desc: "Live Academic Guidance", icon: HeartHandshake, bg: "bg-indigo-50 text-indigo-600" }
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${feat.bg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </section>
      {/* 💬 Student Reviews testimonial section */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-xl px-4 mt-10 space-y-4">
          <div className="space-y-0.5 text-center">
            <h2 className="text-xs font-heading font-extrabold text-slate-900 uppercase tracking-wider">Student Reviews</h2>
            <p className="text-[10px] text-slate-400">Real feedback from students who scored high.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reviews.map((rev: any) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed italic">
                  "{rev.review_text}"
                </p>
                <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-50">
                  <span>{rev.student_name}</span>
                  <span>{rev.university}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
