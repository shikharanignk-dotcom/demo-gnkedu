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
  const [formTab, setFormTab] = useState<"info" | "upload" | "pricing">("info");

  // Form Fields
  const [formType, setFormType] = useState<"assignment" | "project" | "video">("assignment");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("dece-assignment");
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

  // Multiple Uploads States
  const [formReels, setFormReels] = useState<string[]>([]);
  const [formHandwrittenDocs, setFormHandwrittenDocs] = useState<{ title: string; pages: string[] }[]>([]);
  const [formPdfDocs, setFormPdfDocs] = useState<{ title: string; pages: string[] }[]>([]);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newReelUrlInput, setNewReelUrlInput] = useState("");

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
  const [whatsapp, setWhatsapp] = useState({ phone: "919518877939", message: "" });
  const [homepageConfig, setHomepageConfig] = useState({
    hero_title: "Guru Nanak Photostat Fatehabad",
    hero_subtitle: "Verify Assignment Sheet Quality Before You Order.",
    theme_color: "indigo",
    logo_text: "GNK Demos",
    paper_formats: "Handwritten sheets, Softcopy PDF, Computer Typed",
    show_pdf: true,
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

      const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
      const docTitleVal = newDocTitle.trim() || defaultTitle;
      const newDoc = { title: docTitleVal, pages: extractedUrls };

      if (type === "handwritten") {
        setFormHandwrittenDocs((prev) => [...prev, newDoc]);
      } else {
        setFormPdfDocs((prev) => [...prev, newDoc]);
      }
      setNewDocTitle("");
      alert(`Auto-extracted ${extractedUrls.length} pages and added document "${docTitleVal}"!`);
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
      setFormReels((prev) => [...prev, url]);
      alert("Video uploaded and added to reels list!");
    } catch (err: any) {
      alert("Failed to upload video: " + err.message);
    } finally {
      setVideoUploading(false);
    }
  };

  // Edit Button Click Handler
  const handleEditClick = (item: any) => {
    setEditingId(item._id);
    setFormTab("info");
    setFormType(item.type);
    setFormTitle(item.title);
    setFormDesc(item.description || "");
    setFormCategory(item.category || "dece-assignment");
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

    // Load multiple uploads lists
    setFormReels(item.video_reels || (item.video_reel_url ? [item.video_reel_url] : []));
    setFormHandwrittenDocs(
      item.handwritten_docs || 
      (item.handwritten_preview_images?.length 
        ? [{ title: "Main solved Copy", pages: item.handwritten_preview_images }] 
        : [])
    );
    setFormPdfDocs(
      item.pdf_docs || 
      (item.pdf_preview_images?.length 
        ? [{ title: "Main solved Copy", pages: item.pdf_preview_images }] 
        : [])
    );
    setNewDocTitle("");
    setNewReelUrlInput("");

    setIsModalOpen(true);
  };

  // Add Button Click Handler
  const handleAddClick = (type?: "assignment" | "project" | "video") => {
    setEditingId(null);
    setFormTab("info");
    if (type) setFormType(type);
    setFormTitle("");
    setFormDesc("");
    setFormCategory("dece-assignment");
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

    // Clear multiple uploads lists
    setFormReels([]);
    setFormHandwrittenDocs([]);
    setFormPdfDocs([]);
    setNewDocTitle("");
    setNewReelUrlInput("");
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
      sub_program: "",
      subject: formSubject || formTitle,
      semester: "Semester 1",
      university: formUniversity || undefined,
      assignment_type: formFormat || undefined,
      price_handwritten: 0,
      price_pdf: 0,
      show_price_public: false,
      video_reel_url: formReels[0] || undefined,
      pdf_preview_images: formPdfDocs[0]?.pages || undefined,
      handwritten_preview_images: formHandwrittenDocs[0]?.pages || undefined,
      tech_stack: formType === "project" ? techArray : undefined,
      live_url: formType === "project" ? formLiveUrl : undefined,
      youtube_url: formYoutubeUrl || undefined,
      thumbnail_url: formThumbnailUrl || undefined,
      file_urls: formPdfDocs[0]?.pages || undefined,
      is_featured: formIsFeatured,
      video_reels: formReels,
      handwritten_docs: formHandwrittenDocs,
      pdf_docs: formPdfDocs,
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
      setFormCategory("dece-assignment");
      setFormSubProgram("");
      setFormSubject("");
      setFormYoutubeUrl("");
      setFormVideoReelUrl("");
      setFormThumbnailUrl("");
      setFormLiveUrl("");
      setFormTechStack("");
      setPdfPagesPreview([]);
      setHandwrittenPagesPreview([]);
      setFormReels([]);
      setFormHandwrittenDocs([]);
      setFormPdfDocs([]);
      setNewDocTitle("");
      setNewReelUrlInput("");
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
          { id: "assignments", label: "Uploads" },
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
        {/* Uploads Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Uploaded Subjects</h2>
              <button
                onClick={() => handleAddClick("assignment")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a15c00] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add subject</span>
              </button>
            </div>

            <div className="space-y-2">
              {demos.map((item: any, idx: number) => (
                <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-1 max-w-[60%]">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-[#a15c00] bg-[#a15c00]/5 px-1.5 py-0.5 rounded border border-[#a15c00]/10">
                        {item.subject || "SUB"}
                      </span>
                      {item.category && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-blue-650 bg-blue-50 px-1.5 py-0.5 rounded">
                          {item.category.replace("-", " ")}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
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
                      disabled={idx === demos.length - 1}
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
                    <label className="text-[9px] text-slate-500 font-bold uppercase leading-none">Phone (e.g. 919518877939)</label>
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
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logo & Hero Content Branding</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium uppercase block">Logo Title</label>
                    <input
                      type="text"
                      value={homepageConfig.logo_text}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, logo_text: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium uppercase block">Hero Title text</label>
                    <input
                      type="text"
                      value={homepageConfig.hero_title}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, hero_title: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium uppercase block">Hero Subtitle text</label>
                    <textarea
                      value={homepageConfig.hero_subtitle}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, hero_subtitle: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 resize-none font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-medium uppercase block">Paper Formats / Other Info text</label>
                    <input
                      type="text"
                      value={homepageConfig.paper_formats}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, paper_formats: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                    <input
                      type="checkbox"
                      id="show_pdf_checkbox"
                      checked={homepageConfig.show_pdf !== false}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, show_pdf: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-350 text-[#a15c00] focus:ring-[#a15c00]"
                    />
                    <label htmlFor="show_pdf_checkbox" className="text-xs text-slate-700 font-bold uppercase tracking-wider cursor-pointer">
                      Enable Soft Copy PDF Section
                    </label>
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

            {/* Tab Bar for Subject Form */}
            {activeTab === "assignments" && (
              <div className="flex border-b border-slate-200 text-[9px] font-bold uppercase tracking-wider bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setFormTab("info")}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                    formTab === "info" ? "border-[#a15c00] text-[#a15c00] bg-white font-black" : "border-transparent text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  📝 Info
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab("upload")}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                    formTab === "upload" ? "border-[#a15c00] text-[#a15c00] bg-white font-black" : "border-transparent text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  📂 Uploads
                </button>
              </div>
            )}

            {/* Forms Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === "assignments" ? (
                <form id="demo-form" onSubmit={handleAddDemo} className="space-y-3.5">
                  
                  {/* TAB 1: BASIC INFO */}
                  {formTab === "info" && (
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-700 font-bold uppercase">Subject Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Child Development"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-700 font-bold uppercase">Description</label>
                        <textarea
                          placeholder="Enter subject guidelines description..."
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          rows={4}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none font-medium leading-relaxed"
                        />
                      </div>

                      {/* Course Category Selector */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase block leading-none">Course Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-750 font-bold"
                        >
                          <option value="dece-assignment">DECE Assignment</option>
                          <option value="dece-project">DECE Project</option>
                          <option value="ma">MA Assignments</option>
                          <option value="ba">BA Assignments</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 p-1.5 border border-slate-100 bg-slate-50 rounded-xl mt-4">
                        <input
                          type="checkbox"
                          id="is-featured"
                          checked={formIsFeatured}
                          onChange={(e) => setFormIsFeatured(e.target.checked)}
                          className="rounded border-slate-200 text-[#a15c00]"
                        />
                        <label htmlFor="is-featured" className="text-[9px] font-bold text-slate-650 cursor-pointer flex items-center gap-1">
                          <span>Pin / Feature on Home Screen</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: UPLOADS & DEMOS */}
                  {formTab === "upload" && (
                    <div className="space-y-4">
                      {/* Cover Thumbnail */}
                      <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                        <label className="text-[9px] text-slate-700 font-bold uppercase block">Subject Cover Image</label>
                        <div className="flex gap-2.5 items-center">
                          {formThumbnailUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={formThumbnailUrl} className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" alt="Thumbnail" />
                          )}
                          <div className="flex-1">
                            <label className="px-3 py-1.5 rounded-lg border border-slate-250 text-[10px] text-slate-650 bg-white hover:bg-slate-50 cursor-pointer font-bold inline-block">
                              <span>Upload Cover Image</span>
                              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                            </label>
                            {thumbnailUploading && <span className="text-[8px] text-[#a15c00] ml-2 animate-pulse font-bold">Uploading...</span>}
                          </div>
                        </div>
                      </div>

                      {/* Video Reels list & uploader */}
                      <div className="space-y-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/50">
                        <div className="space-y-0.5">
                          <label className="text-[9px] text-slate-700 font-bold uppercase block">Video Reels Walkthroughs (Multiple)</label>
                          <p className="text-[8px] text-slate-400">Add multiple video reels links or upload video files.</p>
                        </div>
                        {/* Reels List */}
                        {formReels.length > 0 && (
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {formReels.map((url, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 text-[9px] text-slate-600 gap-2">
                                <span className="truncate flex-1 font-mono">{url}</span>
                                <button
                                  type="button"
                                  onClick={() => setFormReels(formReels.filter((_, i) => i !== idx))}
                                  className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Add URL field */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Paste vertical reel URL (.mp4 or YouTube)"
                            value={newReelUrlInput}
                            onChange={(e) => setNewReelUrlInput(e.target.value)}
                            className="flex-1 p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newReelUrlInput.trim()) {
                                setFormReels([...formReels, newReelUrlInput.trim()]);
                                setNewReelUrlInput("");
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#a15c00] hover:bg-[#854b00] text-white text-[9px] font-bold uppercase cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        {/* Add file button */}
                        <div className="flex items-center gap-2 border-t border-slate-200/50 pt-2">
                          <label className="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] text-slate-650 bg-white hover:bg-slate-100 cursor-pointer font-bold inline-block">
                            <span>Upload Video File (.mp4)</span>
                            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                          </label>
                          {videoUploading && <span className="text-[8px] text-[#a15c00] animate-pulse font-bold">Uploading video...</span>}
                        </div>
                      </div>

                      {/* Handwritten Solved PDFs (Multiple) */}
                      <div className="space-y-3 p-3 bg-slate-55 p-3 rounded-xl border border-slate-200/60 bg-slate-50">
                        <div className="space-y-0.5">
                          <label className="text-[9px] text-slate-700 font-bold uppercase block">Handwritten PDF Solved Copies</label>
                          <p className="text-[8px] text-slate-400">Manage multiple handwritten copies. Enter title and select PDF.</p>
                        </div>
                        {/* Handwritten Docs List */}
                        {formHandwrittenDocs.length > 0 && (
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {formHandwrittenDocs.map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 text-[9px] text-slate-650 gap-2">
                                <div className="truncate flex-1">
                                  <span className="font-extrabold text-[#a15c00] block">{doc.title}</span>
                                  <span className="text-[8px] text-slate-400 block">{doc.pages.length} preview pages</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setFormHandwrittenDocs(formHandwrittenDocs.filter((_, i) => i !== idx))}
                                  className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Upload Doc inputs */}
                        <div className="space-y-2 border-t border-slate-200/50 pt-2">
                          <input
                            type="text"
                            placeholder="Enter handwritten copy name (e.g. Set-A Solved)..."
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                            className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                          />
                          <div className="p-2.5 rounded-xl border border-dashed border-slate-250 bg-white text-center relative">
                            <label className="text-[9px] text-slate-600 font-bold block cursor-pointer">
                              <Upload className="h-4 w-4 text-[#a15c00] inline mr-1" />
                              <span>Select Solved PDF File</span>
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
                          </div>
                        </div>
                      </div>

                      {/* Soft Copy Solved PDFs (Multiple) */}
                      <div className="space-y-3 p-3 bg-slate-55 p-3 rounded-xl border border-slate-200/60 bg-slate-50">
                        <div className="space-y-0.5">
                          <label className="text-[9px] text-slate-700 font-bold uppercase block">Solved PDF Documents (Soft Copy)</label>
                          <p className="text-[8px] text-slate-400">Manage multiple softcopy solved documents.</p>
                        </div>
                        {/* Softcopy Docs List */}
                        {formPdfDocs.length > 0 && (
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {formPdfDocs.map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 text-[9px] text-slate-650 gap-2">
                                <div className="truncate flex-1">
                                  <span className="font-extrabold text-[#a15c00] block">{doc.title}</span>
                                  <span className="text-[8px] text-slate-400 block">{doc.pages.length} preview pages</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setFormPdfDocs(formPdfDocs.filter((_, i) => i !== idx))}
                                  className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Upload Doc inputs */}
                        <div className="space-y-2 border-t border-slate-200/50 pt-2">
                          <input
                            type="text"
                            placeholder="Enter softcopy doc name (e.g. Solved PDF Copy 1)..."
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                            className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                          />
                          <div className="p-2.5 rounded-xl border border-dashed border-slate-250 bg-white text-center relative">
                            <label className="text-[9px] text-slate-600 font-bold block cursor-pointer">
                              <Upload className="h-4 w-4 text-[#a15c00] inline mr-1" />
                              <span>Select Solved PDF File</span>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none font-medium leading-relaxed"
                    />
                  </div>
                </form>
              ) : (
                <form id="info-form" onSubmit={handleAddNotice} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-700 font-bold uppercase">Notice Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IGNOU December 2026 Submission Open"
                      value={infoTitle}
                      onChange={(e) => setInfoTitle(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
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
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 resize-none font-medium leading-relaxed"
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
                disabled={submitting || uploading || extractingType !== null || thumbnailUploading || videoUploading}
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
