import React, { useState, useEffect, useRef } from 'react';
import { Users, CheckCircle2, BookOpen, Tag, Clock, MessageCircle, Truck, Award, Sparkles, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  const highlights = [
    {
      icon: Users,
      title: '10,000+ Happy Students',
      desc: 'Trusted by thousands of IGNOU students across India for top grades and guaranteed submission approval.',
      badge: '10k+ Verified',
    },
    {
      icon: CheckCircle2,
      title: 'Verified Handwritten Material',
      desc: '100% genuine pen-written assignments on clean A4 foolscap sheets following official IGNOU guidelines.',
      badge: '100% Genuine',
    },
    {
      icon: BookOpen,
      title: 'Latest IGNOU Pattern',
      desc: 'Prepared according to July 2025 – Jan 2026 session question papers & official evaluation criteria.',
      badge: 'July 2025/Jan 2026',
    },
    {
      icon: Tag,
      title: 'Affordable Price',
      desc: 'Best student-friendly prices in India. Genuine handwritten assignments & ready DECE-4 project files with COD.',
      badge: 'Up to 80% OFF',
    },
    {
      icon: Clock,
      title: 'Same Day Dispatch',
      desc: 'SpeedPost & Courier orders prepared & dispatched within 24 hours with live tracking links.',
      badge: '⚡ 24h Express',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Order Support',
      desc: 'Instant 24×7 assistance on WhatsApp for subject inquiries, PDF previews, and parcel status.',
      badge: '24×7 Instant',
    },
    {
      icon: Truck,
      title: 'India Post & Delhivery Delivery',
      desc: 'Fast express courier delivery to every pincode in India with Cash on Delivery (COD) options.',
      badge: 'All India COD',
    },
    {
      icon: Award,
      title: 'Trusted Since Years',
      desc: 'Fatehabad (Haryana) premier IGNOU guidance hub with thousands of 5-star student reviews.',
      badge: '100% Approval',
    },
  ];

  // IntersectionObserver to detect if section is visible in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-swipe effect ONLY when section is visible
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % highlights.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, isVisible, highlights.length]);

  // Scroll to active index smooth
  useEffect(() => {
    if (scrollTrackRef.current && isVisible) {
      const container = scrollTrackRef.current;
      const activeCard = container.children[activeIndex] as HTMLElement;
      if (activeCard) {
        container.scrollTo({
          left: activeCard.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex, isVisible]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % highlights.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  return (
    <section ref={sectionRef} id="why-us" className="py-8 sm:py-12 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching StudentReviews style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-[#0A66C2] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0A66C2]" />
              Why Choose Us
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose Guru Nanak Photostat?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
              Fatehabad (Haryana) • 100% Genuine IGNOU Study Material & Assignment Hub
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Auto Play Toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              title={isPaused ? "Play Auto-swipe" : "Pause Auto-swipe"}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-600" />}
              <span className="hidden sm:inline">{isPaused ? 'Auto Swipe' : 'Pause'}</span>
            </button>

            {/* Carousel Nav Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0A66C2] hover:text-white transition-colors shadow-2xs cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0A66C2] hover:text-white transition-colors shadow-2xs cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Auto-Swiping Single Line Horizontal Carousel matching StudentReviews */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollTrackRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none pb-4 pt-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {highlights.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-[280px] sm:w-[340px] md:w-[360px] shrink-0 bg-white rounded-xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    index === activeIndex
                      ? 'border-blue-400 ring-2 ring-blue-400/20 shadow-md scale-[1.01]'
                      : 'border-slate-200/90 shadow-2xs hover:border-blue-300'
                  }`}
                >
                  <div>
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A66C2] to-blue-800 text-white flex items-center justify-center font-bold shadow-xs">
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-amber-600 font-extrabold text-xs tracking-wide flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                        ⭐ {item.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug mb-1.5">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};


