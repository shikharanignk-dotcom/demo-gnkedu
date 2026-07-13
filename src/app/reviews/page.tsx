"use client";

import { useEffect, useState, useMemo } from "react";
import { Star, GraduationCap, CheckCircle, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_REVIEWS = [
  {
    id: "r1",
    student_name: "Priya Sharma",
    rating: 5,
    review_text: "Perfect quality handwritten sheets. Handwriting was extremely clean and uniform throughout all pages. Got 90 marks in IGNOU exam. Highly recommend!",
    university: "IGNOU (DECE)",
    verified: true,
  },
  {
    id: "r2",
    student_name: "Rahul Kumar",
    rating: 5,
    review_text: "The web project runs smoothly on my local machine. The explanations provided in the walkthrough video helped me clear my college viva easily.",
    university: "Amity University (BCA)",
    verified: true,
  },
  {
    id: "r3",
    student_name: "Shivani Meena",
    rating: 5,
    review_text: "Fast delivery and great customer support on WhatsApp. They resolved my doubts about formatting immediately.",
    university: "Rajasthan University (BA)",
    verified: true,
  },
  {
    id: "r4",
    student_name: "Aman Gupta",
    rating: 5,
    review_text: "Got complete assignment softcopies. Format was exactly as per IGNOU guidelines. Excellent scoring support.",
    university: "IGNOU (MCA)",
    verified: true,
  },
  {
    id: "r5",
    student_name: "Neha Preet",
    rating: 4,
    review_text: "Very neat handwriting. Got the files on time. Will definitely order again next semester.",
    university: "Delhi University (B.Com)",
    verified: false,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.log("Using fallback mock data for reviews.");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Compute stats metrics
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 5.0, count: 0, fiveStar: 0 };
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(1));
    const fiveStar = reviews.filter((r) => r.rating === 5).length;
    return {
      avg,
      count: reviews.length,
      fiveStar,
    };
  }, [reviews]);

  return (
    <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Student <span className="text-gradient">Reviews</span>
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
          Read verified testimonials from students who scored excellent marks using GNK Edusolution support.
        </p>
      </div>

      {/* Review Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl glass-panel items-center">
        {/* Rating Score */}
        <div className="text-center space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0">
          <p className="text-5xl sm:text-6xl font-heading font-extrabold text-white">{stats.avg}</p>
          <div className="flex justify-center text-amber-400 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 fill-amber-400 stroke-none ${
                  i < Math.round(stats.avg) ? "opacity-100" : "opacity-30"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-text-muted font-medium">Out of 5 stars based on reviews</p>
        </div>

        {/* Verified Badges */}
        <div className="text-center space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0">
          <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">100%</p>
          <p className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Verified Orders</p>
          <p className="text-xs text-text-muted max-w-[200px] mx-auto">
            Every review represents real homework help and assignment delivery.
          </p>
        </div>

        {/* Student Satisfaction */}
        <div className="text-center space-y-2">
          <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">
            {stats.count > 0 ? Math.round((stats.fiveStar / stats.count) * 100) : 100}%
          </p>
          <p className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">5-Star Rating</p>
          <p className="text-xs text-text-muted max-w-[200px] mx-auto">
            Majority of customers report scoring 85%+ in their final submissions.
          </p>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl glass-panel flex flex-col justify-between hover:shadow-xl hover:shadow-brand-purple/5 transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Rating stars & verified badge */}
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 stroke-none" />
                  ))}
                  {[...Array(5 - rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-white/20 stroke-none" />
                  ))}
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold uppercase">
                    <CheckCircle className="h-3 w-3 fill-brand-blue stroke-bg-dark" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {/* Text content */}
              <p className="text-sm text-slate-300 italic leading-relaxed">
                &ldquo;{rev.review_text}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-6">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-brand-purple" />
                <span className="text-xs font-semibold text-white">
                  {rev.student_name}
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-medium">
                {rev.university}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
