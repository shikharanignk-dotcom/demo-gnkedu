"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch demos from Convex
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
  const phone = whatsappConfig.phone || "919352483446";

  const assignments = useMemo(() => {
    return demos.filter((d: any) => d.type === "assignment");
  }, [demos]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((item: any) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [assignments]);

  const filteredItems = useMemo(() => {
    return assignments.filter((item: any) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.subject && item.subject.toLowerCase().includes(search.toLowerCase()));
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchType =
        selectedType === "all" || item.assignment_type === selectedType;

      return matchSearch && matchCategory && matchType;
    });
  }, [assignments, search, selectedCategory, selectedType]);

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-6 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Assignment <span className="text-[#a15c00]">Demos</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Verify handwriting formatting, margins, pen strokes, and layout presentation sheets before placing your order.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subject/title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#a15c00] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Courses</option>
            {categories.map((cat: any) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="handwritten">Handwritten</option>
            <option value="pdf">Softcopy PDF</option>
            <option value="typed">Computer Typed</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {filteredItems.map((item: any) => {
          const detailUrl = `/courses/${item.category?.toLowerCase() || "dece"}/${item.slug || item._id}`;
          return (
            <div
              key={item._id}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-[7px] uppercase font-bold text-white tracking-wider">
                  {item.assignment_type}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[7px] px-2 py-0.5 rounded bg-amber-500/5 text-[#a15c00] border border-amber-500/10 font-bold tracking-wider uppercase">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-heading font-extrabold text-slate-900 pt-1 leading-snug">
                    {item.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-slate-400">
                    <p><span className="font-semibold text-slate-500">Subject:</span> {item.subject}</p>
                    <p><span className="font-semibold text-slate-500">Sem:</span> {item.semester}</p>
                    <p className="col-span-2"><span className="font-semibold text-slate-500">Univ:</span> {item.university}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={detailUrl}
                    className="flex-1 text-center py-2 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Interactive Demo
                  </Link>
                  <a
                    href={`https://wa.me/${phone}?text=Hi, I want to inquire about assignment: ${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Order
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <BookOpen className="h-7 w-7 text-slate-350 mx-auto" />
          <p className="text-xs text-slate-400">No assignments found matching filters.</p>
        </div>
      )}
    </div>
  );
}
