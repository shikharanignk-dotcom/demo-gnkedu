import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Info
} from 'lucide-react';
import { REELS_FEED_ITEMS, ReelFeedItem, getYouTubeEmbedUrl } from '../data/showcaseData';

interface ReelsHeroFeedProps {
  onWhatsAppClick: (customMsg?: string, isOrder?: boolean) => void;
  onExploreWebsite: () => void;
}

export const ReelsHeroFeed: React.FC<ReelsHeroFeedProps> = ({
  onWhatsAppClick,
  onExploreWebsite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [showEndCard, setShowEndCard] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter reels by selected category
  const filteredReels = selectedCategory === 'all'
    ? REELS_FEED_ITEMS
    : REELS_FEED_ITEMS.filter((item) => item.category === selectedCategory);

  const activeReel: ReelFeedItem = filteredReels[currentReelIndex] || filteredReels[0] || REELS_FEED_ITEMS[0];

  // Initialize likes count map
  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    REELS_FEED_ITEMS.forEach((item) => {
      initialLikes[item.id] = item.initialLikesCount || 1200;
    });
    setLikesCounts(initialLikes);
  }, []);

  // Reset to first reel on category change
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentReelIndex(0);
    setShowEndCard(false);
    setIsPlaying(true);
  };

  // Navigate to Next Reel
  const handleNextReel = () => {
    if (currentReelIndex < filteredReels.length - 1) {
      setCurrentReelIndex((prev) => prev + 1);
      setShowEndCard(false);
      setIsPlaying(true);
    } else {
      setShowEndCard(true);
    }
  };

  // Navigate to Previous Reel
  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex((prev) => prev - 1);
      setShowEndCard(false);
      setIsPlaying(true);
    }
  };

  // Handle Like Toggle
  const handleToggleLike = (reelId: string) => {
    const isLiked = likedReels[reelId];
    setLikedReels((prev) => ({ ...prev, [reelId]: !isLiked }));
    setLikesCounts((prev) => ({
      ...prev,
      [reelId]: (prev[reelId] || 1000) + (isLiked ? -1 : 1),
    }));
  };

  // Handle Share / Copy Link
  const handleShare = (reel: ReelFeedItem) => {
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        text: `Check out this IGNOU demo work by Guru Nanak Photostat: ${reel.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        handlePrevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, filteredReels.length]);

  // Touch Swipe navigation for mobile
  const touchStartY = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (diff > 50) {
      handleNextReel(); // Swiped Up -> Next Reel
    } else if (diff < -50) {
      handlePrevReel(); // Swiped Down -> Prev Reel
    }
  };

  const categories = [
    { id: 'all', label: '🔥 All Reels' },
    { id: 'dece_proj', label: '📁 DECE Project' },
    { id: 'dece_hw', label: '📘 DECE Assignment' },
    { id: 'ba_hw', label: '✍️ BA / BCOM' },
    { id: 'ma_hw', label: '🎓 MA / MBA' },
    { id: 'dispatch', label: '📦 Live Dispatch' },
  ];

  const youtubeEmbedUrl = getYouTubeEmbedUrl(activeReel.videoUrl);

  return (
    <div
      id="reels-feed"
      ref={containerRef}
      className="relative bg-slate-950 text-white min-h-[92vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden select-none border-b border-slate-800"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================= */}
      {/* 1. TOP BAR: Category Pills + Skip to Website CTA */}
      {/* ========================================================= */}
      <div className="z-30 px-3 sm:px-6 pt-3 pb-2 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          
          {/* Live Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
              Live Work Demos
            </span>
          </div>

          {/* Quick Exit: Skip to Website (Guarantees customer is never trapped) */}
          <button
            onClick={onExploreWebsite}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-[#FF7A00] text-white hover:text-white px-3 py-1.5 rounded-full text-xs font-black backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95 shrink-0 group"
          >
            <span>Skip to Full Website</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="max-w-5xl mx-auto mt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A66C2] text-white shadow-md ring-2 ring-blue-400/40 scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN REELS STAGE (Centered Vertical 9:16 Video Player) */}
      {/* ========================================================= */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative">
        
        {/* Main Phone-style Reel Card Frame */}
        <div className="relative w-full max-w-[420px] h-[72vh] sm:h-[75vh] max-h-[760px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
          
          {/* Top Segmented Story Progress Bar */}
          <div className="absolute top-2.5 left-3 right-3 z-30 flex gap-1">
            {filteredReels.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-xs"
              >
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    idx < currentReelIndex
                      ? 'w-full bg-red-500'
                      : idx === currentReelIndex
                      ? 'w-full bg-amber-400'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Reel Counter Badge (e.g. "Reel 2 of 7") */}
          <div className="absolute top-5 left-3.5 z-30 flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/15">
              {currentReelIndex + 1} / {filteredReels.length}
            </span>
            <span className="bg-[#0A66C2]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              {activeReel.categoryLabel}
            </span>
          </div>

          {/* Mute / Unmute Floating Quick Toggle on top-right */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-5 right-3.5 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* ===================================================== */}
          {/* VIDEO / EMBED / THUMBNAIL DISPLAY */}
          {/* ===================================================== */}
          {activeReel.videoUrl ? (
            youtubeEmbedUrl ? (
              // YouTube / YouTube Shorts Embed
              <iframe
                key={activeReel.id}
                src={`${youtubeEmbedUrl}&mute=${isMuted ? 1 : 0}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // Direct MP4 Video Player
              <video
                ref={videoRef}
                key={activeReel.id}
                src={activeReel.videoUrl}
                poster={activeReel.thumbnail}
                playsInline
                autoPlay
                muted={isMuted}
                loop
                className="w-full h-full object-cover"
              />
            )
          ) : (
            // High-Res Demo Thumbnail with Aesthetic Placeholder
            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
              <img
                src={activeReel.thumbnail}
                alt={activeReel.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl mb-3 ring-4 ring-white/20 animate-pulse">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider mb-1">
                  Video Demo Ready To Link
                </span>
                <p className="text-white font-black text-sm sm:text-base leading-snug drop-shadow-md">
                  {activeReel.title}
                </p>
                <p className="text-slate-300 text-xs mt-1 max-w-xs drop-shadow">
                  Paste your YouTube Shorts or Video link to play live here!
                </p>
              </div>
            </div>
          )}

          {/* Dark Bottom Gradient for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/95 pointer-events-none z-10" />

          {/* ===================================================== */}
          {/* FLOATING ACTION STACK (Right Side like Instagram) */}
          {/* ===================================================== */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-3.5">
            
            {/* WhatsApp Quick Order Direct Button */}
            <button
              onClick={() => onWhatsAppClick(activeReel.whatsappMessage, true)}
              className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-white/40 group relative"
              title="Order this Demo on WhatsApp"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </button>
            <span className="text-[9.5px] font-black text-emerald-400 -mt-2">Order</span>

            {/* Like Button */}
            <button
              onClick={() => handleToggleLike(activeReel.id)}
              className="w-11 h-11 rounded-full bg-slate-900/80 hover:bg-red-600/90 text-white flex items-center justify-center backdrop-blur-md border border-white/15 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Like this demo"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  likedReels[activeReel.id] ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </button>
            <span className="text-[10px] font-bold text-slate-200 -mt-2">
              {likesCounts[activeReel.id]
                ? (likesCounts[activeReel.id] / 1000).toFixed(1) + 'k'
                : activeReel.likes}
            </span>

            {/* Share / Copy Button */}
            <button
              onClick={() => handleShare(activeReel)}
              className="w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-600/90 text-white flex items-center justify-center backdrop-blur-md border border-white/15 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Share Reel"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-slate-200 -mt-2">Share</span>
          </div>

          {/* ===================================================== */}
          {/* BOTTOM REEL INFO OVERLAY */}
          {/* ===================================================== */}
          <div className="absolute bottom-3 left-3 right-16 z-20 text-left pointer-events-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5 backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{activeReel.badge}</span>
            </div>

            {/* Title */}
            <h3 className="text-white text-xs sm:text-sm font-black leading-snug line-clamp-2 drop-shadow-md">
              {activeReel.title}
            </h3>

            {/* Description */}
            <p className="text-slate-300 text-[11px] leading-tight line-clamp-2 mt-1 drop-shadow-xs">
              {activeReel.description}
            </p>

            {/* WhatsApp CTA Bar */}
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => onWhatsAppClick(activeReel.whatsappMessage, true)}
                className="bg-[#FF7A00] hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Book This Work</span>
              </button>

              <button
                onClick={onExploreWebsite}
                className="bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-xs font-extrabold backdrop-blur-md border border-white/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Details & Pricing</span>
              </button>
            </div>
          </div>

          {/* ===================================================== */}
          {/* END OF REELS POPUP MODAL (When user finishes all reels) */}
          {/* ===================================================== */}
          {showEndCard && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-xl mb-3">
                🎉
              </div>
              <h4 className="text-lg font-black text-white">
                You've Checked All Demos!
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                Explore our full course catalog, sample solved PDFs, pass guarantee, and student reviews on the website.
              </p>

              <div className="mt-5 w-full flex flex-col gap-2.5">
                <button
                  onClick={onExploreWebsite}
                  className="w-full bg-[#0A66C2] hover:bg-blue-600 text-white font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>Explore Full Website & Price List</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentReelIndex(0);
                    setShowEndCard(false);
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-slate-300 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <span>Watch Reels Again</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ===================================================== */}
        {/* DESKTOP SIDE NAVIGATION CONTROLS (Up & Down Arrows) */}
        {/* ===================================================== */}
        <div className="hidden sm:flex flex-col gap-3 ml-4">
          <button
            onClick={handlePrevReel}
            disabled={currentReelIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer ${
              currentReelIndex === 0
                ? 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900/80 hover:bg-[#0A66C2] text-white hover:scale-110 active:scale-95'
            }`}
            title="Previous Reel (or Arrow Up)"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextReel}
            className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Next Reel (or Arrow Down)"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM FLOATING BAR: Next Swipe Guide + Explore Website */}
      {/* ========================================================= */}
      <div className="z-30 px-4 py-2.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between max-w-5xl mx-auto w-full">
        {/* Left: Reel count info */}
        <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Swipe up or tap arrows for next reel</span>
        </div>

        {/* Right: Scroll to Full Website */}
        <button
          onClick={onExploreWebsite}
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-black tracking-wide transition-colors cursor-pointer group"
        >
          <span>Explore All Courses Below</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Copy Toast Feedback */}
      {copiedToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Reel link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
