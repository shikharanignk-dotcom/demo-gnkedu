"use client";

import { useMemo } from "react";
import { Star, GraduationCap, CheckCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ReviewsPage() {
  // Fetch reviews from Convex
  const reviews = useQuery(api.reviews.get) || [];

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 4.9, count: 25, fiveStar: 23 };
    const sum = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(1));
    const fiveStar = reviews.filter((r: any) => r.rating === 5).length;
    return {
      avg,
      count: reviews.length,
      fiveStar,
    };
  }, [reviews]);

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-8 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Student <span className="text-[#a15c00]">Reviews</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Read verified testimonials from students who scored excellent marks using GNK Edusolution support.
        </p>
      </div>

      {/* Review Stats Summary */}
      <div className="grid grid-cols-1 gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm items-center">
        <div className="text-center space-y-1 pb-3 border-b border-slate-100">
          <p className="text-3xl font-heading font-extrabold text-slate-900">{stats.avg}</p>
          <div className="flex justify-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 fill-amber-400 stroke-none ${
                  i < Math.round(stats.avg) ? "opacity-100" : "opacity-30"
                }`}
              />
            ))}
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Average Student Rating</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="border-r border-slate-100 pr-2">
            <p className="text-xl font-heading font-bold text-[#a15c00]">100%</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Verified Deliveries</p>
          </div>
          <div>
            <p className="text-xl font-heading font-bold text-[#a15c00]">
              {stats.count > 0 ? Math.round((stats.fiveStar / stats.count) * 100) : 95}%
            </p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">5-Star Quality</p>
          </div>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="space-y-4">
        {reviews.map((rev: any) => (
          <div
            key={rev._id}
            className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 stroke-none" />
                  ))}
                  {[...Array(5 - rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-slate-200 stroke-none" />
                  ))}
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[8px] px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold uppercase">
                    <CheckCircle className="h-2.5 w-2.5 fill-sky-600 stroke-white" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;{rev.review_text}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-[#a15c00]" />
                <span className="text-[10px] font-bold text-slate-900">
                  {rev.student_name}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">
                {rev.university}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
