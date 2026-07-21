"use client";

import { useState, useMemo } from "react";
import { Search, FolderCode, X, Globe, Video, Award, Layers } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Fetch from Convex
  const demos = useQuery(api.demos.get) || [];
  const siteSettings = useQuery(api.site_settings.get) || [];

  // Map settings
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const whatsappConfig = settingsObj.whatsapp_config || {};
  const phone = whatsappConfig.phone || "919518877939";

  const projects = useMemo(() => {
    return demos.filter((d: any) => d.type === "project");
  }, [demos]);

  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((item: any) => {
      if (item.tech_stack) {
        item.tech_stack.forEach((tech: string) => set.add(tech));
      }
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item: any) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      const matchTech =
        selectedTech === "all" ||
        (item.tech_stack && item.tech_stack.includes(selectedTech));

      return matchSearch && matchTech;
    });
  }, [projects, search, selectedTech]);

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-6 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Project <span className="text-[#a15c00]">Showcase</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Explore student projects including source code structure, screenshots, database designs, and running systems.
        </p>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#a15c00]"
          />
        </div>

        <select
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="all">All Technologies</option>
          {allTechTags.map((tech: any) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {filteredProjects.map((proj: any) => (
          <div
            key={proj._id}
            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            {/* Card Media */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proj.thumbnail_url}
                alt={proj.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-[7px] uppercase font-bold text-white tracking-wider">
                {proj.category}
              </span>
            </div>

            {/* Info Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-heading font-extrabold text-slate-900 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-[10px] text-slate-505 leading-relaxed line-clamp-3">
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
                  className="flex-1 text-center py-2 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Details
                </button>
                {proj.live_url && (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Open Live Website"
                  >
                    <Globe className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <FolderCode className="h-7 w-7 text-slate-350 mx-auto" />
          <p className="text-xs text-slate-400">No projects found matching the filters.</p>
        </div>
      )}

      {/* Project Detail View Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm max-h-[85vh] rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <span className="text-[7px] px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-bold tracking-wider uppercase">
                  {activeProject.category}
                </span>
                <h2 className="text-xs font-heading font-bold text-slate-900 pt-1">
                  {activeProject.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 rounded hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable details content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      className={`relative w-12 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        index === galleryIdx ? "border-indigo-650" : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">About Project</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-[9px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-[#a15c00]" />
                  <span>Technologies Used</span>
                </h4>
                <div className="flex gap-1 flex-wrap">
                  {activeProject.tech_stack?.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-[8px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* YouTube Walkthrough integration */}
              {activeProject.youtube_url && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="text-[9px] font-bold text-slate-850 uppercase tracking-wider flex items-center gap-1">
                    <Video className="h-3.5 w-3.5 text-[#a15c00]" />
                    <span>Project Demo Video</span>
                  </h4>
                  <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-slate-200 mx-auto">
                    <iframe
                      className="w-full h-full border-0"
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
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex gap-2 items-center justify-between">
              <span className="text-[8px] text-slate-400 font-medium">Includes full setup guidelines report.</span>
              <div className="flex gap-2">
                {activeProject.live_url && (
                  <a
                    href={activeProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-center px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-[9px] font-bold border border-slate-200 transition-colors"
                  >
                    Open Live
                  </a>
                )}
                <a
                  href={`https://wa.me/${phone}?text=Hi, I am interested in project: ${encodeURIComponent(activeProject.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center px-4 py-1.5 rounded-xl bg-[#a15c00] text-white text-[9px] font-bold tracking-wider uppercase hover:bg-[#854b00] transition-colors"
                >
                  Order
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
