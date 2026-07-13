"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, PlayCircle, Video, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_VIDEOS = [
  {
    id: "v1",
    type: "video",
    title: "Handwriting Assignment Quality & Paper Review Demo",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Handwriting Demo",
  },
  {
    id: "v2",
    type: "video",
    title: "NextJS React Project Implementation and Admin Walkthrough",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Project Demo",
  },
  {
    id: "v3",
    type: "video",
    title: "IGNOU Handwritten Assignment Format viva tips",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Academic Help",
  },
];

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

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filteredVideos = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [items, search, selectedCategory]);

  return (
    <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Video <span className="text-gradient">Tutorials</span>
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
          Watch running demonstrations of our applications and visual speed runs of handwritten assignments.
        </p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl glass-panel">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search demo videos by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors appearance-none cursor-pointer"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredVideos.map((vid) => {
          // Resolve correct youtube embed url format
          let embedUrl = vid.youtube_url;
          if (embedUrl && !embedUrl.includes("/embed/")) {
            // Convert standard youtube link to embed link format
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
              // fallback placeholder if url parsing fails
              embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
            }
          }

          return (
            <div
              key={vid.id}
              className="rounded-2xl glass-panel overflow-hidden space-y-4 pb-6 hover:shadow-xl hover:shadow-brand-purple/5 transition-all duration-300"
            >
              {/* Aspect Ratio Box */}
              <div className="relative aspect-video bg-black border-b border-white/5">
                <iframe
                  className="w-full h-full"
                  src={embedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={vid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Info details */}
              <div className="px-6 space-y-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-semibold border border-brand-purple/20">
                  {vid.category || "Video Demo"}
                </span>
                <h3 className="text-base font-heading font-semibold text-white pt-1 leading-snug">
                  {vid.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16 space-y-4 rounded-2xl glass-panel">
          <PlayCircle className="h-10 w-10 text-text-muted mx-auto animate-pulse" />
          <p className="text-sm text-text-muted">No demo videos match your current search.</p>
        </div>
      )}
    </div>
  );
}
