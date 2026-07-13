"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, FolderCode, X, Globe, Video, Award, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_PROJECTS = [
  {
    id: "p1",
    type: "project",
    title: "GNK Edusolution CRM Dashboard",
    tech_stack: ["Next.js", "Tailwind", "Supabase", "Docker"],
    description: "Fully responsive lead management dashboard integrating WhatsApp webhooks. Allows multiple agents to chat with students, manage templates, automate follow-ups, and track transaction logs.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    file_urls: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600"
    ],
    live_url: "https://gnkedu.online",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Full Stack Web",
  },
  {
    id: "p2",
    type: "project",
    title: "Hostel Warden Portal & Mess App",
    tech_stack: ["React Native", "NodeJS", "MongoDB"],
    description: "Multi-role application for college hostel administration. Wardens can manage room allocations, students can request gate passes, and kitchen staff can update food calendar menus.",
    thumbnail_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600",
    file_urls: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600"
    ],
    live_url: "",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Mobile App",
  },
  {
    id: "p3",
    type: "project",
    title: "Library Book Tracker Application",
    tech_stack: ["React", "Express", "SQLite"],
    description: "A desktop-friendly portal for library operations. Features barcode scan search emulation, automatic late-fee calculations, and book inventory stock metrics.",
    thumbnail_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600",
    file_urls: [],
    live_url: "",
    youtube_url: "",
    category: "Desktop Application",
  },
];

export default function ProjectsPage() {
  const [items, setItems] = useState<any[]>(FALLBACK_PROJECTS);
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Image index inside details modal gallery
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("demos")
          .select("*")
          .eq("type", "project")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.log("Using fallback mock data for projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.tech_stack) {
        item.tech_stack.forEach((tech: string) => set.add(tech));
      }
    });
    return Array.from(set);
  }, [items]);

  const filteredProjects = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchTech =
        selectedTech === "all" ||
        (item.tech_stack && item.tech_stack.includes(selectedTech));

      return matchSearch && matchTech;
    });
  }, [items, search, selectedTech]);

  return (
    <div className="w-full mx-auto max-w-5xl px-4 py-8 space-y-8 bg-bg-page">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Project <span className="text-gradient">Showcase</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          Explore student projects including source code structure, screenshots, database designs, and running systems.
        </p>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-premium">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Technologies</option>
            {allTechTags.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl bg-white border border-slate-100 shadow-premium hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Card Media */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proj.thumbnail_url}
                alt={proj.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-[8px] uppercase font-bold text-white tracking-wider">
                {proj.category}
              </span>
            </div>

            {/* Info Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-heading font-bold text-slate-900 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Tech tags list */}
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {proj.tech_stack?.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-[8px] px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject(proj);
                    setGalleryIdx(0);
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Details
                </button>
                {proj.live_url && (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Open Live Website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12 space-y-3 rounded-2xl bg-white border border-slate-100 shadow-premium">
          <FolderCode className="h-8 w-8 text-text-muted mx-auto animate-pulse" />
          <p className="text-xs text-text-muted">No projects found matching the filters.</p>
        </div>
      )}

      {/* 💻 Project Detail View Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl h-[85vh] rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <span className="text-[8px] px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold tracking-wider uppercase">
                  {activeProject.category}
                </span>
                <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900 pt-1">
                  {activeProject.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable details content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Grid: Screenshots gallery & description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Screenshot Gallery */}
                <div className="space-y-3">
                  <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    {activeProject.file_urls && activeProject.file_urls.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={activeProject.file_urls[galleryIdx]}
                        alt={`${activeProject.title} Screenshot`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={activeProject.thumbnail_url}
                        alt={activeProject.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {activeProject.file_urls && activeProject.file_urls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {activeProject.file_urls.map((url: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setGalleryIdx(index)}
                          className={`relative w-16 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            index === galleryIdx ? "border-indigo-600" : "border-slate-200 opacity-60 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description & Specs */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">About Project</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeProject.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Technologies Used</span>
                    </h4>
                    <div className="flex gap-1.5 flex-wrap">
                      {activeProject.tech_stack?.map((tech: string) => (
                        <span
                          key={tech}
                          className="text-[9px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube Walkthrough integration */}
              {activeProject.youtube_url && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-850 uppercase tracking-wider flex items-center gap-1">
                    <Video className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Project Demo Video</span>
                  </h4>
                  <div className="relative aspect-video max-w-xl bg-black rounded-xl overflow-hidden border border-slate-200 mx-auto">
                    <iframe
                      className="w-full h-full"
                      src={activeProject.youtube_url}
                      title="Project Walkthrough"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] text-slate-500 text-center sm:text-left">
                  Includes full report document, local setup instructions, and walkthrough.
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {activeProject.live_url && (
                  <a
                    href={activeProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold border border-slate-200 transition-colors"
                  >
                    Open Live
                  </a>
                )}
                <a
                  href={`https://wa.me/919352483446?text=Hi, I am interested in project: ${encodeURIComponent(activeProject.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none text-center px-5 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase hover:bg-indigo-700 transition-colors"
                >
                  Order Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
