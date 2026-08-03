import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { FileText, Check, Sparkles, Eye, Download, ShieldCheck, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Heart, Play, Pause, Video, Film, ZoomIn, ZoomOut, Maximize2, MessageCircle, BookOpen, Volume2, VolumeX } from 'lucide-react';

interface ProductsSectionProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onWhatsAppClick: (msg: string) => void;
  onViewSamplePdf: (title: string, url?: string) => void;
  onDownloadSample?: (sample: any) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  searchQuery?: string;
}

interface VideoReelItem {
  id: string;
  title: string;
  duration: string;
  views: string;
  thumbnail: string;
  description: string;
  videoUrl?: string;
}

interface SamplePdfItem {
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

interface CategoryShowcaseData {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  priceTag: string;
  whatsappMessage: string;
  reels: VideoReelItem[];
  pdfs: SamplePdfItem[];
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onWhatsAppClick,
  onViewSamplePdf,
  onDownloadSample,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('dece_proj');

  // Per category active items
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [activePdfIndex, setActivePdfIndex] = useState<number>(0);
  const [isPlayingReel, setIsPlayingReel] = useState<boolean>(false);
  const [isMutedReel, setIsMutedReel] = useState<boolean>(true);
  const [reelProgress, setReelProgress] = useState<number>(0);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [pdfPageNum, setPdfPageNum] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [isPdfAutoFlipping, setIsPdfAutoFlipping] = useState<boolean>(true);
  const [isPageFlipping, setIsPageFlipping] = useState<boolean>(false);

  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const categoryTabs = [
    { id: 'dece_hw', label: '📘 DECE Assignment' },
    { id: 'dece_proj', label: '📁 DECE Project' },
    { id: 'ba_hw', label: '✍️ BA Assignment' },
    { id: 'ma_hw', label: '🎓 MA Assignment' },
  ];

