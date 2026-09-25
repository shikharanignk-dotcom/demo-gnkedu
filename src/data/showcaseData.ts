export interface VideoReelItem {
  id: string;
  title: string;
  duration: string;
  views: string;
  thumbnail: string;
  description: string;
  videoUrl?: string; // Add your YouTube video/shorts or direct MP4 link here
}

export interface SamplePdfItem {
  id: string;
  code: string;
  title: string;
  pagesCount: number;
  fileSize: string;
  previewImage: string;
  description: string;
  pdfUrl?: string;
  downloadUrl?: string;
}

export interface CategoryShowcaseData {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  priceTag: string;
  whatsappMessage: string;
  reels: VideoReelItem[];
  pdfs: SamplePdfItem[];
}

/**
 * ⚙️ VIDEO DEMO SECTION VISIBILITY TOGGLE:
 * Set to `true` to display the Video Reels demo box.
 * Set to `false` if you want to completely hide the Video Reels box and keep only the PDF Sample reader.
 */
export const SHOW_VIDEO_DEMO_BOX: boolean = true;

/**
 * Helper to detect and format YouTube / YouTube Shorts links into playable embed URLs.
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Standard YouTube Watch or Short link: https://www.youtube.com/watch?v=... or https://youtu.be/...
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Already an embed link
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  return null;
}

/**
 * =========================================================================
 * 🎥 CATEGORY SHOWCASES (VIDEO REELS + PDF SAMPLES)
 * -------------------------------------------------------------------------
 * HOW TO ADD NEW VIDEOS:
 * 1. For each reel below, paste your video link in `videoUrl`:
 *    - YouTube Link: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID'
 *    - YouTube Shorts: 'https://youtube.com/shorts/YOUR_SHORTS_ID'
 *    - Direct MP4 Link: 'https://your-domain.com/video.mp4'
 * 2. If `videoUrl` is empty (''), a neat preview placeholder is shown.
 * =========================================================================
 */
