import React, { useState } from 'react';
import { FaqItem } from '../types';
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';

interface FaqSectionProps {
  faqs: FaqItem[];
  onWhatsAppClick: (query?: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs, onWhatsAppClick }) => {
  const [openId, setOpenId] = useState<string>(faqs[0]?.id || '');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <section id="faq" className="py-8 sm:py-12 md:py-16 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-6 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-[#0A66C2] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#0A66C2]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Got Questions? We Have Answers!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Everything you need to know about placing orders, delivery timelines, COD options, and handwritten quality.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-[#0A66C2] bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                    isOpen ? 'bg-[#0A66C2] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-blue-100/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Still have questions regarding your IGNOU course?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Chat directly with our Fatehabad support executive on WhatsApp.</p>
          </div>

          <button
            onClick={() => onWhatsAppClick("Hi, I have a question regarding IGNOU assignment ordering.")}
            className="bg-[#FF7A00] hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Ask on WhatsApp Now
          </button>
        </div>

      </div>
    </section>
  );
};
