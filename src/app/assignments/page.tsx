"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, BookOpen, X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_ASSIGNMENTS: any[] = [];

export default function AssignmentsPage() {
  const [items, setItems] = useState<any[]>(FALLBACK_ASSIGNMENTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewerItem, setViewerItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // PDF Viewer Zoom State
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("demos")
          .select("*")
          .eq("type", "assignment")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.log("Using fallback mock data for assignments.");
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchType =
        selectedType === "all" || item.assignment_type === selectedType;

      return matchSearch && matchCategory && matchType;
    });
  }, [items, search, selectedCategory, selectedType]);

  return (
    <div className="w-full mx-auto max-w-5xl px-4 py-8 space-y-8 bg-bg-page">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Assignment <span className="text-gradient">Demos</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          Verify handwriting formatting, margins, pen strokes, and layout presentation sheets before placing your order.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-premium">
        {/* Search */}
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search subject/title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Courses</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="handwritten">Handwritten Sheets</option>
            <option value="pdf">Softcopy PDF</option>
            <option value="typed">Computer Typed</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-slate-100 shadow-premium hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Card Thumbnail */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-[8px] uppercase font-bold text-white tracking-wider">
                {item.assignment_type}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold tracking-wider uppercase">
                  {item.category}
                </span>
                <h3 className="text-sm font-heading font-bold text-slate-900 pt-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">Subject:</span> {item.subject}
                </p>
                <p className="text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">Semester:</span> {item.semester}
                </p>
                <p className="text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">University:</span> {item.university}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewerItem(item);
                    setZoom(100);
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Sample
                </button>
                <a
                  href={`https://wa.me/919352483446?text=Hi, I want to inquire about assignment: ${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Inquire
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 space-y-3 rounded-2xl bg-white border border-slate-100 shadow-premium">
          <BookOpen className="h-8 w-8 text-text-muted mx-auto animate-bounce" />
          <p className="text-xs text-text-muted">No assignments matched your search filters.</p>
        </div>
      )}

      {/* 🖥️ PDF Viewer Modal */}
      {viewerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl h-[85vh] rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900 leading-tight">
                  {viewerItem.title}
                </h2>
                <p className="text-[8px] sm:text-[10px] text-slate-500">
                  Format: {viewerItem.assignment_type} &bull; University: {viewerItem.university}
                </p>
              </div>

              {/* Control panel & close button */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1.5 border border-slate-200 rounded-lg bg-white px-1.5 py-0.5">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-700 min-w-[30px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setZoom(100)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <a
                  href={viewerItem.file_urls?.[0] || "#"}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                </a>

                <button
                  onClick={() => setViewerItem(null)}
                  className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Viewer Content Area */}
            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-3">
              {viewerItem.file_urls?.[0] ? (
                viewerItem.file_urls[0].endsWith(".pdf") || viewerItem.file_urls[0].includes("sample.pdf") ? (
                  <iframe
                    src={`${viewerItem.file_urls[0]}#toolbar=0`}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
                    className="w-full h-full max-w-2xl border-0 rounded-lg shadow-sm transition-transform duration-100 bg-white"
                  ></iframe>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={viewerItem.file_urls[0]}
                    alt={viewerItem.title}
                    style={{ transform: `scale(${zoom / 100})` }}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform duration-100 bg-white"
                  />
                )
              ) : (
                <div className="text-center text-text-muted">No sample document uploaded.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <p className="text-[10px] text-slate-500 text-center sm:text-left">
                Directly place your order on WhatsApp to get the custom assignment files.
              </p>
              <a
                href={`https://wa.me/919352483446?text=Hi, I am interested in assignment: ${encodeURIComponent(viewerItem.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-[10px] uppercase text-center hover:bg-indigo-700 shadow-sm transition-all"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
