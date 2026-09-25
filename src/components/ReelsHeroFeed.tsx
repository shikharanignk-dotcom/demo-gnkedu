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
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  Info,
  Maximize2
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
  const [showHeartPop, setShowHeartPop] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const lastTapRef = useRef<number>(0);

  // Filter reels by selected DECE category
  const filteredReels = selectedCategory === 'all'
    ? REELS_FEED_ITEMS
    : REELS_FEED_ITEMS.filter((item) => item.category === selectedCategory);

  const activeReel: ReelFeedItem = filteredReels[currentReelIndex] || filteredReels[0] || REELS_FEED_ITEMS[0];

  // Initialize likes count map
  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    REELS_FEED_ITEMS.forEach((item) => {
      initialLikes[item.id] = item.initialLikesCount || 3200;
    });
    setLikesCounts(initialLikes);
  }, []);

  // Control video playback when active reel or play state changes
  useEffect(() => {
    setVideoProgress(0);
    // Pause all other videos
    Object.keys(videoRefs.current).forEach((key) => {
      const idx = Number(key);
      const vid = videoRefs.current[idx];
      if (vid) {
        if (idx === currentReelIndex && isPlaying) {
          vid.currentTime = 0;
          vid.muted = isMuted;
          const p = vid.play();
          if (p !== undefined) {
            p.catch(() => {
              vid.muted = true;
              setIsMuted(true);
              vid.play().catch(() => {});
            });
          }
        } else {
          vid.pause();
        }
      }
    });
  }, [currentReelIndex, isPlaying]);

  // Sync mute state across videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid) vid.muted = isMuted;
    });
  }, [isMuted]);

  // Reset to first reel on category change
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentReelIndex(0);
    setShowEndCard(false);
    setIsPlaying(true);
    setVideoProgress(0);
  };

  // Navigate to Next Reel
  const handleNextReel = () => {
    if (currentReelIndex < filteredReels.length - 1) {
      setCurrentReelIndex((prev) => prev + 1);
      setShowEndCard(false);
      setIsPlaying(true);
      setVideoProgress(0);
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
      setVideoProgress(0);
    }
  };

  // Native Wheel Event listener with { passive: false } to PREVENT whole page from scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheelHandler = (e: WheelEvent) => {
      // Debounce rapid wheel turns
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 20) {
        // Scroll Down -> Next Reel
        if (currentReelIndex < filteredReels.length - 1) {
          e.preventDefault();
          isScrollingRef.current = true;
          handleNextReel();
          setTimeout(() => { isScrollingRef.current = false; }, 420);
        } else if (!showEndCard) {
          e.preventDefault();
          isScrollingRef.current = true;
          setShowEndCard(true);
          setTimeout(() => { isScrollingRef.current = false; }, 420);
        }
        // If showEndCard is already open, do not prevent default, allow scrolling to website
      } else if (e.deltaY < -20) {
        // Scroll Up -> Previous Reel
        if (showEndCard) {
          e.preventDefault();
          setShowEndCard(false);
        } else if (currentReelIndex > 0) {
          e.preventDefault();
          isScrollingRef.current = true;
          handlePrevReel();
          setTimeout(() => { isScrollingRef.current = false; }, 420);
        }
      }
    };

    el.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelHandler);
    };
  }, [currentReelIndex, filteredReels.length, showEndCard]);

  // Handle Like Toggle
  const handleToggleLike = (reelId: string) => {
    const isLiked = likedReels[reelId];
    setLikedReels((prev) => ({ ...prev, [reelId]: !isLiked }));
    setLikesCounts((prev) => ({
      ...prev,
      [reelId]: (prev[reelId] || 3000) + (isLiked ? -1 : 1),
    }));
  };

  // Handle Double Tap / Click on Video to Like
  const handleVideoAreaClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!likedReels[activeReel.id]) {
        handleToggleLike(activeReel.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    } else {
      setIsPlaying(!isPlaying);
    }
    lastTapRef.current = now;
  };

  // Handle Share / Copy Link
  const handleShare = (reel: ReelFeedItem) => {
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        text: `Check out this IGNOU DECE demo work by Guru Nanak Photostat: ${reel.title}`,
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
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, filteredReels.length]);

  // Touch Swipe navigation for mobile
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 35) {
      if (diffY > 0) {
        handleNextReel(); // Swiped Up -> Next Reel
      } else {
        handlePrevReel(); // Swiped Down -> Prev Reel
      }
    }
  };

  // 100% Focused on DECE
  const deceCategories = [
    { id: 'all', label: `🔥 All DECE Demos (${REELS_FEED_ITEMS.length})` },
    { id: 'dece_proj', label: '📁 DECE-4 Project Files' },
    { id: 'dece_hw', label: '📘 DECE Assignments' },
  ];

  const youtubeEmbedUrl = getYouTubeEmbedUrl(activeReel.videoUrl);

  return (
    <div
      id="reels-feed"
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative bg-slate-950 text-white min-h-[92vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden select-none border-b border-slate-800"
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
              Live DECE Work Demos
            </span>
          </div>

          {/* Quick Exit: Skip to Website (Guarantees customer is never trapped) */}
          <button
            onClick={onExploreWebsite}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-[#FF7A00] text-white px-3 py-1.5 rounded-full text-xs font-black backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95 shrink-0 group"
          >
            <span>Skip to Full Website</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Category Filter Pills Bar (ONLY DECE) */}
        <div className="max-w-5xl mx-auto mt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {deceCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
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
        
        {/* Main Phone-style Reel Card Frame with Wheel & Touch Navigation */}
        <div
          onClick={handleVideoAreaClick}
          className="relative w-full max-w-[400px] h-[78vh] sm:h-[82vh] max-h-[820px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center cursor-pointer group select-none"
        >
          
          {/* Top Segmented Story Progress Bar */}
          <div className="absolute top-2.5 left-3 right-3 z-30 flex gap-1 pointer-events-none">
            {filteredReels.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-xs"
              >
                <div
                  className={`h-full transition-all duration-100 ease-linear rounded-full ${
                    idx < currentReelIndex
                      ? 'w-full bg-red-500'
                      : idx === currentReelIndex
                      ? 'bg-amber-400'
                      : 'w-0'
                  }`}
                  style={{
                    width: idx < currentReelIndex ? '100%' : idx === currentReelIndex ? `${videoProgress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Reel Counter Badge (e.g. "Reel 2 of 6") */}
          <div className="absolute top-5 left-3.5 z-30 flex items-center gap-2 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/15">
              {currentReelIndex + 1} / {filteredReels.length}
            </span>
            <span className="bg-[#0A66C2]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              {activeReel.categoryLabel}
            </span>
          </div>

          {/* Mute / Unmute Floating Quick Toggle on top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (videoRefs.current[currentReelIndex]) {
                videoRefs.current[currentReelIndex]!.muted = nextMuted;
              }
            }}
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
          {/* VERTICAL SLIDING REEL TRACK (Instagram / TikTok Style) */}
          {/* ===================================================== */}
          <div
            className="w-full h-full transition-transform duration-500 ease-out flex flex-col"
            style={{ transform: `translateY(-${currentReelIndex * 100}%)` }}
          >
            {filteredReels.map((reel, idx) => {
              const isCurrent = idx === currentReelIndex;
              const isNearby = Math.abs(idx - currentReelIndex) <= 1;
              const ytEmbed = getYouTubeEmbedUrl(reel.videoUrl);

              return (
                <div
                  key={reel.id}
                  className="w-full h-full shrink-0 relative bg-black flex items-center justify-center overflow-hidden"
                >
                  {reel.videoUrl ? (
                    ytEmbed ? (
                      <iframe
                        src={isCurrent ? `${ytEmbed}&mute=${isMuted ? 1 : 0}` : ''}
                        className="w-full h-full border-0 pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : isNearby ? (
                      <video
                        ref={(el) => { videoRefs.current[idx] = el; }}
                        src={reel.videoUrl}
                        preload={isCurrent ? 'auto' : 'metadata'}
                        playsInline
                        muted={isMuted}
                        loop
                        onTimeUpdate={() => {
                          if (isCurrent && videoRefs.current[idx]?.duration) {
                            setVideoProgress(
                              (videoRefs.current[idx]!.currentTime / videoRefs.current[idx]!.duration) * 100
                            );
                          }
                        }}
                        onEnded={() => {
                          if (isCurrent) handleNextReel();
                        }}
                        className="w-full h-full object-cover bg-black"
                      />
                    ) : (
                      <div className="w-full h-full bg-black" />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                      <Play className="w-10 h-10 text-white/40 mb-2" />
                      <p className="text-white text-xs font-bold">{reel.title}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Double-Tap Heart Animation Overlay */}
          {showHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-in zoom-in-50 fade-in duration-300">
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl animate-bounce" />
            </div>
          )}

          {/* Play / Pause Center Icon Overlay (when paused) */}
          {!isPlaying && !youtubeEmbedUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/30">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/30">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Subtle Bottom Vignette (Only bottom 28% of video, not blocking the middle) */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10" />

          {/* ===================================================== */}
          {/* FLOATING ACTION STACK (Right Side like Instagram) */}
          {/* ===================================================== */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-2.5 bottom-16 z-20 flex flex-col items-center gap-3 pointer-events-auto"
          >
            {/* WhatsApp Quick Order Direct Button */}
            <button
              onClick={() => onWhatsAppClick(activeReel.whatsappMessage, true)}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-white/40 group relative"
              title="Order this Demo on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </button>
            <span className="text-[9px] font-black text-emerald-400 -mt-2 drop-shadow">Order</span>

            {/* Like Button */}
            <button
              onClick={() => handleToggleLike(activeReel.id)}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Like this demo"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  likedReels[activeReel.id] ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </button>
            <span className="text-[9.5px] font-bold text-slate-200 -mt-2 drop-shadow">
              {likesCounts[activeReel.id]
                ? (likesCounts[activeReel.id] / 1000).toFixed(1) + 'k'
                : activeReel.likes}
            </span>

            {/* Share / Copy Button */}
            <button
              onClick={() => handleShare(activeReel)}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Share Reel"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <span className="text-[9px] font-bold text-slate-200 -mt-2 drop-shadow">Share</span>
          </div>

          {/* ===================================================== */}
          {/* COMPACT BOTTOM REEL INFO OVERLAY (NON-OBSTRUCTIVE) */}
          {/* ===================================================== */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2.5 left-3 right-16 z-20 text-left pointer-events-auto"
          >
            {/* Subject Code + Trust Badge on single line */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-[#0A66C2]/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                {activeReel.subjectCode}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[9.5px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                <span>{activeReel.badge}</span>
              </span>
            </div>

            {/* Title (Single line, crisp font, no big text block) */}
            <h3 className="text-white text-xs sm:text-sm font-bold leading-snug line-clamp-1 drop-shadow-md">
              {activeReel.title}
            </h3>

            {/* Description (Single line compact) */}
            <p className="text-slate-300 text-[10.5px] leading-tight line-clamp-1 mt-0.5 opacity-90 drop-shadow-xs">
              {activeReel.description}
            </p>

            {/* WhatsApp & Website Quick CTA Row */}
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => onWhatsAppClick(activeReel.whatsappMessage, true)}
                className="bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order via WhatsApp (COD)</span>
              </button>

              <button
                onClick={onExploreWebsite}
                className="bg-white/15 hover:bg-white/25 text-white/90 px-2.5 py-1.5 rounded-lg text-[11px] font-bold backdrop-blur-md border border-white/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Website Info</span>
              </button>
            </div>
          </div>

          {/* ===================================================== */}
          {/* END OF REELS POPUP MODAL (When user finishes all reels) */}
          {/* ===================================================== */}
          {showEndCard && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-xl mb-3">
                🎉
              </div>
              <h4 className="text-lg font-black text-white">
                You've Checked All DECE Demos!
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
                    setVideoProgress(0);
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
            title="Previous Reel (or Scroll Up / Arrow Up)"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextReel}
            className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Next Reel (or Scroll Down / Arrow Down)"
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
          <span>Scroll mouse wheel or swipe up for next reel</span>
        </div>

        {/* Right: Scroll to Full Website */}
        <button
          onClick={onExploreWebsite}
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-black tracking-wide transition-colors cursor-pointer group"
        >
          <span>Explore All DECE Courses Below</span>
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
