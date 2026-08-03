import React from 'react';

export const AnnouncementBar: React.FC = () => {
  const marqueeText =
    "🔥 July 2025 & Jan 2026 Session Solved Assignments & Handwritten Files Available! 100% Pass Guarantee • 🚚 Fast Home Delivery Across India • ⚡ SpeedPost Courier Dispatch in 24h • ✍️ Clean Calligraphy Handwriting & Format Guarantee • ";

  return (
    <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-2 shadow-md border-b border-blue-800/60 overflow-hidden relative select-none">
      <div className="w-full overflow-hidden whitespace-nowrap flex items-center">
        <div className="animate-marquee-continuous flex items-center shrink-0">
          <div className="flex items-center gap-4 pr-4 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wide">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
          <div className="flex items-center gap-4 pr-4 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wide">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
