"use client";

import { useState, useMemo } from "react";
import { Search, PlayCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function VideosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch from Convex
  const demos = useQuery(api.demos.get) || [];

  const videos = useMemo(() => {
    return demos.filter((d: any) => d.type === "video");
  }, [demos]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((item: any) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((item: any) => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [videos, search, selectedCategory]);

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-8 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Video <span className="text-[#a15c00]">Guides</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Watch running demonstrations of our applications and visual speed runs of handwritten assignments.
        </p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search demo videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {filteredVideos.map((vid: any) => {
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

          const isDirectFile = vid.file_urls && vid.file_urls.length > 0;

          return (
            <div
              key={vid._id}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden space-y-3 pb-4"
            >
              {/* Aspect Ratio Box */}
              <div className="relative aspect-video bg-black border-b border-slate-200">
                {isDirectFile ? (
                  <video
                    src={vid.file_urls?.[0]}
                    controls
                    poster={vid.thumbnail_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    className="w-full h-full border-0"
                    src={embedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* Info details */}
              <div className="px-5 space-y-2">
                <span className="text-[8px] px-2 py-0.5 rounded bg-amber-500/5 text-[#a15c00] font-bold border border-amber-550/10">
                  {vid.category || "Video Guide"}
                </span>
                <h3 className="text-xs font-heading font-bold text-slate-900 pt-1 leading-snug">
                  {vid.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <PlayCircle className="h-7 w-7 text-slate-350 mx-auto" />
          <p className="text-xs text-slate-400">No guides found matching filters.</p>
        </div>
      )}
    </div>
  );
}
