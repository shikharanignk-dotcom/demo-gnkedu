import React from 'react';
import { Users, FileText, Award, Headset, Star, Sparkles, Truck } from 'lucide-react';

export const LiveCounter: React.FC = () => {
  const stats = [
    {
      label: 'Happy Students Served',
      value: '12,000+',
      icon: Users,
      badge: 'All India',
      bgColor: 'bg-blue-50 border-blue-200 text-[#0A66C2]',
    },
    {
      label: 'Assignments Delivered',
      value: '35,000+',
      icon: FileText,
      badge: 'Handwritten',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      label: 'Projects Completed',
      value: '8,000+',
      icon: Award,
      badge: 'Viva Approved',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      label: 'WhatsApp Support',
      value: '24×7',
      icon: Headset,
      badge: 'Instant Reply',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-700',
    },
    {
      label: 'Google User Rating',
      value: '4.9★',
      icon: Star,
      badge: '500+ Reviews',
      bgColor: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    },
    {
      label: 'Fast SpeedPost COD',
      value: '24 Hours',
      icon: Truck,
      badge: 'Express Dispatch',
      bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
  ];

  return (
    <section className="py-4 sm:py-6 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 border-t border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-3 sm:mb-5">
          <div className="inline-flex items-center gap-1 bg-blue-100 text-[#0A66C2] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 fill-current" />
            Proven Record of Academic Excellence
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Trusted by Thousands of IGNOU Students Across India
          </h2>
        </div>

        {/* 6 Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 text-center">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white px-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-between group relative"
              >
                {/* Top Badge */}
                <span className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mb-1">
                  {stat.badge}
                </span>

                {/* Icon Container */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${stat.bgColor} border flex items-center justify-center font-bold mb-1 shadow-2xs group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                {/* Value */}
                <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-0.5 leading-tight">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