export const CATEGORY_SHOWCASES_DATA: Record<string, CategoryShowcaseData> = {
  dece_hw: {
    id: 'dece_hw',
    label: 'DECE Assignment',
    title: 'DECE (DECE-1, DECE-2 & DECE-3) Handwritten Assignment Hub',
    subtitle: 'Complete 3-subject handwritten set on clean A4 foolscap sheets with neat black/blue pen according to official IGNOU guidelines.',
    priceTag: 'Cash on Delivery (COD) Available',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE (DECE-1, DECE-2, DECE-3) Handwritten Assignment Set.',
    reels: [
      {
        id: 'dece-reel-3',
        title: 'DECE-3 Working With Children Handwritten Unboxing Reel',
        duration: '0:58',
        views: '16.5k',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Full unboxing video showing complete 25-30 pages per assignment written by experienced subject experts.',
      },
      {
        id: 'dece-reel-2',
        title: 'DECE-2 Child Services Pen & Handwriting Quality Check',
        duration: '0:52',
        views: '11.8k',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Showing genuine pen-written answers on A4 foolscap pages with proper indexing & 100% IGNOU guidelines.',
      },
      {
        id: 'dece-reel-4',
        title: 'DECE 2025-26 Complete 3 Subject Handwritten Set Showcase',
        duration: '1:10',
        views: '22.1k',
        thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'All 3 subjects (DECE-1, DECE-2, DECE-3) neatly bound and packaged together with Cash on Delivery.',
      },
      {
        id: 'dece-reel-1',
        title: 'DECE-1 Early Childhood Care Handwritten Assignment Real Copy',
        duration: '0:45',
        views: '14.2k',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Inspecting neat handwriting, margins, page headings, and diagrammatic answers for DECE-1 assignment.',
      },
      {
        id: 'dece-reel-5',
        title: 'Guru Nanak Photostat DECE Student Parcel Dispatch Reel',
        duration: '0:38',
        views: '28.4k',
        thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Live packing and SpeedPost/Delhivery courier dispatch process from Fatehabad (Haryana) shop.',
      },
    ],
    pdfs: [
      {
        id: 'dece-pdf-1',
        code: 'DECE Sample 1',
        title: 'DECE Assignment Solved Sample PDF #1',
        pagesCount: 28,
        fileSize: '2.4 MB',
        previewImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
        description: 'Verified IGNOU DECE assignment solved sample PDF #1 with accurate answers and guidelines.',
        pdfUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/preview',
        downloadUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/view?usp=sharing',
      },
      {
        id: 'dece-pdf-2',
        code: 'DECE Sample 2',
        title: 'DECE Assignment Solved Sample PDF #2',
        pagesCount: 32,
        fileSize: '2.8 MB',
        previewImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop',
        description: 'Verified IGNOU DECE assignment solved sample PDF #2 with complete handwritten format and references.',
        pdfUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/preview',
        downloadUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/view?usp=sharing',
      },
    ],
  },
  dece_proj: {
    id: 'dece_proj',
    label: 'DECE Project',
    title: 'DECE-4 Internship Project File & Synopsis Hub',
    subtitle: 'Complete customized DECE-4 Project Work File & Synopsis with Guide Approval, School Observation Logs & Activity Reports.',
    priceTag: 'Cash on Delivery (COD) Available',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE-4 Internship Project File & Synopsis.',
    reels: [
      {
        id: 'dece-proj-reel-1',
        title: 'DECE-4 Internship Project File Hardcover Unboxing & Review',
        duration: '1:05',
        views: '25.3k',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Full unboxing of hardcover DECE-4 final project report binder with all 30 activity plans attached.',
      },
      {
        id: 'dece-proj-reel-2',
        title: 'DECE-4 Project Synopsis Approval Letter & Guide CV Reel',
        duration: '0:50',
        views: '19.2k',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Demonstrating valid Guide Resume, Qualification Certificate, and signed Annexure forms for 100% approval.',
      },
      {
        id: 'dece-proj-reel-3',
        title: 'DECE-04 Working Guide & Annexures Filling Video Guide',
        duration: '1:15',
        views: '18.7k',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Step-by-step video on how Annexure 1, 2, 3, and school principal stamp signatures are arranged.',
      },
      {
        id: 'dece-proj-reel-4',
        title: 'DECE Project 100% IGNOU HQ Approval Guarantee Explanation',
        duration: '0:48',
        views: '32.1k',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Explaining our 100% money-back or free revision guarantee if IGNOU Maidan Garhi requests any edits.',
      },
      {
        id: 'dece-proj-reel-5',
        title: 'DECE Project Report 30 Days Activity Plan Execution Reel',
        duration: '1:22',
        views: '35.8k',
        thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'A close look at day-by-day preschool activity logs, child reaction charts, and teacher comments.',
      },
    ],
    pdfs: [
      {
        id: 'dece-proj-pdf-2',
        code: 'DECE Project 1',
        title: 'DECE-4 Internship Project Report Sample PDF #1',
        pagesCount: 18,
        fileSize: '1.9 MB',
        previewImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop',
        description: 'Approved DECE-4 synopsis proposal copy with objective statements and activity schedule.',
        pdfUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/preview',
        downloadUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/view?usp=sharing',
      },
      {
        id: 'dece-proj-pdf-1',
        code: 'DECE Project 2',
        title: 'DECE-4 Internship Project Report Sample PDF #2',
        pagesCount: 85,
        fileSize: '8.5 MB',
        previewImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
        description: 'Full sample of DECE-4 project file including Phase 1, Phase 2, and Phase 3 activities.',
        pdfUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/preview',
        downloadUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/view?usp=sharing',
      },
    ],
  },
  ba_hw: {
    id: 'ba_hw',
    label: 'BA Assignment',
    title: 'BA / BAG / BCOMG / BSCG Solved & Handwritten Assignment Hub',
    subtitle: 'High quality solved PDF and neat handwritten assignments for BAG, BCOMG, BSCG, and all Bachelor Degree courses.',
    priceTag: 'Cash on Delivery (COD) Available',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order BA / BAG / BCOMG Handwritten Assignments.',
    reels: [
      {
        id: 'ba-reel-1',
        title: 'BEVAE-181 Environmental Studies Handwritten Assignment Reel',
        duration: '0:42',
        views: '18.2k',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Neatly written BEVAE-181 assignment on A4 foolscap sheets with high-contrast pen and clear diagrams.',
      },
      {
        id: 'ba-reel-2',
        title: 'BSOC-131 Introduction to Sociology Neat Handwriting Reel',
        duration: '0:48',
        views: '14.6k',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'English medium BSOC-131 assignment showing proper margins, subheadings, and references.',
      },
      {
        id: 'ba-reel-3',
        title: 'BHDLA-135 Hindi Bhasha Vividh Prayog Assignment Reel',
        duration: '0:55',
        views: '15.9k',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Hindi medium BHDLA-135 handwritten assignment sample with beautiful handwriting and zero errors.',
      },
      {
        id: 'ba-reel-4',
        title: 'BCOC-131 Financial Accounting Solved Assignment Video',
        duration: '1:02',
        views: '12.3k',
        thumbnail: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Commerce BCOC-131 numerical balance sheet tables and neat ledger accounts handwriting.',
      },
      {
        id: 'ba-reel-5',
        title: 'BAG 1st & 2nd Year Complete Assignment SpeedPost Parcel Reel',
        duration: '0:50',
        views: '29.4k',
        thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Parcel packing of 8 subjects bundle for BAG 1st Year student with live tracking code.',
      },
    ],
    pdfs: [
      {
        id: 'ba-pdf-1',
        code: 'BA Sample 1',
        title: 'BA Assignment Solved Sample PDF #1',
        pagesCount: 26,
        fileSize: '2.1 MB',
        previewImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
        description: 'Official solved assignment PDF for BA / BAG with complete answers.',
        pdfUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/preview',
        downloadUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/view?usp=sharing',
      },
      {
        id: 'ba-pdf-2',
        code: 'BA Sample 2',
        title: 'BA Assignment Solved Sample PDF #2',
        pagesCount: 28,
        fileSize: '2.5 MB',
        previewImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop',
        description: 'BA / BAG solved assignment sample PDF formatted for 2025-2026 submission.',
        pdfUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/preview',
        downloadUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/view?usp=sharing',
      },
    ],
  },
  ma_hw: {
    id: 'ma_hw',
    label: 'MA Assignment',
    title: 'MA (MHD, MEG, MPS, MAH) & MBA Assignment & Project Hub',
    subtitle: 'Master Degree high-scoring handwritten assignments, solved PDFs, and synopsis files prepared by PhD subject scholars.',
    priceTag: 'Cash on Delivery (COD) Available',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order MA / Master Degree Handwritten Assignments.',
    reels: [
      {
        id: 'ma-reel-1',
        title: 'MHD-02 Adhunik Hindi Kavya Handwritten Assignment Video Reel',
        duration: '0:52',
        views: '17.8k',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Neatly handwritten MHD-02 assignment with beautiful Hindi calligraphic style and full word limit.',
      },
      {
        id: 'ma-reel-2',
        title: 'MEG-01 British Poetry MA English Assignment Writing Reel',
        duration: '0:46',
        views: '13.9k',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'MA English MEG-01 assignment written with high vocabulary and critical analysis for top grades.',
      },
      {
        id: 'ma-reel-3',
        title: 'MMPP-001 MBA Project Synopsis & Report Hardcover Reel',
        duration: '1:10',
        views: '24.1k',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'MBA Marketing / Finance project report hardcover binding and questionnaire sample.',
      },
      {
        id: 'ma-reel-4',
        title: 'MA Political Science / History Solved Assignment Unboxing',
        duration: '0:58',
        views: '19.3k',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Master Degree assignment bundle unboxing for MPS-001, MPS-002, and MAH history papers.',
      },
      {
        id: 'ma-reel-5',
        title: 'MA Degree 25-30 Pages A4 Foolscap Quality Inspection Reel',
        duration: '0:44',
        views: '21.0k',
        thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
        videoUrl: '', // 👈 Paste your YouTube or MP4 link here
        description: 'Quality inspection of page thickness, handwriting alignment, and study centre approval standards.',
      },
    ],
    pdfs: [
      {
        id: 'ma-pdf-1',
        code: 'MA Sample 1',
        title: 'MA Assignment Solved Sample PDF #1',
        pagesCount: 34,
        fileSize: '3.1 MB',
        previewImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
        description: 'Complete solved assignment PDF for Master degree courses with detailed answers.',
        pdfUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/preview',
        downloadUrl: 'https://drive.google.com/file/d/1wKewLHkrV3DTWGx_j1lButhYdI0ALIy1/view?usp=sharing',
      },
      {
        id: 'ma-pdf-2',
        code: 'MA Sample 2',
        title: 'MA Assignment Solved Sample PDF #2',
        pagesCount: 30,
        fileSize: '2.7 MB',
        previewImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop',
        description: 'Special MA English & Hindi sample solved assignment PDF for examination preparation.',
        pdfUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/preview',
        downloadUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/view?usp=sharing',
      },
    ],
  },
};

