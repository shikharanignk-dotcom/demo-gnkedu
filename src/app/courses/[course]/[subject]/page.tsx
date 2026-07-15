"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronLeft, GraduationCap, CheckCircle2, ChevronRight, MessageSquare, AlertCircle } from "lucide-react";
import { VideoReel } from "@/components/shared/video-reel";
import { Flipbook } from "@/components/shared/flipbook";



export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseParam = (params.course as string) || "dece";
  const subjectParam = (params.subject as string) || "dece-1";

  // Tab Toggle State: "handwritten" vs "pdf"
  const [activeFormatTab, setActiveFormatTab] = useState<"handwritten" | "pdf">("handwritten");

  // Fetch from Convex
  const demos = useQuery(api.demos.get);
  const siteSettings = useQuery(api.site_settings.get);

  // Mutations for analytics tracking
  const incrementViewPdf = useMutation(api.demos.incrementViewPdf);
  const incrementOrder = useMutation(api.demos.incrementOrder);

  // Settings
  const settingsObj: Record<string, any> = {};
  siteSettings?.forEach((row: any) => {
    settingsObj[row.key] = row.value;
  });
  const whatsappConfig = settingsObj.whatsapp_config || {};
  const phone = whatsappConfig.phone || "919352483446";

  // Match subject
  const currentSubject = useMemo(() => {
    if (!demos || demos.length === 0) return null;

    const match = demos.find(
      (d: any) =>
        d.slug === subjectParam ||
        d._id === subjectParam ||
        d.subject?.toLowerCase() === subjectParam.toLowerCase()
    );
    if (!match) return null;

    return {
      id: match._id,
      code: match.subject || "SUB",
      title: match.title,
      description: match.description || "",
      about: [
        { title: "Comprehensive Coverage", text: "Includes all units from Block 1 to 4 with summary notes and previous 5 years' solved question papers." },
        { title: "Quality Handwriting", text: "Our handwritten assignments are written by subject experts ensuring high marks." }
      ],
      videoUrl: match.video_reel_url,
      handwrittenPages: match.handwritten_preview_images || match.file_urls || [],
      pdfPages: match.pdf_preview_images || match.file_urls || [],
      priceHandwritten: match.price_handwritten || 350,
      pricePdf: match.price_pdf || 120,
      showPricePublic: match.show_price_public !== false,
      likesCount: match.likes_count || 0,
    };
  }, [demos, subjectParam]);

  // Track page views/sample views on load and on tab switches
  useEffect(() => {
    if (currentSubject && currentSubject.id && typeof incrementViewPdf === "function") {
      try {
        incrementViewPdf({ id: currentSubject.id });
      } catch (e) {
        console.error("Failed to increment sample view analytics:", e);
      }
    }
  }, [currentSubject, activeFormatTab, incrementViewPdf]);

  // List of all subject videos in this course for vertical swipes
  const courseSubjects = useMemo(() => {
    if (!demos || demos.length === 0) return [];
    return demos.filter((d: any) => d.category?.toLowerCase() === courseParam.toLowerCase());
  }, [demos, courseParam]);

  const handleNextSubject = () => {
    if (courseSubjects.length <= 1) return;
    const currentIndex = courseSubjects.findIndex(
      (s: any) => (s.slug || s._id) === subjectParam || s.subject?.toLowerCase() === subjectParam.toLowerCase()
    );
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % courseSubjects.length;
      const nextSub = courseSubjects[nextIndex];
      router.push(`/courses/${courseParam}/${nextSub.slug || nextSub._id || nextSub.id}`);
    }
  };

  const handlePrevSubject = () => {
    if (courseSubjects.length <= 1) return;
    const currentIndex = courseSubjects.findIndex(
      (s: any) => (s.slug || s._id) === subjectParam || s.subject?.toLowerCase() === subjectParam.toLowerCase()
    );
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + courseSubjects.length) % courseSubjects.length;
      const prevSub = courseSubjects[prevIndex];
      router.push(`/courses/${courseParam}/${prevSub.slug || prevSub._id || prevSub.id}`);
    }
  };

  if (!demos) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-3 bg-slate-50 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a15c00]" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading subject...</span>
      </div>
    );
  }

  if (!currentSubject) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-3 bg-slate-50 min-h-screen text-center p-6">
        <AlertCircle className="h-8 w-8 text-amber-600 mb-2" />
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Subject Not Found</h2>
        <p className="text-[10px] text-slate-500 max-w-xs">The subject assignment you are looking for does not exist or has been deleted.</p>
        <Link href={`/courses/${courseParam}`} className="mt-4 px-4 py-2 rounded-xl bg-[#a15c00] text-white text-[9px] font-extrabold uppercase tracking-wider">
          Go back to explorer
        </Link>
      </div>
    );
  }

  const currentPreFilledText = `Hi Guru Nanak Photostat, I am interested in ordering assignment: ${currentSubject.code} (${currentSubject.title}) in format: ${activeFormatTab.toUpperCase()}.`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(currentPreFilledText)}`;

  const handleOrderClick = () => {
    if (currentSubject.id && typeof incrementOrder === "function") {
      try {
        incrementOrder({ id: currentSubject.id });
      } catch (e) {
        console.error("Failed to increment order clicks analytics:", e);
      }
    }
  };

  const flipbookImages = activeFormatTab === "handwritten" ? currentSubject.handwrittenPages : currentSubject.pdfPages;
  const showPrice = currentSubject.showPricePublic;

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-6 space-y-6 bg-slate-50 min-h-screen pb-32">
      {/* Header Back Button & Breadcrumbs (Screenshot 4) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Link href={`/courses/${courseParam}`} className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
            <ChevronLeft className="h-4 w-4 text-slate-400" />
            <span>Back</span>
          </Link>
          <GraduationCap className="h-5 w-5 text-[#a15c00]" />
        </div>

        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wide">
          <Link href="/">Home</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <Link href={`/courses/${courseParam}`}>{courseParam}</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <span className="text-[#a15c00]">{currentSubject.code}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-heading font-extrabold text-slate-900 leading-tight">
            {currentSubject.code}: {currentSubject.title}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentSubject.description}
          </p>
        </div>
      </div>

      {/* Handwritten vs Soft Copy Toggle Tabs (Screenshot 4) */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/50 gap-1.5 select-none">
        <button
          onClick={() => setActiveFormatTab("handwritten")}
          className={`flex-1 text-center py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFormatTab === "handwritten"
              ? "bg-[#a15c00] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Handwritten
        </button>
        <button
          onClick={() => setActiveFormatTab("pdf")}
          className={`flex-1 text-center py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFormatTab === "pdf"
              ? "bg-[#a15c00] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Soft Copy PDF
        </button>
      </div>

      {/* 🎬 1. Vertical Reel Video Player at Top (Screenshot 4) */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Video Walkthrough (Swipe up/down)</label>
        <VideoReel
          videoUrl={currentSubject.videoUrl}
          title={`${currentSubject.code} Assignment`}
          demoId={currentSubject.id}
          likesCount={currentSubject.likesCount}
          onNextSubject={handleNextSubject}
          onPrevSubject={handlePrevSubject}
        />
      </div>

      {/* 📖 2. HTML5/CSS 3D Flipbook PDF Viewer (Screenshot 4) */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Interactive Preview Pages</label>
        {flipbookImages && flipbookImages.length > 0 ? (
          <Flipbook
            images={flipbookImages}
            pdfName={`Solved_Paper_${currentSubject.code}.pdf`}
            whatsappLink={whatsappUrl}
            maxPreviews={5}
          />
        ) : (
          <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 flex flex-col items-center gap-1.5">
            <AlertCircle className="h-6 w-6 text-slate-350" />
            <span>No sample pages uploaded for this subject format yet.</span>
          </div>
        )}
      </div>

      {/* Pricing Information Card (Optional/Staff viewable) */}
      {showPrice ? (
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Preview Pricing</h4>
            <p className="text-xs text-slate-700 mt-0.5 font-medium">
              {activeFormatTab === "handwritten" ? "Handwritten Hardcopy" : "Softcopy PDF SOLVED"}
            </p>
          </div>
          <span className="text-sm font-heading font-extrabold text-slate-900">
            ₹{activeFormatTab === "handwritten" ? currentSubject.priceHandwritten : currentSubject.pricePdf}
          </span>
        </div>
      ) : (
        /* Hidden price info indicator for logged-in staff */
        <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 border-dashed text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          Pricing sensitive info hidden from public
        </div>
      )}

      {/* Badges / Quick Trust highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-[#a15c00] shrink-0 font-bold text-xs border border-amber-500/20">
            ✓
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-900 leading-tight">Updated 2024</h4>
            <p className="text-[8px] text-slate-400 mt-0.5 font-medium leading-none">Latest IGNOU Syllabus</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-[#a15c00] shrink-0 font-bold text-xs border border-amber-500/20">
            ⚡
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-900 leading-tight">Fast Delivery</h4>
            <p className="text-[8px] text-slate-400 mt-0.5 font-medium leading-none">Hardcopies in 2-3 Days</p>
          </div>
        </div>
      </div>

      {/* 📄 "About This Material" detailed text block (Screenshot 4) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-heading font-extrabold text-slate-900 uppercase tracking-wider">
          About This Material
        </h3>

        <div className="space-y-4">
          {currentSubject.about?.map((item: any, i: number) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[#a15c00] shrink-0 font-bold text-[10px] border border-amber-500/20 mt-0.5">
                ✓
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-800 leading-tight">{item.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟢 4. Sticky Bottom WhatsApp Order Button (Screenshot 4) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-250/60 p-4 flex justify-center shadow-lg safe-bottom">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleOrderClick}
          className="w-full max-w-md py-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebd59] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="h-4.5 w-4.5 fill-white stroke-none" />
          <span>Order {currentSubject.code} Now</span>
          <span className="text-[8px] opacity-75 font-normal tracking-normal lowercase block">Directly on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
