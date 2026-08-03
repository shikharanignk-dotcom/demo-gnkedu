import React from 'react';
import { CheckCircle2, ShoppingCart, MessageCircle, Gift, ShieldCheck, Truck, Sparkles, BookOpen, Star, FileCheck, Layers, Award, Clock, Flame } from 'lucide-react';

interface DeceShowcaseSectionProps {
  onWhatsAppClick: (customMsg?: string, isOrder?: boolean) => void;
}

export const DeceShowcaseSection: React.FC<DeceShowcaseSectionProps> = ({ onWhatsAppClick }) => {
  const deceAssignmentList = [
    '100% Handwritten by Expert Writers',
    'Latest IGNOU Session (July 2025 – Jan 2026)',
    'Blue & Black Pen with Proper Margin',
    'Front Page & Question Paper Included',
    'Fast Dispatch & All India Delivery',
    'Pass Support & Premium Quality Guaranteed',
  ];

  const deceProjectList = [
    'Latest IGNOU Approved Project Format',
    'Complete Project Report with All Certificates',
    'Spiral Binding & Premium Handwriting',
    'Ready for Submission with Proper Formatting',
    'High Quality Printing & Fast Delivery',
    'Viva Support & Pass Assistance Included',
  ];

  const trustBadges = [
    { label: '100% Handwritten', icon: '✍️' },
    { label: 'Latest Session', icon: '📚' },
    { label: 'Fast Delivery', icon: '⚡' },
    { label: 'COD Available', icon: '💵' },
    { label: 'All India Delivery', icon: '🚚' },
  ];

  const freePerks = [
    'Front Page',
    'Question Paper',
    'PDF Preview',
    'Proper Margin',
    'Quality Check',
    'Packing Protection',
  ];

  return (
    <section id="dece-special" className="py-8 sm:py-12 md:py-14 bg-gradient-to-b from-slate-50 via-sky-50/40 to-amber-50/30 text-slate-900 border-t border-b border-slate-200 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 fill-current text-white" />
            Special IGNOU DECE Course Packages
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            📘 DECE Handwritten Assignment & Project Hub
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-semibold">
            100% Handwritten • July 2025 & Jan 2026 Session • Ready for Direct Study Centre Submission
          </p>
        </div>



        {/* 2 Main Product Cards Side-By-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Card 1: 📘 DECE Handwritten Assignment */}
          <div className="bg-white border-2 border-blue-500/80 hover:border-blue-600 rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg flex flex-col justify-between relative group transition-all duration-300">
            
            {/* Top Badge */}
            <div className="absolute -top-3.5 right-4 sm:right-6 bg-gradient-to-r from-[#0A66C2] to-blue-700 text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full shadow-md">
              BESTSELLER • 100% PASS GUARANTEE
            </div>

            <div>
              {/* Title & Subtitle */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0A66C2] border border-blue-200 flex items-center justify-center text-xl font-black shadow-xs shrink-0">
                  📘
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    DECE (DECE-1, DECE-2 & DECE-3) Handwritten Assignment
                  </h3>
                  <p className="text-xs text-blue-700 font-bold mt-0.5">
                    100% Handwritten • Latest Session • Ready to Submit
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Total Subjects</span>
                  <span className="font-black text-slate-900 text-xs">📖 3 Subjects</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Approx Pages</span>
                  <span className="font-black text-slate-900 text-xs">📝 105 Pages</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Paper Size</span>
                  <span className="font-black text-slate-900 text-xs">📄 A4 Foolscap</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Writing</span>
                  <span className="font-black text-emerald-700 text-xs">✍ 100% Handwritten</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Dispatch</span>
                  <span className="font-black text-amber-700 text-xs">📦 Within 24h</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Delivery</span>
                  <span className="font-black text-sky-700 text-xs">🚚 3-7 Days</span>
                </div>
              </div>

              {/* Description Checklist */}
              <div className="space-y-1.5 mb-4">
                <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider mb-1.5">Package Inclusion Checklist:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-slate-700">
                  {deceAssignmentList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-3">
                {/* Left Price Column */}
                <div>
                  <span className="text-[11px] text-slate-400 line-through font-bold block">₹1200 Original Price</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xl sm:text-3xl font-black text-[#0A66C2] whitespace-nowrap">
                      ₹1000
                    </span>
                    <span className="bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-md font-extrabold text-[10px] sm:text-xs whitespace-nowrap flex items-center gap-0.5">
                      🔥 17% OFF
                    </span>
                  </div>
                </div>

                {/* Booking & COD Badge Box (Without Advance word) */}
                <div className="bg-blue-50/90 border border-blue-200/90 rounded-xl px-2.5 py-2 text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5 font-black text-blue-900 text-xs sm:text-sm">
                    <span className="bg-[#0A66C2] text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">BOOKING</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">₹300</span>
                  </div>
                  <div className="text-[10.5px] sm:text-xs font-extrabold text-slate-700 mt-1 flex items-center justify-end gap-1">
                    <span>📦</span> ₹700 Cash on Delivery
                  </div>
                </div>
              </div>

              {/* Side-by-side buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => onWhatsAppClick('I have taken a sample: book my order', true)}
                  className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white font-black py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>Order Now</span>
                </button>
                <button
                  onClick={() => onWhatsAppClick('I have seen the sample; now, please tell me how to place the order.', false)}
                  className="w-full bg-[#00a884] hover:bg-emerald-700 text-white font-black py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: 📕 DECE Project File */}
          <div className="bg-white border-2 border-amber-500/80 hover:border-amber-600 rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg flex flex-col justify-between relative group transition-all duration-300">
            
            {/* Top Badge */}
            <div className="absolute -top-3.5 right-4 sm:right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full shadow-md">
              SPECIAL DISCOUNT • 🔥 20% OFF
            </div>

            <div>
              {/* Title & Subtitle */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center text-xl font-black shadow-xs shrink-0">
                  📕
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    DECE-4 Internship Project File
                  </h3>
                  <p className="text-xs text-amber-700 font-bold mt-0.5">
                    Ready Made Project • Viva Support • Latest Format
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Project Code</span>
                  <span className="font-black text-slate-900 text-xs">📖 DECE-4</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Approx Pages</span>
                  <span className="font-black text-slate-900 text-xs">📄 ~150 Pages</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Latest Session</span>
                  <span className="font-black text-[#0A66C2] text-xs">📚 July 2025–Jan 2026</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Format</span>
                  <span className="font-black text-emerald-700 text-xs">✍ Handwritten</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Dispatch</span>
                  <span className="font-black text-amber-700 text-xs">📦 Within 24 Hours</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[9.5px] block font-bold">Delivery</span>
                  <span className="font-black text-sky-700 text-xs">🚚 3-7 Days</span>
                </div>
              </div>

              {/* Description Checklist */}
              <div className="space-y-1.5 mb-4">
                <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider mb-1.5">Project File Inclusions:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-slate-700">
                  {deceProjectList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-3">
                {/* Left Price Column */}
                <div>
                  <span className="text-[11px] text-slate-400 line-through font-bold block">₹2500 Original Price</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xl sm:text-3xl font-black text-amber-600 whitespace-nowrap">
                      ₹2000
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-md font-extrabold text-[10px] sm:text-xs whitespace-nowrap flex items-center gap-0.5">
                      🔥 20% OFF
                    </span>
                  </div>
                </div>

                {/* Booking & COD Badge Box (Without Advance word) */}
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl px-2.5 py-2 text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5 font-black text-amber-900 text-xs sm:text-sm">
                    <span className="bg-amber-600 text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">BOOKING</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">₹300</span>
                  </div>
                  <div className="text-[10.5px] sm:text-xs font-extrabold text-slate-700 mt-1 flex items-center justify-end gap-1">
                    <span>📦</span> ₹1700 Cash on Delivery
                  </div>
                </div>
              </div>

              {/* Side-by-side buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => onWhatsAppClick('I have taken a sample: book my order', true)}
                  className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white font-black py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>Order Now</span>
                </button>
                <button
                  onClick={() => onWhatsAppClick('I have seen the sample; now, please tell me how to place the order.', false)}
                  className="w-full bg-[#00a884] hover:bg-emerald-700 text-white font-black py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Extra Highlight Box (🎁 Free With Every Order) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-orange-500/10 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl shadow-xs shrink-0">
                🎁
              </div>
              <div>
                <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  BONUS FREE OFFER
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Free With Every DECE Order
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  We pack all essential IGNOU submission documents free of charge in every parcel!
                </p>
              </div>
            </div>

            {/* 6 Perks Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:w-auto">
              {freePerks.map((perk, i) => (
                <div key={i} className="bg-white border border-amber-300/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>✔ {perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
