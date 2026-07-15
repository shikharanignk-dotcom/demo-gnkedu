"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronLeft, Search, ShoppingCart, HelpCircle, GraduationCap, ChevronRight, BookOpen, Star } from "lucide-react";



const PROGRAM_METADATA: Record<string, { title: string; desc: string; subPrograms: string[] | null }> = {
  dece: {
    title: "Diploma in Early Childhood Care",
    desc: "Expert assignments and curriculum guides for modern childhood educators.",
    subPrograms: null,
  },
  ma: {
    title: "Master of Arts",
    desc: "Advanced post-graduate assignments and guides for diverse humanities fields.",
    subPrograms: ["MPS", "MHD", "MAHI", "MEG"],
  },
  ba: {
    title: "Bachelor of Arts",
    desc: "Fundamental undergraduate guides and solved assignments across various social sciences.",
    subPrograms: ["BAM", "BCOMF"],
  },
  meg: {
    title: "MA English Literature",
    desc: "Specially curated critical notes, essays, and solved assignment papers for English majors.",
    subPrograms: null,
  },
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseParam = (params.course as string) || "dece";
  
  const courseMeta = PROGRAM_METADATA[courseParam.toLowerCase()] || {
    title: courseParam.toUpperCase(),
    desc: "Academic solved assignments and projects guide.",
    subPrograms: null,
  };

  // State
  const [search, setSearch] = useState("");
  const [selectedSubProgram, setSelectedSubProgram] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  // Fetch real subjects from Convex
  const demos = useQuery(api.demos.get);
  const siteSettings = useQuery(api.site_settings.get);

  // Map settings
  const settingsObj: Record<string, any> = {};
  siteSettings?.forEach((row: any) => {
    settingsObj[row.key] = row.value;
  });
  const whatsappConfig = settingsObj.whatsapp_config || {};
  const phone = whatsappConfig.phone || "919352483446";

  // Pre-load default sub-program selected state
  useEffect(() => {
    if (courseMeta.subPrograms && courseMeta.subPrograms.length > 0) {
      setSelectedSubProgram("all");
    } else {
      setSelectedSubProgram("all");
    }
  }, [courseParam, courseMeta.subPrograms]);

  // Fetch real database subjects
  const allSubjects = useMemo(() => {
    if (!demos || demos.length === 0) {
      return [];
    }

    // Filter demos belonging to this course
    return demos
      .filter((d: any) => d.category?.toLowerCase() === courseParam.toLowerCase())
      .map((d: any) => ({
        id: d._id,
        code: d.subject || "SUB",
        title: d.title,
        description: d.description || "",
        category: d.category || "",
        sub_program: d.sub_program || null,
        semester: d.semester || "Semester 1",
        assignment_type: d.assignment_type || "handwritten",
        type: d.type,
        tag: d.type === "project" ? "Field Project" : "Core Course",
        thumbnail: d.thumbnail_url || (d.handwritten_preview_images?.[0]) || (d.pdf_preview_images?.[0]) || null,
        slug: d.slug,
      }));
  }, [demos, courseParam]);

  // Filtered list
  const filteredSubjects = useMemo(() => {
    return allSubjects.filter((sub: any) => {
      const matchSearch =
        sub.title.toLowerCase().includes(search.toLowerCase()) ||
        sub.code.toLowerCase().includes(search.toLowerCase()) ||
        sub.description.toLowerCase().includes(search.toLowerCase());
      
      const matchSub =
        selectedSubProgram === "all" ||
        sub.sub_program?.toLowerCase() === selectedSubProgram.toLowerCase();
      
      const matchSem =
        selectedSemester === "all" ||
        sub.semester?.toLowerCase() === selectedSemester.toLowerCase();

      return matchSearch && matchSub && matchSem;
    });
  }, [allSubjects, search, selectedSubProgram, selectedSemester]);

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-6 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Breadcrumbs / Header (Screenshot 2) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
            <ChevronLeft className="h-4 w-4 text-slate-400" />
            <span>Back</span>
          </Link>
          <GraduationCap className="h-5 w-5 text-[#a15c00]" />
        </div>

        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wide">
          <Link href="/">Home</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <span className="text-[#a15c00]">{courseParam}</span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-heading font-extrabold text-slate-900 leading-tight">
            {courseMeta.title}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {courseMeta.desc}
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search subject code (e.g., DECE-1)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#a15c00] transition-colors shadow-sm"
        />
      </div>

      {/* Sub-program tabs (For MA, BA etc.) */}
      {courseMeta.subPrograms && (
        <div className="space-y-2 select-none">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Programs</label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
            <button
              onClick={() => setSelectedSubProgram("all")}
              className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border transition-all ${
                selectedSubProgram === "all"
                  ? "bg-[#a15c00] border-[#a15c00] text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              All Subjects
            </button>
            {courseMeta.subPrograms.map((sub: string) => (
              <button
                key={sub}
                onClick={() => setSelectedSubProgram(sub)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border transition-all ${
                  selectedSubProgram === sub
                    ? "bg-[#a15c00] border-[#a15c00] text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Semester filter chips */}
      <div className="space-y-2 select-none">
        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Semester / Year</label>
        <div className="flex gap-2">
          {["all", "Semester 1", "Semester 2"].map((sem: string) => {
            const label = sem === "all" ? "All Semesters" : sem;
            const isActive = selectedSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border shrink-0 ${
                  isActive
                    ? "bg-[#a15c00] border-[#a15c00] text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-650 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Cards list (Screenshot 2) */}
      <div className="space-y-4 pt-2">
        {filteredSubjects.map((sub: any) => {
          const detailUrl = `/courses/${courseParam}/${sub.slug || sub.id}`;
          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                {sub.thumbnail ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={sub.thumbnail}
                    alt={sub.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 flex flex-col items-center justify-center gap-1">
                    <span className="text-2xl font-heading font-extrabold text-[#a15c00]/25 uppercase tracking-widest">{sub.code}</span>
                    <span className="text-[9px] font-bold text-[#a15c00]/30 uppercase tracking-wider">GNK Photostat</span>
                  </div>
                )}
                
                {/* Demo Action Overlay pill */}
                <Link
                  href={detailUrl}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#a15c00] hover:bg-[#854b00] text-white text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md transition-all"
                >
                  <Search className="h-3 w-3 stroke-[2.5]" />
                  <span>View Demo</span>
                </Link>
              </div>

              {/* Card Content details */}
              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#a15c00] bg-[#a15c00]/5 border border-[#a15c00]/10 px-2 py-0.5 rounded-md">
                    {sub.code}
                  </span>
                  <h3 className="text-sm font-heading font-extrabold text-slate-900 pt-1 leading-snug">
                    {sub.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-150/50 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {sub.tag}
                  </span>
                  <Link
                    href={detailUrl}
                    className="text-[10px] font-extrabold text-[#a15c00] hover:text-[#854b00] flex items-center gap-0.5 transition-colors"
                  >
                    <span>Access Content</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 space-y-2">
            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400">No subjects found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom mobile Navbar (Matching layout) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 flex justify-between items-center shadow-lg">
        <Link href="/" className="flex flex-col items-center justify-center gap-0.5 text-slate-400">
          <GraduationCap className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <button className="flex flex-col items-center justify-center gap-0.5 text-[#a15c00]">
          <BookOpen className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold uppercase tracking-wider">Courses</span>
        </button>
        <Link href="/reviews" className="flex flex-col items-center justify-center gap-0.5 text-slate-400">
          <Star className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold uppercase tracking-wider">Reviews</span>
        </Link>
        <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-0.5 text-slate-400">
          <ShoppingCart className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
