"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, FolderCode, PlayCircle, Star, MessageSquare, ArrowRight, ShieldCheck, Award, Zap, HeartHandshake } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Fallback high-quality mock data for instant preview
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
    title: "BCA Computer Networks Typed assignment",
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
    tech_stack: ["Next.js", "Tailwind CSS", "Supabase"],
    description: "Fully responsive online store with product listings, cart system, checkout, and custom sales analytics dashboard for the owner.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    category: "Full Stack Web",
    is_featured: true,
  },
  {
    id: "4",
    type: "project",
    title: "Hostel Management System App",
    tech_stack: ["React Native", "NodeJS", "Express"],
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
    youtube_id: "dQw4w9WgXcQ", // Placeholder video ID, will embed beautifully
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
        
        // Fetch featured demos
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

        // Fetch published reviews
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
    <div className="w-full space-y-24 pb-20">
      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-xs text-brand-purple font-medium">
            <Award className="h-4 w-4" />
            <span>Trusted Demo Portfolio for Assignments & Projects</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            See the Quality Before You Order at <span className="text-gradient">GNK Edusolution</span>
          </h1>

          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Browse our verified handwritten sheets, college project codebases, and review demos. 100% authenticity and scoring excellence guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/assignments"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-brand-purple/20 active:scale-95 transition-all"
            >
              <span>Explore Demos</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/919352483446"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
            >
              <MessageSquare className="h-4 w-4 fill-white stroke-none" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 📊 Trust Stats Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl glass-panel text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">500+</p>
            <p className="text-xs sm:text-sm text-text-muted font-medium">Students Served</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">1000+</p>
            <p className="text-xs sm:text-sm text-text-muted font-medium">Assignments Delivered</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">50+</p>
            <p className="text-xs sm:text-sm text-text-muted font-medium">Academic Projects</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">4.8★</p>
            <p className="text-xs sm:text-sm text-text-muted font-medium">Average Student Rating</p>
          </div>
        </div>
      </section>

      {/* 🛡️ Core Values Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">Why GNK Edusolution?</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">We focus on high scoring sheet layout formats and clean codebases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-white">Premium Quality Sheets</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Assignments written on 80GSM A4 sheets with neat margins, standard spacing, and clear question headers to maximize marks.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <FolderCode className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-white">Clean Project Code</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Every college project (BCA, B.Tech, MCA) includes responsive clean code, detailed project reports, and local running guides.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-white">100% Trust Guarantee</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              We show you exact work samples, video walkthroughs, and student ratings before taking payment. No fake promises.
            </p>
          </div>
        </div>
      </section>

      {/* 📁 Featured Demos Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">Featured Samples</h2>
            <p className="text-sm text-text-muted">A quick look at our high-scoring assignment and coding samples.</p>
          </div>
          <Link
            href="/assignments"
            className="group flex items-center gap-1 text-sm font-semibold text-brand-purple hover:text-brand-purple-hover transition-colors"
          >
            <span>View All Demos</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {demos.map((demo) => (
            <div key={demo.id} className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col sm:flex-row">
              {/* Thumbnail */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={demo.thumbnail_url}
                  alt={demo.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-bg-dark/80 text-[10px] uppercase font-semibold text-white border border-white/10">
                  {demo.type}
                </span>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-brand-purple font-semibold tracking-wider uppercase">
                    {demo.category}
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-white leading-snug">
                    {demo.title}
                  </h3>
                  {demo.type === "assignment" ? (
                    <p className="text-xs text-text-muted">
                      {demo.university} &bull; {demo.semester} &bull; {demo.assignment_type}
                    </p>
                  ) : (
                    <p className="text-xs text-text-muted line-clamp-2">
                      {demo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={demo.type === "assignment" ? "/assignments" : "/projects"}
                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    View Sample
                  </Link>
                  {demo.tech_stack && (
                    <div className="flex gap-1.5 flex-wrap">
                      {demo.tech_stack.slice(0, 2).map((tech: string) => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">Video Walkthroughs</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">Watch live videos of our handwriting speed, layouts, and system demo executions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_VIDEOS.map((vid) => (
            <div key={vid.id} className="rounded-2xl glass-panel overflow-hidden space-y-4 pb-6">
              {/* Aspect Ratio Box for YouTube Embed */}
              <div className="relative aspect-video bg-black">
                {/* Responsive iframe */}
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${vid.youtube_id}`}
                  title={vid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="px-6 space-y-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-semibold border border-brand-purple/20">
                  {vid.category}
                </span>
                <h3 className="text-base font-heading font-semibold text-white pt-2 leading-snug">
                  {vid.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ Customer Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">Student Reviews</h2>
          <p className="text-sm text-text-muted">100% verified feedback from students who scored 85%+ using our files.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 rounded-2xl glass-panel space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.review_text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  {rev.student_name}
                </span>
                <span className="text-[10px] text-text-muted font-medium">
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
