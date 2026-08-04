import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageCircle, FileText, Search, Star, ShieldCheck, Sparkles, Award, ArrowRight, Download, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onWhatsAppClick: (subject?: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onWhatsAppClick, onSearchSubmit }) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'dece_hw' | 'dece_proj' | 'bevae'>('dece_hw');
  const [currentSlide, setCurrentSlide] = useState(0);

  const studentGallery = [
    {
      url: 'https://res.cloudinary.com/u1pgidk7/image/upload/v1785069576/1_pgamx2.png',
      title: 'Happy IGNOU Students with Handwritten Assignments',
      subtitle: '100% Genuine Blue & Black Pen Writing on A4 Foolscap Sheets',
      badge: '😊 10,000+ Happy Students'
    },
    {
      url: 'https://res.cloudinary.com/u1pgidk7/image/upload/v1785069571/3_gph45x.png',
      title: 'DECE-4 Project & Assignments Ready to Submit',
      subtitle: 'Fast SpeedPost Dispatch across India with Live Tracking',
      badge: '⭐ 100% Pass Approval'
    },
    {
      url: 'https://res.cloudinary.com/u1pgidk7/image/upload/v1785069571/3_gph45x.png',
      title: 'Top Grades Guaranteed in IGNOU Term-End Exams',
      subtitle: 'Written by Subject Experts following Official IGNOU Guidelines',
      badge: '🏆 Top Grades'
    }
  ];

  const mobileTopBanners = [
    'https://res.cloudinary.com/u1pgidk7/image/upload/v1785069576/1_pgamx2.png',
    'https://res.cloudinary.com/u1pgidk7/image/upload/v1785069571/3_gph45x.png',
    'https://res.cloudinary.com/u1pgidk7/image/upload/v1785069571/3_gph45x.png'
  ];
  const [mobileBannerIndex, setMobileBannerIndex] = useState(0);

  // Auto-swipe timer for mobile top banner
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setMobileBannerIndex((prev) => (prev + 1) % mobileTopBanners.length);
    }, 3000);
    return () => clearInterval(bannerTimer);
  }, [mobileTopBanners.length]);

  // Auto-swipe timer for 3 HD images (1280x720)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % studentGallery.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [studentGallery.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onSearchSubmit(heroSearch.trim());
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const highlights = [
    '100% Handwritten',
    'All IGNOU Courses Available',
    'Fast Delivery Across India',
    'Cash on Delivery Available',
    'Expert Writers',
    'WhatsApp Support',
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-5 pb-4 sm:pt-8 sm:pb-8 md:pt-12 md:pb-12">
      {/* Decorative background subtle gradients */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile-Only Auto-Changing Top Banner (Hidden on Desktop / Laptop) */}
        <div className="block md:hidden mb-5 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 group">
          <img
            src={mobileTopBanners[mobileBannerIndex]}
            alt={`Mobile Top Banner ${mobileBannerIndex + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover transition-all duration-700 hover:scale-105"
          />
          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center items-center gap-1.5 z-10">
            {mobileTopBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileBannerIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  mobileBannerIndex === idx ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
                title={`Banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-1.5 pr-4 rounded-full shadow-xs text-xs sm:text-sm font-semibold mb-[12px]">
              <span className="text-amber-500">⭐⭐⭐⭐⭐</span>
              <span>Trusted by 10,000+ Students Across India</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-[13px]">
              Complete Your <span className="text-[#0A66C2]">IGNOU Assignments</span> Without Stress
            </h1>

            {/* Sub Heading */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-[11px]">
              Get High-Quality Handwritten Assignments, Project Files, PDF Assignments, Notes, and Guess Papers for All IGNOU Programs.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-2 text-left max-w-2xl mx-auto lg:mx-0 w-[322.72px] pt-[17px]">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs / Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#free-samples"
                className="relative group overflow-hidden w-full sm:w-auto text-center bg-gradient-to-r from-[#0A66C2] via-blue-600 to-[#0A66C2] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/40 text-sm sm:text-base flex items-center justify-center gap-2.5 transform hover:-translate-y-1 hover:scale-105 active:scale-95 animate-bounce"
                style={{ animationDuration: '3s' }}
              >
                {/* Shimmer Light Effect */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                
                <FileText className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                <span className="tracking-wide">View Free Samples</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              </a>
            </div>

            {/* Quick Search Input */}
            <div className="pt-4 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-4 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter Subject Code (e.g. BEVAE-181, BSOC-131, DECE-04)"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full pl-11 pr-28 py-3.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] text-sm font-medium shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-[#0A66C2] hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Find Course
                </button>
              </form>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 justify-center lg:justify-start">
                <span className="font-semibold text-slate-600">Popular:</span>
                <button onClick={() => { setHeroSearch('BEVAE-181'); onSearchSubmit('BEVAE-181'); }} className="hover:underline text-[#0A66C2]">BEVAE-181</button> •
                <button onClick={() => { setHeroSearch('BAG'); onSearchSubmit('BAG'); }} className="hover:underline text-[#0A66C2]">BAG</button> •
                <button onClick={() => { setHeroSearch('DECE-04'); onSearchSubmit('DECE-04'); }} className="hover:underline text-[#0A66C2]">DECE-04</button> •
                <button onClick={() => { setHeroSearch('MBA'); onSearchSubmit('MBA'); }} className="hover:underline text-[#0A66C2]">MBA</button>
              </div>
            </div>

          </div>

          {/* Right Column: High-converting Visual Showcase Card (Hidden on mobile/tablet, shown on desktop) */}
          <div className="hidden lg:block lg:col-span-5 relative">
            
            {/* Guarantee Badge */}
            <div className="absolute -top-4 -left-4 z-20 bg-amber-400 text-slate-950 font-black text-xs uppercase px-3.5 py-1.5 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 rotate-[-2deg]">
              <Award className="w-4 h-4 text-slate-950" />
              100% PASS APPROVAL GUARANTEE
            </div>

            {/* Main Interactive Preview Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-5 sm:p-6 relative">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('dece_hw')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                    activeTab === 'dece_hw'
                      ? 'bg-[#0A66C2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📘 DECE Assignment
                </button>
                <button
                  onClick={() => setActiveTab('dece_proj')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                    activeTab === 'dece_proj'
                      ? 'bg-[#0A66C2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📕 DECE-4 Project
                </button>
                <button
                  onClick={() => setActiveTab('bevae')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                    activeTab === 'bevae'
                      ? 'bg-[#0A66C2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📗 BEVAE-181
                </button>
              </div>

              {/* Header Info */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-extrabold text-slate-700 ml-1">IGNOU Verified Preview</span>
                </div>
                <span className="bg-blue-100 text-[#0A66C2] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  July 2025 & Jan 2026
                </span>
              </div>

              {/* Auto-changing 1280x720 HD Student Image Gallery Carousel */}
              <div className="my-3.5 relative rounded-2xl overflow-hidden border border-slate-200 group aspect-video bg-slate-900">
                <img
                  src={studentGallery[currentSlide].url}
                  alt={studentGallery[currentSlide].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />



                {/* Carousel Dot Indicators Overlay */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1.5 z-10">
                  {studentGallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/70 hover:bg-white'
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Price & Immediate Order Action */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      ₹300 Booking
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      + Cash on Delivery
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-700 mt-0.5 font-black uppercase tracking-wider">
                    {activeTab === 'dece_proj' 
                      ? '📦 ₹1700 Pay at doorstep'
                      : '📦 ₹700 Pay at doorstep'}
                  </p>
                </div>

                <button
                  onClick={() =>
                    onWhatsAppClick(
                      activeTab === 'dece_proj'
                        ? 'DECE-4 Project File (₹300 booking advance + ₹1700 COD)'
                        : activeTab === 'dece_hw'
                        ? 'DECE (DECE 1, 2, 3) Assignment Set (₹300 booking advance + ₹700 COD)'
                        : 'BEVAE-181 Assignment'
                    )
                  }
                  className="bg-[#FF7A00] hover:bg-orange-600 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md hover:shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order Now</span>
                </button>
              </div>

              {/* Free Highlight Box inside Card */}
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900">
                <span className="font-extrabold text-[11px] flex items-center gap-1 text-amber-800 mb-1">
                  🎁 Free With Every Order:
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10.5px] font-semibold text-slate-700">
                  <span>✔ Front Page</span>
                  <span>✔ Question Paper</span>
                  <span>✔ PDF Preview</span>
                  <span>✔ Proper Margin</span>
                </div>
              </div>

              {/* Delivery stats footer inside card */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>SpeedPost All India</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Pass Guarantee</span>
                </div>
              </div>
            </div>

            {/* Live Delivery Dispatch Banner - Clean positioning without overlapping card text */}
            <div className="mt-3 bg-white p-3 rounded-2xl shadow-md border border-slate-200/90 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
                🚚
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-900 leading-tight">DECE Packages Dispatched Today!</p>
                <p className="text-[10.5px] font-medium text-slate-500 mt-0.5">Fast SpeedPost Dispatch across India with Live Tracking</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
