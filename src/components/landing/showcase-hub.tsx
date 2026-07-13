"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, BookOpen, Globe, Video, Bell, Star, MessageSquare, Download, ZoomIn, ZoomOut, RotateCcw, X, Home, ExternalLink, ShieldCheck, ChevronRight } from "lucide-react";

interface ShowcaseHubProps {
  initialDemos: any[];
  initialReviews: any[];
  initialNotices: any[];
  settings: {
    hero_title?: string;
    hero_subtitle?: string;
    whatsapp_number?: string;
    whatsapp_message?: string;
    show_assignments?: boolean;
    show_projects?: boolean;
    show_videos?: boolean;
    theme_color?: string;
  };
}

export function ShowcaseHub({ initialDemos, initialReviews, initialNotices, settings }: ShowcaseHubProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "projects" | "videos">("assignments");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  
  // Modal states
  const [viewerItem, setViewerItem] = useState<any | null>(null);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [activeNotice, setActiveNotice] = useState<any | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [zoom, setZoom] = useState(100);

  const themeColor = settings.theme_color || "indigo";
  const whatsappPhone = settings.whatsapp_number || "919352483446";
  const whatsappMsg = settings.whatsapp_message || "Hello Guru Nanak Photostat, I want to inquire about assignments/projects.";

  // Set the dynamic theme variables on load and when settings change
  useEffect(() => {
    console.log("=== SHOWCASE HUB THEME APPLIED ===");
    console.log("themeColor:", themeColor);
    console.log("whatsappPhone:", whatsappPhone);

    const root = document.documentElement;
    const colors: Record<string, { primary: string; hover: string; light: string; rgb: string }> = {
      indigo: { primary: "#4f46e5", hover: "#4338ca", light: "#f5f3ff", rgb: "79, 70, 229" },
      violet: { primary: "#7c3aed", hover: "#6d28d9", light: "#faf5ff", rgb: "124, 58, 237" },
      amber: { primary: "#d97706", hover: "#b85c00", light: "#fffbeb", rgb: "217, 119, 6" },
      emerald: { primary: "#059669", hover: "#047857", light: "#f0fdf4", rgb: "5, 150, 105" },
      rose: { primary: "#e11d48", hover: "#be185d", light: "#fff1f2", rgb: "225, 29, 72" },
    };
    const theme = colors[themeColor] || colors.indigo;
    root.style.setProperty("--dynamic-brand-color", theme.primary);
    root.style.setProperty("--dynamic-brand-hover", theme.hover);
    root.style.setProperty("--dynamic-brand-light", theme.light);
    root.style.setProperty("--dynamic-brand-rgb", theme.rgb);
  }, [themeColor, whatsappPhone]);

  // Group demos by type
  const assignments = useMemo(() => initialDemos.filter(d => d.type === "assignment"), [initialDemos]);
  const projects = useMemo(() => initialDemos.filter(d => d.type === "project"), [initialDemos]);
  const videos = useMemo(() => initialDemos.filter(d => d.type === "video"), [initialDemos]);

  // Latest notice for scrolling/bulletin header banner
  const latestNotice = useMemo(() => {
    return initialNotices.length > 0 ? initialNotices[0] : null;
  }, [initialNotices]);

  // Extract unique categories based on active tab
  const categories = useMemo(() => {
    const set = new Set<string>();
    const list = activeTab === "assignments" ? assignments : activeTab === "projects" ? projects : [];
    list.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [activeTab, assignments, projects]);

  // Extract unique tech tags for projects
  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((item) => {
      if (item.tech_stack) {
        item.tech_stack.forEach((tech: string) => set.add(tech));
      }
    });
    return Array.from(set);
  }, [projects]);

  // Filters logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.subject && item.subject.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchType = selectedType === "all" || item.assignment_type === selectedType;
      return matchSearch && matchCategory && matchType;
    });
  }, [assignments, search, selectedCategory, selectedType]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchTech = selectedType === "all" || (item.tech_stack && item.tech_stack.includes(selectedType));
      return matchSearch && matchTech;
    });
  }, [projects, search, selectedType]);

  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [videos, search]);

  return (
    <div className="w-full space-y-5 pb-16 md:pb-6">
      {/* 📱 Main Billboard Notices Alert Bar (Floating Notice Bulletin) */}
      {latestNotice && (
        <div 
          onClick={() => setActiveNotice(latestNotice)}
          className={`w-full px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border-b hover:opacity-90 transition-all ${
            latestNotice.is_important 
              ? "bg-amber-50 text-amber-800 border-amber-200" 
              : "bg-indigo-50 text-indigo-700 border-indigo-100"
          }`}
        >
          <span className="flex h-2 w-2 relative shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${latestNotice.is_important ? "bg-amber-500" : "bg-indigo-500"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${latestNotice.is_important ? "bg-amber-600" : "bg-indigo-600"}`}></span>
          </span>
          <span className="truncate">
            📢 <span className="font-bold uppercase text-[10px] tracking-wider shrink-0 bg-white/60 px-1.5 py-0.5 rounded border border-current mr-1">{latestNotice.category || "Bulletin"}</span> 
            {latestNotice.title} &mdash; <span className="underline">View details</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      )}

      {/* 📱 Compact Brand Banner */}
      <section className="bg-white border-b border-slate-200/80 py-6 text-center">
        <div className="mx-auto max-w-xl px-4 space-y-2">
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
            {settings.hero_title || "Guru Nanak Photostat Showcase"}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {settings.hero_subtitle || "Click any sample below to view handwriting quality, project designs, and files."}
          </p>
          <div className="flex gap-2 justify-center pt-1.5">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase shadow-sm flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="h-4 w-4 fill-white stroke-none" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* 📊 Tab Switcher - Centered (Only visible on larger screens now, bottom bar takes care on mobile) */}
      <div className="hidden md:block mx-auto max-w-xl px-4">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1">
          {[
            { id: "assignments", label: "Handwritten Sheets", icon: BookOpen, active: settings.show_assignments !== false },
            { id: "projects", label: "College Projects", icon: Globe, active: settings.show_projects !== false },
            { id: "videos", label: "Video Demos", icon: Video, active: settings.show_videos !== false },
          ].map((tab) => {
            if (!tab.active) return null;
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔍 Search & Filter Panels */}
      <div className="mx-auto max-w-xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-100 shadow-premium">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {activeTab === "assignments" ? (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer"
              >
                <option value="all">All Formats</option>
                <option value="handwritten">Handwritten Sheets</option>
                <option value="pdf">Softcopy PDF</option>
                <option value="typed">Computer Typed</option>
              </select>
            </>
          ) : activeTab === "projects" ? (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer sm:col-span-2"
            >
              <option value="all">All Technologies</option>
              {allTechTags.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          ) : (
            <div className="hidden sm:block sm:col-span-2 text-right py-1.5 pr-2 text-[10px] text-slate-400">
              Showing video walkthough samples
            </div>
          )}
        </div>
      </div>

      {/* 📁 Content Grid */}
      <div className="mx-auto max-w-xl px-4">
        {/* Tab 1: Assignments list */}
        {activeTab === "assignments" && (
          <div className="space-y-3.5">
            {filteredAssignments.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-100 shadow-premium overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all">
                <div className="relative w-full sm:w-28 aspect-video sm:aspect-auto sm:h-28 shrink-0 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[7px] uppercase font-bold text-white tracking-wider">
                    {item.assignment_type}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5">
                    {item.category && (
                      <span className="text-[7px] px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold uppercase">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-xs font-heading font-extrabold text-slate-900 pt-1.5 leading-tight">{item.title}</h3>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1 text-[9px] text-slate-500">
                      {item.subject && (
                        <p><span className="font-semibold text-slate-700">Subject:</span> {item.subject}</p>
                      )}
                      {item.semester && (
                        <p><span className="font-semibold text-slate-700">Sem:</span> {item.semester}</p>
                      )}
                      {item.university && (
                        <p><span className="font-semibold text-slate-700">Univ:</span> {item.university}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => {
                        setViewerItem(item);
                        setZoom(100);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View PDF Sample
                    </button>
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=Hi, I want to order assignment: ${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-wider transition-colors text-center"
                    >
                      Order
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {filteredAssignments.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-100">
                <BookOpen className="h-7 w-7 text-slate-350 mx-auto mb-1.5" />
                <p className="text-xs text-slate-400">No assignment demos created yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Projects list */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-xl border border-slate-100 shadow-premium overflow-hidden flex flex-col hover:shadow-md transition-all">
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proj.thumbnail_url} alt={proj.title} className="w-full h-full object-cover" />
                  {proj.category && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[7px] uppercase font-bold text-white tracking-wider">
                      {proj.category}
                    </span>
                  )}
                </div>

                <div className="p-3.5 space-y-2.5">
                  <h3 className="text-xs font-heading font-extrabold text-slate-900 leading-snug">{proj.title}</h3>
                  <p className="text-[10px] text-slate-650 leading-relaxed">{proj.description}</p>
                  
                  {proj.tech_stack && proj.tech_stack.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {proj.tech_stack.map((tech: string) => (
                        <span key={tech} className="text-[7px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-slate-50 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setGalleryIdx(0);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View Screens & Video
                    </button>
                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1"
                      >
                        <span>Live</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-100">
                <Globe className="h-7 w-7 text-slate-350 mx-auto mb-1.5" />
                <p className="text-xs text-slate-400">No project samples uploaded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Videos list */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredVideos.map((vid) => {
              let embedUrl = vid.youtube_url;
              if (embedUrl && !embedUrl.includes("/embed/")) {
                try {
                  const url = new URL(embedUrl);
                  let vidId = "";
                  if (url.hostname.includes("youtu.be")) {
                    vidId = url.pathname.slice(1);
                  } else {
                    vidId = url.searchParams.get("v") || "";
                  }
                  if (vidId) embedUrl = `https://www.youtube.com/embed/${vidId}`;
                } catch (e) {
                  embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
                }
              }

              return (
                <div key={vid.id} className="rounded-xl bg-white border border-slate-100 shadow-premium overflow-hidden space-y-2.5 pb-3">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      className="w-full h-full border-0"
                      src={embedUrl}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="px-3 space-y-0.5">
                    {vid.category && (
                      <span className="text-[7px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold uppercase">
                        {vid.category}
                      </span>
                    )}
                    <h3 className="text-[10px] font-bold text-slate-900 pt-1 leading-snug">{vid.title}</h3>
                  </div>
                </div>
              );
            })}
            {filteredVideos.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-100 w-full">
                <Video className="h-7 w-7 text-slate-350 mx-auto mb-1.5" />
                <p className="text-xs text-slate-400">No video guides uploaded yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📱 Premium Sticky Mobile Bottom Navigation Bar (App-like Interface) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-4 py-2.5 flex justify-between items-center select-none safe-bottom">
        {[
          { id: "home", label: "Home", icon: Home, action: () => { setActiveTab("assignments"); setSearch(""); setSelectedCategory("all"); setSelectedType("all"); } },
          { id: "assignments", label: "Sheets", icon: BookOpen, active: settings.show_assignments !== false, action: () => setActiveTab("assignments") },
          { id: "projects", label: "Projects", icon: Globe, active: settings.show_projects !== false, action: () => setActiveTab("projects") },
          { id: "videos", label: "Videos", icon: Video, active: settings.show_videos !== false, action: () => setActiveTab("videos") },
          { id: "support", label: "Inquire", icon: MessageSquare, action: () => { window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`, "_blank"); } },
        ].map((item) => {
          if (item.active === false) return null;
          const Icon = item.icon;
          const isSelected = activeTab === item.id || (item.id === "home" && activeTab === "assignments" && search === "");
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer transition-all ${
                isSelected ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-650"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span className="text-[8px] font-bold tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 📢 Floating Notice Bulletin Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                activeNotice.is_important ? "bg-amber-100 text-amber-800" : "bg-indigo-50 text-indigo-700"
              }`}>
                {activeNotice.category}
              </span>
              <button 
                onClick={() => setActiveNotice(null)} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
              <h3 className="text-sm font-heading font-extrabold text-slate-900 leading-snug">{activeNotice.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{activeNotice.content}</p>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-right">
              <button 
                onClick={() => setActiveNotice(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-350 text-slate-700 text-[10px] font-bold uppercase tracking-wider"
              >
                Close notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📄 PDF Sample Modal */}
      {viewerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl h-[80vh] rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{viewerItem.title}</h2>
                <p className="text-[8px] text-slate-500">Format: {viewerItem.assignment_type}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-lg bg-white px-1.5 py-0.5">
                  <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1 hover:bg-slate-100 text-slate-500"><ZoomOut className="h-3 w-3" /></button>
                  <span className="text-[9px] font-mono min-w-[25px] text-center">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 hover:bg-slate-100 text-slate-500"><ZoomIn className="h-3 w-3" /></button>
                </div>
                {viewerItem.file_urls?.[0] && (
                  <a href={viewerItem.file_urls[0]} target="_blank" rel="noreferrer" download className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"><Download className="h-3.5 w-3.5" /></a>
                )}
                <button onClick={() => setViewerItem(null)} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-3.5">
              {viewerItem.file_urls?.[0] ? (
                viewerItem.file_urls[0].endsWith(".pdf") || viewerItem.file_urls[0].includes("sample.pdf") ? (
                  <iframe
                    src={`${viewerItem.file_urls[0]}#toolbar=0`}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
                    className="w-full h-full border-0 rounded-lg shadow-sm bg-white"
                  ></iframe>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={viewerItem.file_urls[0]}
                    alt={viewerItem.title}
                    style={{ transform: `scale(${zoom / 100})` }}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white"
                  />
                )
              ) : (
                <div className="text-xs text-slate-500">No preview document uploaded.</div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex gap-3 items-center justify-between">
              <p className="hidden sm:block text-[9px] text-slate-500">Directly contact on WhatsApp to order your customized sheets.</p>
              <a
                href={`https://wa.me/${whatsappPhone}?text=Hi, I am interested in ordering assignment: ${encodeURIComponent(viewerItem.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-[9px] uppercase text-center hover:bg-indigo-700"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 🖥️ Project Details Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl h-[80vh] rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <span className="text-[7px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold">{activeProject.category}</span>
                <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900 pt-1 leading-snug">{activeProject.title}</h2>
              </div>
              <button onClick={() => setActiveProject(null)} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    {activeProject.file_urls && activeProject.file_urls.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={activeProject.file_urls[galleryIdx]} alt="Screenshot" className="w-full h-full object-cover" />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={activeProject.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    )}
                  </div>

                  {activeProject.file_urls && activeProject.file_urls.length > 1 && (
                    <div className="flex gap-1 overflow-x-auto">
                      {activeProject.file_urls.map((url: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setGalleryIdx(index)}
                          className={`w-10 aspect-video rounded overflow-hidden border-2 shrink-0 ${
                            index === galleryIdx ? "border-indigo-600" : "border-slate-200 opacity-60"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">About Project</h4>
                  <p className="text-xs text-slate-650 leading-relaxed">{activeProject.description}</p>
                  <h4 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">Tech Stack</h4>
                  <div className="flex gap-1 flex-wrap">
                    {activeProject.tech_stack?.map((tech: string) => (
                      <span key={tech} className="text-[8px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              {activeProject.youtube_url && (
                <div className="space-y-2 pt-3.5 border-t border-slate-100">
                  <h4 className="text-[9px] font-bold text-slate-750 uppercase tracking-wider">Project Walkthrough Video</h4>
                  <div className="relative aspect-video max-w-md bg-black rounded-lg overflow-hidden mx-auto">
                    <iframe
                      className="w-full h-full"
                      src={activeProject.youtube_url}
                      title="Walkthrough"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex gap-2 justify-end">
              {activeProject.live_url && (
                <a href={activeProject.live_url} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-[9px] font-bold border border-slate-200 flex items-center gap-1">Open app</a>
              )}
              <a
                href={`https://wa.me/${whatsappPhone}?text=Hi, I want to order project: ${encodeURIComponent(activeProject.title)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[9px] font-bold uppercase hover:bg-indigo-700"
              >
                Order Project
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
