"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  ChevronLeft, Search, ShoppingCart, HelpCircle, GraduationCap, 
  ChevronRight, BookOpen, Star, Sparkles, AlertCircle, FileText, CheckCircle2 
} from "lucide-react";
import { VideoReel } from "@/components/shared/video-reel";
import { Flipbook } from "@/components/shared/flipbook";

const PROGRAM_METADATA: Record<string, { title: string; desc: string }> = {
  "dece-assignment": {
    title: "DECE Assignments Demos",
    desc: "Premium handwritten & reference solved assignments for Diploma in Early Childhood Care.",
  },
  "dece-project": {
    title: "DECE Project Demos",
    desc: "DECE-4 Project Synopsis and Report writing guide walkthroughs.",
  },
  "ma": {
    title: "MA Solved Assignments",
    desc: "Master of Arts solved sheets for MPS, MHD, MEG, MAHI and other programs.",
  },
  "ba": {
    title: "BA Solved Assignments",
    desc: "Bachelor of Arts general and honors solved assignment sheets.",
  },
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const courseParam = (params.course as string) || "dece-assignment";
  const formatQuery = searchParams.get("format") || "handwritten";
  const subjectQuery = searchParams.get("subject") || "";

  const courseMeta = PROGRAM_METADATA[courseParam.toLowerCase()] || {
    title: "Assignments Explorer",
    desc: "Academic solved assignments and projects guide.",
  };

  // State
  const [search, setSearch] = useState("");
  const [activeFormat, setActiveFormat] = useState<"handwritten" | "pdf">(
    formatQuery === "pdf" ? "pdf" : "handwritten"
  );
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const incrementedSubjectsRef = useRef<Set<string>>(new Set());

  // Convex Queries & Mutations
  const demos = useQuery(api.demos.get) || [];
  const siteSettings = useQuery(api.site_settings.get) || [];
  const incrementViewPdf = useMutation(api.demos.incrementViewPdf);
  const incrementOrder = useMutation(api.demos.incrementOrder);

  // Map settings
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const whatsappConfig = settingsObj.whatsapp_config || {};
  const phone = whatsappConfig.phone || "919352483446";

  const showPdfSetting = settingsObj.homepage_config?.show_pdf !== false;

  useEffect(() => {
    if (!showPdfSetting && activeFormat === "pdf") {
      setActiveFormat("handwritten");
    }
  }, [showPdfSetting, activeFormat]);

  // Filter subjects for this category
  const categorySubjects = useMemo(() => {
    return demos
      .filter((d: any) => d.category?.toLowerCase() === courseParam.toLowerCase())
      .map((d: any) => ({
        id: d._id,
        code: d.subject || d.title || "SUB",
        title: d.title,
        description: d.description || "",
        category: d.category || "",
        semester: d.semester || "Semester 1",
        priceHandwritten: d.price_handwritten || 0,
        pricePdf: d.price_pdf || 0,
        showPricePublic: false,
        videoUrl: d.video_reel_url || "",
        handwrittenPages: d.handwritten_preview_images || d.file_urls || [],
        pdfPages: d.pdf_preview_images || d.file_urls || [],
        likesCount: d.likes_count || 0,
        slug: d.slug,
        videoReels: d.video_reels || (d.video_reel_url ? [d.video_reel_url] : []),
        handwrittenDocs: d.handwritten_docs || (d.handwritten_preview_images?.length ? [{ title: "Main Solved Copy", pages: d.handwritten_preview_images }] : []),
        pdfDocs: d.pdf_docs || (d.pdf_preview_images?.length ? [{ title: "Main Solved Copy", pages: d.pdf_preview_images }] : []),
      }));
  }, [demos, courseParam]);

  // Set default active subject when subjects load or query changes
  useEffect(() => {
    if (categorySubjects.length > 0) {
      if (subjectQuery) {
        const found = categorySubjects.find(
          (s: any) => s.code.toLowerCase() === subjectQuery.toLowerCase() || s.id === subjectQuery || s.slug === subjectQuery
        );
        if (found) {
          setActiveSubjectId(found.id);
          setSelectedDocIndex(0);
          setActiveReelIndex(0);
          return;
        }
      }
      // If no query or found, fallback to first item
      setActiveSubjectId(categorySubjects[0].id);
      setSelectedDocIndex(0);
      setActiveReelIndex(0);
    }
  }, [categorySubjects, subjectQuery]);

  // Search filter
  const filteredSubjects = useMemo(() => {
    return categorySubjects.filter((sub: any) => {
      return (
        sub.title.toLowerCase().includes(search.toLowerCase()) ||
        sub.code.toLowerCase().includes(search.toLowerCase()) ||
        sub.description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [categorySubjects, search]);

  // Find active subject details
  const activeSubject = useMemo(() => {
    return categorySubjects.find((s: any) => s.id === activeSubjectId) || null;
  }, [categorySubjects, activeSubjectId]);

  // Track page view analytics when switching subjects or format tabs
  useEffect(() => {
    if (activeSubjectId) {
      const key = `${activeSubjectId}-${activeFormat}`;
      if (!incrementedSubjectsRef.current.has(key)) {
        incrementedSubjectsRef.current.add(key);
        try {
          incrementViewPdf({ id: activeSubjectId as any });
        } catch (e) {
          console.error("View analytics increment failed:", e);
        }
      }
    }
  }, [activeSubjectId, activeFormat, incrementViewPdf]);

  const handleSubjectChange = (sub: any) => {
    setActiveSubjectId(sub.id);
    setSelectedDocIndex(0);
    setActiveReelIndex(0);
    // Update URL query params without reloading the page
    const params = new URLSearchParams(window.location.search);
    params.set("subject", sub.code);
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  const handleFormatChange = (format: "handwritten" | "pdf") => {
    setActiveFormat(format);
    setSelectedDocIndex(0);
    setActiveReelIndex(0);
    const params = new URLSearchParams(window.location.search);
    params.set("format", format);
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  const handleReelScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 260 + 16;
    const index = Math.round(scrollLeft / cardWidth);
    if (index !== activeReelIndex && index >= 0) {
      setActiveReelIndex(index);
    }
  };

  // Dynamic WhatsApp pre-filled message generator
  const getWhatsappLink = () => {
    if (!activeSubject) return `https://wa.me/${phone}`;
    const formatText = activeFormat === "handwritten" ? "Handwritten (Hard Copy)" : "Soft Copy Solved PDF";
    const msg = `Hi Guru Nanak Photostat, I would like to order:
Subject Code: ${activeSubject.code}
Title: ${activeSubject.title}
Format: ${formatText}
I viewed the live demo preview on your site. Please confirm availability.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const handleOrderClick = () => {
    if (activeSubjectId) {
      try {
        incrementOrder({ id: activeSubjectId as any });
      } catch (e) {
        console.error("Order analytics increment failed:", e);
      }
    }
  };

  // Determine active document copies list
  const activeDocList = useMemo(() => {
    if (!activeSubject) return [];
    return activeFormat === "handwritten" ? activeSubject.handwrittenDocs : activeSubject.pdfDocs;
  }, [activeSubject, activeFormat]);

  // Determine active preview images
  const flipbookImages = useMemo(() => {
    if (activeDocList && activeDocList.length > 0) {
      const activeDoc = activeDocList[selectedDocIndex] || activeDocList[0];
      return activeDoc?.pages || [];
    }
    // Fallback to legacy single array field
    if (!activeSubject) return [];
    return activeFormat === "handwritten"
      ? activeSubject.handwrittenPages
      : activeSubject.pdfPages;
  }, [activeSubject, activeFormat, activeDocList, selectedDocIndex]);

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-6 space-y-6 bg-slate-50 min-h-screen pb-32">
      {/* 1. Header & Back Link */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
            <ChevronLeft className="h-4 w-4 text-slate-400" />
            <span>Go Back</span>
          </Link>
          <GraduationCap className="h-5 w-5 text-[#a15c00]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-heading font-extrabold text-slate-900 leading-tight">
            {courseMeta.title}
          </h1>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            {courseMeta.desc}
          </p>
        </div>
      </div>

      {/* 2. Format Selector Tabs (Handwritten vs PDF) */}
      {showPdfSetting && (
        <div className="grid grid-cols-2 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200 gap-1.5">
          <button
            onClick={() => handleFormatChange("handwritten")}
            className={`py-3 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex flex-col items-center justify-center cursor-pointer ${
              activeFormat === "handwritten"
                ? "bg-[#a15c00] text-white shadow-md scale-[1.02]"
                : "text-slate-650 hover:bg-white/50"
            }`}
          >
            <span className="text-sm">✍️</span>
            <span className="mt-0.5">Handwritten</span>
            <span className="text-[7px] opacity-75 font-normal tracking-normal lowercase">bne-bnaye hard copy</span>
          </button>

          <button
            onClick={() => handleFormatChange("pdf")}
            className={`py-3 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex flex-col items-center justify-center cursor-pointer ${
              activeFormat === "pdf"
                ? "bg-[#a15c00] text-white shadow-md scale-[1.02]"
                : "text-slate-650 hover:bg-white/50"
            }`}
          >
            <span className="text-sm">📄</span>
            <span className="mt-0.5">Soft Copy PDF</span>
            <span className="text-[7px] opacity-75 font-normal tracking-normal lowercase">dekh kar likhne ke liye</span>
          </button>
        </div>
      )}

      {/* 3. Subject Selector (Cards list) */}
      {categorySubjects.length > 0 && (
        <div className="space-y-2 select-none">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Select Subject Code</label>
            {categorySubjects.length > 3 && (
              <span className="text-[8px] text-slate-400 font-bold bg-slate-200 px-1.5 py-0.5 rounded uppercase">
                {categorySubjects.length} subjects
              </span>
            )}
          </div>

          {/* Search bar inside list */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject code (e.g. DECE-1)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#a15c00]/50 focus:ring-1 focus:ring-[#a15c00]/20"
            />
          </div>

          {/* Horizontal scroll chip selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filteredSubjects.map((sub: any) => {
              const isActive = sub.id === activeSubjectId;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubjectChange(sub)}
                  title={sub.code}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wide border shrink-0 transition-all max-w-[150px] truncate cursor-pointer ${
                    isActive
                      ? "bg-amber-500/10 border-amber-500/30 text-[#a15c00] shadow-sm scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-650 hover:border-slate-350"
                  }`}
                >
                  {sub.code}
                </button>
              );
            })}
            {filteredSubjects.length === 0 && (
              <span className="text-[10px] text-slate-400 py-1.5 italic">No subjects match search query.</span>
            )}
          </div>
        </div>
      )}

      {/* 4. Active Subject Details display (PDF Flipbook, Video Reels, details) */}
      {activeSubject ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Divider */}
          <div className="h-px bg-slate-200" />

          {/* Subject Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
            <h2 className="text-base font-heading font-extrabold text-slate-900 leading-snug">
              {activeSubject.title}
            </h2>
            {activeSubject.description && (
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {activeSubject.description}
              </p>
            )}
          </div>

          {/* reels display if available (only for handwritten format) */}
          {activeFormat === "handwritten" && activeSubject.videoReels && activeSubject.videoReels.length > 0 && (
            <div className="space-y-2 select-none">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Video Walkthroughs (Swipe right-to-left)</label>
              <div 
                onScroll={handleReelScroll}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
              >
                {activeSubject.videoReels.map((url: string, index: number) => (
                  <div key={index} className="w-[260px] sm:w-[295px] shrink-0 snap-center relative">
                    <VideoReel
                      videoUrl={url}
                      title={`${activeSubject.title} Demo ${index + 1}`}
                      demoId={activeSubject.id}
                      likesCount={activeSubject.likesCount}
                      isActive={index === activeReelIndex}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Solved Docs selectors */}
          {activeDocList && activeDocList.length > 1 && (
            <div className="space-y-2 select-none">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Select Solved Copy</label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {activeDocList.map((doc: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDocIndex(i)}
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wide border shrink-0 transition-all cursor-pointer ${
                      selectedDocIndex === i
                        ? "bg-[#a15c00] border-[#a15c00] text-white shadow-md scale-[1.02]"
                        : "bg-white border-slate-200 text-slate-650 hover:bg-slate-350"
                    }`}
                  >
                    {doc.title || `Solved Copy ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* flipbook display */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Interactive Pages Preview</label>
            {flipbookImages && flipbookImages.length > 0 ? (
              <Flipbook
                images={flipbookImages}
                pdfName={`Preview_${activeSubject.title.replace(/\s+/g, "_")}_${activeFormat.toUpperCase()}.pdf`}
                whatsappLink={getWhatsappLink()}
                maxPreviews={5}
              />
            ) : (
              <div className="w-full bg-white p-12 rounded-3xl border border-slate-250 flex flex-col items-center justify-center text-center text-slate-400">
                <HelpCircle className="h-8 w-8 text-slate-300 mb-2 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">No images uploaded</p>
                <p className="text-[8px] text-slate-400 mt-1 max-w-[200px]">Preview pages for {activeFormat === "handwritten" ? "handwritten" : "soft copy PDF"} are not available yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full bg-white p-16 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center text-slate-400">
          <AlertCircle className="h-10 w-10 text-slate-350 mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">No subjects found</p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[220px]">This category is currently empty. Demos will be uploaded by the administrator soon.</p>
        </div>
      )}

      {/* 5. Sticky Bottom WhatsApp CTA Button Widget */}
      {activeSubject && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40 flex justify-center">
          <a
            href={getWhatsappLink()}
            onClick={handleOrderClick}
            target="_blank"
            rel="noreferrer"
            className="w-full max-w-xl py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-extrabold text-xs uppercase tracking-widest text-center shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <span>Order Solved {activeSubject.title} Now</span>
          </a>
        </div>
      )}
    </div>
  );
}
