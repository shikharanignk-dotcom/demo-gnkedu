"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, FolderCode, PlayCircle, Star, MessageSquare, ArrowRight, Award, Zap, HeartHandshake, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MOCK_DEMOS = [
  {
    id: "1",
    type: "assignment",
    title: "IGNOU DECE-01 Handwritten Assignment",
    subject: "Early Childhood Care & Education",
    semester: "Semester 1",
    university: "IGNOU",
    assignment_type: "handwritten",
    thumbnail_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
    category: "DECE Diploma",
    is_featured: true,
  },
  {
    id: "2",
    type: "assignment",
    title: "BCA Computer Networks Typed Assignment",
    subject: "Computer Networks",
    semester: "Semester 3",
    university: "IP University",
    assignment_type: "pdf",
    thumbnail_url: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
    category: "BCA Computer Science",
    is_featured: true,
  },
  {
    id: "3",
    type: "project",
    title: "E-Commerce Website with Admin Dashboard",
    tech_stack: ["Next.js", "Tailwind", "Supabase"],
    description: "Fully responsive online store with product listings, cart system, checkout, and custom sales analytics dashboard for the owner.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    category: "Full Stack Web",
    is_featured: true,
  },
  {
    id: "4",
    type: "project",
    title: "Hostel Management System App",
    tech_stack: ["React Native", "NodeJS"],
    description: "Mobile application for students to request leaves, report hostel issues, and view daily dining menu schedules.",
    thumbnail_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
    category: "Mobile App",
    is_featured: true,
  },
];

const MOCK_VIDEOS = [
  {
    id: "v1",
    title: "Handwriting Assignment Quality & Paper Review Demo",
    youtube_id: "dQw4w9WgXcQ",
    category: "Handwriting Demo",
  },
  {
    id: "v2",
    title: "NextJS React Project Implementation and Admin Walkthrough",
    youtube_id: "dQw4w9WgXcQ",
    category: "Project Demo",
  },
];

const MOCK_REVIEWS = [
  {
    id: "r1",
    student_name: "Priya Sharma",
    rating: 5,
    review_text: "Perfect quality handwritten sheets. Handwriting was extremely clean and uniform throughout all pages. Got 90 marks in IGNOU exam. Highly recommend!",
    university: "IGNOU (DECE)",
  },
  {
    id: "r2",
    student_name: "Rahul Kumar",
    rating: 5,
    review_text: "The web project runs smoothly on my local machine. The explanations provided in the walkthrough video helped me clear my college viva easily.",
    university: "Amity University (BCA)",
  },
  {
    id: "r3",
    student_name: "Shivani Meena",
    rating: 5,
    review_text: "Fast delivery and great customer support on WhatsApp. They resolved my doubts about formatting immediately.",
    university: "Rajasthan University (BA)",
  },
];

export default function LandingPage() {
  const [demos, setDemos] = useState<any[]>(MOCK_DEMOS);
  const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        
        const { data: demosData } = await supabase
          .from("demos")
          .select("*")
          .eq("published", true)
          .eq("is_featured", true)
          .order("sort_order", { ascending: true })
          .limit(6);
          
        if (demosData && demosData.length > 0) {
          setDemos(demosData);
        }

        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("*")
          .eq("published", true)
          .limit(3);

        if (reviewsData && reviewsData.length > 0) {
          setReviews(reviewsData);
        }
      } catch (err) {
        console.log("Using local fallback mock data: Supabase URL config not complete.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full space-y-16 pb-16 bg-bg-page">
      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-20 sm:pb-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-[10px] sm:text-xs text-indigo-600 font-semibold">
            <Award className="h-4 w-4" />
            <span>Trusted Demo Portfolio & Quality Samples</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
            Verify Assignment Sheet Quality Before You Order at <span className="text-gradient">GNK Edusolution</span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Browse our verified handwritten sheets, college project codebases, and review demos. 100% authenticity and scoring excellence guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-3">
            <Link
              href="/assignments"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md active:scale-95 transition-all"
            >
              <span>Explore Demos</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/919352483446"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <MessageSquare className="h-4 w-4 fill-slate-700 stroke-none" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 📊 Trust Stats Bar */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium text-center">
          <div className="space-y-0.5">
            <p className="text-2xl sm:text-3xl font-heading font-bold text-indigo-600">500+</p>
            <p className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-wider">Students Served</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl sm:text-3xl font-heading font-bold text-indigo-600">1000+</p>
            <p className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-wider">Assignments</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl sm:text-3xl font-heading font-bold text-indigo-600">50+</p>
            <p className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-wider">Projects Done</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl sm:text-3xl font-heading font-bold text-indigo-600">4.8★</p>
            <p className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </section>

      {/* 🛡️ Core Values Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Why GNK Edusolution?</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto">We focus on high scoring sheet layout formats and clean codebases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-heading font-bold text-slate-900">Premium Quality Sheets</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assignments written on 80GSM A4 sheets with neat margins, standard spacing, and clear headers to maximize marks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-3">
            <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <FolderCode className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-heading font-bold text-slate-900">Clean Project Code</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every college project includes responsive clean code, detailed project reports, and local running guides.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HeartHandshake className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-heading font-bold text-slate-900">100% Trust Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We show you exact work samples, video walkthroughs, and student ratings before taking payment. No fake promises.
            </p>
          </div>
        </div>
      </section>

      {/* 📁 Featured Demos Showcase */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Featured Samples</h2>
            <p className="text-xs text-text-muted">A quick look at our high-scoring assignment and coding samples.</p>
          </div>
          <Link
            href="/assignments"
            className="group flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>View All Demos</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Single column stack for clean mobile rendering, grid for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => (
            <div key={demo.id} className="rounded-2xl bg-white border border-slate-100 shadow-premium hover:shadow-lg transition-all overflow-hidden flex flex-col sm:flex-row">
              {/* Thumbnail */}
              <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={demo.thumbnail_url}
                  alt={demo.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[8px] uppercase font-bold text-white tracking-wider">
                  {demo.type}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] text-indigo-600 font-bold tracking-wider uppercase">
                    {demo.category}
                  </span>
                  <h3 className="text-sm font-heading font-bold text-slate-900 leading-snug">
                    {demo.title}
                  </h3>
                  {demo.type === "assignment" ? (
                    <p className="text-[10px] text-text-muted">
                      {demo.university} &bull; {demo.semester} &bull; {demo.assignment_type}
                    </p>
                  ) : (
                    <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={demo.type === "assignment" ? "/assignments" : "/projects"}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                  >
                    View Sample
                  </Link>
                  {demo.tech_stack && (
                    <div className="flex gap-1">
                      {demo.tech_stack.slice(0, 2).map((tech: string) => (
                        <span key={tech} className="text-[8px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎬 Embedded Video Demos */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Video Walkthroughs</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto">Watch live videos of our handwriting speed, layouts, and system demo executions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_VIDEOS.map((vid) => (
            <div key={vid.id} className="rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden space-y-3 pb-4">
              <div className="relative aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${vid.youtube_id}`}
                  title={vid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="px-5 space-y-1">
                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                  {vid.category}
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-bold text-slate-900 pt-2 leading-snug">
                  {vid.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ Customer Reviews */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Student Reviews</h2>
          <p className="text-xs text-text-muted">100% verified feedback from students who scored 85%+ using our files.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-premium flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &ldquo;{rev.review_text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-slate-900">
                  {rev.student_name}
                </span>
                <span className="text-[9px] text-text-muted font-medium">
                  {rev.university}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
