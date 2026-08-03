import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Flame, ChevronRight, Phone } from 'lucide-react';

interface HeaderProps {
  onOpenApplyModal: () => void;
  seatsLeft: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApplyModal, seatsLeft }) => {
  // Countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 38
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <header className="sticky top-0 z-40 w-full shadow-2xl">
      {/* Top Urgent Ticker Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white font-bold px-2 py-0.5 rounded text-xs uppercase tracking-wider animate-pulse">
              <Flame className="w-3.5 h-3.5 text-yellow-300" /> Limited Batch
            </span>
            <span>
              🔥 Next Batch: <strong>3-Day Luxury Retreat in Goa</strong> | Seats Filling Fast!
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full text-amber-200 border border-amber-400/30 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Discount Ends In:</span>
              <strong className="font-mono text-white tracking-wider">
                {formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s
              </strong>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-amber-100 text-xs bg-red-900/60 px-2.5 py-1 rounded-full border border-red-500/40">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>Only <strong>{seatsLeft} Seats Left</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg sm:text-xl tracking-tighter">
                RM
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-2xl text-white tracking-tight flex items-center gap-1.5">
                RAHUL MALODIA
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                  CA & Business Coach
                </span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-amber-400/90 tracking-widest uppercase">
                CEO RETREAT • Vyapar Ko Bada Karo
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#overview" className="hover:text-amber-400 transition-colors">Overview</a>
            <a href="#agenda" className="hover:text-amber-400 transition-colors">3-Day Agenda</a>
            <a href="#mentor" className="hover:text-amber-400 transition-colors">Your Mentor</a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors">Case Studies</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">Pass Tiers</a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">FAQs</a>
          </div>

          {/* Action CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApplyModal}
              className="relative inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-slate-950 text-xs sm:text-sm bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>APPLY FOR RETREAT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
