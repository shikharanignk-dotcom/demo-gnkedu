import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CheckCircle2, ChevronRight, GraduationCap, BookOpen, Building2, FileText, HeartHandshake, Zap, Star } from "lucide-react";

export const dynamic = "force-dynamic";

// Hardcoded program configuration matching Screenshot 1
const PROGRAMS = [
  {
    id: "dece",
    title: "DECE",
    fullName: "Diploma in Early Childhood Care",
    badge: "Child Assignments",
    icon: GraduationCap,
    subPrograms: null,
  },
  {
    id: "ma",
    title: "MA",
    fullName: "Master of Arts (All Subjects)",
    badge: "High Rated",
    icon: BookOpen,
    subPrograms: ["MPS", "MHD", "MAHI", "MEG"],
  },
  {
    id: "ba",
    title: "BA",
    fullName: "Bachelor of Arts (Gen & Hons)",
    badge: "Best Seller",
    icon: Building2,
    subPrograms: ["BAM", "BCOMF"],
  },
  {
    id: "meg",
    title: "MEG",
    fullName: "MA English Literature",
    badge: "Critical Notes",
    icon: FileText,
    subPrograms: null,
  },
];

export default async function HomePage() {
  let reviews: any[] = [];
  let settingsObj: Record<string, any> = {};

  try {
    const [reviewsData, settingsData] = await Promise.all([
      fetchQuery(api.reviews.get, { limit: 4 }),
      fetchQuery(api.site_settings.get),
    ]);

    reviews = reviewsData || [];
    settingsData?.forEach((row: any) => {
      settingsObj[row.key] = row.value;
    });
  } catch (err) {
    console.error("Convex not connected yet, loading fallbacks.");
  }

  const homepageConfig = settingsObj.homepage_config || {};
  const whatsappConfig = settingsObj.whatsapp_config || {};

  const phone = whatsappConfig.phone || "919352483446";
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
            Verify Assignment Quality <span className="text-[#a15c00]">Before You Order</span>
          </h1>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            Trusted by thousands of IGNOU students. Get accurate, high-quality, and prompt assignment delivery at your doorstep.
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

      {/* 🛡️ Services features row */}
      <section className="mx-auto max-w-xl px-4 mt-6 grid grid-cols-1 gap-3">
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

      {/* 📁 Explore Programs (Screenshot 1) */}
      <section className="mx-auto max-w-xl px-4 mt-10 space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-sm font-heading font-extrabold text-slate-900 uppercase tracking-wider">
              Explore Programs
            </h2>
            <p className="text-[10px] text-slate-500">
              Hand-picked course materials for IGNOU excellence
            </p>
          </div>
          <Link href="/courses" className="text-[10px] font-bold text-[#a15c00] flex items-center gap-0.5">
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {PROGRAMS.map((prog) => {
            const Icon = prog.icon;
            return (
              <Link
                key={prog.id}
                href={`/courses/${prog.id}`}
                className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex justify-between items-center"
              >
                {/* Left details */}
                <div className="space-y-2 z-10">
                  <span className="inline-block text-[8px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-extrabold uppercase tracking-wide">
                    {prog.badge}
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-heading font-extrabold text-slate-900">{prog.title}</h3>
                    <p className="text-[10px] text-slate-400 max-w-[200px] sm:max-w-xs">{prog.fullName}</p>
                  </div>
                </div>

                {/* Right Icon overlay */}
                <div className="relative z-10 flex items-center gap-1 text-[#a15c00] font-bold text-xs uppercase">
                  <Icon className="h-10 w-10 text-slate-100 absolute right-2 -bottom-2 group-hover:scale-110 transition-transform pointer-events-none" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 📜 Unmatched Printing Quality Section (Screenshot 1) */}
      <section className="mx-auto max-w-xl px-4 mt-10">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/50 space-y-4">
          <h3 className="text-xs font-heading font-extrabold text-slate-900 uppercase tracking-wider">
            Unmatched Printing Quality
          </h3>
          
          <ul className="space-y-3">
            {[
              "75 GSM Premium A4 Paper for durability",
              "Laser-sharp text readability guaranteed",
              "Waterproof ink for long-term document safety"
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[10px] text-slate-650 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#a15c00] shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <a
              href={`https://wa.me/${phone}?text=Hi, I want to request a sample PDF of solved assignments.`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2.5 rounded-xl border border-[#a15c00] hover:bg-[#a15c00]/5 text-[#a15c00] font-extrabold text-[10px] uppercase tracking-wider bg-white transition-colors cursor-pointer block"
            >
              Request Sample PDF
            </a>
          </div>
        </div>
      </section>

      {/* 💬 Student Reviews testimonial section */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-xl px-4 mt-10 space-y-4">
          <div className="space-y-0.5 text-center">
            <h2 className="text-xs font-heading font-extrabold text-slate-900 uppercase tracking-wider">Student Reviews</h2>
            <p className="text-[10px] text-slate-400">Real feedback from students who scored high.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reviews.map((rev) => (
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
