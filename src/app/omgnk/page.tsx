"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Plus, Trash2, LogOut, FileText, Globe, PlayCircle, Star, Settings, Loader2, Upload, X, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assignments");
  const [demos, setDemos] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [counters, setCounters] = useState<any>({ students: 500, assignments: 1000, projects: 50 });
  const [whatsapp, setWhatsapp] = useState<any>({ phone: "919352483446", message: "" });
  const supabase = createClient();

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

  // Info Form Fields
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContent, setInfoContent] = useState("");
  const [infoCategory, setInfoCategory] = useState("Notice");
  const [infoIsImportant, setInfoIsImportant] = useState(false);

  // File Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/omgnk/login");
      } else {
        fetchAdminData();
      }
    });
  }, [router, supabase.auth]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: demosData } = await supabase
        .from("demos")
        .select("*")
        .order("created_at", { ascending: false });
      if (demosData) setDemos(demosData);

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (reviewsData) setReviews(reviewsData);

      const { data: infoData } = await supabase
        .from("information")
        .select("*")
        .order("created_at", { ascending: false });
      if (infoData) setNotices(infoData);

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
    router.replace("/omgnk/login");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const bucketName = type === "thumbnail" ? "thumbnails" : "demo-files";

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

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
        youtube_url: formType === "project" ? formYoutubeUrl : null,
        category: formCategory,
        thumbnail_url: uploadedThumbnailUrl || "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
        file_urls: uploadedFileUrl ? [uploadedFileUrl] : [],
        is_featured: formIsFeatured,
      });

      if (error) throw error;

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

  const handleAddInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("information").insert({
        title: infoTitle,
        content: infoContent,
        category: infoCategory,
        is_important: infoIsImportant,
        published: true,
      });

      if (error) throw error;

      setInfoTitle("");
      setInfoContent("");
      setIsModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(`Failed to add information: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    const { error } = await supabase.from("information").delete().eq("id", id);
    if (error) alert(`Delete failed: ${error.message}`);
    else fetchAdminData();
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-3 bg-bg-page">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-text-muted">Loading administration dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-5xl px-4 py-8 space-y-8 bg-bg-page">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
        <div className="space-y-0.5">
          <h1 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="h-5.5 w-5.5 text-indigo-600" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-text-muted">Manage portfolio contents and track visitor numbers.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        {[
          { id: "assignments", label: "Assignments", icon: FileText },
          { id: "projects", label: "Projects", icon: Globe },
          { id: "info", label: "Important Info", icon: Bell },
          { id: "reviews", label: "Reviews", icon: Star },
          { id: "settings", label: "Site Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-heading font-bold text-slate-900">Showcase Assignments</h2>
              <button
                onClick={() => {
                  setFormType("assignment");
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Assignment</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-premium">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Format</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demos
                    .filter((d) => d.type === "assignment")
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 text-slate-600">
                        <td className="p-3 font-semibold text-slate-900">{item.title}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">{item.subject}</td>
                        <td className="p-3 uppercase">{item.assignment_type}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteDemo(item.id)}
                            className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-heading font-bold text-slate-900">Showcase Projects</h2>
              <button
                onClick={() => {
                  setFormType("project");
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-premium">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3">Project Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Tech Stack</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demos
                    .filter((d) => d.type === "project")
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 text-slate-600">
                        <td className="p-3 font-semibold text-slate-900">{item.title}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {item.tech_stack?.map((t: string) => (
                              <span key={t} className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 text-[8px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteDemo(item.id)}
                            className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Important Info */}
        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-heading font-bold text-slate-900">Manage Announcements/FAQs</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Info Notice</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-premium">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3">Notice Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notices.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 text-slate-600">
                      <td className="p-3 font-semibold text-slate-900">{item.title}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 uppercase">
                        {item.is_important ? (
                          <span className="text-amber-600 font-bold">Important</span>
                        ) : (
                          "Normal"
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteNotice(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews list */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-heading font-bold text-slate-900">Student Testimonials</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-premium">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">University</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Review</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50 text-slate-600">
                      <td className="p-3 font-semibold text-slate-900">{rev.student_name}</td>
                      <td className="p-3">{rev.university}</td>
                      <td className="p-3 font-semibold text-amber-500">{rev.rating}★</td>
                      <td className="p-3 max-w-xs truncate">{rev.review_text}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Settings Page */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md p-5 rounded-2xl border border-slate-200 bg-white shadow-premium">
            <h2 className="text-sm font-heading font-bold text-slate-900">General Site Configurations</h2>

            {/* Counters */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Trust counters</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-medium">Students Served</label>
                  <input
                    type="number"
                    value={counters.students}
                    onChange={(e) => setCounters({ ...counters, students: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-medium">Assignments Done</label>
                  <input
                    type="number"
                    value={counters.assignments}
                    onChange={(e) => setCounters({ ...counters, assignments: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-medium">Projects Done</label>
                  <input
                    type="number"
                    value={counters.projects}
                    onChange={(e) => setCounters({ ...counters, projects: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">WhatsApp Contact</h3>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-medium">WhatsApp Phone (format: 91XXXXXXXXXX)</label>
                  <input
                    type="text"
                    value={whatsapp.phone}
                    onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-medium">Default Pre-filled Message</label>
                  <textarea
                    value={whatsapp.message}
                    onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
                    rows={2}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving settings...</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* 🖥️ Modals Forms */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md max-h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs sm:text-sm font-heading font-bold text-slate-900">
                {activeTab === "reviews"
                  ? "Add Review"
                  : activeTab === "info"
                  ? "Add Information Notice"
                  : `Add Showcase ${formType}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form scroll container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {activeTab === "assignments" || activeTab === "projects" ? (
                <form id="demo-form" onSubmit={handleAddDemo} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Item Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    >
                      <option value="assignment">Assignment File</option>
                      <option value="project">College Coding Project</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DECE-01 handwritten assignment"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Category</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DECE Diploma, BCA Science"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  {formType === "assignment" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500">Subject</label>
                        <input
                          type="text"
                          placeholder="e.g. Nutrition"
                          value={formSubject}
                          onChange={(e) => setFormSubject(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500">Semester</label>
                        <input
                          type="text"
                          placeholder="e.g. Sem 1"
                          value={formSemester}
                          onChange={(e) => setFormSemester(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500">Paper Format</label>
                        <select
                          value={formFormat}
                          onChange={(e) => setFormFormat(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        >
                          <option value="handwritten">Handwritten sheets</option>
                          <option value="pdf">Softcopy PDF</option>
                          <option value="typed">Computer Typed</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500">University</label>
                        <input
                          type="text"
                          value={formUniversity}
                          onChange={(e) => setFormUniversity(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {formType === "project" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[9px] text-slate-500">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          placeholder="React, Express, MySQL"
                          value={formTechStack}
                          onChange={(e) => setFormTechStack(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500">Live Web Link</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formLiveUrl}
                          onChange={(e) => setFormLiveUrl(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500">Walkthrough embed URL</label>
                        <input
                          type="text"
                          placeholder="https://youtube.com/embed/..."
                          value={formYoutubeUrl}
                          onChange={(e) => setFormYoutubeUrl(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Description</label>
                    <textarea
                      placeholder="Details about layouts, parameters..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                      <label className="text-[9px] text-slate-600 font-bold block cursor-pointer">
                        <Upload className="h-4 w-4 text-indigo-600 mx-auto mb-0.5" />
                        <span>Card Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "thumbnail")}
                          className="hidden"
                        />
                      </label>
                      {uploadedThumbnailUrl && <p className="text-[8px] text-green-600 truncate">{uploadedThumbnailUrl}</p>}
                    </div>

                    <div className="p-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                      <label className="text-[9px] text-slate-600 font-bold block cursor-pointer">
                        <Upload className="h-4 w-4 text-indigo-600 mx-auto mb-0.5" />
                        <span>Sample PDF</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "file")}
                          className="hidden"
                        />
                      </label>
                      {uploadedFileUrl && <p className="text-[8px] text-green-600 truncate">{uploadedFileUrl}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="is-featured"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-indigo-600 border border-slate-200"
                    />
                    <label htmlFor="is-featured" className="text-[9px] text-slate-700 cursor-pointer">
                      Feature on home page
                    </label>
                  </div>
                </form>
              ) : activeTab === "reviews" ? (
                <form id="review-form" onSubmit={handleAddReview} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Student Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Rating</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(parseInt(e.target.value) || 5)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★</option>
                      <option value={3}>3 Stars ★★★</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">University / Course</label>
                    <input
                      type="text"
                      placeholder="e.g. IGNOU (DECE)"
                      value={revUniv}
                      onChange={(e) => setRevUniv(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Review Feedback</label>
                    <textarea
                      required
                      placeholder="Review message..."
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      rows={3}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>
                </form>
              ) : (
                <form id="info-form" onSubmit={handleAddInfo} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Notice/FAQ Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. How to download softcopy?"
                      value={infoTitle}
                      onChange={(e) => setInfoTitle(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Category</label>
                    <select
                      value={infoCategory}
                      onChange={(e) => setInfoCategory(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    >
                      <option value="Notice">Notice Announcement</option>
                      <option value="FAQ">FAQ Question</option>
                      <option value="Instruction">Instruction Guide</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Content Description</label>
                    <textarea
                      required
                      placeholder="Announcement detailed details..."
                      value={infoContent}
                      onChange={(e) => setInfoContent(e.target.value)}
                      rows={4}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="info-important"
                      checked={infoIsImportant}
                      onChange={(e) => setInfoIsImportant(e.target.checked)}
                      className="rounded text-indigo-600 border border-slate-200"
                    />
                    <label htmlFor="info-important" className="text-[9px] text-slate-700 cursor-pointer">
                      Mark as Important Notice (Highlights yellow)
                    </label>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={
                  activeTab === "reviews"
                    ? "review-form"
                    : activeTab === "info"
                    ? "info-form"
                    : "demo-form"
                }
                disabled={submitting || uploading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>Create Notice</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