  // Comprehensive data for 2 boxes in each category (5 Reels + 5 PDFs)
  const categoryShowcases: Record<string, CategoryShowcaseData> = {
    dece_hw: {
      id: 'dece_hw',
      label: 'DECE Assignment',
      title: 'DECE (DECE-1, DECE-2 & DECE-3) Handwritten Assignment Hub',
      subtitle: 'Complete 3-subject handwritten set on clean A4 foolscap sheets with neat black/blue pen according to official IGNOU guidelines.',
      priceTag: '₹300 Booking • ₹700 Cash on Delivery (COD)',
      whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE (DECE-1, DECE-2, DECE-3) Handwritten Assignment Set.',
      reels: [
        {
          id: 'dece-reel-3',
          title: 'DECE-3 Working With Children Handwritten Unboxing Reel',
          duration: '0:58',
          views: '16.5k',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746242/Assignemt_3_pp430m.mp4',
          description: 'Full unboxing video showing complete 25-30 pages per assignment written by experienced subject experts.',
        },
        {
          id: 'dece-reel-2',
          title: 'DECE-2 Child Services Pen & Handwriting Quality Check',
          duration: '0:52',
          views: '11.8k',
          thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745779/Assignemt_2_uh8g9y.mp4',
          description: 'Showing genuine pen-written answers on A4 foolscap pages with proper indexing & 100% IGNOU guidelines.',
        },
        {
          id: 'dece-reel-4',
          title: 'DECE 2025-26 Complete 3 Subject Handwritten Set Showcase',
          duration: '1:10',
          views: '22.1k',
          thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746263/Assignemt_4_v8gazc.mp4',
          description: 'All 3 subjects (DECE-1, DECE-2, DECE-3) neatly bound and packaged together with Cash on Delivery.',
        },
        {
          id: 'dece-reel-1',
          title: 'DECE-1 Early Childhood Care Handwritten Assignment Real Copy',
          duration: '0:45',
          views: '14.2k',
          thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745092/Assignemt_1_ths626.mp4',
          description: 'Inspecting neat handwriting, margins, page headings, and diagrammatic answers for DECE-1 assignment.',
        },
        {
          id: 'dece-reel-5',
          title: 'Guru Nanak Photostat DECE Student Parcel Dispatch Reel',
          duration: '0:38',
          views: '28.4k',
          thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746246/Assignemt_5_otznql.mp4',
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
      priceTag: '₹300 Booking • ₹1700 Cash on Delivery (COD)',
      whatsappMessage: 'Hi Guru Nanak Photostat, I want to order DECE-4 Internship Project File & Synopsis.',
      reels: [
        {
          id: 'dece-proj-reel-1',
          title: 'DECE-4 Internship Project File Hardcover Unboxing & Review',
          duration: '1:05',
          views: '25.3k',
          thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745041/Poject_1_xqb5fz.mp4',
          description: 'Full unboxing of hardcover DECE-4 final project report binder with all 30 activity plans attached.',
        },
        {
          id: 'dece-proj-reel-2',
          title: 'DECE-4 Project Synopsis Approval Letter & Guide CV Reel',
          duration: '0:50',
          views: '19.2k',
          thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745047/Poject_2_tecryq.mp4',
          description: 'Demonstrating valid Guide Resume, Qualification Certificate, and signed Annexure forms for 100% approval.',
        },
        {
          id: 'dece-proj-reel-3',
          title: 'DECE-04 Working Guide & Annexures Filling Video Guide',
          duration: '1:15',
          views: '18.7k',
          thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745045/Poject_3_iuhc0p.mp4',
          description: 'Step-by-step video on how Annexure 1, 2, 3, and school principal stamp signatures are arranged.',
        },
        {
          id: 'dece-proj-reel-4',
          title: 'DECE Project 100% IGNOU HQ Approval Guarantee Explanation',
          duration: '0:48',
          views: '32.1k',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745060/Poject_4_hbqep6.mp4',
          description: 'Explaining our 100% money-back or free revision guarantee if IGNOU Maidan Garhi requests any edits.',
        },
        {
          id: 'dece-proj-reel-5',
          title: 'DECE Project Report 30 Days Activity Plan Execution Reel',
          duration: '1:22',
          views: '35.8k',
          thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745042/Poject_5_m6ftfg.mp4',
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
      priceTag: '₹180 per Subject • Fast Home Delivery',
      whatsappMessage: 'Hi Guru Nanak Photostat, I want to order BA / BAG / BCOMG Handwritten Assignments.',
      reels: [
        {
          id: 'ba-reel-1',
          title: 'BEVAE-181 Environmental Studies Handwritten Assignment Reel',
          duration: '0:42',
          views: '18.2k',
          thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746263/Assignemt_4_v8gazc.mp4',
          description: 'Neatly written BEVAE-181 assignment on A4 foolscap sheets with high-contrast pen and clear diagrams.',
        },
        {
          id: 'ba-reel-2',
          title: 'BSOC-131 Introduction to Sociology Neat Handwriting Reel',
          duration: '0:48',
          views: '14.6k',
          thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746242/Assignemt_3_pp430m.mp4',
          description: 'English medium BSOC-131 assignment showing proper margins, subheadings, and references.',
        },
        {
          id: 'ba-reel-3',
          title: 'BHDLA-135 Hindi Bhasha Vividh Prayog Assignment Reel',
          duration: '0:55',
          views: '15.9k',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745779/Assignemt_2_uh8g9y.mp4',
          description: 'Hindi medium BHDLA-135 handwritten assignment sample with beautiful handwriting and zero errors.',
        },
        {
          id: 'ba-reel-4',
          title: 'BCOC-131 Financial Accounting Solved Assignment Video',
          duration: '1:02',
          views: '12.3k',
          thumbnail: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746246/Assignemt_5_otznql.mp4',
          description: 'Commerce BCOC-131 numerical balance sheet tables and neat ledger accounts handwriting.',
        },
        {
          id: 'ba-reel-5',
          title: 'BAG 1st & 2nd Year Complete Assignment SpeedPost Parcel Reel',
          duration: '0:50',
          views: '29.4k',
          thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745092/Assignemt_1_ths626.mp4',
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
      priceTag: '₹180 - ₹250 per Subject • Expert Writers',
      whatsappMessage: 'Hi Guru Nanak Photostat, I want to order MA / Master Degree Handwritten Assignments.',
      reels: [
        {
          id: 'ma-reel-1',
          title: 'MHD-02 Adhunik Hindi Kavya Handwritten Assignment Video Reel',
          duration: '0:52',
          views: '17.8k',
          thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746246/Assignemt_5_otznql.mp4',
          description: 'Neatly handwritten MHD-02 assignment with beautiful Hindi calligraphic style and full word limit.',
        },
        {
          id: 'ma-reel-2',
          title: 'MEG-01 British Poetry MA English Assignment Writing Reel',
          duration: '0:46',
          views: '13.9k',
          thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746242/Assignemt_3_pp430m.mp4',
          description: 'MA English MEG-01 assignment written with high vocabulary and critical analysis for top grades.',
        },
        {
          id: 'ma-reel-3',
          title: 'MMPP-001 MBA Project Synopsis & Report Hardcover Reel',
          duration: '1:10',
          views: '24.1k',
          thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745092/Assignemt_1_ths626.mp4',
          description: 'MBA Marketing / Finance project report hardcover binding and questionnaire sample.',
        },
        {
          id: 'ma-reel-4',
          title: 'MA Political Science / History Solved Assignment Unboxing',
          duration: '0:58',
          views: '19.3k',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785745779/Assignemt_2_uh8g9y.mp4',
          description: 'Master Degree assignment bundle unboxing for MPS-001, MPS-002, and MAH history papers.',
        },
        {
          id: 'ma-reel-5',
          title: 'MA Degree 25-30 Pages A4 Foolscap Quality Inspection Reel',
          duration: '0:44',
          views: '21.0k',
          thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
          videoUrl: 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785746263/Assignemt_4_v8gazc.mp4',
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
          description: 'Master degree solved assignment sample PDF formatted for 2025-2026 submission.',
          pdfUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/preview',
          downloadUrl: 'https://drive.google.com/file/d/1X25pYUqYEXdp_FirMcWRY0Z1Zj5xeyYg/view?usp=sharing',
        },
      ],
    },
  };

  const currentCategoryData = categoryShowcases[selectedCategory] || categoryShowcases['dece_hw'];
  const activeReel = currentCategoryData.reels[activeReelIndex] || currentCategoryData.reels[0];
  const activePdf = currentCategoryData.pdfs[activePdfIndex] || currentCategoryData.pdfs[0];

  // Auto scroll active tab into view & reset video player to autoplay first reel
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tab = activeTabRef.current;
      const targetLeft = tab.offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2);
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    }
    setActiveReelIndex(0);
    setActivePdfIndex(0);
    setIsPlayingReel(false);
    setPdfPageNum(1);
  }, [selectedCategory]);

  // Synchronize HTML5 video element playback with state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlayingReel) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlayingReel, activeReelIndex, selectedCategory]);

  // Instagram Reels Progress - Auto play & auto advance next video in 5-reel loop
  useEffect(() => {
    const currentReel = currentCategoryData?.reels[activeReelIndex];
    if (currentReel?.videoUrl) return; // Progress & advance handled directly by video events

    if (!isPlayingReel) {
      setReelProgress(0);
      return;
    }

    setReelProgress(0);
    const DURATION_MS = 6000; // 6 sec per video reel fallback
    const INTERVAL_MS = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += INTERVAL_MS;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setReelProgress(pct);

      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        setReelProgress(0);
        // Auto start next video reel in 5-reel circular loop
        setActiveReelIndex((prev) => {
          const totalReels = currentCategoryData?.reels?.length || 5;
          return (prev + 1) % totalReels;
        });
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPlayingReel, activeReelIndex, currentCategoryData?.reels]);

  // PDF Page Flip Timer - Auto flips every 2s with rich smooth page animation
  useEffect(() => {
    if (!isPdfAutoFlipping) return;

    const pdfTimer = setInterval(() => {
      setIsPageFlipping(true);

      setTimeout(() => {
        setPdfPageNum((prev) => {
          const totalPages = currentCategoryData?.pdfs[activePdfIndex]?.pagesCount || 20;
          if (prev < totalPages) {
            return prev + 1;
          } else {
            return 1;
          }
        });

        setTimeout(() => {
          setIsPageFlipping(false);
        }, 350);
      }, 250);

    }, 2000);

    return () => clearInterval(pdfTimer);
  }, [isPdfAutoFlipping, activePdfIndex, currentCategoryData?.pdfs]);

  const handleNextCategory = () => {
    const currentIndex = categoryTabs.findIndex((t) => t.id === selectedCategory);
    const nextIndex = (currentIndex + 1) % categoryTabs.length;
    setSelectedCategory(categoryTabs[nextIndex].id);
    setActiveReelIndex(0);
    setActivePdfIndex(0);
    setIsPlayingReel(false);
    setPdfPageNum(1);
  };

  const handlePrevCategory = () => {
    const currentIndex = categoryTabs.findIndex((t) => t.id === selectedCategory);
    const prevIndex = (currentIndex - 1 + categoryTabs.length) % categoryTabs.length;
    setSelectedCategory(categoryTabs[prevIndex].id);
    setActiveReelIndex(0);
    setActivePdfIndex(0);
    setIsPlayingReel(false);
    setPdfPageNum(1);
  };

  return (
    <section id="products" className="pt-[12px] pb-[22px] bg-slate-50 border-t border-slate-200 relative">
      <div id="free-samples" className="absolute -top-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified Section Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-amber-100 text-[#0A66C2] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-xs border border-blue-200/60">
            <Sparkles className="w-4 h-4 text-[#0A66C2]" />
            <span>Interactive Video Reels & Sample PDF Reader</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Centre Acceptance Guaranteed
            </span>
          </div>
        </div>

        {/* Category Selector Buttons - Sticky ONLY on mobile view (< md), static on desktop/PC */}
        <div className="sticky md:static top-[70px] sm:top-[80px] md:top-auto z-30 mb-6 max-w-2xl mx-auto p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-blue-200/90 shadow-lg text-center transition-all">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            {categoryTabs.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={isSelected ? activeTabRef : null}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setActiveReelIndex(0);
                    setActivePdfIndex(0);
                    setIsPlayingReel(false);
                    setPdfPageNum(1);
                  }}
                  className={`w-full h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-extrabold flex items-center justify-center text-center leading-tight tracking-tight transition-all cursor-pointer border shadow-xs ${
                    isSelected
                      ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-md ring-2 ring-blue-400/40 scale-[1.01]'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50/80 hover:border-blue-300 hover:text-[#0A66C2]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>



        {/* ---------------------------------------------------- */}
        {/* EXACTLY 2 BOXES GRID FOR ACTIVE CATEGORY */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* =================================================== */}
          {/* BOX 1: 🎥 VIDEO REELS DEMO BOX (5 VIDEO REELS) */}
          {/* =================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
            
            {/* Box Header */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-rose-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-bold shrink-0">
                  <Film className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Demo Video
                </h3>
              </div>
            </div>

            {/* Video Player Stage Area - Instagram Reels Style with Auto-Scroll */}
            <div className="relative aspect-[4/5] sm:aspect-video bg-slate-950 overflow-hidden flex items-center justify-center group select-none">
              
              {/* Instagram Top Segmented Progress Bar */}
              <div className="absolute top-2.5 left-3 right-3 z-20 flex gap-1.5">
                {currentCategoryData.reels.map((_, idx) => {
                  let widthStyle = '0%';
                  if (idx < activeReelIndex) widthStyle = '100%';
                  else if (idx === activeReelIndex) widthStyle = `${reelProgress}%`;

                  return (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs">
                      <div
                        className="h-full bg-red-500 transition-all duration-100 ease-linear rounded-full"
                        style={{ width: widthStyle }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Video Element or Background Thumbnail */}
              {activeReel.videoUrl ? (
                <video
                  ref={videoRef}
                  key={activeReel.id}
                  src={activeReel.videoUrl}
                  poster={activeReel.thumbnail}
                  playsInline
                  muted={isMutedReel}
                  onTimeUpdate={() => {
                    if (videoRef.current && videoRef.current.duration) {
                      setReelProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
                    }
                  }}
                  onEnded={() => {
                    setActiveReelIndex((prev) => (prev + 1) % currentCategoryData.reels.length);
                    setIsPlayingReel(false);
                  }}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isPlayingReel ? 'scale-105 filter brightness-95' : 'brightness-75 group-hover:scale-105'
                  }`}
                />
              ) : (
                <img
                  src={activeReel.thumbnail}
                  alt={activeReel.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isPlayingReel ? 'scale-105 filter brightness-90' : 'brightness-75 group-hover:scale-105'
                  }`}
                />
              )}

              {/* Instagram Video Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

              {/* Center Play / Pause Toggle Button */}
              <button
                onClick={() => setIsPlayingReel(!isPlayingReel)}
                className={`absolute z-10 w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-white/30 ${
                  isPlayingReel ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
                title={isPlayingReel ? 'Pause Reel' : 'Play Video Reel'}
              >
                {isPlayingReel ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>

              {/* Left Side Centered Navigation Control (Previous Video) */}
              <button
                onClick={() => {
                  setActiveReelIndex((prev) => (prev - 1 + currentCategoryData.reels.length) % currentCategoryData.reels.length);
                  setIsPlayingReel(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer group/nav"
                title="Previous Video"
              >
                <ChevronLeft className="w-6 h-6 group-hover/nav:-translate-x-0.5 transition-transform" />
              </button>

              {/* Right Side Centered Navigation Control (Next Video) */}
              <button
                onClick={() => {
                  setActiveReelIndex((prev) => (prev + 1) % currentCategoryData.reels.length);
                  setIsPlayingReel(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer group/nav"
                title="Next Video"
              >
                <ChevronRight className="w-6 h-6 group-hover/nav:translate-x-0.5 transition-transform" />
              </button>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-white text-center bg-slate-950/60 backdrop-blur-xs py-1 px-3 rounded-lg border border-white/10">
                <p className="text-white text-xs sm:text-sm font-black line-clamp-1 drop-shadow">
                  {activeReel.title}
                </p>
              </div>

            </div>

          </div>


          {/* =================================================== */}
          {/* BOX 2: 📄 SAMPLE PDF BOOK READER BOX (5 SAMPLE PDFs) */}
          {/* =================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
            
            {/* Box Header */}
            <div className="bg-gradient-to-r from-[#0A66C2] via-blue-700 to-indigo-800 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5 text-blue-200" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Demo PDF
                </h3>
              </div>
            </div>

            {/* 5 Sample PDFs Selector Tabs Bar */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {currentCategoryData.pdfs.map((pdf, idx) => {
                const isActive = activePdfIndex === idx;
                return (
                  <button
                    key={pdf.id}
                    onClick={() => {
                      setActivePdfIndex(idx);
                      setPdfPageNum(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#0A66C2] text-white shadow-xs font-extrabold'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{pdf.code}</span>
                  </button>
                );
              })}
            </div>

            {/* CLEAN UNCLUTTERED PDF READER STAGE AREA */}
            <div className="relative aspect-[4/5] sm:aspect-video bg-slate-900 p-2 sm:p-3 flex items-center justify-center overflow-hidden select-none group">
              {activePdf.pdfUrl ? (
                <iframe
                  src={activePdf.pdfUrl}
                  title={activePdf.title}
                  className="w-full h-full rounded-xl border-0 shadow-lg bg-white"
                  allow="autoplay"
                />
              ) : (
                /* SINGLE A4 PAPER WITH ENHANCED 3D PAGE FLIP ANIMATION */
                <div className="w-full h-full max-w-md mx-auto my-auto mt-2 mb-2 flex items-center justify-center perspective-1000">
                  <div 
                    className={`w-full h-full bg-[#fdfbf7] rounded-xl shadow-2xl border border-amber-200/90 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden text-slate-800 transition-all duration-500 ease-out transform-gpu ${
                      isPageFlipping 
                        ? '-rotate-y-30 -translate-x-12 scale-90 opacity-20 filter blur-[1px]' 
                        : 'rotate-y-0 translate-x-0 scale-100 opacity-100 blur-0'
                    }`}
                    style={{
                      boxShadow: isPageFlipping ? '0 5px 15px -5px rgba(0,0,0,0.1)' : '0 20px 35px -10px rgba(0,0,0,0.5)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Paper Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-12 z-0">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 text-center uppercase tracking-widest">
                        Guru Nanak Photostat Sample PDF
                      </span>
                    </div>

                    {/* Top Header of Page */}
                    <div className="relative z-10 border-b-2 border-blue-600/20 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                          {activePdf.code}
                        </span>
                        <span className="text-xs font-black text-slate-800 truncate max-w-[180px]">
                          {activePdf.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                        Page {pdfPageNum}
                      </span>
                    </div>

                    {/* Page Body Content based on Page Number */}
                    <div className="relative z-10 my-auto py-2 space-y-2 text-slate-800">
                      {pdfPageNum === 1 ? (
                        /* PAGE 1: COVER & OVERVIEW */
                        <div className="space-y-2">
                          <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-100">
                            <span className="text-[10px] font-extrabold text-blue-800 uppercase block mb-0.5">
                              Official IGNOU Solved Format
                            </span>
                            <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                              {activePdf.title} ({activePdf.code})
                            </h4>
                            <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {activePdf.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="bg-amber-50/90 p-2 rounded border border-amber-200">
                              <span className="font-extrabold text-amber-900 block">Total Pages:</span>
                              <span className="font-bold text-slate-700">{activePdf.pagesCount} Pages</span>
                            </div>
                            <div className="bg-emerald-50/90 p-2 rounded border border-emerald-200">
                              <span className="font-extrabold text-emerald-900 block">File Size:</span>
                              <span className="font-bold text-slate-700">{activePdf.fileSize}</span>
                            </div>
                          </div>

                          <div className="p-2 bg-emerald-100/70 rounded-lg border border-emerald-300 text-[10px] font-bold text-emerald-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>100% Hand-written & Verified Solution</span>
                          </div>
                        </div>
                      ) : (
                        /* PAGE 2+: SOLVED QUESTIONS PREVIEW */
                        <div className="space-y-2 font-mono text-[10px] sm:text-[11px] leading-relaxed bg-[linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:100%_20px] p-2 rounded">
                          <div className="bg-amber-100/80 p-2 rounded border border-amber-300/80">
                            <span className="font-black text-slate-900 block text-xs">
                              Q.{pdfPageNum - 1}: Solved Question Preview
                            </span>
                            <p className="text-slate-800 font-semibold mt-0.5">
                              Explain key principles, objectives, and solutions for {activePdf.code} assignment...
                            </p>
                          </div>

                          <div className="text-slate-700 italic space-y-1">
                            <p className="font-bold text-emerald-800 not-italic">
                              Ans: Handwritten Solution Page #{pdfPageNum}:
                            </p>
                            <p className="line-clamp-3">
                              Written on official A4 foolscap sheets with neat margins, accurate diagrams, proper referencing, and clean pen strokes as per IGNOU submission guidelines.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PAGE FLIP CORNER CURL */}
                    <button
                      onClick={() => {
                        setIsPageFlipping(true);
                        setTimeout(() => {
                          setPdfPageNum((prev) => (prev < activePdf.pagesCount ? prev + 1 : 1));
                          setIsPageFlipping(false);
                        }, 250);
                      }}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-amber-300 via-amber-200 to-transparent shadow-xl rounded-tl-2xl border-t border-l border-amber-400/80 cursor-pointer hover:w-12 hover:h-12 transition-all group/corner z-30 flex items-end justify-end p-1.5"
                      title="Click to Flip Page"
                    >
                      <ChevronRight className="w-4 h-4 text-amber-900 group-hover/corner:scale-125 transition-transform" />
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* CLEAN ACTION CONTROLS BELOW READER */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
              <button
                onClick={() => onViewSamplePdf(activePdf.title, activePdf.downloadUrl || activePdf.pdfUrl)}
                className="w-full bg-transparent hover:bg-blue-50/80 text-[#0A66C2] font-extrabold py-2.5 px-3 rounded-xl text-xs border border-blue-300/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Maximize2 className="w-4 h-4 text-[#0A66C2]" />
                Fullscreen PDF Reader
              </button>
            </div>

          </div>

        </div>

        {/* Footer Helpline Banner */}
        <div className="mt-10 bg-blue-900 text-white p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-blue-800 pt-[15px] pl-[18px]">
          <div>
            <h4 className="font-extrabold text-base text-white">Need a different IGNOU subject code assignment, project, or PDF?</h4>
            <p className="text-xs text-blue-200 mt-1">We have 500+ solved IGNOU subjects in Hindi & English ready for immediate dispatch.</p>
          </div>
          <button
            onClick={() => onWhatsAppClick('Hi Guru Nanak Photostat, I need help with a custom IGNOU subject code not listed in the main boxes.')}
            className="bg-[#FF7A00] hover:bg-orange-600 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow shrink-0 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
            <div className="text-center leading-tight">
              <span className="block font-black text-xs sm:text-sm">Inquire Any Subject Code</span>
              <span className="block text-[11px] font-bold text-orange-100 mt-0.5">(+91 95188 77939)</span>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
