import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';

interface ContactSectionProps {
  onWhatsAppClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onWhatsAppClick }) => {
  return (
    <section id="contact" className="py-8 sm:py-12 md:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-[#0A66C2] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Fatehabad Center & Support HQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Guru Nanak Photostat
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Visit our physical shop in Fatehabad or contact us on phone and WhatsApp for instant IGNOU guidance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Address Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A66C2] flex items-center justify-center font-bold shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Guru Nanak Photostat</h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Near Old Bus Stand, Fatehabad, Haryana - 125050
                </p>
                <p className="text-[11px] text-emerald-700 font-bold mt-1">
                  ✓ Physical Shop & IGNOU Helpline Center
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="https://maps.google.com/?q=Guru+Nanak+Photostat+Near+Old+Bus+Stand+Fatehabad+Haryana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Navigation className="w-4 h-4 text-[#0A66C2]" />
                Get Directions
              </a>

              <a
                href="tel:+919518877939"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Shop Now
              </a>
            </div>
          </div>

          {/* Quick Contact Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Order Helpline</span>
                <p className="font-extrabold text-slate-900 text-sm">+91 95188 77939</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A66C2] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Email Support</span>
                <p className="font-bold text-slate-900 text-sm">gnphotostat.ignou@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Business Hours</span>
                <p className="font-bold text-slate-900 text-sm">8:00 AM – 9:00 PM (Monday – Sunday)</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
