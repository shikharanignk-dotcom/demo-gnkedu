"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, FolderCode, X, Globe, Video, ListCollapse, Award, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_PROJECTS = [
  {
    id: "p1",
    type: "project",
    title: "GNK Edusolution CRM Dashboard",
    tech_stack: ["Next.js", "Tailwind CSS", "Supabase", "Docker"],
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

  // Extract unique tech tags from stack arrays
  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.tech_stack) {
        item.tech_stack.forEach((tech: string) => set.add(tech));
      }
    });
    return Array.from(set);
  }, [items]);

  // Filter items
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
    <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Project <span className="text-gradient">Showcase</span>
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
          Explore student projects including source code structure, screenshots, database designs, and running systems.
        </p>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl glass-panel">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors appearance-none cursor-pointer"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between"
          >
            {/* Card Media */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proj.thumbnail_url}
                alt={proj.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-bg-dark/85 text-[10px] uppercase font-semibold text-brand-blue border border-brand-blue/20">
                {proj.category}
              </span>
            </div>

            {/* Info Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-base font-heading font-semibold text-white leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Tech tags list */}
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {proj.tech_stack?.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-[9px] px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/25 font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject(proj);
                    setGalleryIdx(0);
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md shadow-brand-purple/10 transition-all cursor-pointer"
                >
                  View Details
                </button>
                {proj.live_url && (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
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
        <div className="text-center py-16 space-y-4 rounded-2xl glass-panel">
          <FolderCode className="h-10 w-10 text-text-muted mx-auto animate-pulse" />
          <p className="text-sm text-text-muted">No projects found matching the filters.</p>
        </div>
      )}

      {/* 💻 Project Detail View Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/95 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl h-[90vh] rounded-2xl glass-panel overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-bg-dark/50">
              <div className="space-y-0.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold tracking-wider uppercase">
                  {activeProject.category}
                </span>
                <h2 className="text-base sm:text-lg font-heading font-bold text-white pt-1">
                  {activeProject.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-2 rounded-xl bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable details content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Grid: Screenshots gallery & description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Screenshot Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-white/5">
                    {/* Primary Image */}
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
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {activeProject.file_urls.map((url: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setGalleryIdx(index)}
                          className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            index === galleryIdx ? "border-brand-purple" : "border-white/5 opacity-60 hover:opacity-100"
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
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">About Project</h4>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {activeProject.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-brand-blue" />
                      <span>Technologies Used</span>
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {activeProject.tech_stack?.map((tech: string) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-bg-dark border border-white/10 text-white font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube Walkthrough integration if URL exists */}
              {activeProject.youtube_url && (
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-brand-purple" />
                    <span>Project Run Video Tutorial</span>
                  </h4>
                  <div className="relative aspect-video max-w-2xl bg-black rounded-xl overflow-hidden border border-white/5">
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
            <div className="px-6 py-4 border-t border-white/5 bg-bg-dark/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-brand-blue" />
                <span className="text-xs text-text-muted">
                  Project comes with full report file, setup commands guide, and run guidance.
                </span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                {activeProject.live_url && (
                  <a
                    href={activeProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    Open Live App
                  </a>
                )}
                <a
                  href={`https://wa.me/919352483446?text=Hi, I am interested in project: ${encodeURIComponent(activeProject.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-bold tracking-wider uppercase hover:opacity-90 shadow-md shadow-brand-purple/10 transition-colors"
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
