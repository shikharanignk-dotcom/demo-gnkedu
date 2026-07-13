"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_VIDEOS: any[] = [];

export default function VideosPage() {
  const [items, setItems] = useState<any[]>(FALLBACK_VIDEOS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("demos")
          .select("*")
          .eq("type", "video")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.log("Using fallback mock data for videos.");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  const filteredVideos = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [items, search, selectedCategory]);

  return (
    <div className="w-full mx-auto max-w-5xl px-4 py-8 space-y-8 bg-bg-page">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Video <span className="text-gradient">Tutorials</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          Watch running demonstrations of our applications and visual speed runs of handwritten assignments.
        </p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-premium">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search demo videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div
              key={vid.id}
              className="rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden space-y-3 pb-4 hover:shadow-lg transition-all duration-200"
            >
              {/* Aspect Ratio Box */}
              <div className="relative aspect-video bg-black border-b border-slate-200">
                <iframe
                  className="w-full h-full"
                  src={embedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={vid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Info details */}
              <div className="px-5 space-y-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                  {vid.category || "Video Demo"}
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-bold text-slate-900 pt-1 leading-snug">
                  {vid.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12 space-y-3 rounded-2xl bg-white border border-slate-100 shadow-premium">
          <PlayCircle className="h-8 w-8 text-text-muted mx-auto animate-pulse" />
          <p className="text-xs text-text-muted">No demo videos match your current search.</p>
        </div>
      )}
    </div>
  );
}
