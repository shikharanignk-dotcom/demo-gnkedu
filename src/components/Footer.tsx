import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Heart, ShieldCheck, HelpCircle, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  onWhatsAppClick: (msg?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOrderTracking,
  onOpenAdmin,
  onWhatsAppClick,
}) => {
  const [modalPolicy, setModalPolicy] = useState<string | null>(null);

  const policyContent: Record<string, { title: string; body: string }> = {
    privacy: {
      title: 'Privacy Policy',
      body: 'Guru Nanak Photostat values your privacy. Student phone numbers, email addresses, and delivery details collected during assignment orders are strictly used for courier dispatch and status updates. We never share or sell student information to third parties.',
    },
    refund: {
      title: 'Refund & Revision Policy',
      body: 'We guarantee 100% IGNOU Study Centre approval. If any assignment or project file is rejected by your Study Centre due to formatting errors or content issues, we provide 100% free rewritten replacement or full refund within 7 days.',
    },
    terms: {
      title: 'Terms & Conditions',
      body: 'Guru Nanak Photostat is an independent academic support and photostat service operating in Fatehabad, Haryana. All study guides, solved assignment PDFs, and project files are created by subject matter experts to assist IGNOU students in understanding coursework.',
    },
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-8 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pb-6 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  Guru Nanak <span className="text-[#0A66C2]">Photostat</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">India's Trusted IGNOU Assignment & Project Service</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal max-w-sm">
              Providing high-quality handwritten assignments, project files, solved PDFs, notes, and guess papers for all IGNOU undergraduate and postgraduate programs across India with Cash on Delivery.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onWhatsAppClick()}
                className="bg-[#FF7A00] hover:bg-orange-600 text-white font-black text-xs px-3.5 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                WhatsApp Order Line
              </button>
              <button
                onClick={onOpenOrderTracking}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                Track Order
              </button>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-2 text-[11px]">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1 text-slate-400">
              <li><a href="#products" className="hover:text-white transition-colors">Services & Free Samples</a></li>
              <li><a href="#search" className="hover:text-white transition-colors">Subject Code Search</a></li>
              <li><a href="#why-us" className="hover:text-white transition-colors">Why Choose Us</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Student Testimonials</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-2 text-[11px]">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Policies & Support</h4>
            <ul className="space-y-1 text-slate-400">
              <li>
                <button onClick={() => setModalPolicy('privacy')} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setModalPolicy('refund')} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Refund & Revision Policy
                </button>
              </li>
              <li>
                <button onClick={() => setModalPolicy('terms')} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Terms & Conditions
                </button>
              </li>
              <li><a href="#contact" className="hover:text-white transition-colors block">Contact Fatehabad Shop</a></li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Staff Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Location & Contact */}
          <div className="space-y-2 text-[11px]">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Fatehabad HQ</h4>
            <div className="space-y-1 text-slate-400">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0 mt-0.5" />
                <span>Near Old Bus Stand, Fatehabad, Haryana - 125050</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+919518877939" className="hover:text-white">+91 95188 77939</a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>gnphotostat.ignou@gmail.com</span>
              </p>
            </div>

            {/* Social Links */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Follow Us On Social Media</span>
              <div className="flex items-center gap-1.5">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="px-2 py-1 bg-slate-900 hover:bg-[#0A66C2] text-white rounded text-[10px] font-bold transition-colors">
                  Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="px-2 py-1 bg-slate-900 hover:bg-pink-600 text-white rounded text-[10px] font-bold transition-colors">
                  Instagram
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="px-2 py-1 bg-slate-900 hover:bg-red-600 text-white rounded text-[10px] font-bold transition-colors">
                  YouTube
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Disclaimer */}
        <div className="mt-4 pt-2 text-center text-[10px] text-slate-500 space-y-1">
          <p>© 2026 Guru Nanak Photostat, Fatehabad (Haryana). All Rights Reserved.</p>
          <p className="text-slate-600 text-[9.5px] max-w-4xl mx-auto leading-tight">
            Disclaimer: Guru Nanak Photostat is an independent student helpline, printing and educational guidance agency. IGNOU (Indira Gandhi National Open University) is a registered trademark of its respective university. We provide original reference solved assignment files and academic project consultation to help students complete coursework.
          </p>
        </div>

      </div>

      {/* Policy View Modal */}
      {modalPolicy && policyContent[modalPolicy] && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900">{policyContent[modalPolicy].title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{policyContent[modalPolicy].body}</p>
            <div className="text-right">
              <button
                onClick={() => setModalPolicy(null)}
                className="bg-[#0A66C2] text-white font-bold px-4 py-2 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