/**
 * =========================================================================
 * 🎬 INSTAGRAM-STYLE FULL DEMO REELS FEED DATA
 * -------------------------------------------------------------------------
 * These are the vertical reels displayed immediately when students visit
 * the website. Add your YouTube Shorts, YouTube Video, or MP4 links below!
 * =========================================================================
 */
export interface ReelFeedItem {
  id: string;
  category: 'all' | 'dece_proj' | 'dece_hw' | 'ba_hw' | 'ma_hw' | 'dispatch';
  categoryLabel: string;
  title: string;
  subjectCode: string;
  duration: string;
  views: string;
  likes: string;
  initialLikesCount: number;
  thumbnail: string;
  videoUrl: string; // 👈 PASTE YOUR YOUTUBE / SHORTS / MP4 LINK HERE
  description: string;
  badge: string;
  whatsappMessage: string;
}

export const REELS_FEED_ITEMS: ReelFeedItem[] = [
  {
    id: 'reel-dece-proj-1',
    category: 'dece_proj',
    categoryLabel: 'DECE Project',
    title: 'DECE-4 Internship Project File Hardcover Unboxing & Complete File Review',
    subjectCode: 'DECE-4 Project',
    duration: '1:05',
    views: '42.8k',
    likes: '3.6k',
    initialLikesCount: 3620,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop',
    videoUrl: 'https://om.gnkedu.online/storage/v1/object/public/chat-media/account-a599104c-f09e-4f9f-9bc9-fb78b1af4c3c/1790315652719-1.mp4',
    description: 'Full unboxing of hardcover DECE-4 project file binder with all 30 preschool activity plans, Annexure 1, 2, 3 and guide approval letter.',
    badge: '100% IGNOU Approved Format',
    whatsappMessage: 'Hi Guru Nanak Photostat, I saw DECE-4 Project File Reel (Video 1). Please send order details & sample.',
  },
  {
    id: 'reel-dece-proj-2',
    category: 'dece_proj',
    categoryLabel: 'DECE Project',
    title: 'DECE-4 Project Annexure Forms & Guide Verification Guide',
    subjectCode: 'DECE-4 Guide Docs',
    duration: '0:50',
    views: '35.4k',
    likes: '2.9k',
    initialLikesCount: 2940,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&auto=format&fit=crop',
    videoUrl: 'https://om.gnkedu.online/storage/v1/object/public/chat-media/account-a599104c-f09e-4f9f-9bc9-fb78b1af4c3c/1790315727403-2.mp4',
    description: 'Demonstrating valid Guide Resume, Qualification Certificate, and signed Annexure forms for 100% approval from Maidan Garhi.',
    badge: 'Guide Support Included',
    whatsappMessage: 'Hi Guru Nanak Photostat, I need DECE-4 Project Synopsis & Guide CV verification details (Video 2).',
  },
  {
    id: 'reel-dece-proj-3',
    category: 'dece_proj',
    categoryLabel: 'DECE Project',
    title: 'DECE-4 Preschool Activities & Observation Report 30 Days Execution',
    subjectCode: 'DECE-4 Activities',
    duration: '0:55',
    views: '31.2k',
    likes: '2.4k',
    initialLikesCount: 2410,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&auto=format&fit=crop',
    videoUrl: 'https://om.gnkedu.online/storage/v1/object/public/chat-media/account-a599104c-f09e-4f9f-9bc9-fb78b1af4c3c/1790315767861-3.mp4',
    description: 'Detailed inspection of all 30 daily activity plans with curriculum objectives, child observation logs, and supervisor grading.',
    badge: 'Complete 30 Activity Plans',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE-4 Project Work File with 30 activities (Video 3).',
  },
  {
    id: 'reel-dece-hw-1',
    category: 'dece_hw',
    categoryLabel: 'DECE Assignment',
    title: 'DECE (DECE-1, 2, 3) Complete 3-Subject Handwritten Set Real Copy Quality Check',
    subjectCode: 'DECE-1, 2, 3',
    duration: '0:58',
    views: '48.9k',
    likes: '4.2k',
    initialLikesCount: 4230,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&auto=format&fit=crop',
    videoUrl: 'https://om.gnkedu.online/storage/v1/object/public/chat-media/account-a599104c-f09e-4f9f-9bc9-fb78b1af4c3c/1790315787326-Em_smpl.mp4',
    description: 'Inspecting neat handwriting, margins, front page, and question paper for DECE 1st year assignment on clean A4 foolscap sheets.',
    badge: '100% Handwritten • PASS Guarantee',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE Handwritten Assignment Set DECE 1, 2, 3 (Video 4).',
  },
  {
    id: 'reel-dece-hw-2',
    category: 'dece_hw',
    categoryLabel: 'DECE Assignment',
    title: 'DECE Assignment Pen & Handwriting A4 Foolscap Real Copy Quality Reel',
    subjectCode: 'DECE Assignment',
    duration: '0:45',
    views: '27.6k',
    likes: '2.1k',
    initialLikesCount: 2180,
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=900&auto=format&fit=crop',
    videoUrl: 'https://om.gnkedu.online/storage/v1/object/public/chat-media/account-a599104c-f09e-4f9f-9bc9-fb78b1af4c3c/1790315839141-Video2.mp4',
    description: 'Clear calligraphy handwriting sample with blue and black pens, proper page numbering, and zero overwriting.',
    badge: 'Neat Pen Work & Margins',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE Handwritten Assignment (Video 5).',
  },
  {
    id: 'reel-dece-dispatch-1',
    category: 'dece_proj',
    categoryLabel: 'DECE Project & Dispatch',
    title: 'DECE Student Project & Assignment Parcel Packing & SpeedPost Dispatch Proof',
    subjectCode: 'All India Delivery',
    duration: '0:40',
    views: '52.1k',
    likes: '5.3k',
    initialLikesCount: 5320,
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop',
    videoUrl: 'https://om.gnkedu.online/storage/v1/object/public/chat-media/account-a599104c-f09e-4f9f-9bc9-fb78b1af4c3c/1790315865991-Vido1.mp4',
    description: 'Live packaging, waterproof bubble wrap sealing, and SpeedPost/Delhivery courier dispatch process with tracking slips.',
    badge: 'Cash on Delivery Available',
    whatsappMessage: 'Hi Guru Nanak Photostat, I want to know about DECE delivery and Cash on Delivery to my pin code (Video 6).',
  },
];

