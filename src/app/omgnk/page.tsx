"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  ShieldCheck, Plus, Trash2, LogOut, FileText, Globe, PlayCircle, Star, 
  Settings, Loader2, Upload, X, Bell, ChevronUp, ChevronDown, Eye, EyeOff, BarChart2, Edit
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("gnk_admin_logged_in");
    if (isLoggedIn !== "true") {
      router.replace("/omgnk/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Convex Queries
  const demos = useQuery(api.demos.list) || [];
  const reviews = useQuery(api.reviews.list) || [];
  const notices = useQuery(api.information.list) || [];
  const siteSettings = useQuery(api.site_settings.get) || [];
  const commentsList = useQuery(api.comments.getAll) || [];

  // Convex Mutations
  const createDemo = useMutation(api.demos.create);
  const updateDemo = useMutation(api.demos.update);
  const deleteDemo = useMutation(api.demos.remove);
  const updateOrder = useMutation(api.demos.updateOrder);
  const generateUploadUrl = useMutation(api.demos.generateUploadUrl);
  const getStorageUrl = useMutation(api.demos.getStorageUrl);
  
  const createReview = useMutation(api.reviews.create);
  const deleteReview = useMutation(api.reviews.remove);
  
  const createNotice = useMutation(api.information.create);
  const deleteNotice = useMutation(api.information.remove);

  const upsertSettings = useMutation(api.site_settings.upsert);

  const addComment = useMutation(api.comments.add);
  const deleteComment = useMutation(api.comments.remove);
  const togglePublishComment = useMutation(api.comments.togglePublish);

  // General state
  const [activeTab, setActiveTab] = useState("assignments");
  const [commentDemoId, setCommentDemoId] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [extractingType, setExtractingType] = useState<"handwritten" | "pdf" | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [pdfPagesPreview, setPdfPagesPreview] = useState<string[]>([]);
  const [handwrittenPagesPreview, setHandwrittenPagesPreview] = useState<string[]>([]);
  const [analyticsSort, setAnalyticsSort] = useState<"views" | "orders">("views");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<"assignment" | "project" | "video">("assignment");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("dece");
  const [formSubProgram, setFormSubProgram] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formSemester, setFormSemester] = useState("Semester 1");
  const [formUniversity, setFormUniversity] = useState("IGNOU");
  const [formFormat, setFormFormat] = useState("handwritten");
  const [formPriceHandwritten, setFormPriceHandwritten] = useState(350);
  const [formPricePdf, setFormPricePdf] = useState(120);
  const [formShowPricePublic, setFormShowPricePublic] = useState(true);
  const [formVideoReelUrl, setFormVideoReelUrl] = useState("");
  const [formThumbnailUrl, setFormThumbnailUrl] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formYoutubeUrl, setFormYoutubeUrl] = useState("");
  const [formTechStack, setFormTechStack] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Review Form Fields
  const [revName, setRevName] = useState("");
  const [revText, setRevText] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revUniv, setRevUniv] = useState("IGNOU");

  // Info Form Fields
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContent, setInfoContent] = useState("");
  const [infoCategory, setInfoCategory] = useState("Notice");
  const [infoIsImportant, setInfoIsImportant] = useState(false);

  // Map settings
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const [counters, setCounters] = useState({ students: 500, assignments: 1000, projects: 50 });
  const [whatsapp, setWhatsapp] = useState({ phone: "919352483446", message: "" });
  const [homepageConfig, setHomepageConfig] = useState({
    hero_title: "Guru Nanak Photostat Fatehabad",
    hero_subtitle: "Verify Assignment Sheet Quality Before You Order.",
    theme_color: "indigo",
    logo_text: "GNK Demos",
    paper_formats: "Handwritten sheets, Softcopy PDF, Computer Typed",
  });

  useEffect(() => {
    if (settingsObj.counters) setCounters(settingsObj.counters);
    if (settingsObj.whatsapp_config) setWhatsapp(settingsObj.whatsapp_config);
    if (settingsObj.homepage_config) setHomepageConfig({ ...homepageConfig, ...settingsObj.homepage_config });
  }, [settingsObj]);

  const handleLogout = () => {
    localStorage.removeItem("gnk_admin_logged_in");
    router.replace("/omgnk/login");
  };

  // Direct Convex upload handler
  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await response.json();
      
      // Use the Convex mutation to get the actual public URL
      // This returns a proper CDN URL that works for images, videos, and PDFs
      const publicUrl = await getStorageUrl({ storageId });
      if (publicUrl) {
        return publicUrl;
      }
      
      // Fallback: construct URL using .cloud domain (Convex serves storage on .cloud, NOT .site)
      const cloudBase = process.env.NEXT_PUBLIC_CONVEX_URL || "";
      return `${cloudBase}/api/storage/${storageId}`;
    } catch (e: any) {
      alert("File upload failed: " + e.message);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  // Preview PDF page auto-converter (Client-side rendering to watermarked JPEGs)
  const handlePreviewPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "handwritten" | "pdf") => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setExtractingType(type);
    try {
      if (!(window as any).pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pagesToExtract = Math.min(pdf.numPages, 5);
      const extractedUrls: string[] = [];

      for (let i = 1; i <= pagesToExtract; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;

          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 6);
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = "rgba(161, 92, 0, 0.12)";
          ctx.textAlign = "center";
          ctx.fillText("GURU NANAK PHOTOSTAT", 0, -20);
          ctx.fillText("DEMO PREVIEW ONLY", 0, 20);
          ctx.restore();

          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85);
          });

          if (blob) {
            const pageFile = new File([blob], `page-${i}.jpg`, { type: "image/jpeg" });
            const pageUrl = await handleFileUpload(pageFile);
            extractedUrls.push(pageUrl);
          }
        }
      }

      if (type === "handwritten") {
        setHandwrittenPagesPreview(extractedUrls);
      } else {
        setPdfPagesPreview(extractedUrls);
      }
      alert(`Auto-extracted ${extractedUrls.length} pages for ${type === "handwritten" ? "Handwritten" : "Softcopy PDF"} preview!`);
    } catch (err: any) {
      console.error(err);
      alert("PDF conversion failed: " + err.message);
    } finally {
      setExtractingType(null);
    }
  };

  // Thumbnail Image Uploader
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailUploading(true);
    try {
      const url = await handleFileUpload(file);
      setFormThumbnailUrl(url);
      alert("Thumbnail uploaded successfully!");
    } catch (err: any) {
      alert("Failed to upload thumbnail: " + err.message);
    } finally {
      setThumbnailUploading(false);
    }
  };

  // Video Reel File Uploader
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file (.mp4, .webm, etc.)");
      return;
    }

    setVideoUploading(true);
    try {
      const url = await handleFileUpload(file);
      setFormVideoReelUrl(url);
      alert("Video uploaded successfully to Convex!");
    } catch (err: any) {
      alert("Failed to upload video: " + err.message);
    } finally {
      setVideoUploading(false);
    }
  };

  // Edit Button Click Handler
  const handleEditClick = (item: any) => {
    setEditingId(item._id);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormDesc(item.description || "");
    setFormCategory(item.category || "dece");
    setFormSubProgram(item.sub_program || "");
    setFormSubject(item.subject || "");
    setFormSemester(item.semester || "Semester 1");
    setFormUniversity(item.university || "IGNOU");
    setFormFormat(item.assignment_type || "handwritten");
    setFormPriceHandwritten(item.price_handwritten || 350);
    setFormPricePdf(item.price_pdf || 120);
    setFormShowPricePublic(item.show_price_public !== false);
    setFormVideoReelUrl(item.video_reel_url || "");
    setFormThumbnailUrl(item.thumbnail_url || "");
    setFormLiveUrl(item.live_url || "");
    setFormYoutubeUrl(item.youtube_url || "");
    setFormTechStack(item.tech_stack ? item.tech_stack.join(", ") : "");
    setFormIsFeatured(item.is_featured || false);
    setHandwrittenPagesPreview(item.handwritten_preview_images || []);
    setPdfPagesPreview(item.pdf_preview_images || []);
    setIsModalOpen(true);
  };

  // Add Button Click Handler
  const handleAddClick = (type?: "assignment" | "project" | "video") => {
    setEditingId(null);
    if (type) setFormType(type);
    setFormTitle("");
    setFormDesc("");
    setFormCategory("dece");
    setFormSubProgram("");
    setFormSubject("");
    setFormSemester("Semester 1");
    setFormUniversity("IGNOU");
    setFormFormat("handwritten");
    setFormPriceHandwritten(350);
    setFormPricePdf(120);
    setFormShowPricePublic(true);
    setFormVideoReelUrl("");
    setFormThumbnailUrl("");
    setFormLiveUrl("");
    setFormYoutubeUrl("");
    setFormTechStack("");
    setFormIsFeatured(false);
    setPdfPagesPreview([]);
    setHandwrittenPagesPreview([]);
    setIsModalOpen(true);
  };

  const handleAddDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);
    const techArray = formTechStack ? formTechStack.split(",").map((t: string) => t.trim()) : [];

    const fields = {
      type: formType,
      title: formTitle,
      description: formDesc || undefined,
      slug,
      category: formCategory || undefined,
      sub_program: formSubProgram || undefined,
      subject: formSubject || undefined,
      semester: formSemester || undefined,
      university: formUniversity || undefined,
      assignment_type: formFormat || undefined,
      price_handwritten: formPriceHandwritten || undefined,
      price_pdf: formPricePdf || undefined,
      show_price_public: formShowPricePublic,
      video_reel_url: formVideoReelUrl || undefined,
      pdf_preview_images: pdfPagesPreview.length > 0 ? pdfPagesPreview : undefined,
      handwritten_preview_images: handwrittenPagesPreview.length > 0 ? handwrittenPagesPreview : undefined,
      tech_stack: formType === "project" ? techArray : undefined,
      live_url: formType === "project" ? formLiveUrl : undefined,
      youtube_url: formYoutubeUrl || undefined,
      thumbnail_url: formThumbnailUrl || undefined,
      file_urls: pdfPagesPreview.length > 0 ? pdfPagesPreview : undefined,
      is_featured: formIsFeatured,
    };

    try {
      if (editingId) {
        await updateDemo({
          id: editingId as any,
          ...fields,
        });
        alert("Subject updated successfully!");
      } else {
        await createDemo({
          ...fields,
          sort_order: demos.length,
          published: true,
        });
        alert("Subject created successfully!");
      }

      // Reset
      setFormTitle("");
      setFormDesc("");
      setFormCategory("dece");
      setFormSubProgram("");
      setFormSubject("");
      setFormYoutubeUrl("");
      setFormVideoReelUrl("");
      setFormThumbnailUrl("");
      setFormLiveUrl("");
      setFormTechStack("");
      setPdfPagesPreview([]);
      setHandwrittenPagesPreview([]);
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save item: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview({
        student_name: revName,
        rating: revRating,
        review_text: revText,
        university: revUniv || undefined,
        verified: true,
        published: true,
      });
      setRevName("");
      setRevText("");
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to add review: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createNotice({
        title: infoTitle,
        content: infoContent,
        category: infoCategory,
        is_important: infoIsImportant,
        published: true,
      });
      setInfoTitle("");
      setInfoContent("");
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to create announcement: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await Promise.all([
        upsertSettings({ key: "counters", value: counters }),
        upsertSettings({ key: "whatsapp_config", value: whatsapp }),
        upsertSettings({ key: "homepage_config", value: homepageConfig }),
      ]);
      alert("Convex Settings updated successfully!");
    } catch (err: any) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reordering handlers
  const handleMove = async (index: number, direction: "up" | "down") => {
    const list = [...demos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap sort order values
    const temp = list[index].sort_order;
    list[index].sort_order = list[targetIndex].sort_order;
    list[targetIndex].sort_order = temp;

    const payload = list.map((item: any) => ({ id: item._id, sort_order: item.sort_order }));
    try {
      await updateOrder({ orders: payload });
    } catch (e: any) {
      alert("Order swap failed: " + e.message);
    }
  };

  // Sorted Analytics items
  const sortedAnalytics = useMemo(() => {
    const list = [...demos].filter((d: any) => d.type === "assignment");
    if (analyticsSort === "views") {
      return list.sort((a, b) => (b.click_count_view_pdf || 0) - (a.click_count_view_pdf || 0));
    } else {
      return list.sort((a, b) => (b.click_count_order || 0) - (a.click_count_order || 0));
    }
  }, [demos, analyticsSort]);

  if (!authorized) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-3 bg-slate-50 min-h-screen">
        <Loader2 className="h-8 w-8 text-[#a15c00] animate-spin" />
        <p className="text-xs text-slate-500">Checking auth token...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-8 space-y-6 bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-0.5">
          <h1 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-[#a15c00]" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-[10px] text-slate-400">Manage course catalogs, prices, and analyze clicks.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold uppercase transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-1 scrollbar-none">
        {[
          { id: "assignments", label: "Assignments" },
          { id: "projects", label: "Projects" },
          { id: "videos", label: "Videos" },
          { id: "comments", label: "Comments" },
          { id: "notices", label: "Info notices" },
          { id: "reviews", label: "Reviews" },
          { id: "analytics", label: "Clicks Analytics" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#a15c00] text-white shadow-sm"
                : "text-slate-500 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panel contents */}
      <div className="space-y-4">
        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assignments & Solved Sheets</h2>
              <button
                onClick={() => handleAddClick("assignment")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a15c00] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add subject</span>
              </button>
            </div>

            <div className="space-y-2">
              {demos
                .filter((d: any) => d.type === "assignment")
                .map((item: any, idx: number) => (
                  <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1 max-w-[60%]">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#a15c00] bg-[#a15c00]/5 px-1.5 py-0.5 rounded border border-[#a15c00]/10">
                          {item.subject || "SUB"}
                        </span>
                        {item.sub_program && (
                          <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {item.sub_program}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 font-bold">
                        ₹{item.price_handwritten || 350} (H) &bull; ₹{item.price_pdf || 120} (PDF)
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-50 border border-slate-200 disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === demos.filter((d: any) => d.type === "assignment").length - 1}
                        className="p-1 rounded bg-slate-50 border border-slate-200 disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 rounded bg-blue-50 border border-blue-100 text-blue-650 hover:bg-blue-100"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm("Delete this subject?")) deleteDemo({ id: item._id });
                        }}
                        className="p-1.5 rounded bg-red-50 border border-red-100 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">College Coding Projects</h2>
              <button
                onClick={() => handleAddClick("project")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a15c00] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add project</span>
              </button>
            </div>

            <div className="space-y-2">
              {demos
                .filter((d: any) => d.type === "project")
                .map((item: any) => (
                  <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[8px] font-extrabold uppercase bg-sky-50 text-sky-600 px-2 py-0.5 rounded">
                        {item.category || "Project"}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">{item.title}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 rounded bg-blue-50 border border-blue-100 text-blue-650 hover:bg-blue-100"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this project?")) deleteDemo({ id: item._id });
                        }}
                        className="p-1.5 rounded bg-red-50 border border-red-100 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Walkthrough Videos</h2>
              <button
                onClick={() => handleAddClick("video")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a15c00] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add video guide</span>
              </button>
            </div>

            <div className="space-y-2">
              {demos
                .filter((d: any) => d.type === "video")
                .map((item: any) => (
                  <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-[8px] text-slate-400 font-bold truncate max-w-[180px]">{item.youtube_url || item.video_reel_url}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 rounded bg-blue-50 border border-blue-100 text-blue-650 hover:bg-blue-100"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this video guide?")) deleteDemo({ id: item._id });
                        }}
                        className="p-1.5 rounded bg-red-50 border border-red-100 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notice Bulletin & FAQs</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a15c00] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Notice</span>
              </button>
            </div>

            <div className="space-y-2">
              {notices.map((item: any) => (
                <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Delete notice?")) deleteNotice({ id: item._id });
                    }}
                    className="p-1.5 rounded bg-red-50 border border-red-100 text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reviews</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a15c00] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="space-y-2">
              {reviews.map((rev: any) => (
                <div key={rev._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{rev.student_name} ({rev.rating}★)</h4>
                    <p className="text-[10px] text-slate-500 italic max-w-xs truncate">"{rev.review_text}"</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Delete review?")) deleteReview({ id: rev._id });
                    }}
                    className="p-1.5 rounded bg-red-50 border border-red-100 text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {/* Add Comment Section */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentDemoId || !commentText.trim()) {
                  alert("Please select a subject and enter comment text.");
                  return;
                }
                try {
                  await addComment({
                    demo_id: commentDemoId as any,
                    name: commentName.trim() || "Admin",
                    text: commentText.trim(),
                  });
                  setCommentName("");
                  setCommentText("");
                  alert("Comment added successfully!");
                } catch (err: any) {
                  alert("Failed to add comment: " + err.message);
                }
              }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3"
            >
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add Comment on Subject</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold uppercase block">Select Subject</label>
                  <select
                    value={commentDemoId}
                    onChange={(e) => setCommentDemoId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="">-- Choose Subject --</option>
                    {demos.map((d: any) => (
                      <option key={d._id} value={d._id}>
                        {d.subject || "SUB"} - {d.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold uppercase block">Name</label>
                  <input
                    type="text"
                    placeholder="Admin / Student Name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase block">Comment Message</label>
                <input
                  type="text"
                  placeholder="Write message..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Add Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manage Comments</h2>
              <div className="space-y-2">
                {commentsList.map((c: any) => {
                  const matchedDemo = demos.find((d: any) => d._id === c.demo_id);
                  return (
                    <div key={c._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{c.name}</span>
                          <span className="text-[8px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                            {matchedDemo ? matchedDemo.subject : "Demo Reel"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">{c.text}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={async () => {
                            try {
                              await togglePublishComment({ id: c._id });
                            } catch (err: any) {
                              alert("Failed to toggle visibility: " + err.message);
                            }
                          }}
                          className={`p-1.5 rounded border transition-colors ${
                            c.published
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                              : "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100"
                          }`}
                          title={c.published ? "Hide Comment" : "Publish Comment"}
                        >
                          {c.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete comment permanently?")) {
                              try {
                                await deleteComment({ id: c._id });
                              } catch (err: any) {
                                alert("Failed to delete comment: " + err.message);
                              }
                            }
                          }}
                          className="p-1.5 rounded bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {commentsList.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No comments found in database.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clicks Analytics Dashboard</h2>
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-200 gap-1 text-[9px] font-bold uppercase select-none">
                <button
                  onClick={() => setAnalyticsSort("views")}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    analyticsSort === "views" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Views
                </button>
                <button
                  onClick={() => setAnalyticsSort("orders")}
                  className={`px-2.5 py-1 transition-all cursor-pointer ${
                    analyticsSort === "orders" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
              {sortedAnalytics.map((item: any, idx: number) => (
                <div key={item._id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider">#{idx + 1} &bull; {item.subject}</span>
                    <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center p-2 px-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
                      <span className="block text-[14px] font-extrabold leading-none">{item.click_count_view_pdf || 0}</span>
                      <span className="text-[7px] font-bold uppercase tracking-wider opacity-80 leading-none">Views</span>
                    </div>

                    <div className="text-center p-2 px-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                      <span className="block text-[14px] font-extrabold leading-none">{item.click_count_order || 0}</span>
                      <span className="text-[7px] font-bold uppercase tracking-wider opacity-80 leading-none">Orders</span>
                    </div>
                  </div>
                </div>
              ))}

              {sortedAnalytics.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-1">
                  <BarChart2 className="h-6 w-6 text-slate-350" />
                  <span>No click analytics data captured yet.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Site Parameters Configuration</h2>

            {/* Config inputs */}
            <div className="space-y-3.5">
              {/* WhatsApp Config */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp Config</h4>
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-bold uppercase leading-none">Phone (e.g. 919352483446)</label>
                    <input
                      type="text"
                      value={whatsapp.phone}
                      onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-bold uppercase leading-none">Pre-filled Msg</label>
                    <textarea
                      value={whatsapp.message}
                      onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Counters */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trust Counters</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium">Students</label>
                    <input
                      type="number"
                      value={counters.students}
                      onChange={(e) => setCounters({ ...counters, students: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium">Assignments</label>
                    <input
                      type="number"
                      value={counters.assignments}
                      onChange={(e) => setCounters({ ...counters, assignments: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium">Projects</label>
                    <input
                      type="number"
                      value={counters.projects}
                      onChange={(e) => setCounters({ ...counters, projects: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage Layout */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logo Branding</h4>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium">Logo Title</label>
                    <input
                      type="text"
                      value={homepageConfig.logo_text}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, logo_text: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1"
            >
              {submitting && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
              <span>Save Configuration</span>
            </button>
          </form>
        )}
      </div>

      {/* 📁 Modal Forms */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm max-h-[80vh] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs sm:text-sm font-heading font-extrabold text-slate-900">
                {editingId 
                  ? "Edit Subject Details" 
                  : activeTab === "reviews"
                  ? "Add Student Review"
                  : activeTab === "notices"
                  ? "Add notice Bulletin"
                  : `Add Subject / ${formType}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Forms Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === "assignments" || activeTab === "projects" || activeTab === "videos" ? (
                <form id="demo-form" onSubmit={handleAddDemo} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Subject Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Child Development"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Description</label>
                    <textarea
                      placeholder="Enter subject guidelines description..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>

                  {/* Course Category Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-bold uppercase leading-none">Course Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                      >
                        <option value="dece">DECE</option>
                        <option value="ma">MA</option>
                        <option value="ba">BA</option>
                        <option value="meg">MEG</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-bold uppercase leading-none">Sub-Program (e.g. MPS)</label>
                      <input
                        type="text"
                        placeholder="e.g. MPS"
                        value={formSubProgram}
                        onChange={(e) => setFormSubProgram(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {formType === "assignment" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500">Subject Code</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. DECE-1"
                            value={formSubject}
                            onChange={(e) => setFormSubject(e.target.value)}
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500">Semester/Year</label>
                          <input
                            type="text"
                            placeholder="e.g. Semester 1"
                            value={formSemester}
                            onChange={(e) => setFormSemester(e.target.value)}
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Pricing inputs */}
                      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-650 font-bold leading-none">Handwritten Price</label>
                          <input
                            type="number"
                            value={formPriceHandwritten}
                            onChange={(e) => setFormPriceHandwritten(parseInt(e.target.value) || 0)}
                            className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-650 font-bold leading-none">PDF Softcopy Price</label>
                          <input
                            type="number"
                            value={formPricePdf}
                            onChange={(e) => setFormPricePdf(parseInt(e.target.value) || 0)}
                            className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-slate-200/50">
                          <input
                            type="checkbox"
                            id="price-toggle"
                            checked={formShowPricePublic}
                            onChange={(e) => setFormShowPricePublic(e.target.checked)}
                            className="rounded border-slate-350 text-[#a15c00]"
                          />
                          <label htmlFor="price-toggle" className="text-[9px] text-slate-700 cursor-pointer flex items-center gap-1 font-bold">
                            {formShowPricePublic ? <Eye className="h-3.5 w-3.5 text-[#a15c00]" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
                            <span>Show pricing on public site</span>
                          </label>
                        </div>
                      </div>

                      {/* Video Walkthrough url & uploader */}
                      <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-700 font-bold uppercase block">Video Reel Link (YouTube / MP4 URL)</label>
                          <input
                            type="text"
                            placeholder="Direct vertical video .mp4 or YouTube link"
                            value={formVideoReelUrl}
                            onChange={(e) => setFormVideoReelUrl(e.target.value)}
                            className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Or</span>
                          <label className="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] text-slate-650 bg-white hover:bg-slate-100 cursor-pointer font-bold inline-block">
                            <span>Upload Video File (.mp4)</span>
                            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                          </label>
                          {videoUploading && <span className="text-[8px] text-[#a15c00] animate-pulse">Uploading...</span>}
                        </div>
                      </div>

                      {/* Handwritten Sample PDF Preview */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-700 font-bold uppercase block">Handwritten Sample PDF (Preview pages)</label>
                        <div className="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center relative">
                          <label className="text-[9px] text-slate-600 font-bold block cursor-pointer">
                            <Upload className="h-4 w-4 text-[#a15c00] inline mr-1" />
                            <span>Upload Handwritten PDF</span>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handlePreviewPdfUpload(e, "handwritten")}
                              className="hidden"
                            />
                          </label>
                          {extractingType === "handwritten" && (
                            <div className="text-[8px] font-bold text-[#a15c00] mt-1 flex items-center justify-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Converting pages...</span>
                            </div>
                          )}
                          {handwrittenPagesPreview.length > 0 && (
                            <div className="text-[8px] text-green-600 font-bold mt-1">
                              ✓ Auto-loaded {handwrittenPagesPreview.length} handwritten preview pages
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Soft Copy PDF Preview */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-700 font-bold uppercase block">Softcopy solved PDF (Preview pages)</label>
                        <div className="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center relative">
                          <label className="text-[9px] text-slate-600 font-bold block cursor-pointer">
                            <Upload className="h-4 w-4 text-[#a15c00] inline mr-1" />
                            <span>Upload Softcopy PDF</span>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handlePreviewPdfUpload(e, "pdf")}
                              className="hidden"
                            />
                          </label>
                          {extractingType === "pdf" && (
                            <div className="text-[8px] font-bold text-[#a15c00] mt-1 flex items-center justify-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Converting pages...</span>
                            </div>
                          )}
                          {pdfPagesPreview.length > 0 && (
                            <div className="text-[8px] text-green-600 font-bold mt-1">
                              ✓ Auto-loaded {pdfPagesPreview.length} softcopy preview pages
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {formType === "project" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase">Tech Stack (comma separated)</label>
                        <input
                           type="text"
                           placeholder="e.g. React, Express, MySQL"
                           value={formTechStack}
                           onChange={(e) => setFormTechStack(e.target.value)}
                           className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase">Live website Link</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formLiveUrl}
                          onChange={(e) => setFormLiveUrl(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cover Thumbnail */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase block">Subject Cover Image</label>
                    <div className="flex gap-2 items-center">
                      {formThumbnailUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={formThumbnailUrl} className="w-12 h-12 object-cover rounded-lg border border-slate-200" alt="Thumbnail" />
                      )}
                      <div className="flex-1">
                        <label className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold inline-block">
                          <span>Upload Cover Image</span>
                          <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                        </label>
                        {thumbnailUploading && <span className="text-[8px] text-[#a15c00] ml-2">Uploading...</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is-featured"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded border-slate-200 text-[#a15c00]"
                    />
                    <label htmlFor="is-featured" className="text-[9px] font-bold text-slate-650 cursor-pointer">
                      Feature on Home Screen
                    </label>
                  </div>
                </form>
              ) : activeTab === "reviews" ? (
                <form id="review-form" onSubmit={handleAddReview} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Student Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanjali Sen"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Rating score</label>
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
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Review feedback</label>
                    <textarea
                      required
                      placeholder="Feedback details..."
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      rows={3}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>
                </form>
              ) : (
                <form id="info-form" onSubmit={handleAddNotice} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Notice Bulletin Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Exams scheduled dates"
                      value={infoTitle}
                      onChange={(e) => setInfoTitle(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Notice content</label>
                    <textarea
                      required
                      placeholder="Notice description details..."
                      value={infoContent}
                      onChange={(e) => setInfoContent(e.target.value)}
                      rows={3}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="info-important"
                      checked={infoIsImportant}
                      onChange={(e) => setInfoIsImportant(e.target.checked)}
                      className="rounded border-slate-200 text-[#a15c00]"
                    />
                    <label htmlFor="info-important" className="text-[9px] font-bold text-slate-650 cursor-pointer">
                      Mark as Important Notice (Yellow highlight banner)
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
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={
                  activeTab === "reviews"
                    ? "review-form"
                    : activeTab === "notices"
                    ? "info-form"
                    : "demo-form"
                }
                disabled={submitting || uploading || extractingType !== null || thumbnailUploading}
                className="px-4.5 py-1.5 rounded-lg bg-[#a15c00] hover:bg-[#854b00] text-white text-[10px] font-bold uppercase flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>{editingId ? "Update item" : "Create item"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
