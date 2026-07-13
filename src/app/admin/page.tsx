"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Plus, Trash2, LogOut, CheckCircle, FileText, Globe, PlayCircle, Star, Settings, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assignments");
  const [demos, setDemos] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [counters, setCounters] = useState<any>({ students: 500, assignments: 1000, projects: 50 });
  const [whatsapp, setWhatsapp] = useState<any>({ phone: "919352483446", message: "" });
  const supabase = createClient();

  // Modal forms states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formType, setFormType] = useState<"assignment" | "project" | "video">("assignment");
  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [formUniversity, setFormUniversity] = useState("IGNOU");
  const [formFormat, setFormFormat] = useState("handwritten");
  const [formCategory, setFormCategory] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formYoutubeUrl, setFormYoutubeUrl] = useState("");
  const [formTechStack, setFormTechStack] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Review Form Fields
  const [revName, setRevName] = useState("");
  const [revText, setRevText] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revUniv, setRevUniv] = useState("");

  // File Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState("");

  useEffect(() => {
    // Authenticate Admin
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        fetchAdminData();
      }
    });
  }, [router, supabase.auth]);

  // Fetch all DB items
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Demos
      const { data: demosData } = await supabase
        .from("demos")
        .select("*")
        .order("created_at", { ascending: false });
      if (demosData) setDemos(demosData);

      // Reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (reviewsData) setReviews(reviewsData);

      // Site settings (counters, whatsapp)
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*");

      if (settingsData) {
        const cnt = settingsData.find((s) => s.key === "counters")?.value;
        const wa = settingsData.find((s) => s.key === "whatsapp_config")?.value;
        if (cnt) setCounters(cnt);
        if (wa) setWhatsapp(wa);
      }
    } catch (err) {
      console.error("Error loading admin dashboard datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  // Helper: Upload file to storage bucket
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const bucketName = type === "thumbnail" ? "thumbnails" : "demo-files";

      // Upload to Supabase Storage bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      // Resolve public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (type === "thumbnail") {
        setUploadedThumbnailUrl(publicUrl);
      } else {
        setUploadedFileUrl(publicUrl);
      }
    } catch (err: any) {
      alert(`File upload failed: ${err.message || "Unknown storage error"}`);
    } finally {
      setUploading(false);
    }
  };

  // Action: Add new demo item
  const handleAddDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);
    const techArray = formTechStack ? formTechStack.split(",").map((t) => t.trim()) : [];

    try {
      const { error } = await supabase.from("demos").insert({
        type: formType,
        title: formTitle,
        description: formDesc,
        slug,
        subject: formType === "assignment" ? formSubject : null,
        semester: formType === "assignment" ? formSemester : null,
        university: formType === "assignment" ? formUniversity : null,
        assignment_type: formType === "assignment" ? formFormat : null,
        tech_stack: formType === "project" ? techArray : null,
        live_url: formType === "project" ? formLiveUrl : null,
        youtube_url: formType === "video" || formType === "project" ? formYoutubeUrl : null,
        category: formCategory,
        thumbnail_url: uploadedThumbnailUrl || "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
        file_urls: uploadedFileUrl ? [uploadedFileUrl] : [],
        is_featured: formIsFeatured,
      });

      if (error) throw error;

      // Reset Form fields
      setFormTitle("");
      setFormDesc("");
      setFormSubject("");
      setFormSemester("");
      setFormCategory("");
      setFormTechStack("");
      setFormLiveUrl("");
      setFormYoutubeUrl("");
      setUploadedFileUrl("");
      setUploadedThumbnailUrl("");
      setIsModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(`Insert failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Action: Add Review
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        student_name: revName,
        rating: revRating,
        review_text: revText,
        university: revUniv,
        verified: true,
        published: true,
      });

      if (error) throw error;

      setRevName("");
      setRevText("");
      setRevUniv("");
      setIsModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(`Failed to add review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Action: Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error: err1 } = await supabase
        .from("site_settings")
        .upsert({ key: "counters", value: counters });

      const { error: err2 } = await supabase
        .from("site_settings")
        .upsert({ key: "whatsapp_config", value: whatsapp });

      if (err1 || err2) throw err1 || err2;
      alert("Settings updated successfully!");
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Action: Delete Item
  const handleDeleteDemo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo item?")) return;
    const { error } = await supabase.from("demos").delete().eq("id", id);
    if (error) alert(`Delete failed: ${error.message}`);
    else fetchAdminData();
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) alert(`Delete failed: ${error.message}`);
    else fetchAdminData();
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-brand-purple animate-spin" />
        <p className="text-sm text-text-muted">Loading secure administration dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-card p-6 rounded-2xl border border-white/5">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-purple" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-text-muted">Manage portfolio contents and track visitor numbers.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-2">
        {[
          { id: "assignments", label: "Assignments", icon: FileText },
          { id: "projects", label: "Projects", icon: Globe },
          { id: "reviews", label: "Reviews", icon: Star },
          { id: "settings", label: "Site Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive ? "bg-brand-purple text-white shadow-md shadow-brand-purple/10" : "text-text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div className="w-full">
        {/* Tab 1: Assignments list */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-heading font-bold text-white">Showcase Assignments</h2>
              <button
                onClick={() => {
                  setFormType("assignment");
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Assignment</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-bg-card overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-bg-dark/50 text-slate-300 font-semibold uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Format</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {demos
                    .filter((d) => d.type === "assignment")
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 text-slate-300">
                        <td className="p-4 font-semibold text-white">{item.title}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.subject}</td>
                        <td className="p-4 uppercase">{item.assignment_type}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteDemo(item.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Projects list */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-heading font-bold text-white">Showcase Projects</h2>
              <button
                onClick={() => {
                  setFormType("project");
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-bg-card overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-bg-dark/50 text-slate-300 font-semibold uppercase tracking-wider">
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Tech Stack</th>
                    <th className="p-4">Live Link</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {demos
                    .filter((d) => d.type === "project")
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 text-slate-300">
                        <td className="p-4 font-semibold text-white">{item.title}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {item.tech_stack?.map((t: string) => (
                              <span key={t} className="px-1.5 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[9px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[10px] truncate max-w-[120px]">{item.live_url || "-"}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteDemo(item.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews list */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-heading font-bold text-white">Student Testimonials</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-bg-card overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-bg-dark/50 text-slate-300 font-semibold uppercase tracking-wider">
                    <th className="p-4">Student Name</th>
                    <th className="p-4">University</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Review Text</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-white/5 text-slate-300">
                      <td className="p-4 font-semibold text-white">{rev.student_name}</td>
                      <td className="p-4">{rev.university}</td>
                      <td className="p-4 font-semibold text-amber-400">{rev.rating}★</td>
                      <td className="p-4 max-w-sm truncate">{rev.review_text}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Settings Page */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl p-6 rounded-2xl border border-white/5 bg-bg-card">
            <h2 className="text-base font-heading font-bold text-white">General Site Configs</h2>

            {/* Counters */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Trust counters</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Students Served</label>
                  <input
                    type="number"
                    value={counters.students}
                    onChange={(e) => setCounters({ ...counters, students: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Assignments Done</label>
                  <input
                    type="number"
                    value={counters.assignments}
                    onChange={(e) => setCounters({ ...counters, assignments: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Projects Completed</label>
                  <input
                    type="number"
                    value={counters.projects}
                    onChange={(e) => setCounters({ ...counters, projects: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">WhatsApp Contact</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">WhatsApp Phone (format: 91XXXXXXXXXX)</label>
                  <input
                    type="text"
                    value={whatsapp.phone}
                    onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Default Pre-filled Message</label>
                  <textarea
                    value={whatsapp.message}
                    onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 mt-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving settings...</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* 🖥️ Modals Forms (Add Demos & Reviews) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/95 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[85vh] rounded-2xl glass-panel overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-bg-dark/50">
              <h3 className="text-sm sm:text-base font-heading font-bold text-white">
                {activeTab === "reviews" ? "Add Student Testimonial" : `Add Portfolio ${formType}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form scroll container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Dynamic CRUD for Showcase */}
              {activeTab !== "reviews" ? (
                <form id="demo-form" onSubmit={handleAddDemo} className="space-y-4">
                  {/* Select Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Item Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                    >
                      <option value="assignment">Assignment Softcopy/Hardcopy</option>
                      <option value="project">Coding Project Project</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IGNOU DECE-01 handwritten Sheets"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Category</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DECE Diploma, BCA Project"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/50"
                    />
                  </div>

                  {/* Assignment Specific inputs */}
                  {formType === "assignment" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 font-medium">Subject</label>
                        <input
                          type="text"
                          placeholder="e.g. Early Childhood"
                          value={formSubject}
                          onChange={(e) => setFormSubject(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 font-medium">Semester</label>
                        <input
                          type="text"
                          placeholder="e.g. Semester 1"
                          value={formSemester}
                          onChange={(e) => setFormSemester(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 font-medium">Format Format</label>
                        <select
                          value={formFormat}
                          onChange={(e) => setFormFormat(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        >
                          <option value="handwritten">Handwritten Sheets</option>
                          <option value="pdf">Softcopy PDF</option>
                          <option value="typed">Computer Typed</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 font-medium">University</label>
                        <input
                          type="text"
                          value={formUniversity}
                          onChange={(e) => setFormUniversity(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Project specific inputs */}
                  {formType === "project" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] text-slate-300 font-medium">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          placeholder="React, Express, SQLite"
                          value={formTechStack}
                          onChange={(e) => setFormTechStack(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 font-medium">Live Website URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formLiveUrl}
                          onChange={(e) => setFormLiveUrl(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 font-medium">YouTube walkthrough Embed URL</label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/embed/..."
                          value={formYoutubeUrl}
                          onChange={(e) => setFormYoutubeUrl(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Description</label>
                    <textarea
                      placeholder="Explain layout format, scoring points, tech features..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white resize-none"
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5 p-3 rounded-xl border border-dashed border-white/10 bg-bg-dark/40 text-center">
                      <label className="text-[10px] text-slate-300 font-semibold block cursor-pointer">
                        <Upload className="h-4 w-4 text-brand-purple mx-auto mb-1" />
                        <span>Upload Card Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "thumbnail")}
                          className="hidden"
                        />
                      </label>
                      {uploadedThumbnailUrl && (
                        <p className="text-[9px] text-green-400 font-medium truncate">{uploadedThumbnailUrl}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl border border-dashed border-white/10 bg-bg-dark/40 text-center">
                      <label className="text-[10px] text-slate-300 font-semibold block cursor-pointer">
                        <Upload className="h-4 w-4 text-brand-purple mx-auto mb-1" />
                        <span>Upload sample PDF/Doc</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "file")}
                          className="hidden"
                        />
                      </label>
                      {uploadedFileUrl && (
                        <p className="text-[9px] text-green-400 font-medium truncate">{uploadedFileUrl}</p>
                      )}
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="is-featured"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded bg-bg-dark border border-white/5 text-brand-purple"
                    />
                    <label htmlFor="is-featured" className="text-[10px] text-slate-300 cursor-pointer">
                      Feature this item on home page
                    </label>
                  </div>
                </form>
              ) : (
                <form id="review-form" onSubmit={handleAddReview} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Student Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Rating Stars</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(parseInt(e.target.value) || 5)}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★</option>
                      <option value={3}>3 Stars ★★★</option>
                    </select>
                  </div>

                  {/* University */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">University / Course info</label>
                    <input
                      type="text"
                      placeholder="e.g. IGNOU (DECE)"
                      value={revUniv}
                      onChange={(e) => setRevUniv(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white"
                    />
                  </div>

                  {/* Text */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-300 font-medium">Review Review Feedback</label>
                    <textarea
                      required
                      placeholder="What was their feedback?"
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 rounded-lg bg-bg-dark border border-white/5 text-xs text-white resize-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-bg-dark/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={activeTab === "reviews" ? "review-form" : "demo-form"}
                disabled={submitting || uploading}
                className="px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Inserting...</span>
                  </>
                ) : (
                  <span>Create Item</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
