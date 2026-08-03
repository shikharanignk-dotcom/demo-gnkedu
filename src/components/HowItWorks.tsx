import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CreditCard,
  PenTool,
  Truck,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  MousePointerClick,
  Maximize2,
  X,
  Eye,
} from 'lucide-react';

interface HowItWorksProps {
  onWhatsAppClick: (msg?: string) => void;
  onOpenOrderTracking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onWhatsAppClick, onOpenOrderTracking }) => {
  const [activeStage, setActiveStage] = useState<number>(1); // Default Stage 1
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [trackingInput, setTrackingInput] = useState<string>('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; tag: string } | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  // Auto-play / auto-step change every 4 seconds if user hasn't interacted
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleStepClick = (stageId: number) => {
    setActiveStage(stageId);
    setIsAutoPlaying(false);
  };

  const stages = [
    {
      id: 1,
      badge: '⚡ STEP 01: SUBJECT SELECTION & BOOKING',
      title: 'Order Booking on WhatsApp',
      subtitle: 'Select Course & Share Details',
      desc: 'Choose your IGNOU program (BAG, BCOMG, MBA, BCA, DECE, etc.) and share your required subject codes with our Fatehabad store helpline.',
      bullets: [
        '500+ Solved IGNOU Subjects Available',
        'Free Sample PDF Inspection Before Payment',
        'Instant Price Estimate & Delivery Timeline',
      ],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      imageTag: '📖 Subject Selection | Instant Verification',
      ctaMsg: 'Hi Guru Nanak Photostat, I want to book Step 01 (Subject Selection & Order Booking).',
    },
    {
      id: 2,
      badge: '⚡ STEP 02: 100% SECURE PAYMENT',
      title: 'Payment & Order Token Receipt',
      subtitle: 'Online UPI or Cash on Delivery',
      desc: 'Pay safely via UPI, Google Pay, PhonePe, QR Code or select Cash on Delivery (COD). Official digital receipt & Order ID generated.',
      bullets: [
        'UPI / QR / Netbanking / Cards',
        'COD Option Available Across India',
        'Instant Digital Receipt & Order ID',
      ],
      image: 'https://images.unsplash.com/photo-1556742049-0a670f4a45a1?auto=format&fit=crop&w=600&q=80',
      imageTag: '💳 Payment & Token | Live Verified',
      ctaMsg: 'Hi Guru Nanak Photostat, I am ready to pay for my IGNOU order token / COD booking.',
    },
    {
      id: 3,
      badge: '⚡ STEP 03: PROFESSIONAL WRITING & QC',
      title: 'Handwriting & Quality Check',
      subtitle: 'Clean A4 Sheet + Cover Page',
      desc: 'Our expert writers complete your answers neatly on clean A4 foolscap sheets with margins, cover page, and questionnaire attached.',
      bullets: [
        'Neat Calligraphy & Diagram Illustrations',
        'Strict Adherence to IGNOU Marking Guidelines',
        'Cover Page & Question Paper Included',
      ],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      imageTag: '✍️ Writer Allocation | Quality Approved',
      ctaMsg: 'Hi, I want to know about Step 03 (Writer Allocation & Quality Check).',
    },
    {
      id: 4,
      badge: '⚡ STEP 04: EXPRESS DISPATCH',
      title: 'Express Dispatch & Tracking',
      subtitle: 'Speed Post Parcel with Live Tracking',
      desc: 'Your finished assignment file is packed securely in waterproof bubble wrap and dispatched via SpeedPost/DTDC courier within 24h.',
      bullets: [
        'Dispatched Within 24 Hours',
        'Real-time SMS & WhatsApp Tracking Link',
        '100% IGNOU Study Centre Acceptance Guarantee',
      ],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      imageTag: '🚚 Courier Dispatch | SpeedPost / DTDC',
      ctaMsg: 'Hi Guru Nanak Photostat, I want to track my courier dispatch parcel.',
    },
  ];

  const currentData = stages.find((s) => s.id === activeStage) || stages[1];

  const handleSimulatedTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setTrackingResult(`Order #${trackingInput.trim().toUpperCase()} • Status: Dispatched via SpeedPost (Tracking ID: SP981234567IN). Expected Delivery: 2 Days.`);
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="pt-[33px] pb-10 md:pb-16 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden font-sans group"
    >
      
      {/* Background Subtle Grid Pattern matching store styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 md:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200/80 text-[#FF7A00] px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Zap className="w-4 h-4 text-[#FF7A00] fill-[#FF7A00]" />
            <span>SIMPLE 4-STAGE ORDER PROCESS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How It Works
          </h2>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium max-w-xl mx-auto">
            From subject selection to home delivery tracking — getting your IGNOU assignment submitted is smooth and stress-free.
          </p>
        </div>

        {/* MOBILE VIEW (Mind Map Card with Auto-Changing Step & Short Description) */}
        <div className="block md:hidden max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md space-y-4">
            
            {/* Header with Step Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[#FF7A00] text-base">🧭</span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Visual Order Path</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-black text-[#FF7A00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-ping" />
                <span>Step 0{activeStage} / 04</span>
              </div>
            </div>

            {/* Connected Vertical Timeline Steps */}
            <div className="relative space-y-2.5 before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
              {stages.map((stage) => {
                const isCurrent = activeStage === stage.id;
                const isCompleted = activeStage > stage.id;

                return (
                  <div
                    key={stage.id}
                    onClick={() => handleStepClick(stage.id)}
                    className={`relative z-10 p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isCurrent
                        ? 'bg-orange-50/70 border-[#FF7A00] shadow-sm ring-1 ring-orange-500/30'
                        : 'bg-slate-50 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Node Circle */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-[#FF7A00] text-white ring-4 ring-orange-100 shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {stage.id}
                      </div>

                      {/* Content Header */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-black truncate ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                            {stage.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-1">
                            Step #0{stage.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Short Description when Active */}
                    {isCurrent && (
                      <div className="mt-1 pt-2.5 border-t border-orange-200/80 space-y-2 text-xs">
                        <p className="text-slate-700 font-medium leading-relaxed text-[11.5px]">
                          {stage.desc}
                        </p>
                        
                        {/* Mobile Stage Image Preview Thumbnail */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage({ url: stage.image, title: stage.title, tag: stage.imageTag });
                          }}
                          className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 cursor-pointer group/mimg my-2"
                        >
                          <img
                            src={stage.image}
                            alt={stage.title}
                            className="w-full h-32 object-cover group-hover/mimg:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-900/30 group-hover/mimg:bg-slate-900/10 transition-colors flex items-center justify-center">
                            <span className="bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow">
                              <Eye className="w-3 h-3 text-orange-400" />
                              <span>Click to View Image</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {stage.bullets.map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onWhatsAppClick(stage.ctaMsg);
                          }}
                          className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white text-xs font-black py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98 transition-transform"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Book Step #{stage.id} On WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Auto-Play Dots */}
            <div className="flex items-center justify-between pt-1 px-1 text-[10px] font-bold text-slate-400">
              <span>🔄 Auto-step changing</span>
              <div className="flex items-center gap-1.5">
                {stages.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStepClick(s.id)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeStage === s.id ? 'w-5 bg-[#FF7A00]' : 'w-1.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* DESKTOP VIEW (Full detailed layout with top pills & 2-column cards) */}
        <div className="hidden md:block space-y-10">
          
          {/* 1. TOP STEP PILLS NAVIGATION BAR */}
          <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stages.map((stage) => {
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStepClick(stage.id)}
                  className={`py-3 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF7A00] to-orange-600 text-white shadow-md shadow-orange-500/20 font-black scale-102'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-[11px] flex items-center justify-center font-black ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    0{stage.id}
                  </span>
                  <span className="truncate">
                    {stage.id === 1 && 'Order Book'}
                    {stage.id === 2 && 'Payment & Token'}
                    {stage.id === 3 && 'Writer Allocation'}
                    {stage.id === 4 && 'Courier Dispatch'}
                  </span>
                </button>
              );
            })}
          </div>

        {/* 2. MAIN INTERACTIVE SECTION: LEFT STAGE CARD + RIGHT MIND MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ACTIVE STAGE DETAIL CARD (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden group">
            
            {/* Top Stage Header Badges */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {currentData.badge}
              </span>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Stage {activeStage} of 4
              </span>
            </div>

            {/* Stage Body Info & Image */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Text Info (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {currentData.title}
                  </h3>
                  <p className="text-xs font-extrabold text-[#0A66C2] mt-1">
                    {currentData.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {currentData.desc}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 pt-1">
                  {currentData.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Order Button for current stage */}
                <div className="pt-2">
                  <button
                    onClick={() => onWhatsAppClick(currentData.ctaMsg)}
                    className="bg-[#FF7A00] hover:bg-orange-600 text-white font-black px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all transform hover:scale-102 flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Book This Step On WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Stage Image / Preview Card (5 cols - Desktop only) */}
              <div className="hidden md:block md:col-span-5">
                <div
                  onClick={() => setPreviewImage({ url: currentData.image, title: currentData.title, tag: currentData.imageTag })}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 group-hover:border-blue-300 transition-colors cursor-pointer group/imgcard"
                >
                  <img
                    src={currentData.image}
                    alt={currentData.title}
                    className="w-full h-48 object-cover group-hover/imgcard:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent group-hover/imgcard:via-slate-900/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover/imgcard:opacity-100 transition-opacity bg-slate-900/90 text-white text-xs font-black px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4 text-orange-400" />
                      <span>Click to View Image</span>
                    </span>
                  </div>

                  {/* Image Badge Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs shadow">
                    <span className="font-extrabold text-slate-900 text-[11px] truncate">
                      {currentData.imageTag}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      Live Verified
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: VISUAL ORDER PATH (MIND MAP) + LIVE TRACKER (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Mind Map Timeline Container */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF7A00]">🧭</span>
                  <h3 className="font-extrabold text-sm text-slate-900">Visual Order Path (Mind Map)</h3>
                </div>
                <span className="text-[10px] font-black uppercase text-[#0A66C2] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Order Book ➔ Dispatch
                </span>
              </div>

              {/* Connected Vertical Timeline Nodes */}
              <div className="relative space-y-3 before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
                {stages.map((stage) => {
                  const isCurrent = activeStage === stage.id;
                  const isCompleted = activeStage > stage.id;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => setActiveStage(stage.id)}
                      className={`relative z-10 p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isCurrent
                          ? 'bg-orange-50/60 border-[#FF7A00] shadow-md ring-1 ring-orange-500/30'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 w-full">
                        {/* Node Circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                            isCurrent
                              ? 'bg-[#FF7A00] text-white ring-4 ring-orange-100'
                              : isCompleted
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {stage.id}
                        </div>

                        {/* Content Header */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-black truncate ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                              {stage.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-1">
                              Step #0{stage.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {stage.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Short Description for Mobile View when clicked */}
                      {isCurrent && (
                        <div className="lg:hidden mt-1.5 pt-2.5 border-t border-orange-200/80 space-y-2 text-xs animate-fadeIn">
                          <p className="text-slate-700 font-semibold leading-relaxed text-[11px]">
                            {stage.desc}
                          </p>
                          <div className="space-y-1">
                            {stage.bullets.map((b, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onWhatsAppClick(stage.ctaMsg);
                            }}
                            className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white text-xs font-black py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98 transition-transform"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>Book Step #{stage.id} On WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>



          </div>

        </div>
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">100% IGNOU Study Centre Approval Guarantee</span>
              <span className="text-slate-600 text-xs">If any assignment is rejected by your Study Centre, we provide free rewritten replacement.</span>
            </div>
          </div>

          <button
            onClick={() => onWhatsAppClick()}
            className="bg-[#FF7A00] hover:bg-orange-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Need Assistance? Chat on WhatsApp
          </button>
        </div>

      </div>

      {/* Full Size Image Preview Lightbox Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col relative">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="bg-[#FF7A00] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0">
                  Image Preview
                </span>
                <h3 className="font-extrabold text-sm sm:text-base truncate">{previewImage.title}</h3>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="p-4 sm:p-6 bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-medium text-[11px] truncate">{previewImage.tag}</span>
              <button
                onClick={() => {
                  setPreviewImage(null);
                  onWhatsAppClick(`Hi, I checked the image sample for ${previewImage.title}. Please guide me on ordering.`);
                }}
                className="bg-[#00a884] hover:bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs shrink-0 shadow"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
