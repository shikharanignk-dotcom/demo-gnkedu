"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Lock, ShoppingCart, ZoomIn, X, BookOpen } from "lucide-react";

interface FlipbookProps {
  images: string[];
  pdfName: string;
  whatsappLink: string;
  maxPreviews?: number;
}

export function Flipbook({ images, pdfName, whatsappLink, maxPreviews = 5 }: FlipbookProps) {
  const visibleCount = Math.min(images.length, maxPreviews);
  const showLockSlide = images.length > maxPreviews;

  // Responsive state
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate spreads based on mobile vs desktop
  // spreads array element structure:
  // { left: string | null, right: string | null, isLock: boolean, pageNumText: string }
  const spreads = [];

  if (isMobile) {
    // Mobile: Single page slides (spiral binder on the left)
    for (let i = 0; i < visibleCount; i++) {
      spreads.push({
        left: images[i],
        right: null,
        isLock: false,
        pageNumText: `Page ${i + 1} / ${images.length}`
      });
    }
    if (showLockSlide) {
      spreads.push({
        left: null,
        right: null,
        isLock: true,
        pageNumText: "Locked"
      });
    }
  } else {
    // Desktop: Double page spreads (spiral binder in the center)
    // Spread 0: Left = null, Right = Page 1
    spreads.push({
      left: null,
      right: images[0] || null,
      isLock: false,
      pageNumText: `Page 1 / ${images.length}`
    });

    // Body spreads
    for (let i = 1; i < visibleCount; i += 2) {
      const leftPageNum = i + 1;
      const rightPageNum = i + 2;
      const hasRight = i + 1 < visibleCount;
      
      spreads.push({
        left: images[i] || null,
        right: images[i + 1] || null,
        isLock: false,
        pageNumText: hasRight 
          ? `Pages ${leftPageNum}-${rightPageNum} / ${images.length}`
          : `Page ${leftPageNum} / ${images.length}`
      });
    }

    if (showLockSlide) {
      spreads.push({
        left: null,
        right: null,
        isLock: true,
        pageNumText: "Locked"
      });
    }
  }

  const [currentSpread, setCurrentSpread] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll position with page state
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (!container) return;
    const width = container.clientWidth;
    if (width === 0) return;
    
    const spreadIndex = Math.round(container.scrollLeft / width);
    if (spreadIndex !== currentSpread && spreadIndex >= 0 && spreadIndex < spreads.length) {
      setCurrentSpread(spreadIndex);
    }
  };

  const goToSpread = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const width = container.clientWidth;
    container.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setCurrentSpread(index);
  }, []);

  const nextPage = useCallback(() => {
    if (currentSpread < spreads.length - 1) {
      goToSpread(currentSpread + 1);
    }
  }, [currentSpread, spreads.length, goToSpread]);

  const prevPage = useCallback(() => {
    if (currentSpread > 0) {
      goToSpread(currentSpread - 1);
    }
  }, [currentSpread, goToSpread]);

  // Reset page index on switch between mobile & desktop views to prevent out of bounds
  useEffect(() => {
    setCurrentSpread(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [isMobile]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextPage();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevPage();
      if (e.key === "Escape") {
        setIsZoomed(false);
        setZoomedImg(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextPage, prevPage]);

  const handleImgError = (url: string) => {
    setImgErrors(prev => new Set(prev).add(url));
  };

  const activeSpread = spreads[currentSpread];

  return (
    <div className="w-full flex flex-col items-center select-none max-w-2xl mx-auto">
      {/* Header Bar */}
      <div className="w-full bg-[#1a1a2e] text-white px-4 py-2.5 rounded-t-2xl flex justify-between items-center text-[10px] font-bold tracking-wider border-b border-white/5">
        <span className="truncate max-w-[55%] opacity-90">{pdfName}</span>
        <div className="flex items-center gap-2">
          <span className="text-white/50 font-mono">
            {activeSpread?.pageNumText}
          </span>
        </div>
      </div>

      {/* Main book frame wrapper */}
      <div className="relative w-full bg-slate-900 p-3 pb-4 shadow-2xl border-x border-[#1a1a2e]/30">
        
        {/* Paper stack depth effect */}
        <div className="absolute bottom-2.5 right-6 left-6 h-1 bg-white border border-slate-200 shadow rounded z-0" />
        <div className="absolute bottom-1 right-8 left-8 h-1 bg-white/80 border border-slate-200/50 shadow rounded z-0" />

        {/* Outer binding cover background overlay */}
        <div className="absolute inset-2 bg-gradient-to-r from-amber-900 via-orange-950 to-amber-900 rounded-lg shadow-inner opacity-40 pointer-events-none z-0" />

        {/* 1. MOBILE STYLE: Left bound single page */}
        {isMobile && (
          <div className="absolute top-0 bottom-0 left-3 w-7 z-20 pointer-events-none flex flex-col justify-around py-5 bg-slate-900/5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-black/50 ml-1.5 shadow-inner" />
                <div className="h-2 w-5 bg-gradient-to-b from-slate-400 via-slate-100 to-slate-500 rounded-r-full shadow border-y border-r border-slate-350/50 -ml-0.5" />
              </div>
            ))}
          </div>
        )}

        {/* 2. DESKTOP STYLE: Center split spiral binding */}
        {!isMobile && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 z-25 pointer-events-none flex flex-col justify-around py-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center w-full">
                <div className="w-1 h-1 rounded-full bg-black/70 shadow-inner" />
                <div className="h-1.5 w-6 bg-gradient-to-r from-slate-400 via-white to-slate-500 rounded-full shadow border border-slate-400/50 transform -rotate-12" />
                <div className="w-1 h-1 rounded-full bg-black/70 shadow-inner" />
              </div>
            ))}
          </div>
        )}

        {/* Scroll snap horizontal container for pages */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`relative w-full overflow-x-auto flex snap-x snap-mandatory scroll-smooth scrollbar-none bg-slate-100/90 rounded-lg border border-slate-700 shadow-2xl z-10 ${
            isMobile ? "pl-7" : ""
          }`}
          style={{ minHeight: 330 }}
        >
          {spreads.map((spread, idx) => (
            <div
              key={idx}
              className={`w-full shrink-0 snap-center relative bg-white overflow-hidden ${
                isMobile ? "flex flex-col items-center justify-center p-3 pl-4" : "grid grid-cols-2"
              }`}
              style={{ minHeight: 330 }}
            >
              {/* DESKTOP Center Crease shadow */}
              {!isMobile && (
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/35 to-black/15 pointer-events-none z-20" />
              )}

              {/* MOBILE Left Seam shadow */}
              {isMobile && (
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-20" />
              )}

              {/* Watermarks */}
              <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center gap-12 opacity-[0.03] select-none">
                <div className="text-slate-900 text-xs font-extrabold uppercase tracking-[4px] rotate-[-25deg] whitespace-nowrap">
                  GNK PHOTOSTAT &bull; PREVIEW
                </div>
              </div>

              {/* ---------------- MOBILE RENDERING OR DESKTOP LEFT PAGE ---------------- */}
              <div className={`relative flex items-center justify-center bg-white ${
                isMobile ? "w-full h-full" : "border-r border-slate-200 p-2 pl-4 pr-3"
              }`}>
                {spread.isLock ? (
                  /* Lock slide view */
                  <div className="flex flex-col items-center justify-center p-4 text-center w-full z-30">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 mb-2 animate-bounce">
                      <Lock className="h-5 w-5" />
                    </div>
                    <h3 className="text-[10px] font-heading font-extrabold text-slate-900 uppercase tracking-wider mb-1">
                      Demo Locked
                    </h3>
                    <p className="text-[8px] text-slate-500 max-w-[150px] leading-relaxed mb-3">
                      Order the solved assignment to access all {images.length} pages.
                    </p>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#a15c00] hover:bg-[#854b00] text-white text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all shadow-md cursor-pointer"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>Order solved PDF</span>
                    </a>
                  </div>
                ) : spread.left ? (
                  !imgErrors.has(spread.left) ? (
                    <div className="relative w-full h-full flex items-center justify-center group/page">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={spread.left}
                        alt="Preview page"
                        className={`max-w-full object-contain shadow-sm cursor-zoom-in ${
                          isMobile ? "max-h-[300px]" : "max-h-[290px]"
                        }`}
                        onClick={() => { if (spread.left) { setZoomedImg(spread.left); setIsZoomed(true); } }}
                        onError={() => { if (spread.left) handleImgError(spread.left); }}
                      />
                      <button
                        onClick={() => { setZoomedImg(spread.left); setIsZoomed(true); }}
                        className="absolute bottom-2 left-2 p-1 rounded bg-black/40 text-white opacity-0 group-hover/page:opacity-100 transition-opacity cursor-pointer"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[8px] text-slate-400">Failed to load page</span>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-350">
                    <BookOpen className="h-7 w-7 opacity-40" />
                    <span className="text-[8px] font-bold uppercase tracking-wider mt-1 opacity-55">GNK PHOTOSTAT</span>
                  </div>
                )}
              </div>

              {/* ---------------- DESKTOP RIGHT PAGE (ONLY ON DESKTOP) ---------------- */}
              {!isMobile && (
                <div className="relative flex items-center justify-center bg-white p-2 pr-4 pl-3">
                  {spread.isLock ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center w-full z-30">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 mb-2 animate-bounce">
                        <Lock className="h-5 w-5" />
                      </div>
                      <h3 className="text-[10px] font-heading font-extrabold text-slate-900 uppercase tracking-wider mb-1">
                        Demo Locked
                      </h3>
                      <p className="text-[8px] text-slate-500 max-w-[140px] leading-relaxed mb-3">
                        Order the solved assignment to access all pages.
                      </p>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#a15c00] hover:bg-[#854b00] text-white text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all shadow-md cursor-pointer"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Order Now</span>
                      </a>
                    </div>
                  ) : spread.right ? (
                    !imgErrors.has(spread.right) ? (
                      <div className="relative w-full h-full flex items-center justify-center group/page">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={spread.right}
                          alt="Preview page right"
                          className="max-w-full max-h-[290px] object-contain shadow-sm cursor-zoom-in"
                          onClick={() => { if (spread.right) { setZoomedImg(spread.right); setIsZoomed(true); } }}
                          onError={() => { if (spread.right) handleImgError(spread.right); }}
                        />
                        <button
                          onClick={() => { setZoomedImg(spread.right); setIsZoomed(true); }}
                          className="absolute bottom-2 right-2 p-1 rounded bg-black/40 text-white opacity-0 group-hover/page:opacity-100 transition-opacity cursor-pointer"
                        >
                          <ZoomIn className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[8px] text-slate-400">Failed to load page</span>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-350">
                      <BookOpen className="h-7 w-7 opacity-40" />
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-1 opacity-55">GNK PHOTOSTAT</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Overlay Navigation Arrows placed left and right of the pages */}
        {currentSpread > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
        )}

        {currentSpread < spreads.length - 1 && (
          <button
            onClick={nextPage}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full bg-[#1a1a2e] rounded-b-2xl py-3 px-4 flex items-center justify-center border-t border-white/5">
        <div className="text-center">
          <span className="text-[10px] text-white/40 font-bold tracking-wider">
            {activeSpread?.isLock ? "Solved Copy Locked" : `${currentSpread + 1} / ${spreads.length}`}
          </span>
          {/* Dot navigation */}
          <div className="flex gap-2 mt-2 justify-center">
            {spreads.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSpread(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  i === currentSpread
                    ? "bg-amber-500 scale-125"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                title={`Page/Spread ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen Zoom Modal */}
      {isZoomed && zoomedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => { setIsZoomed(false); setZoomedImg(null); }}
        >
          <button
            onClick={() => { setIsZoomed(false); setZoomedImg(null); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 z-10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomedImg}
            alt="Zoomed preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
