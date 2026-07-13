"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Globe, Video, Bell, Star, MessageSquare, Download, ZoomIn, ZoomOut, RotateCcw, X, Layers, Award, ShieldCheck, CheckCircle, HelpCircle } from "lucide-react";

interface ShowcaseHubProps {
  initialDemos: any[];
  initialReviews: any[];
  initialNotices: any[];
}

export function ShowcaseHub({ initialDemos, initialReviews, initialNotices }: ShowcaseHubProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "projects" | "videos" | "notices">("assignments");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // handwritten, pdf, typed
  
  // Modal states
  const [viewerItem, setViewerItem] = useState<any | null>(null);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Group demos by type
  const assignments = useMemo(() => initialDemos.filter(d => d.type === "assignment"), [initialDemos]);
  const projects = useMemo(() => initialDemos.filter(d => d.type === "project"), [initialDemos]);
  const videos = useMemo(() => initialDemos.filter(d => d.type === "video"), [initialDemos]);

  // Extract unique categories for filtering based on active tab
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

  // Filter lists based on tab + search + category
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
    <div className="w-full space-y-6">
      {/* 📱 Quick Header & CTA */}
      <section className="bg-white border-b border-slate-200 py-6 text-center">
        <div className="mx-auto max-w-xl px-4 space-y-3">
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
            Guru Nanak Photostat <span className="text-indigo-600">Demos</span>
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click any sample below to view handwriting quality, project designs, and files before you order.
          </p>
          <div className="flex gap-2 justify-center pt-1">
            <a
              href="https://wa.me/919352483446"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase shadow-sm flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="h-4 w-4 fill-white stroke-none" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 📊 Tab Switcher - Centered & Big for Touch input */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 gap-1 overflow-x-auto">
          {[
            { id: "assignments", label: "Assignments", icon: BookOpen },
            { id: "projects", label: "Projects", icon: Globe },
            { id: "videos", label: "Video Demos", icon: Video },
            { id: "notices", label: "Important Info", icon: Bell },
          ].map((tab) => {
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
                className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔍 Search & Filter Panels */}
      {activeTab !== "notices" && (
        <div className="mx-auto max-w-3xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-premium">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {activeTab === "assignments" ? (
              <>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                >
                  <option value="all">All Subjects</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer"
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
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer sm:col-span-2"
              >
                <option value="all">All Technologies</option>
                {allTechTags.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            ) : null}
          </div>
        </div>
      )}

      {/* 📁 Content Grid - Optimized for Mobile (Single column card stacks) */}
      <div className="mx-auto max-w-3xl px-4 pb-12">
        {/* Tab 1: Assignments list */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            {filteredAssignments.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all">
                <div className="relative w-full sm:w-36 aspect-video sm:aspect-auto sm:h-36 shrink-0 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-[8px] uppercase font-bold text-white tracking-wider">
                    {item.assignment_type}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-heading font-extrabold text-slate-900 pt-1 leading-tight">{item.title}</h3>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px] text-slate-500">
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

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setViewerItem(item);
                        setZoom(100);
                      }}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View PDF Sample
                    </button>
                    <a
                      href={`https://wa.me/919352483446?text=Hi, I want to order assignment: ${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors text-center"
                    >
                      Order
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {filteredAssignments.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No assignments created yet. Add them in `/omgnk`.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Projects list */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden flex flex-col hover:shadow-md transition-all">
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proj.thumbnail_url} alt={proj.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-[8px] uppercase font-bold text-white tracking-wider">
                    {proj.category}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-heading font-extrabold text-slate-900 leading-snug">{proj.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  
                  <div className="flex gap-1.5 flex-wrap">
                    {proj.tech_stack?.map((tech: string) => (
                      <span key={tech} className="text-[8px] px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setGalleryIdx(0);
                      }}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View Screens & Video
                    </button>
                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Live Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <Globe className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No project samples uploaded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Videos list */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div key={vid.id} className="rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden space-y-3 pb-4">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      className="w-full h-full border-0"
                      src={embedUrl}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="px-4 space-y-1">
                    <span className="text-[8px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">
                      {vid.category || "Video Tutorial"}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 pt-1 leading-snug">{vid.title}</h3>
                  </div>
                </div>
              );
            })}
            {filteredVideos.length === 0 && (
              <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-slate-100">
                <Video className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No video guides uploaded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Notices/Information list */}
        {activeTab === "notices" && (
          <div className="space-y-4">
            {initialNotices.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border ${
                  item.is_important ? "bg-amber-500/5 border-amber-200" : "bg-white border-slate-100 shadow-premium"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.is_important ? "bg-amber-100 text-amber-800" : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {item.category}
                  </span>
                  {item.is_important && (
                    <span className="text-[8px] text-amber-700 font-bold uppercase">Important Notice</span>
                  )}
                </div>
                <h3 className="text-sm font-heading font-extrabold text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            ))}
            {initialNotices.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No notices or guidelines posted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🖥️ Assignment Sample PDF Modal */}
      {viewerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900">{viewerItem.title}</h2>
                <p className="text-[8px] sm:text-[10px] text-slate-500">Format: {viewerItem.assignment_type}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-lg bg-white px-1.5 py-0.5">
                  <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1 hover:bg-slate-100 text-slate-500"><ZoomOut className="h-3.5 w-3.5" /></button>
                  <span className="text-[10px] font-mono min-w-[30px] text-center">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 hover:bg-slate-100 text-slate-500"><ZoomIn className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setZoom(100)} className="p-1 hover:bg-slate-100 text-slate-500"><RotateCcw className="h-3.5 w-3.5" /></button>
                </div>
                <a href={viewerItem.file_urls?.[0]} target="_blank" rel="noreferrer" download className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"><Download className="h-3.5 w-3.5" /></a>
                <button onClick={() => setViewerItem(null)} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-3">
              {viewerItem.file_urls?.[0] ? (
                viewerItem.file_urls[0].endsWith(".pdf") || viewerItem.file_urls[0].includes("sample.pdf") ? (
                  <iframe
                    src={`${viewerItem.file_urls[0]}#toolbar=0`}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
                    className="w-full h-full max-w-2xl border-0 rounded-lg shadow-sm bg-white"
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

            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <p className="text-[10px] text-slate-500">Directly contact on WhatsApp to order your customized sheets.</p>
              <a
                href={`https://wa.me/919352483446?text=Hi, I am interested in assignment: ${encodeURIComponent(viewerItem.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-[10px] uppercase text-center hover:bg-indigo-700"
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
          <div className="relative w-full max-w-3xl h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <span className="text-[8px] px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold">{activeProject.category}</span>
                <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900 pt-1">{activeProject.title}</h2>
              </div>
              <button onClick={() => setActiveProject(null)} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    {activeProject.file_urls && activeProject.file_urls.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={activeProject.file_urls[galleryIdx]} alt="Screenshot" className="w-full h-full object-cover" />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={activeProject.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    )}
                  </div>

                  {activeProject.file_urls && activeProject.file_urls.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto">
                      {activeProject.file_urls.map((url: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setGalleryIdx(index)}
                          className={`w-12 aspect-video rounded-lg overflow-hidden border-2 shrink-0 ${
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

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">About Project</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeProject.description}</p>
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Tech Stack</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {activeProject.tech_stack?.map((tech: string) => (
                      <span key={tech} className="text-[9px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              {activeProject.youtube_url && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-850 uppercase tracking-wider">Project Walkthrough Video</h4>
                  <div className="relative aspect-video max-w-xl bg-black rounded-xl overflow-hidden mx-auto">
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
                <a href={activeProject.live_url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold border border-slate-200">Open App</a>
              )}
              <a
                href={`https://wa.me/919352483446?text=Hi, I want to order project: ${encodeURIComponent(activeProject.title)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-bold uppercase hover:bg-indigo-700"
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
