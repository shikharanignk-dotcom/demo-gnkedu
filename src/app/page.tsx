import { createClient } from "@/lib/supabase/client";
import { ShowcaseHub } from "@/components/landing/showcase-hub";
import { HeartHandshake, Zap, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = createClient();

  // Fetch all categories on server side in parallel
  const [demosRes, reviewsRes, noticesRes] = await Promise.all([
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
      .order("created_at", { ascending: false })
  ]);

  const demos = demosRes.data || [];
  const reviews = reviewsRes.data || [];
  const notices = noticesRes.data || [];

  return (
    <div className="w-full min-h-screen bg-bg-page pb-12">
      {/* 🚀 Main Demos & Interactive Hub (First fold: what customers want) */}
      <ShowcaseHub initialDemos={demos} initialReviews={reviews} initialNotices={notices} />

      {/* 🛡️ Core Values Section (Second fold: build trust) */}
      <section className="mx-auto max-w-3xl px-4 mt-12 pt-8 border-t border-slate-200/80 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-sm font-heading font-extrabold text-slate-900 tracking-tight">
            Why Guru Nanak Photostat?
          </h2>
          <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
            We focus on clean sheet structures, proper academic formatting, and prompt customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-premium space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Instant Previews</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Open and read actual sample sheets or run walkthrough videos before you place an order.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-premium space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HeartHandshake className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Verified Guidelines</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              All assignments adhere to official university instructions (margins, format, pen color).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-premium space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Star className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Top Scoring Format</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Designed with proper layout metrics to maximize scoring potential during evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* 💬 Customer Testimonials (Third fold) */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 mt-12 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-heading font-extrabold text-slate-900">Student Reviews</h2>
            <p className="text-[10px] text-slate-500">Real feedback from students who scored high.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-white border border-slate-100 shadow-premium space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
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
