"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Filter, BookOpen, X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_ASSIGNMENTS = [
  {
    id: "a1",
    type: "assignment",
    title: "IGNOU DECE-01 Handwritten Assignment",
    subject: "Early Childhood Care & Education",
    semester: "Semester 1",
    university: "IGNOU",
    assignment_type: "handwritten",
    thumbnail_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
    file_urls: ["https://pdfobject.com/pdf/sample.pdf"], // Demo sample PDF
    category: "DECE Diploma",
  },
  {
    id: "a2",
    type: "assignment",
    title: "BCA Computer Networks Typed assignment",
    subject: "Computer Networks",
    semester: "Semester 3",
    university: "IP University",
    assignment_type: "pdf",
    thumbnail_url: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
    file_urls: ["https://pdfobject.com/pdf/sample.pdf"],
    category: "BCA Computer Science",
  },
  {
    id: "a3",
    type: "assignment",
    title: "MBA Marketing Case Study Report",
    subject: "Marketing Management",
    semester: "Semester 2",
    university: "IGNOU",
    assignment_type: "typed",
    thumbnail_url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400",
    file_urls: ["https://pdfobject.com/pdf/sample.pdf"],
    category: "MBA Business",
  },
  {
    id: "a4",
    type: "assignment",
    title: "IGNOU DECE-02 Handwritten Sheets",
    subject: "Child Health & Nutrition",
    semester: "Semester 1",
    university: "IGNOU",
    assignment_type: "handwritten",
    thumbnail_url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
    file_urls: ["https://pdfobject.com/pdf/sample.pdf"],
    category: "DECE Diploma",
  },
];

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

  // Filter Categories dynamically from items
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter logic
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
    <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Assignment <span className="text-gradient">Demos</span>
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
          Verify handwriting formatting, margins, pen strokes, and layout presentation sheets before placing your order.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl glass-panel">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by subject or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors appearance-none cursor-pointer"
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
            className="w-full px-4 py-3 rounded-xl bg-bg-dark/50 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="handwritten">Handwritten Sheets</option>
            <option value="pdf">Softcopy PDF</option>
            <option value="typed">Computer Typed</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between"
          >
            {/* Card Thumbnail */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-bg-dark/85 text-[10px] uppercase font-semibold text-brand-purple border border-brand-purple/20">
                {item.assignment_type}
              </span>
            </div>

            {/* Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-semibold tracking-wider uppercase">
                  {item.category}
                </span>
                <h3 className="text-base font-heading font-semibold text-white pt-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted">
                  <span className="font-medium text-slate-300">Subject:</span> {item.subject}
                </p>
                <p className="text-xs text-text-muted">
                  <span className="font-medium text-slate-300">Semester:</span> {item.semester}
                </p>
                <p className="text-xs text-text-muted">
                  <span className="font-medium text-slate-300">University:</span> {item.university}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewerItem(item);
                    setZoom(100);
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md shadow-brand-purple/10 transition-colors cursor-pointer"
                >
                  View Sample
                </button>
                <a
                  href={`https://wa.me/919352483446?text=Hi, I want to inquire about assignment: ${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
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
        <div className="text-center py-16 space-y-4 rounded-2xl glass-panel">
          <BookOpen className="h-10 w-10 text-text-muted mx-auto animate-bounce" />
          <p className="text-sm text-text-muted">No assignments matched your search filters.</p>
        </div>
      )}

      {/* 🖥️ Beautiful PDF Viewer Modal */}
      {viewerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/95 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl glass-panel overflow-hidden flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-bg-dark/50">
              <div className="space-y-0.5">
                <h2 className="text-sm sm:text-base font-heading font-bold text-white leading-tight">
                  {viewerItem.title}
                </h2>
                <p className="text-[10px] sm:text-xs text-text-muted">
                  Format: {viewerItem.assignment_type} &bull; University: {viewerItem.university}
                </p>
              </div>

              {/* Control panel & close button */}
              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-2 border border-white/5 rounded-lg bg-bg-dark/50 px-2 py-1">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-[10px] font-mono text-white min-w-[36px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setZoom(100)}
                    className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <a
                  href={viewerItem.file_urls?.[0] || "#"}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  title="Download File"
                >
                  <Download className="h-4.5 w-4.5" />
                </a>

                <button
                  onClick={() => setViewerItem(null)}
                  className="p-2 rounded-xl bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple transition-colors cursor-pointer"
                  title="Close Viewer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Viewer Content Area */}
            <div className="flex-1 bg-slate-950 overflow-auto flex items-center justify-center p-4">
              {viewerItem.file_urls?.[0] ? (
                viewerItem.file_urls[0].endsWith(".pdf") || viewerItem.file_urls[0].includes("sample.pdf") ? (
                  /* Embed standard PDF Viewer with Zoom styling */
                  <iframe
                    src={`${viewerItem.file_urls[0]}#toolbar=0`}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
                    className="w-full h-full max-w-3xl border-0 rounded-lg shadow-lg transition-transform duration-100"
                  ></iframe>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={viewerItem.file_urls[0]}
                    alt={viewerItem.title}
                    style={{ transform: `scale(${zoom / 100})` }}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-100"
                  />
                )
              ) : (
                <div className="text-center text-text-muted">No sample document uploaded for this assignment.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-bg-dark/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-xs text-text-muted">
                Doubt about this assignment? WhatsApp us for direct inquiry support.
              </p>
              <a
                href={`https://wa.me/919352483446?text=Hi, I am interested in assignment: ${encodeURIComponent(viewerItem.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold text-xs tracking-wider uppercase text-center hover:opacity-90 shadow-md shadow-brand-purple/15 transition-all"
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
