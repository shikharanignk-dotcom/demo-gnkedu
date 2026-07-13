import { createClient } from "@/lib/supabase/client";
import { ShowcaseHub } from "@/components/landing/showcase-hub";
import { HeartHandshake, Zap, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = createClient();

  // Fetch all categories and settings on server side in parallel
  const [demosRes, reviewsRes, noticesRes, settingsRes] = await Promise.all([
    supabase
      .from("demos")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("information")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("site_settings")
      .select("*")
  ]);

  const demos = demosRes.data || [];
  const reviews = reviewsRes.data || [];
  const notices = noticesRes.data || [];
  const settingsData = settingsRes.data || [];

  // Map settings array to key-value objects
  const settingsObj: Record<string, any> = {};
  settingsData.forEach((row) => {
    settingsObj[row.key] = row.value;
  });

  const homepageConfig = settingsObj.homepage_config || {};
  const whatsappConfig = settingsObj.whatsapp_config || {};

  console.log("=== SERVER LOADED SETTINGS ===");
  console.log("homepageConfig:", homepageConfig);
  console.log("whatsappConfig:", whatsappConfig);

  const settings = {
    hero_title: homepageConfig.hero_title || "Guru Nanak Photostat Fatehabad",
    hero_subtitle: homepageConfig.hero_subtitle || "Verify Assignment Sheet Quality Before You Order.",
    whatsapp_number: whatsappConfig.phone || "919352483446",
    whatsapp_message: whatsappConfig.message || "Hello Guru Nanak Photostat, I want to inquire about assignments/projects.",
    show_assignments: homepageConfig.show_assignments !== false,
    show_projects: homepageConfig.show_projects !== false,
    show_videos: homepageConfig.show_videos !== false,
    theme_color: homepageConfig.theme_color || "indigo",
  };

  return (
    <div className="w-full min-h-screen bg-bg-page pb-16 md:pb-6">
      {/* 🚀 Main Demos & Interactive Hub (First fold: loads instantly with settings) */}
      <ShowcaseHub 
        initialDemos={demos} 
        initialReviews={reviews} 
        initialNotices={notices} 
        settings={settings}
      />

      {/* 🛡️ Core Values Section (Second fold: build trust) */}
      <section className="mx-auto max-w-xl px-4 mt-8 pt-6 border-t border-slate-200/80 space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-heading font-extrabold text-slate-900 uppercase tracking-wide">
            Why Guru Nanak Photostat?
          </h2>
          <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
            We focus on clean sheet structures, proper academic formatting, and prompt customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-premium space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-900">Instant Previews</h4>
            <p className="text-[9px] text-slate-500 leading-normal">
              Open and read actual sample sheets or run walkthrough videos before you place an order.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-premium space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-900">Verified Guidelines</h4>
            <p className="text-[9px] text-slate-500 leading-normal">
              All assignments adhere to official university instructions (margins, format, pen color).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-premium space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Star className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-900">Top Scoring Format</h4>
            <p className="text-[9px] text-slate-500 leading-normal">
              Designed with proper layout metrics to maximize scoring potential during evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* 💬 Customer Testimonials (Third fold) */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-xl px-4 mt-8 space-y-5">
          <div className="text-center space-y-0.5">
            <h2 className="text-xs font-heading font-extrabold text-slate-900 uppercase tracking-wide">Student Reviews</h2>
            <p className="text-[9px] text-slate-500">Real feedback from students who scored high.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-premium space-y-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-current" />
                  ))}
                </div>
                <p className="text-[9px] text-slate-650 leading-relaxed italic">
                  "{rev.review_text}"
                </p>
                <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-50">
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
